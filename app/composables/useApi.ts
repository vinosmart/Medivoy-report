import { useAuthStore } from '~/stores/auth'

export function useApi() {
  const config = useRuntimeConfig()
  const auth = useAuthStore()
  const baseUrl = config.public.apiBase || 'http://127.0.0.1:3001/api'

  // CRITICAL: Always restore token from localStorage before any API call
  // This fixes the 401 error when navigating between pages
  if (import.meta.client) {
    auth.loadFromStorage()
  }

  function getHeaders(contentType: string | null = 'application/json') {
    const headers: Record<string, string> = {}
    if (contentType) headers['Content-Type'] = contentType
    if (auth.token) {
      headers['Authorization'] = `Bearer ${auth.token}`
    }
    return headers
  }

  async function register(email: string, password: string, role = 'patient') {
    const res: any = await $fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      body: { email, password, role },
    })
    if (res?.access_token) auth.login(res.user, res.access_token)
    return res
  }

  async function login(email: string, password: string) {
    const res: any = await $fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      body: { email, password },
    })
    if (res?.access_token) auth.login(res.user, res.access_token)
    return res
  }

  async function uploadReport(title: string, type: string, file: File) {
    // Always reload token from storage before upload
    if (import.meta.client) auth.loadFromStorage();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('type', type);
    const headers = getHeaders(null);
    console.log('[uploadReport] Using token:', auth.token);
    return await $fetch(`${baseUrl}/reports/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });
  }

  async function getReports() {
    return await $fetch(`${baseUrl}/reports`, {
      headers: getHeaders(),
    })
  }

  async function getReport(id: string) {
    return await $fetch(`${baseUrl}/reports/${id}`, {
      headers: getHeaders(),
    })
  }

  return { register, login, uploadReport, getReports, getReport }
}
