export type ChatRole = 'user' | 'assistant' | 'system'

export interface ChatMessage {
  id: string
  conversation_id: string
  user_id: string
  role: ChatRole
  content: string
  tokens_used: number | null
  model: string | null
  created_at: string
}

export interface ChatConversation {
  id: string
  user_id: string
  title: string
  model: string
  message_count: number
  last_message_at: string | null
  created_at: string
  updated_at: string
}
