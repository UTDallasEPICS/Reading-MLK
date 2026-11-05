import { prisma } from '../../utils/prisma'
import { getQuery } from 'h3'
import { requireClassAccess } from '../../utils/require-session'

export default defineEventHandler(async (event) => {
    const method = event.node.req.method
    const query = getQuery(event)

    // GET /api/formComponent?form=1 to get components for a specific form
    if (method === 'GET') {
        const classToken = typeof query.classId === 'string' ? query.classId : ''
        const formId = Number(query.form)

        if (!classToken) {
            throw createError({ statusCode: 403, statusMessage: 'Class access is required' })
        }

        const { classId } = await requireClassAccess(event, classToken)
        const form = await prisma.form.findFirst({
            where: { id: formId, FormGroup: { class: classId } },
            select: { id: true },
        })

        if (!form) {
            throw createError({ statusCode: 404, statusMessage: 'Form not found' })
        }

        return await prisma.formComponent.findMany({
            where: { form: form.id },
            orderBy: { order: 'asc' }
        })
    }

})
