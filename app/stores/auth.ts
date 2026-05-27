import { defineStore } from 'pinia'

type Role = 'patient' | 'doctor' | 'admin'

type User = {
  id: string
  email: string
  role: Role
  name?: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)

  const isLoggedIn = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  function login(userData: User, accessToken: string) {
    user.value = userData
    token.value = accessToken
    if (import.meta.client) {
      localStorage.setItem('medivoy_user', JSON.stringify(userData))
      localStorage.setItem('medivoy_token', accessToken)
    }
  }

  function loadFromStorage() {
    if (!import.meta.client) return
    try {
      const savedUser = localStorage.getItem('medivoy_user')
      const savedToken = localStorage.getItem('medivoy_token')
      if (savedUser) user.value = JSON.parse(savedUser)
      if (savedToken) token.value = savedToken
    } catch (e) {
      console.error('[Auth] Failed to restore from storage', e)
    }
  }

  function logout() {
    user.value = null
    token.value = null
    if (import.meta.client) {
      localStorage.removeItem('medivoy_user')
      localStorage.removeItem('medivoy_token')
    }
  }

  return { user, token, isLoggedIn, isAdmin, login, loadFromStorage, logout }
})
