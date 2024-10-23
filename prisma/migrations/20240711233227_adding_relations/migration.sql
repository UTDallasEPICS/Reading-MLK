/*
  Warnings:

  - A unique constraint covering the columns `[admin_id]` on the table `admin_profile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[faculty_id]` on the table `faculty_profile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `parent_profile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[student_id]` on the table `student_profile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `admin_id` to the `admin_profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `faculty_id` to the `faculty_profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `parent_profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `student_id` to the `student_profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "admin_profile" ADD COLUMN     "admin_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "faculty_profile" ADD COLUMN     "faculty_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "parent_profile" ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "student_profile" ADD COLUMN     "student_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "admin_profile_admin_id_key" ON "admin_profile"("admin_id");

-- CreateIndex
CREATE UNIQUE INDEX "faculty_profile_faculty_id_key" ON "faculty_profile"("faculty_id");

-- CreateIndex
CREATE UNIQUE INDEX "parent_profile_user_id_key" ON "parent_profile"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "student_profile_student_id_key" ON "student_profile"("student_id");

-- AddForeignKey
ALTER TABLE "parent_profile" ADD CONSTRAINT "parent_profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faculty_profile" ADD CONSTRAINT "faculty_profile_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_profile" ADD CONSTRAINT "student_profile_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_profile" ADD CONSTRAINT "admin_profile_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
