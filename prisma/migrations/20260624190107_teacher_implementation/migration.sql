/*
  Warnings:

  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `author` on the `Form` table. All the data in the column will be lost.
  - Added the required column `class` to the `Announcement` table without a default value. This is not possible if the table is not empty.
  - Made the column `author` on table `Announcement` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `class` to the `FormGroup` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Admin_userId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Admin";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Poster" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tag" TEXT NOT NULL DEFAULT 'other',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "school" TEXT,
    "district" TEXT,
    "zipcode" TEXT
);

-- CreateTable
CREATE TABLE "Class" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "joinToken" TEXT NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ClassToStudent" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_ClassToStudent_A_fkey" FOREIGN KEY ("A") REFERENCES "Class" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ClassToStudent_B_fkey" FOREIGN KEY ("B") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_ClassToPoster" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_ClassToPoster_A_fkey" FOREIGN KEY ("A") REFERENCES "Class" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ClassToPoster_B_fkey" FOREIGN KEY ("B") REFERENCES "Poster" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Announcement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "postDate" DATETIME NOT NULL,
    "expiryDate" DATETIME,
    "content" JSONB,
    "author" TEXT NOT NULL,
    "class" TEXT NOT NULL,
    CONSTRAINT "Announcement_author_fkey" FOREIGN KEY ("author") REFERENCES "Poster" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Announcement_class_fkey" FOREIGN KEY ("class") REFERENCES "Class" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Announcement" ("author", "content", "expiryDate", "id", "postDate") SELECT "author", "content", "expiryDate", "id", "postDate" FROM "Announcement";
DROP TABLE "Announcement";
ALTER TABLE "new_Announcement" RENAME TO "Announcement";
CREATE INDEX "Announcement_postDate_idx" ON "Announcement"("postDate");
CREATE INDEX "Announcement_expiryDate_idx" ON "Announcement"("expiryDate");
CREATE TABLE "new_Form" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "formGroup" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    CONSTRAINT "Form_formGroup_fkey" FOREIGN KEY ("formGroup") REFERENCES "FormGroup" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Form" ("endDate", "formGroup", "id", "order", "published", "startDate", "title") SELECT "endDate", "formGroup", "id", "order", "published", "startDate", "title" FROM "Form";
DROP TABLE "Form";
ALTER TABLE "new_Form" RENAME TO "Form";
CREATE INDEX "Form_formGroup_idx" ON "Form"("formGroup");
CREATE TABLE "new_FormGroup" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME,
    "class" TEXT NOT NULL,
    "raffleWinner" INTEGER,
    CONSTRAINT "FormGroup_class_fkey" FOREIGN KEY ("class") REFERENCES "Class" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "FormGroup_raffleWinner_fkey" FOREIGN KEY ("raffleWinner") REFERENCES "Student" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_FormGroup" ("endDate", "id", "raffleWinner", "startDate") SELECT "endDate", "id", "raffleWinner", "startDate" FROM "FormGroup";
DROP TABLE "FormGroup";
ALTER TABLE "new_FormGroup" RENAME TO "FormGroup";
CREATE INDEX "FormGroup_class_idx" ON "FormGroup"("class");
CREATE INDEX "FormGroup_startDate_idx" ON "FormGroup"("startDate");
CREATE INDEX "FormGroup_endDate_idx" ON "FormGroup"("endDate");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "Poster_tag_idx" ON "Poster"("tag");

-- CreateIndex
CREATE INDEX "Poster_verified_idx" ON "Poster"("verified");

-- CreateIndex
CREATE INDEX "Poster_school_idx" ON "Poster"("school");

-- CreateIndex
CREATE INDEX "Poster_district_idx" ON "Poster"("district");

-- CreateIndex
CREATE INDEX "Poster_zipcode_idx" ON "Poster"("zipcode");

-- CreateIndex
CREATE UNIQUE INDEX "Class_joinToken_key" ON "Class"("joinToken");

-- CreateIndex
CREATE UNIQUE INDEX "_ClassToStudent_AB_unique" ON "_ClassToStudent"("A", "B");

-- CreateIndex
CREATE INDEX "_ClassToStudent_B_index" ON "_ClassToStudent"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ClassToPoster_AB_unique" ON "_ClassToPoster"("A", "B");

-- CreateIndex
CREATE INDEX "_ClassToPoster_B_index" ON "_ClassToPoster"("B");
