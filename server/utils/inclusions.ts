//Commonly Used Inclusions for prisma queries
export const formInclude = {
  Components: {
    orderBy: [{ order: 'asc' as const }, { id: 'asc' as const }],
  },
  FormGroup: true,
}

export const formGroupInclude = {
  RaffleWinner: true,
  Forms: {
    orderBy: [{ order: 'asc' as const }, { id: 'asc' as const }],
    include: {
      Components: {
        orderBy: [{ order: 'asc' as const }, { id: 'asc' as const }],
      },
    },
  },
}
