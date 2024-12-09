/*
  Warnings:

  - Added the required column `first_name` to the `student_profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `student_profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "student_profile" ADD COLUMN     "first_name" TEXT NOT NULL,
ADD COLUMN     "last_name" TEXT NOT NULL;
