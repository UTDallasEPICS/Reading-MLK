import { z } from "zod";

export const userSchema = z.object({
  id: z.cuid2(),
  name: z.string().min(1).max(100),
  email: z.email(),
  emailVerified: z.boolean(),
  role: z.literal(["admin", "reader"]),
  
})

export const adminSchema = z.object({
  id: z.string().max(30),
  settings: z.object({}).optional().nullable(),
  userid: z.cuid2()
})

export const announcementSchema = z.object({
  postDate: z.coerce.date(),
  expireDate: z.coerce.date().nullable().optional(),
  content: z.object({
    icon: z.string().max(8),
    title: z.string().min(1).max(250),
    body: z.string().min(1).max(5000)
  })
})

export const formSchema = z.object({
  id: z.int(),
  order: z.int(),
  startDate: z.coerce.date(), 
  endDate: z.coerce.date(),
  published: z.boolean(),
  author: z.cuid2(),
  formGroup: z.int(),
  title: z.string().min(1).max(250),
})

export type Admin = z.infer<typeof adminSchema>
export type Announcement = z.infer<typeof announcementSchema>
export type Form = z.infer<typeof formSchema>