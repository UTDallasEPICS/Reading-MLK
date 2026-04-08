import { authClient } from '../utils/auth-client'

export default defineNuxtRouteMiddleware(async (to) => {
  const { data: session } = await authClient.useSession(useFetch)

  const publicRoutes = ['/', '/auth']

  if (!session.value && !publicRoutes.includes(to.path)) {
    return navigateTo('/auth')
  }

  if (session.value && to.path === '/auth') {
    return navigateTo('/')
  }
})