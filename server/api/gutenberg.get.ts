import { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  const { src } = getQuery(event) as { src?: string }
  if (!src) {
    throw createError({ statusCode: 400, statusMessage: 'Missing src query parameter' })
  }

  const decoded = decodeURIComponent(src)

  try {
    const res = await fetch(decoded)
    if (!res.ok) {
      throw new Error(`Upstream fetch failed: ${res.status}`)
    }
    const text = await res.text()

    // try to extract body content to avoid injecting full <html> into our page
    const m = text.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
    let html = m ? m[1] : text

    // strip any <script> tags for safety
    html = html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')

    return { html }
  } catch (err: any) {
    throw createError({ statusCode: 502, statusMessage: `Failed to fetch source: ${err.message}` })
  }
})
