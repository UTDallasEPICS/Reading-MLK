import { authClient } from '../utils/auth-client'

export default defineNuxtRouteMiddleware(async (to) => {
  const { data: session } = await authClient.useSession(useFetch)

  const isLoggedIn = !!session.value
  const userRole = session.value?.user?.role

  const isAdminRoute = to.path.startsWith('/admin')
  const isReaderRoute = to.path.startsWith('/reader')

  if (!isLoggedIn && (isAdminRoute || isReaderRoute)) {
    return navigateTo('/auth')
  }

  if (!isLoggedIn) {
    return
  }

  if (to.path === '/auth') {
    const requestedRole = Array.isArray(to.query.role) ? to.query.role[0] : to.query.role

    if (requestedRole === 'admin') {
      return navigateTo(userRole === 'admin' ? '/admin' : '/reader/profile')
    }

    if (requestedRole === 'reader') {
      return navigateTo('/reader/profile')
    }

    return navigateTo(userRole === 'admin' ? '/admin' : '/reader/profile')
  }

  if (isAdminRoute && userRole !== 'admin') {
    return navigateTo('/reader/profile')
  }
})