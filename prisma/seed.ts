import { prisma } from '../server/utils/prisma'

async function main() {
  const seededEmails = [
    'parent1@example.com',
    'parent2@gmail.com',
    'rae@readinghuddle.com',
    'asloran23@gmail.com',
    'sxg230203@utdallas.edu'
  ]

  await prisma.studentShopItem.deleteMany({})
  await prisma.shopAnimation.deleteMany({})
  await prisma.shopTheme.deleteMany({})
  await prisma.shopItem.deleteMany({})

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
      id: 'seed_user_5',
      name: 'Swarna',
      email: 'sxg230203@utdallas.edu',
      emailVerified: true,
      role: 'admin',
      accounts: {
        create: {
          id: 'seed_account_5',
          accountId: 'sxg230203@utdallas.edu',
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

  await prisma.user.create({
    data: {
      id: 'seed_user_4',
      name: 'Aidan',
      email: 'asloran23@gmail.com',
      emailVerified: true,
      role: 'admin',
      accounts: {
        create: {
          id: 'seed_account_4',
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

  const shopThemes = [
    {
      id: 1,
      name: 'Light Bloom',
      cost: 0,
      dateAvailable: new Date('2026-01-01T00:00:00.000Z'),
      themeColor: '#f5ede3',
      themeEffect: {
        className: 'light',
        previewBg: '#f5ede3',
        previewGrad: 'radial-gradient(at 0% 0%, hsla(25,95%,75%,0.3) 0px, transparent 50%)',
      },
    },
    {
      id: 2,
      name: 'Galaxy Night',
      cost: 500,
      dateAvailable: new Date('2026-01-01T00:00:00.000Z'),
      themeColor: '#1f3b7c',
      themeEffect: {
        className: 'blue',
        previewBg: '#1f3b7c',
        previewGrad: 'radial-gradient(at 0% 0%, hsla(250,20%,20%,0.5) 0px, transparent 50%)',
        brandDark: '#f8fafc',
      },
    },
    {
      id: 3,
      name: 'Old Parchment',
      cost: 300,
      dateAvailable: new Date('2026-01-01T00:00:00.000Z'),
      themeColor: '#f4ecd8',
      themeEffect: {
        className: 'sepia',
        previewBg: '#f4ecd8',
        previewGrad: 'none',
        brandDark: '#433422',
      },
    },
    {
      id: 10,
      name: 'Sunset',
      cost: 100,
      dateAvailable: new Date('2026-01-01T00:00:00.000Z'),
      themeColor: '#fff5f5',
      themeEffect: {
        className: 'sunset',
        previewBg: '#fff5f5',
        previewGrad: 'radial-gradient(at 0% 0%, hsla(10,90%,75%,0.25) 0px, transparent 50%)',
      },
    },
    {
      id: 11,
      name: 'Ocean',
      cost: 100,
      dateAvailable: new Date('2026-01-01T00:00:00.000Z'),
      themeColor: '#f0f9ff',
      themeEffect: {
        className: 'ocean',
        previewBg: '#f0f9ff',
        previewGrad: 'radial-gradient(at 0% 0%, hsla(200,90%,75%,0.25) 0px, transparent 50%)',
      },
    },
    {
      id: 12,
      name: 'Forest',
      cost: 150,
      dateAvailable: new Date('2026-01-01T00:00:00.000Z'),
      themeColor: '#f0fdf4',
      themeEffect: {
        className: 'forest',
        previewBg: '#f0fdf4',
        previewGrad: 'radial-gradient(at 0% 0%, hsla(140,80%,70%,0.25) 0px, transparent 50%)',
      },
    },
    {
      id: 13,
      name: 'Candy',
      cost: 150,
      dateAvailable: new Date('2026-01-01T00:00:00.000Z'),
      themeColor: '#fdf2f8',
      themeEffect: {
        className: 'candy',
        previewBg: '#fdf2f8',
        previewGrad: 'radial-gradient(at 0% 0%, hsla(330,90%,85%,0.35) 0px, transparent 50%)',
      },
    },
    {
      id: 14,
      name: 'Fire',
      cost: 150,
      dateAvailable: new Date('2026-01-01T00:00:00.000Z'),
      themeColor: '#fff7ed',
      themeEffect: {
        className: 'fire',
        previewBg: '#fff7ed',
        previewGrad: 'radial-gradient(at 30% 40%, hsla(20,95%,65%,0.3) 0px, transparent 50%)',
      },
    },
    {
      id: 15,
      name: 'Ice',
      cost: 150,
      dateAvailable: new Date('2026-01-01T00:00:00.000Z'),
      themeColor: '#f0f9ff',
      themeEffect: {
        className: 'ice',
        previewBg: '#f0f9ff',
        previewGrad: 'radial-gradient(at 0% 0%, hsla(200,100%,95%,0.4) 0px, transparent 50%)',
      },
    },
  ]

  const shopAnimations = [
    {
      id: 4,
      name: 'Twinkling Stars',
      cost: 200,
      dateAvailable: new Date('2026-01-01T00:00:00.000Z'),
      animationType: 'background',
      animationEffect: {
        effectMode: 'background',
      },
    },
    {
      id: 5,
      name: 'Confetti Rain',
      cost: 1000,
      dateAvailable: new Date('2026-01-01T00:00:00.000Z'),
      animationType: 'background',
      animationEffect: {
        effectMode: 'background',
      },
    },
    {
      id: 6,
      name: 'Magic Sparkles',
      cost: 400,
      dateAvailable: new Date('2026-01-01T00:00:00.000Z'),
      animationType: 'cursor',
      animationEffect: {
        effectMode: 'cursor',
      },
    },
    {
      id: 7,
      name: 'Fireflies',
      cost: 400,
      dateAvailable: new Date('2026-01-01T00:00:00.000Z'),
      animationType: 'background',
      animationEffect: {
        effectMode: 'background',
      },
    },
    {
      id: 8,
      name: 'Fluttering Butterflies',
      cost: 500,
      dateAvailable: new Date('2026-01-01T00:00:00.000Z'),
      animationType: 'background',
      animationEffect: {
        effectMode: 'background',
      },
    },
    {
      id: 9,
      name: 'Falling Leaves',
      cost: 800,
      dateAvailable: new Date('2026-01-01T00:00:00.000Z'),
      animationType: 'background',
      animationEffect: {
        effectMode: 'background',
      },
    },
  ]

  for (const theme of shopThemes) {
    await prisma.shopItem.create({
      data: {
        id: theme.id,
        type: 'theme',
        name: theme.name,
        dateAvailable: theme.dateAvailable,
        cost: theme.cost,
        Theme: {
          create: {
            themeColor: theme.themeColor,
            themeEffect: theme.themeEffect,
          },
        },
      },
    })
  }

  for (const animation of shopAnimations) {
    await prisma.shopItem.create({
      data: {
        id: animation.id,
        type: 'animation',
        name: animation.name,
        dateAvailable: animation.dateAvailable,
        cost: animation.cost,
        Animation: {
          create: {
            animationType: animation.animationType,
            animationEffect: animation.animationEffect,
          },
        },
      },
    })
  }


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