import { prisma } from '../../utils/prisma'
import { getQuery, sendRedirect } from 'h3'
import crypto from 'node:crypto'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const token = query.token

    if (!token || typeof token !== 'string') {
        return sendRedirect(event, '/auth?emailChangeError=invalid')
    }

    const incomingHash = crypto.createHash('sha256').update(token).digest('hex')
    const pending = await prisma.pendingEmailChange.findFirst({
        where: { token: incomingHash },
    })

    if (!pending) {
        return sendRedirect(event, '/auth?emailChangeError=invalid')
    }

    if (pending.expiresAt.getTime() < Date.now()) {
        await prisma.pendingEmailChange.delete({
            where: { token: incomingHash },
        })
        return sendRedirect(event, '/auth?emailChangeError=expired')
    }

    const existingUser = await prisma.user.findUnique({
        where: { email: pending.newEmail },
        select: { id: true },
    })

    if (existingUser && existingUser.id !== pending.userId) {
        await prisma.pendingEmailChange.delete({
            where: { token: incomingHash },
        })
        return sendRedirect(event, '/auth?emailChangeError=conflict')
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