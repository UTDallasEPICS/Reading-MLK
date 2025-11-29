import { createAuthClient } from "better-auth/vue";
import { magicLinkClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
    baseURL: process.env.NODE_ENV === 'production' 
        ? process.env.NUXT_PUBLIC_APP_URL || 'http://localhost:3000'
        : 'http://localhost:3000',
    plugins: [
        magicLinkClient()
    ]
})