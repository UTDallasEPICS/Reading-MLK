import path from 'path'
import { existsSync, mkdirSync } from 'fs'
import fs from 'node:fs/promises'
import { prisma } from '~~/server/utils/prisma'
import { auth } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.headers,
  })

  if (!session) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const form = await readMultipartFormData(event)

  if (!form) {
    throw createError({ statusCode: 400, statusMessage: 'No form data' })
  }

  const file = form.find((i) => i.name === 'file')

  if (!file || !file.data) {
    throw createError({ statusCode: 400, statusMessage: 'File missing' })
  }

  const dirPath = path.join(
    process.env.UPLOAD_STORAGE_PATH || 'public/images',
    'users',
    session.user.id,
    'images'
  )

  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true })
  }

  // Validate MIME type and derive file extension
  const MIME_TO_EXT: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
  }

  const ext = MIME_TO_EXT[file.type ?? '']
  if (!ext) {
    throw createError({ statusCode: 400, statusMessage: 'Unsupported image type. Only JPEG, PNG, and WebP are allowed.' })
  }

  const randomImageId = crypto.randomUUID()

  //Include extension in filename so the read side can detect MIME type
  const filePath = path.join(dirPath, `${randomImageId}.${ext}`)

  if (existsSync(filePath)) {
    throw createError({ statusCode: 400, message: 'Image already exists.' })
  }

  // Use promise-based writeFile so errors are properly caught
  await fs.writeFile(filePath, file.data)

  // Store the generated image ID in the database as required
  const addedImage = await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      image: path.join('users', session.user.id, 'images', `${randomImageId}.${ext}`),
    },
  })

  console.log(addedImage)

  setResponseStatus(event, 201)

  return {
    message: 'Added profile picture to logged in user.',
  }
})
