import { prisma } from '../server/utils/prisma'

function makeLocalDate(dateString: string) {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day)
}




  const shopThemes = [
  { id: 1,  name: 'Light Bloom',   cost: 0,   class: 'default',  color: '#f5ede3', grad: 'radial-gradient(at 0% 0%, hsla(25,95%,75%,0.3) 0px, transparent 50%)' },
  { id: 2,  name: 'Galaxy Night',  cost: 500, class: 'dark',   color: '#1f3b7c', grad: 'radial-gradient(at 0% 0%, hsla(250,20%,20%,0.5) 0px, transparent 50%)' },
  { id: 3,  name: 'Old Parchment', cost: 300, class: 'sepia',  color: '#f4ecd8', grad: 'none' },
  { id: 4, name: 'Sunset',        cost: 100, class: 'sunset', color: '#fff5f5', grad: 'radial-gradient(at 0% 0%, hsla(10,90%,75%,0.25) 0px, transparent 50%)' },
  { id: 5, name: 'Ocean',         cost: 100, class: 'ocean',  color: '#f0f9ff', grad: 'radial-gradient(at 0% 0%, hsla(200,90%,75%,0.25) 0px, transparent 50%)' },
  { id: 6, name: 'Forest',        cost: 150, class: 'forest', color: '#f0fdf4', grad: 'radial-gradient(at 0% 0%, hsla(140,80%,70%,0.25) 0px, transparent 50%)' },
  { id: 7, name: 'Candy',         cost: 150, class: 'candy',  color: '#fdf2f8', grad: 'radial-gradient(at 0% 0%, hsla(330,90%,85%,0.35) 0px, transparent 50%)' },
  { id: 8, name: 'Fire',          cost: 150, class: 'fire',   color: '#fff7ed', grad: 'radial-gradient(at 30% 40%, hsla(20,95%,65%,0.3) 0px, transparent 50%)' },
  { id: 9, name: 'Ice',           cost: 150, class: 'ice',    color: '#f0f9ff', grad: 'radial-gradient(at 0% 0%, hsla(200,100%,95%,0.4) 0px, transparent 50%)' },
]

const shopAnimations = [
  { id: 20, name: 'Twinkling Stars',        cost: 200 },
  { id: 21, name: 'Confetti Rain',          cost: 1000 },
  { id: 22, name: 'Magic Sparkles',         cost: 400 },
  { id: 23, name: 'Fireflies',              cost: 400 },
  { id: 24, name: 'Fluttering Butterflies', cost: 500 },
  { id: 25, name: 'Falling Leaves',         cost: 800 },
]

async function seedShopItems() {
  for (const t of shopThemes) {
    await prisma.shopItem.upsert({
      where: { id: t.id },
      update: {
        type: 'theme',
        name: t.name,
        cost: t.cost,
        Theme: {
          upsert: {
            update: { themeColor: t.color, themeEffect: { class: t.class, previewGrad: t.grad } },
            create: { themeColor: t.color, themeEffect: { class: t.class, previewGrad: t.grad } },
          },
        },
      },
      create: {
        id: t.id,
        type: 'theme',
        name: t.name,
        cost: t.cost,
        dateAvailable: new Date(),
        Theme: {
          create: { themeColor: t.color, themeEffect: { class: t.class, previewGrad: t.grad } },
        },
      },
    })
  }

  for (const a of shopAnimations) {
    await prisma.shopItem.upsert({
      where: { id: a.id },
      update: {
        type: 'animation',
        name: a.name,
        cost: a.cost,
        Animation: {
          upsert: {
            update: { animationType: a.name },
            create: { animationType: a.name },
          },
        },
      },
      create: {
        id: a.id,
        type: 'animation',
        name: a.name,
        cost: a.cost,
        dateAvailable: new Date(),
        Animation: {
          create: { animationType: a.name },
        },
      },
    })
  }
}

async function main() {
  const seededEmails = [
    'parent1@example.com',
    'parent2@gmail.com',
    'rae@readinghuddle.com',
    'asloran23@gmail.com',
    'nevins321@gmail.com',
    'sxg230203@utdallas.edu'
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
      id: 'seed_user_6',
      name: 'Aidan',
      email: 'asloran23@gmail.com',
      emailVerified: true,
      role: 'admin',
      accounts: {
        create: {
          id: 'seed_account_6',
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

  await seedShopItems()
  // Clean old progress-testing data
  await prisma.submissionResponse.deleteMany()
  await prisma.formSubmission.deleteMany()
  await prisma.formComponent.deleteMany()
  await prisma.form.deleteMany()
  await prisma.formGroup.deleteMany()

  // Pull seeded students
  const crota = await prisma.student.findFirst({ where: { name: 'Crota' } })
  const gumball = await prisma.student.findFirst({ where: { name: 'Gumball' } })
  const darwin = await prisma.student.findFirst({ where: { name: 'Darwin' } })
  const anais = await prisma.student.findFirst({ where: { name: 'Anais' } })

  if (!crota || !gumball || !darwin || !anais) {
    throw new Error('Seed students not found')
  }

  // Get one admin to author forms
  const nevinAdmin = await prisma.admin.findFirst({
    where: { userId: 'seed_user_4' },
  })

  if (!nevinAdmin) {
    throw new Error('Admin seed record for Nevin not found')
  }

  // Form Groups (weeks)
  const week1 = await prisma.formGroup.create({
    data: {
      startDate: makeLocalDate('2026-04-20'),
      endDate: makeLocalDate('2026-04-26'),
    },
  })

  const week2 = await prisma.formGroup.create({
    data: {
      startDate: makeLocalDate('2026-04-27'),
      endDate: makeLocalDate('2026-05-03'),
    },
  })

  const week3 = await prisma.formGroup.create({
    data: {
      startDate: makeLocalDate('2026-05-04'),
      endDate: makeLocalDate('2026-05-10'),
    },
  })

  // Week 1 Forms
  const week1Form1 = await prisma.form.create({
    data: {
      order: 0,
      startDate: makeLocalDate('2026-04-20'),
      published: true,
      author: nevinAdmin.id,
      formGroup: week1.id,
      title: 'Monday Story Reflection',
    },
  })

  const week1Form2 = await prisma.form.create({
    data: {
      order: 1,
      startDate: makeLocalDate('2026-04-21'),
      published: true,
      author: nevinAdmin.id,
      formGroup: week1.id,
      title: 'Tuesday Reading Check',
    },
  })

  const week1Form3 = await prisma.form.create({
    data: {
      order: 2,
      startDate: makeLocalDate('2026-04-23'),
      published: true,
      author: nevinAdmin.id,
      formGroup: week1.id,
      title: 'Thursday Comprehension',
    },
  })

  const week1Form4 = await prisma.form.create({
    data: {
      order: 3,
      startDate: makeLocalDate('2026-04-25'),
      published: true,
      author: nevinAdmin.id,
      formGroup: week1.id,
      title: 'Saturday Family Reading',
    },
  })

  // Week 2 Forms
  const week2Form1 = await prisma.form.create({
    data: {
      order: 0,
      startDate: makeLocalDate('2026-04-27'),
      published: true,
      author: nevinAdmin.id,
      formGroup: week2.id,
      title: 'Monday Vocabulary Builder',
    },
  })

  const week2Form2 = await prisma.form.create({
    data: {
      order: 1,
      startDate: makeLocalDate('2026-04-29'),
      published: true,
      author: nevinAdmin.id,
      formGroup: week2.id,
      title: 'Wednesday Book Talk',
    },
  })

  const week2Form3 = await prisma.form.create({
    data: {
      order: 2,
      startDate: makeLocalDate('2026-05-01'),
      published: true,
      author: nevinAdmin.id,
      formGroup: week2.id,
      title: 'Friday Quiz Time',
    },
  })

  const week2Form4 = await prisma.form.create({
    data: {
      order: 3,
      startDate: makeLocalDate('2026-05-03'),
      published: true,
      author: nevinAdmin.id,
      formGroup: week2.id,
      title: 'Sunday Reading Wrap-Up',
    },
  })

  // Week 3 Forms
  const week3Form1 = await prisma.form.create({
    data: {
      order: 0,
      startDate: makeLocalDate('2026-05-04'),
      published: true,
      author: nevinAdmin.id,
      formGroup: week3.id,
      title: 'Monday Reading Log',
    },
  })

  const week3Form2 = await prisma.form.create({
    data: {
      order: 1,
      startDate: makeLocalDate('2026-05-06'),
      published: true,
      author: nevinAdmin.id,
      formGroup: week3.id,
      title: 'Wednesday Critical Thinking',
    },
  })

  const week3Form3 = await prisma.form.create({
    data: {
      order: 2,
      startDate: makeLocalDate('2026-05-08'),
      published: true,
      author: nevinAdmin.id,
      formGroup: week3.id,
      title: 'Friday Reading Reflection',
    },
  })

  const week3Form4 = await prisma.form.create({
    data: {
      order: 3,
      startDate: makeLocalDate('2026-05-10'),
      published: true,
      author: nevinAdmin.id,
      formGroup: week3.id,
      title: 'Sunday Story Summary',
    },
  })

  // Add simple components so forms look real
  const allForms = [
    week1Form1, week1Form2, week1Form3, week1Form4,
    week2Form1, week2Form2, week2Form3, week2Form4,
    week3Form1, week3Form2, week3Form3, week3Form4,
  ]

  for (const form of allForms) {
    await prisma.formComponent.createMany({
      data: [
        {
          form: form.id,
          order: 0,
          questionType: 'context',
          questionText: `Context for ${form.title}`,
        },
        {
          form: form.id,
          order: 1,
          questionType: 'text',
          questionText: `What did you learn from ${form.title}?`,
        },
        {
          form: form.id,
          order: 2,
          questionType: 'mcq',
          questionText: `Quick check for ${form.title}`,
          questionOptions: {
            choices: [
              { text: 'A', correct: true },
              { text: 'B', correct: false },
              { text: 'C', correct: false },
              { text: 'D', correct: false },
            ],
          },
        },
      ],
    })
  }

  // Lots of submissions for testing filters, grouped view, pagination, export
  const submissions = [
    // Week 1
    { student: crota.id, form: week1Form1.id, date: '2026-04-20' },
    { student: crota.id, form: week1Form2.id, date: '2026-04-21' },
    { student: crota.id, form: week1Form3.id, date: '2026-04-23' },
    { student: crota.id, form: week1Form4.id, date: '2026-04-25' },

    { student: gumball.id, form: week1Form1.id, date: '2026-04-20' },
    { student: gumball.id, form: week1Form2.id, date: '2026-04-21' },
    { student: gumball.id, form: week1Form3.id, date: '2026-04-23' },

    { student: darwin.id, form: week1Form2.id, date: '2026-04-21' },
    { student: darwin.id, form: week1Form4.id, date: '2026-04-25' },

    { student: anais.id, form: week1Form1.id, date: '2026-04-20' },
    { student: anais.id, form: week1Form3.id, date: '2026-04-23' },
    { student: anais.id, form: week1Form4.id, date: '2026-04-25' },

    // Week 2
    { student: crota.id, form: week2Form1.id, date: '2026-04-27' },
    { student: crota.id, form: week2Form2.id, date: '2026-04-29' },
    { student: crota.id, form: week2Form3.id, date: '2026-05-01' },

    { student: gumball.id, form: week2Form1.id, date: '2026-04-27' },
    { student: gumball.id, form: week2Form2.id, date: '2026-04-29' },
    { student: gumball.id, form: week2Form3.id, date: '2026-05-01' },
    { student: gumball.id, form: week2Form4.id, date: '2026-05-03' },

    { student: darwin.id, form: week2Form1.id, date: '2026-04-27' },
    { student: darwin.id, form: week2Form3.id, date: '2026-05-01' },

    { student: anais.id, form: week2Form2.id, date: '2026-04-29' },
    { student: anais.id, form: week2Form4.id, date: '2026-05-03' },

    // Week 3
    { student: crota.id, form: week3Form1.id, date: '2026-05-04' },
    { student: crota.id, form: week3Form2.id, date: '2026-05-06' },
    { student: crota.id, form: week3Form3.id, date: '2026-05-08' },
    { student: crota.id, form: week3Form4.id, date: '2026-05-10' },

    { student: gumball.id, form: week3Form1.id, date: '2026-05-04' },
    { student: gumball.id, form: week3Form3.id, date: '2026-05-08' },

    { student: darwin.id, form: week3Form2.id, date: '2026-05-06' },
    { student: darwin.id, form: week3Form3.id, date: '2026-05-08' },
    { student: darwin.id, form: week3Form4.id, date: '2026-05-10' },

    { student: anais.id, form: week3Form1.id, date: '2026-05-04' },
    { student: anais.id, form: week3Form2.id, date: '2026-05-06' },
  ]

  for (const entry of submissions) {
    await prisma.formSubmission.create({
      data: {
        student: entry.student,
        form: entry.form,
        submissionDate: makeLocalDate(entry.date),
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