import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { saveToken, clearToken, api } from './api'

interface User {
  id: number
  username: string
  email?: string
  streak_days: number
  words_known: number
  words_learning: number
  words_unknown: number
}

interface AuthStore {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  register: (username: string, password: string, email?: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

export const useAuth = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      login: async (username, password) => {
        set({ isLoading: true })
        try {
          const data = await api.login({ username, password })
          saveToken(data.access_token)
          set({ token: data.access_token })
          await get().refreshUser()
        } finally {
          set({ isLoading: false })
        }
      },

      register: async (username, password, email) => {
        set({ isLoading: true })
        try {
          const data = await api.register({ username, password, email })
          saveToken(data.access_token)
          set({ token: data.access_token })
          await get().refreshUser()
        } finally {
          set({ isLoading: false })
        }
      },

      logout: () => {
        clearToken()
        set({ user: null, token: null })
      },

      refreshUser: async () => {
        try {
          const user = await api.me()
          set({ user })
        } catch {
          get().logout()
        }
      },
    }),
    {
      name: 'leximind-auth',
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
)
