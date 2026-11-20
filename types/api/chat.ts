export interface ChatUser {
  id: number
  name: string
  role?: string
}

export interface ChatAttachment {
  id: string
  resourceType: "image" | "video"
  format: string
  bytes: number
  width: number | null
  height: number | null
  duration: number | null
}

export interface ChatMessage {
  id: number
  conversationId: number
  senderId: number
  clientMessageId: string
  sequence: number
  text: string | null
  createdAt: string
  sender: ChatUser
  attachments: ChatAttachment[]
}

export interface ChatReadPosition {
  userId: number
  sequence: number
}

export interface ChatConversationSummary {
  id: number
  userId: number
  lastSequence: number
  createdAt: string
  updatedAt: string
  user: ChatUser
  readSequence: number
  readPositions: ChatReadPosition[]
  unreadCount: number
  lastMessage: ChatMessage | null
}

export interface ChatMessagePage {
  items: ChatMessage[]
  hasMore: boolean
  nextCursor: number | null
}

export interface ChatUploadReservation {
  uploadId: string
  uploadUrl: string
  fields: Record<string, string | number | boolean>
  maxBytes: number
  maxDuration: number
}
