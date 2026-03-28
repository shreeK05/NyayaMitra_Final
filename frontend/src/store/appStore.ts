import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Language, Message, Case, Amendment } from '@/types'

interface User {
  id?: string
  phone: string
  name: string
  state: string
  isLoggedIn: boolean
}

interface AppState {
  language: Language
  setLanguage: (lang: Language) => void

  isOnline: boolean
  setIsOnline: (online: boolean) => void

  // Auth
  user: User | null
  setUser: (user: User | null) => void
  logout: () => void

  // Voice Counsellor
  messages: Message[]
  addMessage: (msg: Message) => void
  clearMessages: () => void
  isListening: boolean
  setIsListening: (listening: boolean) => void
  isProcessing: boolean
  setIsProcessing: (processing: boolean) => void

  // Cases
  cases: Case[]
  addCase: (c: Case) => void
  updateCase: (id: string, updates: Partial<Case>) => void

  // Amendments
  amendments: Amendment[]
  setAmendments: (a: Amendment[]) => void

  // NyayaScore
  nyayaScore: number
  setNyayaScore: (score: number) => void

  // User state
  userState: string
  setUserState: (state: string) => void

  // Active tab
  activeTab: string
  setActiveTab: (tab: string) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      language: 'hi',
      setLanguage: (lang) => set({ language: lang }),

      isOnline: true,
      setIsOnline: (online) => set({ isOnline: online }),

      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null, messages: [], nyayaScore: 0 }),

      messages: [],
      addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
      clearMessages: () => set({ messages: [] }),
      isListening: false,
      setIsListening: (listening) => set({ isListening: listening }),
      isProcessing: false,
      setIsProcessing: (processing) => set({ isProcessing: processing }),

      cases: [],
      addCase: (c) => set((s) => ({ cases: [...s.cases, c] })),
      updateCase: (id, updates) =>
        set((s) => ({
          cases: s.cases.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        })),

      amendments: [],
      setAmendments: (a) => set({ amendments: a }),

      nyayaScore: 0,
      setNyayaScore: (score) => set({ nyayaScore: score }),

      userState: 'Maharashtra',
      setUserState: (state) => set({ userState: state }),

      activeTab: 'home',
      setActiveTab: (tab) => set({ activeTab: tab }),
    }),
    {
      name: 'nyayamitra-store',
      partialUpdater: true,
    } as any
  )
)
