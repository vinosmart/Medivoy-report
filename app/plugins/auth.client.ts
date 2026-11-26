export default defineNuxtPlugin({
  name: "auth",
  dependsOn: ["pinia"],
  setup() {
    const auth = useAuthStore();
    auth.init();
  },
});