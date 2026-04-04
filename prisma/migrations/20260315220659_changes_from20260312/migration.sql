/*
  Warnings:

  - You are about to drop the `Animation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Component` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Response` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Submission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Theme` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Unlockable` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `authorid` on the `Announcement` table. All the data in the column will be lost.
  - The primary key for the `Form` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `authorid` on the `Form` table. All the data in the column will be lost.
  - You are about to drop the column `fgid` on the `Form` table. All the data in the column will be lost.
  - The primary key for the `FormGroup` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `fid` on the `FormGroup` table. All the data in the column will be lost.
  - You are about to drop the column `rwinid` on the `FormGroup` table. All the data in the column will be lost.
  - You are about to drop the column `rwinname` on the `FormGroup` table. All the data in the column will be lost.
  - The primary key for the `Student` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `streak` on the `Student` table. All the data in the column will be lost.
  - Added the required column `formGroup` to the `Form` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Form` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `FormGroup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parent` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Animation";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Component";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Response";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Submission";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Theme";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Unlockable";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "FormComponent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "form" INTEGER NOT NULL,
    "componentOrder" INTEGER NOT NULL DEFAULT 0,
    "questionType" TEXT NOT NULL DEFAULT 'f',
    "QuestionText" TEXT NOT NULL,
    "QuestionOptions" TEXT,
    CONSTRAINT "FormComponent_form_fkey" FOREIGN KEY ("form") REFERENCES "Form" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FormSubmission" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "student" INTEGER NOT NULL,
    "form" INTEGER NOT NULL,
    "submissionDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FormSubmission_student_fkey" FOREIGN KEY ("student") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "FormSubmission_form_fkey" FOREIGN KEY ("form") REFERENCES "Form" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SubmissionResponse" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "submission" INTEGER NOT NULL,
    "formComponent" INTEGER NOT NULL,
    "response" TEXT NOT NULL,
    CONSTRAINT "SubmissionResponse_submission_fkey" FOREIGN KEY ("submission") REFERENCES "FormSubmission" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SubmissionResponse_formComponent_fkey" FOREIGN KEY ("formComponent") REFERENCES "FormComponent" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ShopItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "firstAvailable" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ShopTheme" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shopItem" INTEGER NOT NULL,
    "themeColor" TEXT NOT NULL,
    "themeEffect" TEXT NOT NULL,
    CONSTRAINT "ShopTheme_shopItem_fkey" FOREIGN KEY ("shopItem") REFERENCES "ShopItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ShopAnimation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shopItem" INTEGER NOT NULL,
    "AnimationType" TEXT NOT NULL,
    "AnimationEffect" TEXT NOT NULL,
    CONSTRAINT "ShopAnimation_shopItem_fkey" FOREIGN KEY ("shopItem") REFERENCES "ShopItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Announcement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "author" INTEGER,
    "postDate" DATETIME NOT NULL,
    "expiryDate" DATETIME,
    "content" TEXT NOT NULL,
    CONSTRAINT "Announcement_author_fkey" FOREIGN KEY ("author") REFERENCES "Admin" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Announcement" ("content", "expiryDate", "id", "postDate") SELECT "content", "expiryDate", "id", "postDate" FROM "Announcement";
DROP TABLE "Announcement";
ALTER TABLE "new_Announcement" RENAME TO "Announcement";
CREATE TABLE "new_Form" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "author" INTEGER,
    "formGroup" INTEGER NOT NULL,
    CONSTRAINT "Form_author_fkey" FOREIGN KEY ("author") REFERENCES "Admin" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Form_formGroup_fkey" FOREIGN KEY ("formGroup") REFERENCES "FormGroup" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Form" ("endDate", "order", "published", "startDate") SELECT "endDate", "order", "published", "startDate" FROM "Form";
DROP TABLE "Form";
ALTER TABLE "new_Form" RENAME TO "Form";
CREATE TABLE "new_FormGroup" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME,
    "raffleWinner" INTEGER,
    CONSTRAINT "FormGroup_raffleWinner_fkey" FOREIGN KEY ("raffleWinner") REFERENCES "Student" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_FormGroup" ("endDate", "startDate") SELECT "endDate", "startDate" FROM "FormGroup";
DROP TABLE "FormGroup";
ALTER TABLE "new_FormGroup" RENAME TO "FormGroup";
CREATE TABLE "new_Student" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "settings" TEXT NOT NULL,
    "exp" INTEGER NOT NULL DEFAULT 0,
    "parent" INTEGER NOT NULL,
    CONSTRAINT "Student_parent_fkey" FOREIGN KEY ("parent") REFERENCES "account" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Student" ("exp", "id", "name", "settings") SELECT "exp", "id", "name", "settings" FROM "Student";
DROP TABLE "Student";
ALTER TABLE "new_Student" RENAME TO "Student";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "ShopTheme_shopItem_key" ON "ShopTheme"("shopItem");

-- CreateIndex
CREATE UNIQUE INDEX "ShopAnimation_shopItem_key" ON "ShopAnimation"("shopItem");
