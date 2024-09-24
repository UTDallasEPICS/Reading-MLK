-- CreateTable
CREATE TABLE "user" (
    "id" INTEGER NOT NULL,
    "user_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "client_cuid" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parent_profile" (
    "id" INTEGER NOT NULL,
    "zipcode" INTEGER NOT NULL,
    "yearly_income" INTEGER,
    "birth_date" TIMESTAMP(3),
    "average_number_books" INTEGER NOT NULL,
    "password" INTEGER NOT NULL,
    "phone_number" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "marital_stat" TEXT,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "social_media" TEXT,

    CONSTRAINT "parent_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faculty_profile" (
    "id" INTEGER NOT NULL,
    "district" TEXT NOT NULL,
    "dual_lang" BOOLEAN NOT NULL,
    "faculty_email" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "school_name" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "grade" TEXT NOT NULL,

    CONSTRAINT "faculty_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_profile" (
    "id" INTEGER NOT NULL,
    "age" INTEGER NOT NULL,
    "grade" INTEGER NOT NULL,
    "reading_lvl" INTEGER NOT NULL,
    "birth_date" TIMESTAMP(3),
    "gender" TEXT NOT NULL,
    "school_name" TEXT NOT NULL,
    "school_dist" TEXT NOT NULL,
    "pref_lang" TEXT,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "pref_name" TEXT NOT NULL,

    CONSTRAINT "student_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_profile" (
    "id" INTEGER NOT NULL,
    "admin_email" TEXT NOT NULL,

    CONSTRAINT "admin_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "classes" (
    "id" INTEGER NOT NULL,
    "class_name" TEXT NOT NULL,
    "class_year" INTEGER NOT NULL,

    CONSTRAINT "classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teacher_to_classes" (
    "id" INTEGER NOT NULL,
    "class_id" INTEGER NOT NULL,
    "teacher_id" INTEGER NOT NULL,

    CONSTRAINT "teacher_to_classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_to_classes" (
    "id" INTEGER NOT NULL,
    "class_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,

    CONSTRAINT "student_to_classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parent_to_kids" (
    "id" INTEGER NOT NULL,
    "parent_id" INTEGER NOT NULL,
    "child_id" INTEGER NOT NULL,

    CONSTRAINT "parent_to_kids_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_user_name_key" ON "user"("user_name");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "parent_profile_phone_number_key" ON "parent_profile"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "parent_profile_social_media_key" ON "parent_profile"("social_media");

-- CreateIndex
CREATE UNIQUE INDEX "faculty_profile_faculty_email_key" ON "faculty_profile"("faculty_email");

-- CreateIndex
CREATE UNIQUE INDEX "admin_profile_admin_email_key" ON "admin_profile"("admin_email");

-- AddForeignKey
ALTER TABLE "teacher_to_classes" ADD CONSTRAINT "teacher_to_classes_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_to_classes" ADD CONSTRAINT "teacher_to_classes_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "faculty_profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_to_classes" ADD CONSTRAINT "student_to_classes_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_to_classes" ADD CONSTRAINT "student_to_classes_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student_profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent_to_kids" ADD CONSTRAINT "parent_to_kids_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "parent_profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent_to_kids" ADD CONSTRAINT "parent_to_kids_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "student_profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
