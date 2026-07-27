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
    const requestedRole = Array.isArray(to.query.role) ? to.query.role[0] : to.query.role

    if (requestedRole === 'reader') {
      return navigateTo('/reader')
    }

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

  if (isCoachRoute && userRole === 'coach') {
    const requestFetch = useRequestFetch()
    const coach = await requestFetch<{ id: string } | null>('/api/coach/profile')

    if (!coach && to.path !== '/coach/onboarding') {
      return navigateTo('/coach/onboarding')
    }

    if (coach && to.path === '/coach/onboarding') {
      return navigateTo('/coach')
    }
  }

  if (isCoachRoute && to.path !== '/coach/create-class' && to.path !== '/coach/onboarding' && userRole === 'coach') {
    const requestFetch = useRequestFetch()
    const classes = await requestFetch<Array<{ joinToken: string }>>('/api/admin/classes')

    if (classes.length === 0) {
      return navigateTo('/coach/create-class')
    }
  }
})
