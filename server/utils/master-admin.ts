import { masterAdmins as localMasterAdmins } from '../../prisma/seed'

// Production master access is independent of the local seed data.
export const masterAdminEmails = ['rae@readinghuddle.com']

export const isMasterAdmin = (email: string) => {
  const normalizedEmail = email.trim().toLowerCase()
  return masterAdminEmails.includes(normalizedEmail)
    || (process.env.NODE_ENV !== 'production'
      && localMasterAdmins.some((admin) => admin.email.trim().toLowerCase() === normalizedEmail))
}
