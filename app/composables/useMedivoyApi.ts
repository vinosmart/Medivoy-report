import { useAuthStore } from '~/stores/auth'

export const useMedivoyApi = () => {
  const config = useRuntimeConfig()
  const auth = useAuthStore()
  const baseURL = config.public.apiBase || 'http://localhost:3001/api'

  const headers = (): Record<string, string> => {
    const h: Record<string, string> = {}
    if (auth.token) h.Authorization = `Bearer ${auth.token}`
    return h
  }

  return {
    // ── Auth ──────────────────────────────────────────────────────────────────
    login: (email: string, password: string) =>
      $fetch<any>(`${baseURL}/auth/login`, {
        method: 'POST',
        body: { email, password },
      }),

    register: (email: string, password: string, role = 'patient') =>
      $fetch<any>(`${baseURL}/auth/register`, {
        method: 'POST',
        body: { email, password, role },
      }),

    // ── Reports ───────────────────────────────────────────────────────────────
    getReports: () =>
      $fetch<any[]>(`${baseURL}/reports`, { headers: headers() }),

    getReport: (id: string) =>
      $fetch<any>(`${baseURL}/reports/${id}`, { headers: headers() }),

    uploadReport: (formData: FormData) =>
      $fetch<any>(`${baseURL}/reports/upload`, {
        method: 'POST',
        body: formData,
        headers: headers(),
      }),

    deleteReport: (id: string) =>
      $fetch<any>(`${baseURL}/reports/${id}`, {
        method: 'DELETE',
        headers: headers(),
      }),

    // ── Family ────────────────────────────────────────────────────────────────
    getFamilyMembers: () =>
      $fetch<any[]>(`${baseURL}/family`, { headers: headers() }),

    addFamilyMember: (data: any) =>
      $fetch<any>(`${baseURL}/family`, {
        method: 'POST',
        body: data,
        headers: headers(),
      }),

    deleteFamilyMember: (id: string) =>
      $fetch<any>(`${baseURL}/family/${id}`, {
        method: 'DELETE',
        headers: headers(),
      }),

    // ── Orders ────────────────────────────────────────────────────────────────
    getOrders: () =>
      $fetch<any[]>(`${baseURL}/orders`, { headers: headers() }),

    placeOrder: (data: any) =>
      $fetch<any>(`${baseURL}/orders`, {
        method: 'POST',
        body: data,
        headers: headers(),
      }),

    updateOrderStatus: (id: string, status: string) =>
      $fetch<any>(`${baseURL}/orders/${id}/status`, {
        method: 'PATCH',
        body: { status },
        headers: headers(),
      }),

    deleteOrder: (id: string) =>
      $fetch<any>(`${baseURL}/orders/${id}`, {
        method: 'DELETE',
        headers: headers(),
      }),

    // ── Profile ───────────────────────────────────────────────────────────────
    getProfile: () =>
      $fetch<any>(`${baseURL}/profile`, { headers: headers() }),

    saveProfile: (data: any) =>
      $fetch<any>(`${baseURL}/profile`, {
        method: 'POST',
        body: data,
        headers: headers(),
      }),

    // ── Genetics ──────────────────────────────────────────────────────────────
    getGenetics: () =>
      $fetch<any>(`${baseURL}/genetics`, { headers: headers() }),

    saveGenetics: (data: any) =>
      $fetch<any>(`${baseURL}/genetics`, {
        method: 'POST',
        body: data,
        headers: headers(),
      }),

    // ── Nutrition ─────────────────────────────────────────────────────────────
    getNutritionGuidance: (payload: {
      goal: string
      diet?: string
      region?: string
      memberName?: string
      relation?: string
      age?: string
      conditions?: string
      reportSummary?: string
    }) =>
      $fetch<any>(`${baseURL}/nutrition/guidance`, {
        method: 'POST',
        body: payload,
        headers: headers(),
      }),
  }
}