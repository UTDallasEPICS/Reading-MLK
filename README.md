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
11. [Third-Party Integrations](#🔌-third-party-integrations)
12. [Tech Stack](#🛠️-tech-stack)
13. [Setting Up the Development Environment](#⚙️-setting-up-the-development-environment)

## 🏢 **Partner Description**

Friends of MLK is a non-profit organization dedicated to enhancing opportunities for historically underserved communities through educational and community development services.

The **Reading Huddle** program helps families improve their children’s literacy both at home and in the classroom. It encourages daily reading routines and provides resources for parents to enhance the home literacy environment.

**Director**: Rae Phillips

## 🌟 **Project Conceptual Overview**

The project’s goal is to create a web application that delivers:

- Easy-to-access educational resources.
- Structured courses for parents to aid their children's learning.

### Features Requested by the Partner (to be completed by future semesters):
1. **Question of the Day** videos.
2. **Daily Reminders** to users.
3. **Progress Tracking**.
4. **Daily Challenges**.
5. **Periodic Quizzes**.

## 🏠 **Home Page**

### 📝 **Overview Home Page**

The **Home Page** serves as the application’s entry point, featuring:

- The mission statement.
- Registration prompts.
- Interactions with modules and resources.

**Technologies Used**: Vue.js, Tailwind CSS

### ⚙️ **Functional Requirements Home Page**

1. **Display Informative Sections**
   - Clear sections about the mission, registration, and available modules.

2. **Interactive Registration**
   - Opens a modal for account selection.

3. **Responsive Layout**
   - Adaptable to various screen sizes.

4. **Animations**
   - Smooth transitions for an enhanced user experience.

5. **Module Interaction**
   - Clickable modules directing users to additional reading resources.



### ✅ **Progress So Far Home Page**

- **Hero Section**: Completed with animations.
- **Account Selection Modal**: Functional.
- **Mission Section**: Implemented with text, images, and animations.
- **Modules Section**: Interactive with hover effects.
- **Scroll Indicator**: Bounce animation pointer added.



### 🚀 **Future Enhancements**

- Enhanced **Account Selection Modal** with detailed forms.
- **Navigation Bar** for improved usability.
- **Accessibility Features** like ARIA labels.
- Optimized performance for animations and image loading.

## 👩‍💼 **About Us Page**

### 📝 **Overview About Us**

The **About Us Page** introduces visitors to the organization’s:

- Mission and Vision
- Core Values
- Team Members
- Contact Information


### ⚙️ **Functional Requirements About Us**

1. **Page Header**
   - Full-width background image with title overlay.

2. **Vision Section**
   - Descriptive text in a card-style container.

3. **Core Values Section**
   - Grid layout for values with icons and hover effects.

4. **Team Section**
   - Profile images, names, and short bios.

5. **Feedback Section**
   - Form for users to submit feedback.

6. **Location Section**
   - Address and embedded Google Map.

7. **Contact Us Section**
   - Contact form with validation.



### 🔧 **Technologies Used**

- Framework: Vue.js
- Styling: Tailwind CSS
- Icons: Font Awesome
- Maps: Google Maps Embed API

## 📝 **Faculty Form Page**

Designed to collect and securely submit faculty member details.

### Features:

- Fields: Email, Phone, School Name, Department, Grade, and Dual Language support checkbox.
- Form validation to ensure required fields are filled.
- Responsive design with real-time feedback.
- Submit button to post data securely to the backend.



## ✉️ **New User Invite Page**

**Admin-exclusive** interface for inviting new users.

### Features:

- Fields for personal and demographic data.
- Dynamic form for adding multiple students.
- Role-based access for secure admin actions.
- Submit button with confirmation prompts.



## 🧾 **Parent Form Page**

Form for administrators to input parent and student details.

### Highlights:

- Fields for personal, demographic, and contact information.
- Dynamic student form allowing multiple entries.
- Validation and error handling for form submission.
- Integration with backend API for data processing.



## 👨‍🎓 **Student Form Page**

Reusable form for inputting multiple students’ details:

- Fields include: Name, Gender, Birth Date, Grade, Reading Level, and Zipcode.
- Add/Remove dynamic student forms.
- Fully responsive design with error handling.



## 📋 **Faculty View Page**

Page for viewing and managing faculty records.

### Key Features:

- Search and filter functionality.
- Editable table with sort and hover effects.
- Role-based access control.
- Responsive and real-time data updates.



## 👪 **Parents View Page**

Interface for managing parent records.

### Features:

- Searchable, sortable table.
- Edit and Remove actions for each parent.
- Responsive layout with error handling.
- Pagination for large datasets.



## 🔌 **Third-Party Integrations**

| Integration | Purpose                   | Role in Project                          |
|-------------|---------------------------|------------------------------------------|
| **Auth0**   | Authentication           | Secure user login and role management.   |
| **HubSpot** | CRM                      | Manages user interactions and campaigns. |
| **Prisma**  | Database Management      | Simplifies schema and data queries.      |

## 🛠️ **Tech Stack**

| Category         | Technology            |
|------------------|-----------------------|
| **Frontend**     | Vue.js, Tailwind CSS  |
| **Backend**      | Express.js            |
| **Database**     | PostgreSQL, Prisma    |
| **State Mgmt**   | Vuex                  |
| **HTTP Requests**| Axios                 |
| **Auth**         | Auth0                 |

## ⚙️ **Setting Up the Development Environment**

### Prerequisites

- **Node.js**, **Docker**, **Git**, and **Postman** (optional).

### Steps

1. **Clone the Repository**
   ```bash
   git clone [repository_url]
   cd project_directory
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Build Docker Environment**
   ```bash
   docker-compose up --build
   ```

4. **Execute Prisma Migrations**
   ```bash
   npx prisma migrate dev
   ```

5. **Seed the Database**
   - Navigate to `./prisma/` directory and add starter credentials.
   - Run seed script:
     ```bash
     node ./generateSeed.js
     ```

6. **Start the Project**
   ```bash
   npm run dev
   ```

7. **Access the Application**
   - Open your browser at `http://localhost:3000`.



For further details, refer to the official [Nuxt 3 Documentation](https://nuxt.com/docs/getting-started/introduction).