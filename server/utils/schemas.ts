import { z } from "zod";
import form from "../api/form";

export const emailSchema = z.email({ pattern: z.regexes.html5Email }).trim().toLowerCase()

export const userCreateSchema = z.object({
  name: z.string().min(1).max(100),
  email: emailSchema,
  role: z.enum(["admin", "reader"]).default("reader"),
  raffleOptIn: z.boolean().optional().default(false), 
  publicityConsent: z.boolean().optional().default(false),
})

export const adminCreateSchema = z.object({
  settings: z.object({}).optional()
})

export const studentCreateSchema = z.object({
  name: z.string("Invalid Name").min(1).max(35)
})

export const studentUpdateSchema = studentCreateSchema.extend({
  settings: z.object({
    dyslexiaFont: z.boolean().optional(), 
    fontSize: z.number().min(1).max(1.5).optional(),
    language: z.enum(["en", "es"]).optional(),
    raffleOptIn: z.boolean().optional(),
    publicityConsent: z.boolean().optional()
    }, "Invalid Settings").optional(),
  exp: z.int("Invalid EXP").max(100000, "Max EXP").min(0, "Min EXP").optional(),
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
})

export const formGroupGETSchema = formGroupCreateSchema.extend({
  id: z.int(),   
  raffleWinner: z.int().nullish()
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

export const formGETSchema = formCreateSchema.extend({
  id: z.int()
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

export type Email = z.infer<typeof emailSchema>
export type UserCreate = z.infer<typeof userCreateSchema>
export type AdminCreate = z.infer<typeof adminCreateSchema>
export type StudentCreate = z.infer<typeof studentCreateSchema>
export type StudentUpdate = z.infer<typeof studentUpdateSchema>
export type AnnouncementCreate = z.infer<typeof announcementCreateSchema>
export type FormCreate = z.infer<typeof formCreateSchema>
export type FormGET = z.infer<typeof formGETSchema>
export type FormGroupGET = z.infer<typeof formGroupGETSchema>
export type FormGroupCreate = z.infer<typeof formGroupCreateSchema>
export type FormComponentCreate = z.infer<typeof formComponentCreateSchema>
export type FormSubmissionCreate = z.infer<typeof formSubmissionCreateSchema>
export type SubmissionResponseCreate = z.infer<typeof submissionResponseCreateSchema>