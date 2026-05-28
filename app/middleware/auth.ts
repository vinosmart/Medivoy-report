export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()
  if (!auth.isHydrated && process.client) auth.init()
  if (!auth.token && to.path !== '/') return navigateTo('/')
})