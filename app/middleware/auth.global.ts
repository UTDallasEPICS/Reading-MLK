import { authClient } from '../utils/auth-client'

export default defineNuxtRouteMiddleware(async (to) => {
  const { data: session } = await authClient.useSession(useFetch)

  const isLoggedIn = !!session.value
  const userRole = (session.value?.user as { role?: string } | undefined)?.role

  const isAdminRoute = to.path.startsWith('/admin')
  const isReaderRoute = to.path.startsWith('/reader')

  if (!isLoggedIn && (isAdminRoute || isReaderRoute)) {
    return navigateTo('/auth')
  }

  if (isLoggedIn && isAdminRoute && userRole !== 'admin') {
    return navigateTo('/reader/profile')
  }
})