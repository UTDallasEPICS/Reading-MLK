// Only Rae can manage admins in production. Development also permits other admins.
export const masterAdminEmails = ['rae@readinghuddle.com']

export const isMasterAdmin = (email: string) =>
  masterAdminEmails.includes(email.trim().toLowerCase())
