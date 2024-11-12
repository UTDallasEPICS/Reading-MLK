-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "user_name" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "preferred_name" TEXT,
    "email" TEXT NOT NULL,
    "client_cuid" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parent_profile" (
    "id" SERIAL NOT NULL,
    "zipcode" TEXT NOT NULL,
    "yearly_income" TEXT,
    "birth_date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "average_number_books" INTEGER NOT NULL,
    "phone_number" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "marital_stat" TEXT,
    "social_media" TEXT,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "parent_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faculty_profile" (
    "id" SERIAL NOT NULL,
    "district" TEXT NOT NULL,
    "dual_lang" BOOLEAN NOT NULL,
    "faculty_email" TEXT NOT NULL,
    "school_name" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "faculty_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_profile" (
    "id" SERIAL NOT NULL,
    "age" INTEGER NOT NULL,
    "grade" INTEGER NOT NULL,
    "reading_lvl" INTEGER NOT NULL,
    "birth_date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "gender" TEXT NOT NULL,
    "school_name" TEXT NOT NULL,
    "school_dist" TEXT NOT NULL,
    "pref_lang" TEXT,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "student_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_profile" (
    "id" SERIAL NOT NULL,
    "admin_email" TEXT NOT NULL,
    "admin_id" INTEGER NOT NULL,

    CONSTRAINT "admin_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "classes" (
    "id" SERIAL NOT NULL,
    "class_name" TEXT NOT NULL,
    "class_year" INTEGER NOT NULL,

    CONSTRAINT "classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teacher_to_classes" (
    "class_id" INTEGER NOT NULL,
    "teacher_id" INTEGER NOT NULL,

    CONSTRAINT "teacher_to_classes_pkey" PRIMARY KEY ("class_id","teacher_id")
);

-- CreateTable
CREATE TABLE "student_to_classes" (
    "class_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,

    CONSTRAINT "student_to_classes_pkey" PRIMARY KEY ("class_id","student_id")
);

-- CreateTable
CREATE TABLE "parent_to_kids" (
    "parent_id" INTEGER NOT NULL,
    "child_id" INTEGER NOT NULL,

    CONSTRAINT "parent_to_kids_pkey" PRIMARY KEY ("parent_id","child_id")
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
CREATE UNIQUE INDEX "student_profile_user_id_key" ON "student_profile"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "admin_profile_admin_email_key" ON "admin_profile"("admin_email");

-- CreateIndex
CREATE UNIQUE INDEX "admin_profile_admin_id_key" ON "admin_profile"("admin_id");

-- AddForeignKey
ALTER TABLE "parent_profile" ADD CONSTRAINT "parent_profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faculty_profile" ADD CONSTRAINT "faculty_profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_profile" ADD CONSTRAINT "student_profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_profile" ADD CONSTRAINT "admin_profile_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
