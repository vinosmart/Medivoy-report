import { useAuthStore } from '~/stores/auth'

export const useMedivoyApi = () => {
  const config = useRuntimeConfig()
  const auth = useAuthStore()
  const baseURL = config.public.apiBase || 'https://api-geno.medivoy.ae/api'

  const headers = (): Record<string, string> => {
    return auth.token ? { Authorization: `Bearer ${auth.token}` } : {}
  }

  const apiFetch = <T>(
    url: string,
    options: Parameters<typeof $fetch>[1] = {},
  ) => {
    if (!auth.token) {
      return Promise.reject(
        new Error("Please sign in to access your health information."),
      );
    }

    return $fetch<T>(url, { ...options, headers: headers() })
  }

  return {
    // Auth
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

    // Reports
    getReports: () =>
      apiFetch<any[]>(`${baseURL}/reports`),

    getReport: (id: string) =>
      apiFetch<any>(`${baseURL}/reports/${id}`),

    uploadReport: (formData: FormData) =>
      apiFetch<any>(`${baseURL}/reports/upload`, {
        method: 'POST',
        body: formData,
      }),

    deleteReport: (id: string) =>
      apiFetch<any>(`${baseURL}/reports/${id}`, {
        method: 'DELETE',
      }),

    // Family
    getFamilyMembers: () =>
      apiFetch<any[]>(`${baseURL}/family`),

    addFamilyMember: (data: any) =>
      apiFetch<any>(`${baseURL}/family`, {
        method: 'POST',
        body: data,
      }),

    deleteFamilyMember: (id: string) =>
      apiFetch<any>(`${baseURL}/family/${id}`, {
        method: 'DELETE',
      }),

    // Orders
    getOrders: () =>
      apiFetch<any[]>(`${baseURL}/orders`),

    placeOrder: (data: any) =>
      apiFetch<any>(`${baseURL}/orders`, {
        method: 'POST',
        body: data,
      }),

    updateOrderStatus: (id: string, status: string) =>
      apiFetch<any>(`${baseURL}/orders/${id}/status`, {
        method: 'PATCH',
        body: { status },
      }),

    deleteOrder: (id: string) =>
      apiFetch<any>(`${baseURL}/orders/${id}`, {
        method: 'DELETE',
      }),

    // Profile
    getProfile: () =>
      apiFetch<any>(`${baseURL}/profile`),

    saveProfile: (data: any) =>
      apiFetch<any>(`${baseURL}/profile`, {
        method: 'POST',
        body: data,
      }),

    // Genetics
    getGenetics: () =>
      apiFetch<any>(`${baseURL}/genetics`),

    saveGenetics: (data: any) =>
      apiFetch<any>(`${baseURL}/genetics`, {
        method: 'POST',
        body: data,
      }),

    // Nutrition
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
      apiFetch<any>(`${baseURL}/nutrition/guidance`, {
        method: 'POST',
        body: payload,
      }),

    // Pharmacy
    searchMedicines: (query: string, take = 20) =>
      apiFetch<any>(`${baseURL}/pharmacy/medicines?q=${encodeURIComponent(query)}&take=${take}`),

    getDoctors: (specialty?: string) =>
      apiFetch<any>(`${baseURL}/pharmacy/doctors${specialty ? `?specialty=${encodeURIComponent(specialty)}` : ''}`),

    getPharmacies: (lat: number, lng: number) =>
      apiFetch<any>(`${baseURL}/pharmacy/pharmacies?lat=${lat}&lng=${lng}`),

    getPharmacySuggestions: (reportId?: string) =>
      apiFetch<any>(`${baseURL}/pharmacy/suggestions${reportId ? `?reportId=${encodeURIComponent(reportId)}` : ''}`),
  }
}