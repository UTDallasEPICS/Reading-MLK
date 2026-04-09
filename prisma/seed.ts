import { prisma } from '../server/utils/prisma'

async function main() {

  const seededEmails = [
    'parent1@example.com',
    'parent2@gmail.com',
    'rae@readinghuddle.com',
    'admin2@example.com',
  ]

  // Make seed idempotent by removing existing users with seed emails first.
  // Related rows (accounts, students, admin) are cleaned up by cascade rules.
  await prisma.user.deleteMany({
    where: {
      email: {
        in: seededEmails,
      },
    },
  })

  // 1. Create a parent with one child
  const user1 = await prisma.user.create({
    data: {
      id: 'seed_user_1',
      name: 'Oryx',
      email: 'parent1@example.com',
      emailVerified: true,
      role: 'reader',
      accounts: {
        create: {
          id: 'seed_account_1',
          accountId: 'parent1@example.com',
          providerId: 'magic-link',
        },
      },
      students: {
        create: {
          name: 'Crota',
          exp: 5000,
          settings: {
            dyslexiaFont: true,
            fontSize: 1,
            language: 'en',
          },
        }],
      },
    },
  })

  // 2. Create a parent with multiple children
  const user2 = await prisma.user.create({
    data: {
      id: 'seed_user_2',
      name: 'Richard Watterson',
      email: 'parent2@gmail.com',
      emailVerified: true,
      role: 'reader',
      accounts: {
        create: {
          id: 'seed_account_2',
          accountId: 'parent2@gmail.com',
          providerId: 'magic-link',
        },
      },
      students: {
        create: [
          { name: 'Gumball' },
          { name: 'Darwin' },
          { name: 'Anais' },
        ],
      },
    },
  })

  // 3. Create a test admin user
  const admin1 = await prisma.user.create({
    data: {
      id: 'seed_user_3',
      name: 'Rae',
      email: 'rae@readinghuddle.com',
      emailVerified: true,
      role: 'admin',
      accounts: {
        create: {
          id: 'seed_account_3',
          accountId: 'rae@readinghuddle.com',
          providerId: 'magic-link',
        },
      },
      admin: {
        create: {},
      },
    },
  })

  // 4. Create a second test admin user
  const admin2 = await prisma.user.create({
    data: {
      id: 'seed_user_4',
      name: 'Admin Two',
      email: 'admin2@example.com',
      emailVerified: true,
      role: 'admin',
      accounts: {
        create: {
          id: 'seed_account_4',
          accountId: 'admin2@example.com',
          providerId: 'magic-link',
        },
      },
      admin: {
        create: {
          settings: {
            dyslexiaFont: true,
            fontSize: 1,
            language: 'en',
          },
        }],
      },
    },
  })
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
