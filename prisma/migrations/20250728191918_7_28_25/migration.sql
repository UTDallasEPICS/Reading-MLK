/*
  Warnings:

  - You are about to drop the column `class_year` on the `classes` table. All the data in the column will be lost.
  - Added the required column `class_code` to the `classes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "classes" DROP COLUMN "class_year",
ADD COLUMN     "class_code" INTEGER NOT NULL;
