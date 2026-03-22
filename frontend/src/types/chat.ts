export type MessageRole = 'user' | 'assistant' | 'system'

export interface ChatMessage {
  id: string
  role: Exclude<MessageRole, 'system'>
  content: string
  timestamp: string
  model?: string
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
  error?: boolean
}

export interface ChatRequest {
  message: string
  history: Array<{
    role: MessageRole
    content: string
    timestamp?: string
  }>
  conversation_id?: string
  stream?: boolean
  temperature?: number
  max_tokens?: number
}

export interface ChatResponse {
  conversation_id: string
  response: string
  model: string
  timestamp: string
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
  status: 'success' | 'error'
  conversation_title?: string
}

export interface ConversationSummary {
  conversation_id: string
  conversation_title: string
  created_at: string
  updated_at: string
  is_archived: boolean
  last_message_preview: string
  message_count: number
}

export interface ChatHistoryResponse {
  items: ConversationSummary[]
  total: number
}

export interface ConversationLoadResponse {
  conversation_id: string
  conversation_title: string
  is_archived: boolean
  messages: Array<{
    role: MessageRole
    content: string
    timestamp?: string
  }>
}

export interface ApiError {
  error: string
  code: string
  status: 'error'
}

export interface UserSettings {
  temperature: number
  maxTokens: number
  enableTypingIndicator: boolean
  compactMode: boolean
}
