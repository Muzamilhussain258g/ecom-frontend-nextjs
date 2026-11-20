"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { io, type Socket } from "socket.io-client"
import {
  completeUpload,
  createConversation,
  getAttachmentAccess,
  getMessages,
  markConversationRead,
  reserveUpload,
  sendMessage,
} from "@/lib/api/customer/chat"
import type {
  ChatAttachment,
  ChatConversationSummary,
  ChatMessage,
  ChatUploadReservation,
} from "@/types/api/chat"

interface Ack<T> {
  success: boolean
  data?: T
  error?: { statusCode: number; message: string | Record<string, unknown> }
}

const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const MAX_VIDEO_BYTES = 20 * 1024 * 1024
const MAX_DURATION_SECONDS = 30

function validateFile(file: File): string | null {
  if (file.type.startsWith("image/")) {
    if (!["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.type)) {
      return "Only JPEG, PNG, WebP, and AVIF images are supported."
    }
    if (file.size > MAX_IMAGE_BYTES) return "Images must be 5 MiB or smaller."
  } else if (file.type.startsWith("video/")) {
    if (!["video/mp4", "video/webm"].includes(file.type)) {
      return "Only MP4 and WebM videos are supported."
    }
    if (file.size > MAX_VIDEO_BYTES) return "Videos must be 20 MiB or smaller."
  } else {
    return "Only images and videos are supported."
  }
  return null
}

function getErrorMessage(error: Ack<unknown>["error"] | unknown): string {
  if (typeof error === "string") return error
  if (error && typeof error === "object") {
    const message = "message" in error ? (error as { message?: unknown }).message : undefined
    if (typeof message === "string") return message
    if (message && typeof message === "object") {
      return JSON.stringify(message)
    }
  }
  return "The request failed."
}

export function SupportChat() {
  const [conversation, setConversation] = useState<ChatConversationSummary | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [text, setText] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const [typing, setTyping] = useState(false)
  const [typingExpiresAt, setTypingExpiresAt] = useState(0)
  const [accessUrls, setAccessUrls] = useState<Record<number, string>>({})
  const socketRef = useRef<Socket | null>(null)
  const messagesRef = useRef<ChatMessage[]>([])
  const lastContiguousRef = useRef(0)

  const reconcileMessage = useCallback((message: ChatMessage) => {
    setMessages((current) => {
      const next = new Map(current.map((item) => [item.id, item]))
      next.set(message.id, message)
      return [...next.values()].sort((a, b) => a.sequence - b.sequence)
    })
  }, [])

  const catchUp = useCallback(async (conversationId: number) => {
    let afterSequence = lastContiguousRef.current
    for (;;) {
      const page = await getMessages(conversationId, {
        afterSequence: afterSequence || undefined,
        limit: 100,
      })
      for (const message of page.items) reconcileMessage(message)
      if (page.items.length) afterSequence = page.items[page.items.length - 1].sequence
      if (!page.hasMore) break
      if (!page.nextCursor) break
    }
  }, [reconcileMessage])

  const refreshThread = useCallback(async (conversationId: number) => {
    await catchUp(conversationId)
    const latest = messagesRef.current.at(-1)
    if (latest) await markConversationRead(conversationId, latest.sequence).catch(() => undefined)
  }, [catchUp])

  useEffect(() => {
    let active = true
    messagesRef.current = messages
    const contiguous = messages.reduce((highest, message) => {
      if (message.sequence === highest + 1) return message.sequence
      return highest
    }, 0)
    if (contiguous > lastContiguousRef.current) lastContiguousRef.current = contiguous
    if (conversation?.id && active && document.visibilityState === "visible") {
      markConversationRead(conversation.id, contiguous).catch(() => undefined)
    }
  }, [messages, conversation])

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const current = await createConversation()
        if (!active) return
        setConversation(current)
        const page = await getMessages(current.id, { limit: 50 })
        if (!active) return
        setMessages(page.items)
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Unable to open support chat.")
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [])

  useEffect(() => {
    if (!conversation) return
    let active = true

    ;(async () => {
      try {
        const session = await fetch("/api/chat/session", { cache: "no-store" })
        if (!session.ok) throw new Error("Your session could not be authenticated.")
        const { accessToken } = await session.json() as { accessToken: string }
        const apiUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1")
          .replace(/\/api\/v1\/?$/, "")
        const socket = io(`${apiUrl}/chat`, {
          path: "/socket.io",
          auth: { token: accessToken },
        })
        socketRef.current = socket

        socket.on("message:created", reconcileMessage)
        socket.on("conversation:updated", (summary: ChatConversationSummary) => {
          if (summary.id === conversation.id) setConversation(summary)
        })
        socket.on("conversation:read", () => undefined)
        socket.on("typing:changed", (payload: {
          conversationId: number
          userId: number
          typing: boolean
          expiresAt: string
        }) => {
          if (payload.conversationId !== conversation.id) return
          const expiresAt = new Date(payload.expiresAt).getTime()
          setTyping(payload.typing)
          setTypingExpiresAt(expiresAt)
        })
        socket.on("connect", () => {
          socket.timeout(10000).emit("conversation:join", { conversationId: conversation.id }, async (ack: Ack<ChatConversationSummary>) => {
            if (!active) return
            if (ack.success && ack.data) setConversation(ack.data)
            if (ack.success) await catchUp(conversation.id)
          })
        })
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Realtime chat unavailable.")
      }
    })()

    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") refreshThread(conversation.id)
    }, 15000)

    const onFocus = () => refreshThread(conversation.id)
    window.addEventListener("focus", onFocus)

    return () => {
      active = false
      window.clearInterval(interval)
      window.removeEventListener("focus", onFocus)
      socketRef.current?.disconnect()
      socketRef.current = null
    }
  }, [conversation?.id, catchUp, reconcileMessage, refreshThread])

  useEffect(() => {
    if (!typingExpiresAt) return
    const timeout = window.setTimeout(() => setTyping(false), Math.max(0, typingExpiresAt - Date.now()))
    return () => window.clearTimeout(timeout)
  }, [typingExpiresAt])

  useEffect(() => {
    let active = true
    const attachmentIds = [...new Set(messages.flatMap((message) =>
      message.attachments.map((attachment) => attachment.id),
    ))]
    for (const attachmentId of attachmentIds) {
      if (accessUrls[attachmentId]) continue
      getAttachmentAccess(attachmentId).then(({ url }) => {
        if (active) setAccessUrls((current) => ({ ...current, [attachmentId]: url }))
      }).catch(() => undefined)
    }
    return () => { active = false }
  }, [messages, accessUrls])

  const selectedPreviewKeys = useMemo(
    () => files.map((file) => `${file.name}:${file.size}:${file.lastModified}`),
    [files],
  )

  const handleFiles = (selected: FileList | null) => {
    if (!selected) return
    const nextFiles = [...files, ...Array.from(selected)].slice(0, 4)
    for (const file of nextFiles) {
      const validationError = validateFile(file)
      if (validationError) {
        setError(validationError)
        return
      }
    }
    setError(null)
    setFiles(nextFiles)
    setPreviews((current) => {
      const next = { ...current }
      for (const file of nextFiles) {
        const key = `${file.name}:${file.size}:${file.lastModified}`
        if (!next[key]) next[key] = URL.createObjectURL(file)
      }
      return next
    })
  }

  const removeFile = (index: number) => {
    const removed = files[index]
    if (!removed) return
    const key = `${removed.name}:${removed.size}:${removed.lastModified}`
    if (previews[key]) URL.revokeObjectURL(previews[key])
    setFiles((current) => current.filter((_, itemIndex) => itemIndex !== index))
    setPreviews((current) => {
      const next = { ...current }
      delete next[key]
      return next
    })
  }

  useEffect(() => () => {
    for (const url of Object.values(previews)) URL.revokeObjectURL(url)
  }, [])

  const uploadFile = async (
    conversationId: number,
    file: File,
  ): Promise<ChatAttachment> => {
    const reservation = await reserveUpload(
      conversationId,
      file.type.startsWith("video/") ? "video" : "image",
    )
    if (file.size > reservation.maxBytes) {
      throw new Error(`The file exceeds the server limit of ${reservation.maxBytes} bytes.`)
    }
    const form = new FormData()
    for (const [key, value] of Object.entries(reservation.fields)) {
      form.append(key, String(value))
    }
    form.append("file", file)
    const upload = await fetch(reservation.uploadUrl, { method: "POST", body: form })
    if (!upload.ok) throw new Error("Cloudinary upload failed.")
    return completeUpload(conversationId, reservation.uploadId)
  }

  const handleSend = async () => {
    if (!conversation || (!text.trim() && files.length === 0) || sending) return
    setSending(true)
    setError(null)
    const clientMessageId = crypto.randomUUID()
    try {
      const attachmentIds: number[] = []
      for (const file of files) {
        const attachment = await uploadFile(conversation.id, file)
        attachmentIds.push(attachment.id)
      }
      const payload = {
        conversationId: conversation.id,
        clientMessageId,
        text: text.trim() || undefined,
        attachmentIds,
      }
      let persisted: ChatMessage | null = null
      if (socketRef.current?.connected) {
        const ack = await socketRef.current
          .timeout(10000)
          .emitWithAck("message:send", payload) as Ack<ChatMessage>
        if (!ack.success) throw new Error(getErrorMessage(ack.error))
        persisted = ack.data || null
      } else {
        persisted = await sendMessage(conversation.id, {
          clientMessageId,
          text: text.trim() || undefined,
          attachmentIds,
        })
      }
      if (persisted) reconcileMessage(persisted)
      setText("")
      for (const url of Object.values(previews)) URL.revokeObjectURL(url)
      setFiles([])
      setPreviews({})
      await refreshThread(conversation.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Message failed.")
    } finally {
      setSending(false)
    }
  }

  if (loading) return <p className="text-sm text-black/60">Loading support chat...</p>
  if (!conversation) return <p className="text-sm text-red-600">{error || "Unable to open support chat."}</p>

  return (
    <div className="grid min-h-[520px] w-full overflow-hidden rounded-2xl border border-border-color bg-white">
      <div className="border-b px-5 py-4">
        <h1 className="font-integral-bold text-[28px] text-primary">Support Chat</h1>
        <p className="text-sm text-black/60">Usually replies within our support hours.</p>
      </div>

      <div className="min-h-0 max-h-[440px] overflow-y-auto px-4 py-5">
        {messages.length === 0 ? (
          <p className="text-center text-sm text-black/50">Start a conversation with support.</p>
        ) : (
          <div className="grid gap-3">
            {messages.map((message) => (
              <div
                key={message.clientMessageId}
                className="flex flex-col items-start"
              >
                <div className="max-w-[85%] rounded-2xl bg-tertiary px-4 py-3">
                  {message.text && <p className="whitespace-pre-wrap break-words">{message.text}</p>}
                  {message.attachments.map((attachment) => (
                    <div key={attachment.id} className="mt-2">
                      {attachment.resourceType === "image" ? (
                        accessUrls[attachment.id] ? (
                          <img
                            src={accessUrls[attachment.id]}
                            alt="Chat attachment"
                            className="max-h-72 max-w-full rounded-lg"
                          />
                        ) : <span className="text-xs">Loading image...</span>
                      ) : accessUrls[attachment.id] ? (
                        <video
                          src={accessUrls[attachment.id]}
                          controls
                          preload="metadata"
                          className="max-h-72 max-w-full rounded-lg"
                        />
                      ) : <span className="text-xs">Loading video...</span>}
                    </div>
                  ))}
                  <p className="mt-1 text-[11px] text-black/50">
                    {new Date(message.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {typing && (
        <p className="px-5 text-xs text-black/50">Support is typing...</p>
      )}

      {selectedPreviewKeys.length > 0 && (
        <div className="flex gap-2 overflow-x-auto px-4 pt-3">
          {files.map((file, index) => {
            const key = `${file.name}:${file.size}:${file.lastModified}`
            return (
              <div key={key} className="relative shrink-0">
                {file.type.startsWith("image/") ? (
                  <img src={previews[key]} alt="Upload preview" className="size-16 rounded-lg object-cover" />
                ) : (
                  <video src={previews[key]} className="size-16 rounded-lg object-cover" muted />
                )}
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute -right-2 -top-2 rounded-full bg-primary px-2 text-white"
                  aria-label={`Remove ${file.name}`}
                >
                  ×
                </button>
              </div>
            )
          })}
        </div>
      )}

      {error && <p className="px-4 pt-3 text-sm text-red-600">{error}</p>}

      <div className="flex items-end gap-2 border-t p-4">
        <label className="cursor-pointer rounded-full bg-tertiary px-3 py-2 text-sm" title="Attach files">
          +
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm"
            multiple
            className="hidden"
            onChange={(event) => handleFiles(event.target.files)}
          />
        </label>
        <textarea
          value={text}
          maxLength={4000}
          onChange={(event) => setText(event.target.value)}
          placeholder="Write a message..."
          className="min-h-10 flex-1 resize-none rounded-2xl bg-tertiary px-4 py-2 outline-none"
        />
        <button
          type="button"
          disabled={sending || (!text.trim() && files.length === 0)}
          onClick={handleSend}
          className="rounded-full bg-primary px-5 py-2 text-sm text-white disabled:opacity-50"
        >
          {sending ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  )
}
