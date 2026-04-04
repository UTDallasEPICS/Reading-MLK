/*
  Warnings:

  - You are about to alter the column `settings` on the `Admin` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - You are about to drop the column `QuestionOptions` on the `FormComponent` table. All the data in the column will be lost.
  - You are about to drop the column `QuestionText` on the `FormComponent` table. All the data in the column will be lost.
  - You are about to drop the column `componentOrder` on the `FormComponent` table. All the data in the column will be lost.
  - You are about to drop the column `AnimationEffect` on the `ShopAnimation` table. All the data in the column will be lost.
  - You are about to drop the column `AnimationType` on the `ShopAnimation` table. All the data in the column will be lost.
  - You are about to drop the column `firstAvailable` on the `ShopItem` table. All the data in the column will be lost.
  - You are about to alter the column `themeEffect` on the `ShopTheme` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - You are about to alter the column `settings` on the `Student` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - Added the required column `questionText` to the `FormComponent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `animationType` to the `ShopAnimation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateAvailable` to the `ShopItem` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Admin" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "settings" JSONB,
    "account" INTEGER NOT NULL,
    CONSTRAINT "Admin_account_fkey" FOREIGN KEY ("account") REFERENCES "account" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Admin" ("account", "id", "settings") SELECT "account", "id", "settings" FROM "Admin";
DROP TABLE "Admin";
ALTER TABLE "new_Admin" RENAME TO "Admin";
CREATE UNIQUE INDEX "Admin_account_key" ON "Admin"("account");
CREATE TABLE "new_FormComponent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "form" INTEGER NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "questionType" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "questionOptions" JSONB,
    CONSTRAINT "FormComponent_form_fkey" FOREIGN KEY ("form") REFERENCES "Form" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_FormComponent" ("form", "id", "questionType") SELECT "form", "id", "questionType" FROM "FormComponent";
DROP TABLE "FormComponent";
ALTER TABLE "new_FormComponent" RENAME TO "FormComponent";
CREATE TABLE "new_ShopAnimation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shopItem" INTEGER NOT NULL,
    "animationType" TEXT NOT NULL,
    "animationEffect" JSONB,
    CONSTRAINT "ShopAnimation_shopItem_fkey" FOREIGN KEY ("shopItem") REFERENCES "ShopItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ShopAnimation" ("id", "shopItem") SELECT "id", "shopItem" FROM "ShopAnimation";
DROP TABLE "ShopAnimation";
ALTER TABLE "new_ShopAnimation" RENAME TO "ShopAnimation";
CREATE UNIQUE INDEX "ShopAnimation_shopItem_key" ON "ShopAnimation"("shopItem");
CREATE TABLE "new_ShopItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dateAvailable" DATETIME NOT NULL
);
INSERT INTO "new_ShopItem" ("id", "name", "type") SELECT "id", "name", "type" FROM "ShopItem";
DROP TABLE "ShopItem";
ALTER TABLE "new_ShopItem" RENAME TO "ShopItem";
CREATE TABLE "new_ShopTheme" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shopItem" INTEGER NOT NULL,
    "themeColor" TEXT NOT NULL,
    "themeEffect" JSONB,
    CONSTRAINT "ShopTheme_shopItem_fkey" FOREIGN KEY ("shopItem") REFERENCES "ShopItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ShopTheme" ("id", "shopItem", "themeColor", "themeEffect") SELECT "id", "shopItem", "themeColor", "themeEffect" FROM "ShopTheme";
DROP TABLE "ShopTheme";
ALTER TABLE "new_ShopTheme" RENAME TO "ShopTheme";
CREATE UNIQUE INDEX "ShopTheme_shopItem_key" ON "ShopTheme"("shopItem");
CREATE TABLE "new_Student" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "settings" JSONB,
    "exp" INTEGER NOT NULL DEFAULT 0,
    "parent" INTEGER NOT NULL,
    CONSTRAINT "Student_parent_fkey" FOREIGN KEY ("parent") REFERENCES "account" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Student" ("exp", "id", "name", "parent", "settings") SELECT "exp", "id", "name", "parent", "settings" FROM "Student";
DROP TABLE "Student";
ALTER TABLE "new_Student" RENAME TO "Student";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
