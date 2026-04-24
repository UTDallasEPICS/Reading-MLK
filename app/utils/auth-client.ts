import { createAuthClient } from 'better-auth/vue'
import { magicLinkClient, inferAdditionalFields } from 'better-auth/client/plugins'
import type { auth } from '~~/server/utils/auth'

export const authClient = createAuthClient({
  plugins: [
    magicLinkClient(),
    inferAdditionalFields<typeof auth>(),
  ],
})