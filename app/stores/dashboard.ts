import { defineStore } from "pinia";

export const useDashboardStore = defineStore("dashboard", () => {
  const stats = ref({ healthScore: 87, riskScore: 24, bioAge: 35 });
  return { stats };
});
