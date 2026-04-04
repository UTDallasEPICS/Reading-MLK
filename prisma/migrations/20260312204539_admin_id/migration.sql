/*
  Warnings:

  - Added the required column `account` to the `Admin` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Admin" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "settings" TEXT NOT NULL,
    "account" INTEGER NOT NULL,
    CONSTRAINT "Admin_account_fkey" FOREIGN KEY ("account") REFERENCES "account" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Admin" ("id", "settings") SELECT "id", "settings" FROM "Admin";
DROP TABLE "Admin";
ALTER TABLE "new_Admin" RENAME TO "Admin";
CREATE UNIQUE INDEX "Admin_account_key" ON "Admin"("account");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
