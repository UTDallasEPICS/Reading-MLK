import { createAuthClient } from "better-auth/vue";
import { magicLinkClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
    baseURL: typeof window !== 'undefined' 
        ? window.location.origin 
        : 'http://localhost:3000',
    fetchOptions: {
        credentials: 'include',
    },
    plugins: [
        magicLinkClient()
    ]
})

export const useAuth = () => {
    return {
        authClient,
        signInWithMagicLink: async (email: string, callbackURL = '/') => {
            return await authClient.signIn.magicLink({ email, callbackURL })
        },
        getSession: async () => {
            return await authClient.getSession()
        },
        signOut: async () => {
            return await authClient.signOut()
        }
    }
}

