-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_name" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "preferred_name" TEXT,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "parent_profile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "zipcode" TEXT NOT NULL,
    "yearly_income" TEXT,
    "birth_date" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "average_number_books" INTEGER NOT NULL,
    "phone_number" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "marital_stat" TEXT,
    "social_media" TEXT,
    "user_id" INTEGER NOT NULL,
    CONSTRAINT "parent_profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "faculty_profile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "district" TEXT NOT NULL,
    "dual_lang" BOOLEAN NOT NULL,
    "faculty_email" TEXT NOT NULL,
    "school_name" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    CONSTRAINT "faculty_profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "student_profile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "age" INTEGER NOT NULL,
    "grade" INTEGER NOT NULL,
    "reading_lvl" INTEGER NOT NULL,
    "birth_date" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "gender" TEXT NOT NULL,
    "school_name" TEXT NOT NULL,
    "school_dist" TEXT NOT NULL,
    "pref_lang" TEXT,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "admin_profile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "admin_id" INTEGER NOT NULL,
    CONSTRAINT "admin_profile_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "classes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "class_name" TEXT NOT NULL DEFAULT 'Untitled Class',
    "class_year" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "teacher_to_classes" (
    "class_id" INTEGER NOT NULL,
    "teacher_id" INTEGER NOT NULL,

    PRIMARY KEY ("class_id", "teacher_id"),
    CONSTRAINT "teacher_to_classes_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "teacher_to_classes_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "faculty_profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "student_to_classes" (
    "class_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,

    PRIMARY KEY ("class_id", "student_id"),
    CONSTRAINT "student_to_classes_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "student_to_classes_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student_profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "parent_to_kids" (
    "parent_id" INTEGER NOT NULL,
    "child_id" INTEGER NOT NULL,

    PRIMARY KEY ("parent_id", "child_id"),
    CONSTRAINT "parent_to_kids_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "parent_profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "parent_to_kids_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "student_profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "assignment_to_classes" (
    "assignment_id" INTEGER NOT NULL,
    "class_id" INTEGER NOT NULL,

    PRIMARY KEY ("assignment_id", "class_id"),
    CONSTRAINT "assignment_to_classes_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "quizzes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "assignment_to_classes_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "assignment_to_students" (
    "assignment_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,

    PRIMARY KEY ("assignment_id", "student_id"),
    CONSTRAINT "assignment_to_students_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "quizzes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "assignment_to_students_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student_profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "books" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "book_title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "isbn" TEXT NOT NULL,
    "page_count" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "video_form" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "vid_length" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "book_id" INTEGER NOT NULL,
    CONSTRAINT "video_form_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "books" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "quizzes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL DEFAULT 'Untitled Quiz',
    "submitted" BOOLEAN NOT NULL DEFAULT false,
    "grade" INTEGER NOT NULL DEFAULT 100
);

-- CreateTable
CREATE TABLE "questions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "quiz_id" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "feedback" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    CONSTRAINT "questions_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quizzes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "multiple_choice_question" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "question_id" INTEGER NOT NULL,
    CONSTRAINT "multiple_choice_question_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "multiple_choice_options" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "questionId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    CONSTRAINT "multiple_choice_options_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "multiple_choice_question" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "free_response_question" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "question_id" INTEGER NOT NULL,
    CONSTRAINT "free_response_question_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "quiz_responses" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "studentProfileId" INTEGER NOT NULL,
    "quizId" INTEGER NOT NULL,
    CONSTRAINT "quiz_responses_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "student_profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "quiz_responses_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "quizzes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "multiple_choice_answers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "quizResponseId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "selectedOption" TEXT NOT NULL,
    CONSTRAINT "multiple_choice_answers_quizResponseId_fkey" FOREIGN KEY ("quizResponseId") REFERENCES "quiz_responses" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "multiple_choice_answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "free_response_answers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "quizResponseId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "responseText" TEXT NOT NULL,
    CONSTRAINT "free_response_answers_quizResponseId_fkey" FOREIGN KEY ("quizResponseId") REFERENCES "quiz_responses" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "free_response_answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "otp_codes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_user_name_key" ON "users"("user_name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "parent_profile_phone_number_key" ON "parent_profile"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "parent_profile_social_media_key" ON "parent_profile"("social_media");

-- CreateIndex
CREATE UNIQUE INDEX "parent_profile_user_id_key" ON "parent_profile"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "faculty_profile_faculty_email_key" ON "faculty_profile"("faculty_email");

-- CreateIndex
CREATE UNIQUE INDEX "faculty_profile_user_id_key" ON "faculty_profile"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "admin_profile_admin_id_key" ON "admin_profile"("admin_id");

-- CreateIndex
CREATE UNIQUE INDEX "books_isbn_key" ON "books"("isbn");

-- CreateIndex
CREATE UNIQUE INDEX "multiple_choice_question_question_id_key" ON "multiple_choice_question"("question_id");

-- CreateIndex
CREATE UNIQUE INDEX "free_response_question_question_id_key" ON "free_response_question"("question_id");

-- CreateIndex
CREATE UNIQUE INDEX "otp_codes_email_key" ON "otp_codes"("email");
