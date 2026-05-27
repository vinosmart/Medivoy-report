import { defineStore } from "pinia";

export const useReportsStore = defineStore("reports", () => {
  const list = ref([]);
  const current = ref(null);

  return { list, current };
});
