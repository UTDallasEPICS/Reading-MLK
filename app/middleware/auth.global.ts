import { authClient } from '../utils/auth-client'

export default defineNuxtRouteMiddleware(async (to) => {
  const { data: session } = await authClient.useSession(useFetch)

  const publicRoutes = ['/', '/auth']

  if (!session.value && !publicRoutes.includes(to.path)) {
    return navigateTo('/auth')
  }

  if (!session.value) {
    return
  }

  const userRole = (session.value.user as { role?: string } | undefined)?.role

  if (to.path === '/') {
    return navigateTo(userRole === 'admin' ? '/admin' : '/reader/profile')
  }

  if (to.path === '/auth') {
    const role = to.query.role

    if (role === 'admin') {
      return navigateTo(userRole === 'admin' ? '/admin' : '/')
    }

    return navigateTo('/reader/profile')
  }

  if (to.path.startsWith('/admin') && userRole !== 'admin') {
    return navigateTo('/')
  }
})