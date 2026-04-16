import { prisma } from '../server/utils/prisma'

async function main() {
  const seededEmails = [
    'parent1@example.com',
    'parent2@gmail.com',
    'rae@readinghuddle.com',
    'asloran23@gmail.com',
    'nevins321@gmail.com',
  ]

  await prisma.user.deleteMany({
    where: {
      email: {
        in: seededEmails,
      },
    },
  })

  await prisma.user.create({
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
        },
      },
    },
  })

  await prisma.user.create({
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

  await prisma.user.create({
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

    await prisma.user.create({
      data: {
        id: 'seed_user_4',
        name: 'Nevin',
        email: 'nevins321@gmail.com',
        emailVerified: true,
        role: 'admin',
        accounts: {
          create: {
            id: 'seed_account_4',
            accountId: 'nevins321@gmail.com',
            providerId: 'magic-link',
          },
        },
        admin: {
          create: {},
        },
      },
    })

  await prisma.user.create({
    data: {
      id: 'seed_user_5',
      name: 'Aidan',
      email: 'asloran23@gmail.com',
      emailVerified: true,
      role: 'admin',
      accounts: {
        create: {
          id: 'seed_account_5',
          accountId: 'asloran23@gmail.com',
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
        },
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