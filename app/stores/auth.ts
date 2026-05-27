import { defineStore } from 'pinia'
export const useAuthStore = defineStore('auth', () => {
  const user = ref<any>(null)
  const token = ref<string | null>(null)
  const isLoggedIn = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  function loadFromStorage() {
    if (!import.meta.client) return
    const u = localStorage.getItem('medivoy_user')
    const t = localStorage.getItem('medivoy_token')
    if (u) user.value = JSON.parse(u)
    if (t) token.value = t
  }

  function login(userData: any, accessToken: string) {
    user.value = userData
    token.value = accessToken
    if (import.meta.client) {
      localStorage.setItem('medivoy_user', JSON.stringify(userData))
      localStorage.setItem('medivoy_token', accessToken)
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

  return { user, token, isLoggedIn, isAdmin, loadFromStorage, login, logout }
})
