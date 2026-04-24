import { prisma } from '../../utils/prisma'
import { getQuery, sendRedirect } from 'h3'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const token = query.token

    if (!token || typeof token !== 'string') {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing token',
        })
    }

    const pending = await prisma.pendingEmailChange.findUnique({
        where: { token },
    })

    if (!pending) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Invalid email change link',
        })
    }

    if (pending.expiresAt.getTime() < Date.now()) {
        await prisma.pendingEmailChange.delete({
            where: { token },
        })

        throw createError({
            statusCode: 400,
            statusMessage: 'Email change link has expired',
        })
    }

    const existingUser = await prisma.user.findUnique({
        where: { email: pending.newEmail },
        select: { id: true },
    })

    if (existingUser && existingUser.id !== pending.userId) {
        await prisma.pendingEmailChange.delete({
            where: { token },
        })

        throw createError({
            statusCode: 409,
            statusMessage: 'Email already in use',
        })
    }

    await prisma.$transaction([
        prisma.user.update({
            where: { id: pending.userId },
            data: {
                email: pending.newEmail,
                emailVerified: true,
            },
        }),
        prisma.session.deleteMany({
            where: {
                userId: pending.userId,
            },
        }),
        prisma.pendingEmailChange.delete({
            where: { userId: pending.userId },
        }),
    ])

    return sendRedirect(event, '/auth?emailChanged=true')
})