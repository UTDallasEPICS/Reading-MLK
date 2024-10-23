/*
  Warnings:

  - You are about to drop the column `faculty_id` on the `faculty_profile` table. All the data in the column will be lost.
  - You are about to drop the column `student_id` on the `student_profile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `faculty_profile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `student_profile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `faculty_profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `student_profile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "faculty_profile" DROP CONSTRAINT "faculty_profile_faculty_id_fkey";

-- DropForeignKey
ALTER TABLE "student_profile" DROP CONSTRAINT "student_profile_student_id_fkey";

-- DropIndex
DROP INDEX "faculty_profile_faculty_id_key";

-- DropIndex
DROP INDEX "student_profile_student_id_key";

-- AlterTable
ALTER TABLE "faculty_profile" DROP COLUMN "faculty_id",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "student_profile" DROP COLUMN "student_id",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "faculty_profile_user_id_key" ON "faculty_profile"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "student_profile_user_id_key" ON "student_profile"("user_id");

-- AddForeignKey
ALTER TABLE "faculty_profile" ADD CONSTRAINT "faculty_profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_profile" ADD CONSTRAINT "student_profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
