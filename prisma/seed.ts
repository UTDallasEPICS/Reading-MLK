import { Param } from '@prisma/client/runtime/client'
import { prisma } from '../server/utils/prisma'

async function main() {
  console.log('Start seeding...')

  // 1. Create a User with a Password (Local Auth)
  const user1 = await prisma.user.create({
    data: {
      name: 'Alice Developer',
      email: 'alice@a.com',
      emailVerified: true,
      accounts: {
        create: {
          accountId: 'alice_local_id',
          providerId: 'credential', // Common for email/password
          password: 'hashed_password_here', // In a real app, hash this!
        },
      },
    },
  })

  // 2. Create a User with an OAuth Account (e.g., Google)
  const user2 = await prisma.user.create({
    data: {
      name: 'Bob Tester',
      email: 'bob@b.com',
      emailVerified: true,
      accounts: {
        create: {
          accountId: 'bob_google_id',
          providerId: 'google',
          accessToken: 'mock_access_token',
        },
      },
    },
  })

  console.log({ user1, user2 })
  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
