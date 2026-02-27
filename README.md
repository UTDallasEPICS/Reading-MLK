# 📚 **FoMLK: Reading Huddle App** *(Rae Phillips)*

## 📖 **Table of Contents**
1. [Partner Description](#🏢-partner-description)
2. [Project Conceptual Overview](#🌟-project-conceptual-overview)
3. [Home Page](#🏠-home-page)
4. [About Us Page](#👩‍💼-about-us-page)
5. [Faculty Form Page](#📝-faculty-form-page)
6. [New User Invite Page](#✉️-new-user-invite-page)
7. [Parent Form Page](#🧾-parent-form-page)
8. [Student Form Page](#👨‍🎓-student-form-page)
9. [Faculty View Page](#📋-faculty-view-page)
10. [Parents View Page](#👪-parents-view-page)
11. [Course Homepage](#🧒-course-home-page)
12. [Third-Party Integrations](#🔌-third-party-integrations)
13. [Tech Stack](#🛠️-tech-stack)
14. [Setting Up the Development Environment](#⚙️-setting-up-the-development-environment)
15. [UI Mockups](#Figma)
16. [Migration Scripts](#Migration-Scripts)
17. [Deployment](#Deployment)

## 🏢 **Partner Description**

Friends of MLK is a non-profit organization dedicated to enhancing opportunities for historically underserved communities through educational and community development services.

The **Reading Huddle** program helps families improve their children’s literacy both at home and in the classroom. It encourages daily reading routines and provides resources for parents to enhance the home literacy environment.

**Director**: Rae Phillips

## 🌟 **Project Conceptual Overview**

The project’s goal is to create a web application that delivers:

- Easy-to-access educational resources.
- Structured courses for parents to aid their children's learning.

## ⚙️ **Setting Up the Development Environment**

### Prerequisites

- **IDE (VS Code for EPICS)**, **Node.js**, **Git**, and **Postman** (optional).
- **pnpm**: https://pnpm.io/installation

### Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/UTDallasEPICS/Reading-MLK.git
cd Reading-MLK
```

### 2. Install dependencies

This project uses `pnpm`, but you can use `npm` as well.

```bash
pnpm install
```

### 3. Setup Environment Variables

Copy the example environment file and fill in your details.

```bash
cp .env.example .env
```

Open `.env` and configure the following:

- `DATABASE_URL`: The SQLite connection string (default: `file:./dev.db`).
- `BETTER_AUTH_SECRET`: A secure random string for encryption. You can generate one using `openssl rand -hex 32`.
- `BETTER_AUTH_URL`: The base URL of your application (default: `http://localhost:3000`).
- `EMAIL_USER`: Your Gmail address (for OTP delivery).
- `EMAIL_PASS`: Your Gmail App Password. [How to generate an App Password](https://support.google.com/accounts/answer/185833).

### 4. Database Setup

Initialize your SQLite database and run migrations.

```bash
pnpm dlx prisma migrate dev --name init
```

Generate the Prisma client

```bash
pnpm dlx prisma generate
```

To reset the database and run the seed script:

```bash
pnpm prisma:reset
```

### 5. Start the development server

```bash
pnpm dev
```

Your application will be available at `http://localhost:3000`. This command also starts **Prisma Studio** automatically.

### 6. How to Login

Login requires an email address that already exists in the database.

- **Option A: Use the seeded user**
  Go to `/auth` and log in with `alice@a.com`.
- **Option B: Use your own email**
  Update `prisma/seed.ts` with your email, then run `pnpm prisma:reset` to re-seed.

**To get your OTP:**

- Check your configured email inbox.
- **Or**, check the **Prisma Studio** tab in your browser and look in the `Verification` table.

## Project Structure

- `app/`: Frontend code (pages, components, assets, composables).
- `server/`: Backend code (API routes, authentication logic, database utilities).
- `prisma/`: Database schema, migrations, and seed scripts.
- `public/`: Static assets.

## License

MIT

