import { Param } from '@prisma/client/runtime/client'
import { prisma } from '../server/utils/prisma'
import { faker } from '@faker-js/faker'

async function main() {
  console.log('Start seeding...')

  // 1. Create a Parent with a Password (Local Auth) and one child
  const user1 = await prisma.user.create({
    data: {
      name: 'Oryx',
      email: 'parent1@example.com',
      emailVerified: true,
      accounts: {
        create: {
          accountId: 'oryx_local_id',
          providerId: 'credential', // Common for email/password
          password: 'hashed_password_here', // In a real app, hash this!
          students: {
            create: { name: 'Crota', exp: 5000, settings: { dyslexiaFont: true, fontSize: 1, language: 'en'}} },
          },
        },
      },
    })

  // 2. Create a Parent with an OAuth Account (e.g., Google) and multiple children
  const user2 = await prisma.user.create({
    data: {
      name: 'Richard Watterson',
      email: 'parent2@gmail.com',
      emailVerified: true,
      accounts: {
        create: {
          accountId: 'rich_google_id',
          providerId: 'google',
          accessToken: 'mock_access_token',
          students: {
            create: [
              { name: 'Gumball' },
              { name: 'Darwin' },
              { name: 'Anais' },
            ],
          },
        },
      },
    },
  })

  //create a test admin user
  const admin1 = await prisma.user.create({
    data: {
      name: 'Gary Admin',
      email: 'admin1@example.com',
      emailVerified: true,
      accounts: {
        create: {
          accountId: 'gary_admin_id',
          providerId: 'credential',
          password: 'hashed_password_here',
          admin: { create: {} },
        },
      },
    },
  })

  //create a second test admin user
  const admin2 = await prisma.user.create({
    data: {
      name: 'Admin Two',
      email: 'admin2@example.com',
      emailVerified: true,
      accounts: {
        create: {
          accountId: 'admin2_local_id',
          providerId: 'credential',
          password: 'hashed_password_here',
          admin: { create: { settings: { dyslexiaFont: true, fontSize: 1, language: 'en' } } } },
        },
      },
    })

  console.log({ user1, user2, admin1, admin2 })
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