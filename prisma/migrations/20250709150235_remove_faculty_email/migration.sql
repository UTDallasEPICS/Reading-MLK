/*
  Warnings:

  - You are about to drop the column `admin_email` on the `admin_profile` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "admin_profile_admin_email_key";

-- AlterTable
ALTER TABLE "admin_profile" DROP COLUMN "admin_email";
