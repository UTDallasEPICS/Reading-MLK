/*
  Warnings:

  - You are about to drop the column `average_number_books` on the `parent_profile` table. All the data in the column will be lost.
  - You are about to drop the column `birth_date` on the `parent_profile` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `parent_profile` table. All the data in the column will be lost.
  - You are about to drop the column `marital_stat` on the `parent_profile` table. All the data in the column will be lost.
  - You are about to drop the column `phone_number` on the `parent_profile` table. All the data in the column will be lost.
  - You are about to drop the column `social_media` on the `parent_profile` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `parent_profile` table. All the data in the column will be lost.
  - You are about to drop the column `yearly_income` on the `parent_profile` table. All the data in the column will be lost.
  - You are about to drop the column `age` on the `student_profile` table. All the data in the column will be lost.
  - You are about to drop the column `birth_date` on the `student_profile` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `student_profile` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `student_profile` table. All the data in the column will be lost.
  - You are about to drop the column `grade` on the `student_profile` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `student_profile` table. All the data in the column will be lost.
  - You are about to drop the column `pref_lang` on the `student_profile` table. All the data in the column will be lost.
  - You are about to drop the column `reading_lvl` on the `student_profile` table. All the data in the column will be lost.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `user_name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `admin_profile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `classes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `faculty_profile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `parent_to_kids` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `student_to_classes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `teacher_to_classes` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[username]` on the table `parent_profile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `student_profile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_email` to the `parent_profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `parent_profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `preferred_language` to the `student_profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `starting_reading_level` to the `student_profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_email` to the `student_profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `student_profile` table without a default value. This is not possible if the table is not empty.
  - Made the column `preferred_name` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "admin_profile" DROP CONSTRAINT "admin_profile_admin_id_fkey";

-- DropForeignKey
ALTER TABLE "faculty_profile" DROP CONSTRAINT "faculty_profile_user_id_fkey";

-- DropForeignKey
ALTER TABLE "parent_profile" DROP CONSTRAINT "parent_profile_user_id_fkey";

-- DropForeignKey
ALTER TABLE "parent_to_kids" DROP CONSTRAINT "parent_to_kids_child_id_fkey";

-- DropForeignKey
ALTER TABLE "parent_to_kids" DROP CONSTRAINT "parent_to_kids_parent_id_fkey";

-- DropForeignKey
ALTER TABLE "student_to_classes" DROP CONSTRAINT "student_to_classes_class_id_fkey";

-- DropForeignKey
ALTER TABLE "student_to_classes" DROP CONSTRAINT "student_to_classes_student_id_fkey";

-- DropForeignKey
ALTER TABLE "teacher_to_classes" DROP CONSTRAINT "teacher_to_classes_class_id_fkey";

-- DropForeignKey
ALTER TABLE "teacher_to_classes" DROP CONSTRAINT "teacher_to_classes_teacher_id_fkey";

-- DropIndex
DROP INDEX "parent_profile_phone_number_key";

-- DropIndex
DROP INDEX "parent_profile_social_media_key";

-- DropIndex
DROP INDEX "parent_profile_user_id_key";

-- DropIndex
DROP INDEX "users_user_name_key";

-- AlterTable
ALTER TABLE "parent_profile" DROP COLUMN "average_number_books",
DROP COLUMN "birth_date",
DROP COLUMN "gender",
DROP COLUMN "marital_stat",
DROP COLUMN "phone_number",
DROP COLUMN "social_media",
DROP COLUMN "user_id",
DROP COLUMN "yearly_income",
ADD COLUMN     "user_email" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "student_profile" DROP COLUMN "age",
DROP COLUMN "birth_date",
DROP COLUMN "first_name",
DROP COLUMN "gender",
DROP COLUMN "grade",
DROP COLUMN "last_name",
DROP COLUMN "pref_lang",
DROP COLUMN "reading_lvl",
ADD COLUMN     "preferred_language" TEXT NOT NULL,
ADD COLUMN     "starting_reading_level" TEXT NOT NULL,
ADD COLUMN     "user_email" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL,
ADD COLUMN     "zipcode" TEXT;

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "id",
DROP COLUMN "role",
DROP COLUMN "user_name",
ADD COLUMN     "birth_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "creationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "gender" TEXT NOT NULL DEFAULT 'not_specified',
ALTER COLUMN "preferred_name" SET NOT NULL,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("email");

-- DropTable
DROP TABLE "admin_profile";

-- DropTable
DROP TABLE "classes";

-- DropTable
DROP TABLE "faculty_profile";

-- DropTable
DROP TABLE "parent_to_kids";

-- DropTable
DROP TABLE "student_to_classes";

-- DropTable
DROP TABLE "teacher_to_classes";

-- CreateTable
CREATE TABLE "teacher_profile" (
    "id" SERIAL NOT NULL,
    "zipcode" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "school_dist" TEXT NOT NULL,
    "school_name" TEXT NOT NULL,
    "user_email" TEXT NOT NULL,

    CONSTRAINT "teacher_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parent_to_student" (
    "parent_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,

    CONSTRAINT "parent_to_student_pkey" PRIMARY KEY ("parent_id","student_id")
);

-- CreateTable
CREATE TABLE "student_to_parent" (
    "parent_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,

    CONSTRAINT "student_to_parent_pkey" PRIMARY KEY ("parent_id","student_id")
);

-- CreateTable
CREATE TABLE "parent_to_teacher" (
    "parent_id" INTEGER NOT NULL,
    "teacher_id" INTEGER NOT NULL,

    CONSTRAINT "parent_to_teacher_pkey" PRIMARY KEY ("parent_id","teacher_id")
);

-- CreateTable
CREATE TABLE "teacher_to_parent" (
    "parent_id" INTEGER NOT NULL,
    "teacher_id" INTEGER NOT NULL,

    CONSTRAINT "teacher_to_parent_pkey" PRIMARY KEY ("parent_id","teacher_id")
);

-- CreateTable
CREATE TABLE "teacher_to_student" (
    "teacher_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,

    CONSTRAINT "teacher_to_student_pkey" PRIMARY KEY ("teacher_id","student_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "teacher_profile_username_key" ON "teacher_profile"("username");

-- CreateIndex
CREATE UNIQUE INDEX "parent_profile_username_key" ON "parent_profile"("username");

-- CreateIndex
CREATE UNIQUE INDEX "student_profile_username_key" ON "student_profile"("username");

-- AddForeignKey
ALTER TABLE "parent_profile" ADD CONSTRAINT "parent_profile_user_email_fkey" FOREIGN KEY ("user_email") REFERENCES "users"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_profile" ADD CONSTRAINT "teacher_profile_user_email_fkey" FOREIGN KEY ("user_email") REFERENCES "users"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_profile" ADD CONSTRAINT "student_profile_user_email_fkey" FOREIGN KEY ("user_email") REFERENCES "users"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent_to_student" ADD CONSTRAINT "parent_to_student_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "parent_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent_to_student" ADD CONSTRAINT "parent_to_student_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_to_parent" ADD CONSTRAINT "student_to_parent_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "parent_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_to_parent" ADD CONSTRAINT "student_to_parent_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent_to_teacher" ADD CONSTRAINT "parent_to_teacher_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "parent_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent_to_teacher" ADD CONSTRAINT "parent_to_teacher_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teacher_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_to_parent" ADD CONSTRAINT "teacher_to_parent_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "parent_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_to_parent" ADD CONSTRAINT "teacher_to_parent_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teacher_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_to_student" ADD CONSTRAINT "teacher_to_student_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teacher_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_to_student" ADD CONSTRAINT "teacher_to_student_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
