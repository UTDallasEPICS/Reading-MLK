import { prisma } from '../../utils/prisma' 
import { Prisma } from '~~/prisma/generated/client'
import { getQuery, createError } from 'h3'
import { requireAdmin, requireSession } from '../../utils/require-session'  
import z from 'zod'

//delete handler once done with api handler output testing

export default eventHandler(async (event) => {
  
  const formInclude = {
    Components: {
      orderBy: [{ order: 'asc' as const }, { id: 'asc' as const }],
    },
    FormGroup: true,
  }

  return prisma.form.findMany({
    orderBy: [{ formGroup: 'asc' }, { order: 'asc' }, { id: 'asc' }],
    include: formInclude,
  })
})