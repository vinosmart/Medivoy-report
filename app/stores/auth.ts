import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as any,
    token: '' as string,
    isHydrated: false,
  }),
  getters: {
    isAdmin: (state) => state.user?.role === 'admin',
    isLoggedIn: (state) => Boolean(state.token),
  },
  actions: {
    init() {
      if (process.client) {
        const raw = localStorage.getItem('medivoy_auth')
        if (raw) {
          try {
            const parsed = JSON.parse(raw)
            this.user = parsed.user || null
            this.token = parsed.token || ''
          } catch {
            localStorage.removeItem('medivoy_auth')
          }
        }
        this.isHydrated = true
      }
    },
    login(user: any, token: string) {
      this.user = user
      this.token = token
      if (process.client) localStorage.setItem('medivoy_auth', JSON.stringify({ user, token }))
    },
    logout() {
      this.user = null
      this.token = ''
      if (process.client) localStorage.removeItem('medivoy_auth')
    },
  },
})