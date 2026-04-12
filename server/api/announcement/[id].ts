import { prisma } from '../../utils/prisma'

// DELETE /api/announcement/:id
// ----------------------------
// This file acts as the dynamic route handler for any request to
// /api/announcement/<some-id>. Nuxt automatically populates
// `event.context.params.id` with the path segment that replaces [id],
// which is the announcement's database UUID/primary key.
//
// Only the DELETE method is handled here. Other methods (GET, POST) are
// handled by the sibling index.ts file at /api/announcement.
export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'DELETE') {
    // Read the dynamic `:id` segment from the URL path.
    // e.g. DELETE /api/announcement/abc-123 → params.id = "abc-123"
    const id = event.context.params?.id

    // Guard: if no id was found in the URL (which should not happen in
    // practice given the route definition, but is a safe defensive check),
    // return a 400 Bad Request with a descriptive error body.
    if (!id) {
      setResponseStatus(event, 400)
      return { error: 'Missing announcement ID' }
    }

    // Parse the URL segment from a string to an integer because the
    // Announcement.id column is defined as `Int @id` in the Prisma schema.
    // URL path segments are always strings, so without this conversion Prisma
    // would reject the query with a type mismatch error at runtime.
    const numericId = parseInt(id, 10)

    // Guard: if the parsed value is not a valid integer (e.g. the URL was
    // /api/announcement/not-a-number), surface a 400 immediately.
    if (isNaN(numericId)) {
      setResponseStatus(event, 400)
      return { error: 'Invalid announcement ID — must be a whole number' }
    }

    try {
      // Delete the record whose integer primary key matches numericId.
      await prisma.announcement.delete({ where: { id: numericId } })

      // Return a simple success payload so the client can confirm the
      // delete completed without needing to inspect a status code.
      return { success: true }
    } catch (e: any) {
      // P2025 is Prisma's "record not found" error code.
      // Surface it as a 404 so the UI can differentiate between
      // "already deleted by another session" and a true server error.
      if (e?.code === 'P2025') {
        setResponseStatus(event, 404)
        return { error: 'Announcement not found' }
      }

      // For all other unexpected errors (DB connection issues, etc.),
      // return a generic 500 Internal Server Error.
      setResponseStatus(event, 500)
      return { error: 'Failed to delete announcement' }
    }
  }
})
