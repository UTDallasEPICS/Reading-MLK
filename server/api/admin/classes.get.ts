import { prisma } from '../../utils/prisma'
import { requireCoach } from '../../utils/require-session'
import { getMlkClass } from '../../utils/mlk-class'

export default defineEventHandler(async (event) => {
  const session = await requireCoach(event)
  const isAdmin = session.user.role === 'admin'

  // Fetch classes the user coaches (or all classes for admin)
  const coachedClasses = await prisma.class.findMany({
    where: {
      Coach: {
        some: {
          userId: session.user.id,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
    select: {
      joinToken: true,
      name: true,
    },
  })

  // Admins additionally always see the Friends of MLK class so they can
  // manage its form groups through the coach panel.
  if (isAdmin) {
    const mlkClass = await getMlkClass()

    const alreadyIncluded = coachedClasses.some((c) => c.joinToken === mlkClass.joinToken)

    if (!alreadyIncluded) {
      // Non-FoMLK classes alphabetically first, then FoMLK at the end
      return [
        ...coachedClasses.filter((c) => c.joinToken !== mlkClass.joinToken),
        { joinToken: mlkClass.joinToken, name: mlkClass.name },
      ]
    }
  }

  return coachedClasses
})

