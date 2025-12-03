import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken"
import fs from "fs"

const client = new PrismaClient()
const runtime = useRuntimeConfig()

export default defineEventHandler(async event => {
  try {
    const body = await readBody(event)
    const idToken = body.id_token
    
    if (!idToken) {
      throw new Error('No id_token provided')
    }

    // Verify the JWT token
    const decoded = jwt.verify(
      idToken,
      fs.readFileSync(process.cwd() + '/cert-dev.pem')
    ) as jwt.JwtPayload

    const email = decoded.email as string
    
    if (!email) {
      throw new Error('No email in token')
    }

    // Check if user exists
    let user = await client.user.findFirst({
      where: { email }
    })

    // If user doesn't exist, create them
    if (!user) {
      console.log(`Creating new user for email: ${email}`)
      
      // Generate username from email
      const username = email.split('@')[0] + '_' + Math.random().toString(36).substring(7)
      const firstName = email.split('@')[0]
      
      // Check if this is the dev email to assign faculty role
      const devEmail = process.env.DEV_EMAIL || ''
      const role = email === devEmail ? 'faculty' : 'parent'
      
      user = await client.user.create({
        data: {
          email,
          user_name: username,
          first_name: firstName,
          last_name: '',
          role,
        }
      })
      
      console.log(`Created user: ${user.user_name} with role: ${role}`)
    }

    // Set cookies
    setCookie(event, "rhtoken", idToken)
    setCookie(event, "rhuser", JSON.stringify(user))
    
    console.log(`User ${email} authenticated successfully`)
    await sendRedirect(event, "/")
    
  } catch (error) {
    console.error('Callback error:', error)
    setCookie(event, 'rhtoken', '')
    setCookie(event, 'rhuser', '')
    await sendRedirect(event, '/api/login')
  }
});