import { z } from "zod";

export const userSchema = z.object({
  id: z.cuid2(),
  name: z.string().min(1).max(100),
  email: z.email(),
  emailVerified: z.boolean(),
  role: z.enum(["admin", "reader"]),
  raffleOptIn: z.boolean(), 
  publicityConsent: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
})



export const adminSchema = z.object({
  id: z.string().max(30),
  settings: z.object({}).optional().nullable(),
  userid: z.cuid2()
})

export const studentSchema = z.object({
  id: z.int(),
  name: z.string().min(1).max(35), 
  settings: z.object({}).optional().nullable(),
  exp: z.int().max(1000).min(0),
  parentUserId: z.cuid2()
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

export const formGroupSchema = z.object({
  id: z.int(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  raffleWinner: z.int().nullable().optional()
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

export const formComponentSchema = z.object({
  id: z.int(),
  form: z.int(),
  order: z.int().min(0),
  questionType: z.enum(["mcq", "text", "context", "video"]),
  questionText: z.string().min(1).max(2500),
  questionOptions: z.object({})
})

export const formSubmissionSchema = z.object({
  id: z.int(),
  student: z.int(),
  form: z.int(),
  submissionDate: z.coerce.date()
})

export const submissionResponseSchema = z.object({
  id: z.int(),
  submission: z.int(),
  formComponent: z.int(),
  response: z.string().min(1).max(5000)
})

export const shopItemSchema = z.object({
  id: z.int(),
  type: z.enum(["theme", "animation"]),
  name: z.string().min(1).max(150),
  dateAvailable: z.coerce.date(),
  cost: z.int().min(0).max(150) 
})

export const shopThemeSchema = z.object({
  id: z.int(),
  shopItem: z.int(),
  themeColor: z.string(),
  themeEffect: z.object({}).optional().nullable()
})

export const shopAnimationSchema = z.object({
  id: z.int(),
  shopItem: z.int(),
  animationType: z.string(),
  animationEffect: z.object({}).optional().nullable()
})

export const pendingEmailChangeSchema = z.object({
  id: z.int(),
  userId: z.cuid2(),
  newEmail: z.email(),
  token: z.string().min(1),
  expiresAt: z.coerce.date(),
  createdAt: z.coerce.date()
})

export type User = z.infer<typeof userSchema>
export type Admin = z.infer<typeof adminSchema>
export type Student = z.infer<typeof studentSchema>
export type Announcement = z.infer<typeof announcementSchema>
export type Form = z.infer<typeof formSchema>
export type FormGroup = z.infer<typeof formGroupSchema>
export type FormComponent = z.infer<typeof formComponentSchema>
export type FormSubmission = z.infer<typeof formSubmissionSchema>
export type SubmissionResponse = z.infer<typeof submissionResponseSchema>
export type ShopItem = z.infer<typeof shopItemSchema>
export type ShopTheme = z.infer<typeof shopThemeSchema>
export type ShopAnimation = z.infer<typeof shopAnimationSchema>
export type PendingEmailChange = z.infer<typeof pendingEmailChangeSchema>