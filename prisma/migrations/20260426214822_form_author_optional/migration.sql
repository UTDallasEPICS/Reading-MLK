/*
  Warnings:

  - A unique constraint covering the columns `[student,form]` on the table `FormSubmission` will be added. If there are existing duplicate values, this will fail.
  - Made the column `title` on table `Form` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateTable
CREATE TABLE "_ShopItemToStudent" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_ShopItemToStudent_A_fkey" FOREIGN KEY ("A") REFERENCES "ShopItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ShopItemToStudent_B_fkey" FOREIGN KEY ("B") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Announcement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "author" TEXT,
    "postDate" DATETIME NOT NULL,
    "expiryDate" DATETIME,
    "content" JSONB,
    CONSTRAINT "Announcement_author_fkey" FOREIGN KEY ("author") REFERENCES "Admin" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Announcement" ("author", "content", "expiryDate", "id", "postDate") SELECT "author", "content", "expiryDate", "id", "postDate" FROM "Announcement";
DROP TABLE "Announcement";
ALTER TABLE "new_Announcement" RENAME TO "Announcement";
CREATE TABLE "new_Form" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "author" TEXT,
    "formGroup" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    CONSTRAINT "Form_author_fkey" FOREIGN KEY ("author") REFERENCES "Admin" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Form_formGroup_fkey" FOREIGN KEY ("formGroup") REFERENCES "FormGroup" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Form" ("author", "endDate", "formGroup", "id", "order", "published", "startDate", "title") SELECT "author", "endDate", "formGroup", "id", "order", "published", "startDate", "title" FROM "Form";
DROP TABLE "Form";
ALTER TABLE "new_Form" RENAME TO "Form";
CREATE TABLE "new_ShopItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dateAvailable" DATETIME NOT NULL,
    "cost" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_ShopItem" ("dateAvailable", "id", "name", "type") SELECT "dateAvailable", "id", "name", "type" FROM "ShopItem";
DROP TABLE "ShopItem";
ALTER TABLE "new_ShopItem" RENAME TO "ShopItem";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_ShopItemToStudent_AB_unique" ON "_ShopItemToStudent"("A", "B");

-- CreateIndex
CREATE INDEX "_ShopItemToStudent_B_index" ON "_ShopItemToStudent"("B");

-- CreateIndex
CREATE UNIQUE INDEX "FormSubmission_student_form_key" ON "FormSubmission"("student", "form");
