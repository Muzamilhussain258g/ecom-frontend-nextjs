import { customerBrowserFetch } from "@/lib/api/browser"
import type {
  ChatConversationSummary,
  ChatMessage,
  ChatMessagePage,
  ChatUploadReservation,
  ChatAttachment,
} from "@/types/api/chat"

export function createConversation() {
  return customerBrowserFetch<ChatConversationSummary>("/chat/conversations", {
    method: "POST",
  })
}

export function getConversations(page = 1, limit = 20) {
  return customerBrowserFetch<{
    items: ChatConversationSummary[]
    total: number
    page: number
    limit: number
  }>("/chat/conversations", { query: { page, limit } })
}

export function getMessages(
  conversationId: number,
  cursor?: { beforeSequence?: number; afterSequence?: number; limit?: number },
) {
  return customerBrowserFetch<ChatMessagePage>(
    `/chat/conversations/${conversationId}/messages`,
    { query: cursor },
  )
}

export function sendMessage(
  conversationId: number,
  payload: { clientMessageId: string; text?: string; attachmentIds?: string[] },
) {
  return customerBrowserFetch<ChatMessage>(
    `/chat/conversations/${conversationId}/messages`,
    { method: "POST", body: payload },
  )
}

export function markConversationRead(conversationId: number, sequence: number) {
  return customerBrowserFetch<{ conversationId: number; userId: number; sequence: number }>(
    `/chat/conversations/${conversationId}/read`,
    { method: "PUT", body: { sequence } },
  )
}

export function reserveUpload(
  conversationId: number,
  resourceType: "image" | "video",
) {
  return customerBrowserFetch<ChatUploadReservation>(
    `/chat/conversations/${conversationId}/uploads`,
    { method: "POST", body: { resourceType } },
  )
}

export function completeUpload(conversationId: number, uploadId: string) {
  return customerBrowserFetch<ChatAttachment>(
    `/chat/conversations/${conversationId}/uploads/${uploadId}/complete`,
    { method: "POST" },
  )
}

export function getAttachmentAccess(attachmentId: string) {
  return customerBrowserFetch<{ url: string; expiresAt: string }>(
    `/chat/attachments/${attachmentId}/access`,
  )
}
