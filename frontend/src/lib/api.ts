import axios, { AxiosError } from 'axios'
import { auth } from '../firebase/config'
import type {
  ApiError,
  ChatHistoryResponse,
  ChatRequest,
  ChatResponse,
  ConversationLoadResponse,
} from '../types/chat'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const withSwappedLocalhost = (url: string): string => {
  try {
    const parsed = new URL(url)
    if (parsed.hostname === 'localhost') {
      parsed.hostname = '127.0.0.1'
      return parsed.toString()
    }
    if (parsed.hostname === '127.0.0.1') {
      parsed.hostname = 'localhost'
      return parsed.toString()
    }
  } catch {
    return url
  }
  return url
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(async (config) => {
  const user = auth?.currentUser
  if (user) {
    const token = await user.getIdToken()
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const requestConfig = error.config
    const isNetworkError = !error.response && (error.code === 'ERR_NETWORK' || error.message === 'Network Error')

    if (isNetworkError && requestConfig && !requestConfig.headers?.['x-localhost-fallback']) {
      const fallbackBaseUrl = withSwappedLocalhost(requestConfig.baseURL || API_BASE_URL)
      if (fallbackBaseUrl !== (requestConfig.baseURL || API_BASE_URL)) {
        const nextHeaders = { ...(requestConfig.headers || {}), 'x-localhost-fallback': '1' }
        return api.request({
          ...requestConfig,
          baseURL: fallbackBaseUrl,
          headers: nextHeaders,
        })
      }
    }

    return Promise.reject(error)
  },
)

export const chatApi = {
  async sendMessage(payload: ChatRequest): Promise<ChatResponse> {
    const { data } = await api.post<ChatResponse>('/chat', payload)
    return data
  },

  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const { data } = await api.get('/health')
    return data
  },

  async verifyToken(): Promise<{ uid: string; email?: string; valid: boolean }> {
    const { data } = await api.get('/auth/verify')
    return data
  },

  async getHistory(search = '', includeArchived = false): Promise<ChatHistoryResponse> {
    const { data } = await api.get<ChatHistoryResponse>('/chat/history', {
      params: { search, include_archived: includeArchived, limit: 100 },
    })
    return data
  },

  async loadConversation(conversationId: string): Promise<ConversationLoadResponse> {
    const { data } = await api.get<ConversationLoadResponse>('/chat/load', {
      params: { conversation_id: conversationId },
    })
    return data
  },

  async updateConversationTitle(conversationId: string, conversationTitle: string): Promise<void> {
    await api.patch('/chat/title', {
      conversation_id: conversationId,
      conversation_title: conversationTitle,
    })
  },

  async archiveConversation(conversationId: string, isArchived: boolean): Promise<void> {
    await api.patch('/chat/archive', {
      conversation_id: conversationId,
      is_archived: isArchived,
    })
  },

  async deleteConversation(conversationId: string): Promise<void> {
    await api.delete('/chat/delete', {
      data: {
        conversation_id: conversationId,
      },
    })
  },
}

export const parseApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>
    if (!axiosError.response && (axiosError.code === 'ERR_NETWORK' || axiosError.message === 'Network Error')) {
      return `Unable to connect to the server (${API_BASE_URL}). Please ensure backend is running.`
    }
    return (
      axiosError.response?.data?.error ||
      axiosError.message ||
      'Network error. Please check your connection and try again.'
    )
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'An unexpected error occurred.'
}
