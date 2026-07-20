import { authClient } from '../utils/auth-client'

export default defineNuxtRouteMiddleware(async (to) => {
  const { data: session } = await authClient.useSession(useFetch)

  const isLoggedIn = !!session.value
  const userRole = session.value?.user?.role

  const isAdminRoute = to.path.startsWith('/admin')
  const isCoachRoute = to.path.startsWith('/coach')
  const isReaderRoute = to.path.startsWith('/reader')

  if (!isLoggedIn && (isAdminRoute || isCoachRoute || isReaderRoute)) {
    return navigateTo('/auth')
  }

  if (!isLoggedIn) {
    return
  }

  if (to.path === '/auth') {
    if (userRole === 'admin') {
      return navigateTo('/admin')
    }

    if (userRole === 'coach') {
      return navigateTo('/coach')
    }

    return navigateTo('/reader/profile')
  }

  if (isAdminRoute && userRole !== 'admin') {
    return navigateTo(userRole === 'coach' ? '/coach' : '/reader/profile')
  }

  if (isCoachRoute && userRole !== 'admin' && userRole !== 'coach') {
    return navigateTo('/reader/profile')
  }
})
