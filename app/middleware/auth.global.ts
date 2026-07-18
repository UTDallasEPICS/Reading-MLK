import { authClient } from '../utils/auth-client'

export default defineNuxtRouteMiddleware(async (to) => {
  const { data: session } = await authClient.useSession(useFetch)

  const isLoggedIn = !!session.value
  const userRole = session.value?.user?.role

  const isAdminRoute = to.path.startsWith('/admin')
  const isUniversalAdminRoute = to.path.startsWith('/universal-admin')
  const isCreateClassRoute = to.path === '/universal-admin/create-class'
  const isReaderRoute = to.path.startsWith('/reader')

  if (!isLoggedIn && (isAdminRoute || isUniversalAdminRoute || isReaderRoute)) {
    return navigateTo('/auth')
  }

  if (!isLoggedIn) {
    return
  }

  if (to.path === '/auth') {
    const requestedRole = Array.isArray(to.query.role) ? to.query.role[0] : to.query.role

    if (requestedRole === 'admin') {
      if (userRole === 'admin') {
        return navigateTo('/universal-admin')
      }

      return navigateTo(userRole === 'poster' ? '/admin' : '/reader')
    }

    if (requestedRole === 'reader') {
      return navigateTo('/reader')
    }

    if (userRole === 'admin') {
      return navigateTo('/universal-admin')
    }

    return navigateTo(userRole === 'poster' ? '/admin' : '/reader')
  }

  if (isUniversalAdminRoute && !isCreateClassRoute && userRole !== 'admin') {
    return navigateTo(userRole === 'poster' ? '/admin' : '/reader')
  }

  if (isCreateClassRoute && userRole !== 'admin' && userRole !== 'poster') {
    return navigateTo('/reader')
  }

  if (isAdminRoute && userRole !== 'admin' && userRole !== 'poster') {
    return navigateTo('/reader')
  }
})
