/*
  Warnings:

  - You are about to drop the column `first_name` on the `faculty_profile` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `faculty_profile` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `parent_profile` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `parent_profile` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `parent_profile` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `parent_profile` table. All the data in the column will be lost.
  - The primary key for the `parent_to_kids` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `parent_to_kids` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `student_profile` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `student_profile` table. All the data in the column will be lost.
  - You are about to drop the column `pref_name` on the `student_profile` table. All the data in the column will be lost.
  - The primary key for the `student_to_classes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `student_to_classes` table. All the data in the column will be lost.
  - The primary key for the `teacher_to_classes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `teacher_to_classes` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[private_email]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `first_name` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `preferred_name` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `private_email` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "users_email_key";

-- AlterTable
ALTER TABLE "faculty_profile" DROP COLUMN "first_name",
DROP COLUMN "last_name";

-- AlterTable
ALTER TABLE "parent_profile" DROP COLUMN "email",
DROP COLUMN "first_name",
DROP COLUMN "last_name",
DROP COLUMN "password";

-- AlterTable
ALTER TABLE "parent_to_kids" DROP CONSTRAINT "parent_to_kids_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "parent_to_kids_pkey" PRIMARY KEY ("parent_id", "child_id");

-- AlterTable
ALTER TABLE "student_profile" DROP COLUMN "first_name",
DROP COLUMN "last_name",
DROP COLUMN "pref_name";

-- AlterTable
ALTER TABLE "student_to_classes" DROP CONSTRAINT "student_to_classes_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "student_to_classes_pkey" PRIMARY KEY ("class_id", "student_id");

-- AlterTable
ALTER TABLE "teacher_to_classes" DROP CONSTRAINT "teacher_to_classes_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "teacher_to_classes_pkey" PRIMARY KEY ("class_id", "teacher_id");

-- AlterTable
ALTER TABLE "users" DROP COLUMN "email",
ADD COLUMN     "first_name" TEXT NOT NULL,
ADD COLUMN     "last_name" TEXT NOT NULL,
ADD COLUMN     "preferred_name" TEXT NOT NULL,
ADD COLUMN     "private_email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_private_email_key" ON "users"("private_email");
