/*
  Warnings:

  - You are about to alter the column `content` on the `Announcement` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.

*/
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
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
