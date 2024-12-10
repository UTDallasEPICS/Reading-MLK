/*
  Warnings:

  - You are about to drop the column `user_id` on the `student_profile` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "student_profile_user_id_key";

-- AlterTable
ALTER TABLE "student_profile" DROP COLUMN "user_id";
