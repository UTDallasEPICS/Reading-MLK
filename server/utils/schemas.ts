import { z } from "zod";

export const emailSchema = z.email({ pattern: z.regexes.html5Email }).trim().toLowerCase()

export const userCreateSchema = z.object({
  name: z.string().min(1).max(100),
  email: emailSchema,
  role: z.enum(["admin", "reader"]).default("reader"),
  raffleOptIn: z.boolean().optional().default(false), 
  publicityConsent: z.boolean().optional().default(false),
})

export const adminCreateSchema = z.object({
  id: z.string().max(30),
  settings: z.object({}).optional()
})

export const studentCreateSchema = z.object({
  name: z.string().min(1).max(35), 
  settings: z.object({
    dyslexiaFont: z.boolean().optional(), 
    fontSize: z.number().min(1).max(1.5).optional(),
    language: z.enum(["en", "es"]).optional(),
    raffleOptIn: z.boolean().optional(),
    publicityConsent: z.boolean().optional()
    }).optional(),
  exp: z.int().max(1000).min(0),
  parentUserId: z.cuid2()
})

export const announcementCreateSchema = z.object({
  postDate: z.coerce.date(),
  expiryDate: z.coerce.date().nullish(),
  author: z.cuid2().nullish(),
  content: z.object({
    icon: z.string().max(8),
    title: z.string().min(1).max(250),
    body: z.string().min(1).max(5000)
  })
})

export const formGroupCreateSchema = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  raffleWinner: z.int().nullable().optional()
})

export const formCreateSchema = z.object({
  order: z.int(),
  startDate: z.coerce.date(), 
  endDate: z.coerce.date(),
  published: z.boolean(),
  author: z.cuid2(),
  formGroup: z.int(),
  title: z.string().min(1).max(250),
})

export const formComponentCreateSchema = z.object({
  form: z.int(),
  order: z.int().min(0),
  questionType: z.enum(["mcq", "text", "context", "video"]),
  questionText: z.string().min(1).max(2500),
  questionOptions: z.object({
    choices: z.array(z.object({text: z.string().min(1), correct: z.boolean()})).optional(),
    video: z.string().optional()
  })
})

export const formSubmissionCreateSchema = z.object({
  student: z.int(),
  form: z.int(),
  submissionDate: z.coerce.date().default(new Date())
})

export const submissionResponseCreateSchema = z.object({
  submission: z.int(),
  formComponent: z.int(),
  response: z.string().min(1).max(5000)
})

export const shopItemCreateSchema = z.object({
  type: z.enum(["theme", "animation"]),
  name: z.string().min(1).max(150),
  dateAvailable: z.coerce.date(),
  cost: z.int().min(0).max(150) 
})

export const shopThemeCreateSchema = z.object({
  shopItem: z.int(),
  themeColor: z.string(),
  themeEffect: z.object({}).nullish()
})

export const shopAnimationCreateSchema = z.object({
  shopItem: z.int(),
  animationType: z.string(),
  animationEffect: z.object({}).nullish()
})

export const pendingEmailChangeCreateSchema = z.object({
  userId: z.cuid2(),
  newEmail: emailSchema,
  token: z.string().min(1),
  expiresAt: z.coerce.date(),
  createdAt: z.coerce.date()
})

export type Email = z.infer<typeof emailSchema>
export type UserCreate = z.infer<typeof userCreateSchema>
export type AdminCreate = z.infer<typeof adminCreateSchema>
export type StudentCreate = z.infer<typeof studentCreateSchema>
export type AnnouncementCreate = z.infer<typeof announcementCreateSchema>
export type FormCreate = z.infer<typeof formCreateSchema>
export type FormGroupCreate = z.infer<typeof formGroupCreateSchema>
export type FormComponentCreate = z.infer<typeof formComponentCreateSchema>
export type FormSubmissionCreate = z.infer<typeof formSubmissionCreateSchema>
export type SubmissionResponseCreate = z.infer<typeof submissionResponseCreateSchema>
export type ShopItemCreate = z.infer<typeof shopItemCreateSchema>
export type ShopThemeCreate = z.infer<typeof shopThemeCreateSchema>
export type ShopAnimationCreate = z.infer<typeof shopAnimationCreateSchema>
export type PendingEmailChangeCreate = z.infer<typeof pendingEmailChangeCreateSchema>