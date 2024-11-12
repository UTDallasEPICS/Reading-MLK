import { PrismaClient } from "@prisma/client"
const client = new PrismaClient()
const runtime = useRuntimeConfig()
export default defineEventHandler(async event => {
  const body = await readBody(event)
  setCookie(event, "rhtoken", body.id_token)
  console.log(body)
  await sendRedirect(event, "/") 
});