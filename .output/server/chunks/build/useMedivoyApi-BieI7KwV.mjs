import { u as useAuthStore } from './auth-DLg6Nzla.mjs';
import { b as useRuntimeConfig } from './server.mjs';

const useMedivoyApi = () => {
  const config = useRuntimeConfig();
  const auth = useAuthStore();
  const baseURL = config.public.apiBase || "https://api-geno.medivoy.ae/api";
  const headers = () => {
    const h = {};
    if (auth.token) {
      h.Authorization = `Bearer ${auth.token}`;
    }
    return h;
  };
  return {
    // Auth
    login: (email, password) => $fetch(`${baseURL}/auth/login`, {
      method: "POST",
      body: { email, password }
    }),
    register: (email, password, role = "patient", name = "") => $fetch(`${baseURL}/auth/register`, {
      method: "POST",
      body: { email, password, role, name }
    }),
    // Reports
    getReports: () => $fetch(`${baseURL}/reports`, {
      headers: headers()
    }),
    getReport: (id) => $fetch(`${baseURL}/reports/${id}`, {
      headers: headers()
    }),
    uploadReport: (formData) => $fetch(`${baseURL}/reports/upload`, {
      method: "POST",
      body: formData,
      headers: headers()
    }),
    deleteReport: (id) => $fetch(`${baseURL}/reports/${id}`, {
      method: "DELETE",
      headers: headers()
    }),
    // Family
    getFamilyMembers: () => $fetch(`${baseURL}/family`, {
      headers: headers()
    }),
    addFamilyMember: (data) => $fetch(`${baseURL}/family`, {
      method: "POST",
      body: data,
      headers: headers()
    }),
    deleteFamilyMember: (id) => $fetch(`${baseURL}/family/${id}`, {
      method: "DELETE",
      headers: headers()
    }),
    // Orders
    getOrders: () => $fetch(`${baseURL}/orders`, {
      headers: headers()
    }),
    placeOrder: (data) => $fetch(`${baseURL}/orders`, {
      method: "POST",
      body: data,
      headers: headers()
    }),
    updateOrderStatus: (id, status) => $fetch(`${baseURL}/orders/${id}/status`, {
      method: "PATCH",
      body: { status },
      headers: headers()
    }),
    deleteOrder: (id) => $fetch(`${baseURL}/orders/${id}`, {
      method: "DELETE",
      headers: headers()
    }),
    // Profile
    getProfile: () => $fetch(`${baseURL}/profile`, {
      headers: headers()
    }),
    saveProfile: (data) => $fetch(`${baseURL}/profile`, {
      method: "POST",
      body: data,
      headers: headers()
    }),
    // Genetics
    getGenetics: () => $fetch(`${baseURL}/genetics`, {
      headers: headers()
    }),
    saveGenetics: (data) => $fetch(`${baseURL}/genetics`, {
      method: "POST",
      body: data,
      headers: headers()
    }),
    // Nutrition
    getNutritionGuidance: (payload) => $fetch(`${baseURL}/nutrition/guidance`, {
      method: "POST",
      body: payload,
      headers: headers()
    }),
    // Pharmacy
    searchMedicines: (query, take = 20) => $fetch(`${baseURL}/pharmacy/medicines?q=${encodeURIComponent(query)}&take=${take}`, {
      headers: headers()
    }),
    getDoctors: (specialty) => $fetch(`${baseURL}/pharmacy/doctors${specialty ? `?specialty=${encodeURIComponent(specialty)}` : ""}`, {
      headers: headers()
    }),
    getPharmacies: (lat, lng) => $fetch(`${baseURL}/pharmacy/pharmacies?lat=${lat}&lng=${lng}`, {
      headers: headers()
    }),
    getPharmacySuggestions: (reportId) => $fetch(`${baseURL}/pharmacy/suggestions${reportId ? `?reportId=${encodeURIComponent(reportId)}` : ""}`, {
      headers: headers()
    })
  };
};

export { useMedivoyApi as u };
//# sourceMappingURL=useMedivoyApi-BieI7KwV.mjs.map
