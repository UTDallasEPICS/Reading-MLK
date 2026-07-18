/*
  Warnings:

  - You are about to drop the column `admin` on the `user` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Poster` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Poster" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tag" TEXT NOT NULL DEFAULT 'other',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "school" TEXT,
    "district" TEXT,
    "zipcode" TEXT,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Poster_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Poster" ("district", "id", "school", "tag", "verified", "zipcode") SELECT "district", "id", "school", "tag", "verified", "zipcode" FROM "Poster";
DROP TABLE "Poster";
ALTER TABLE "new_Poster" RENAME TO "Poster";
CREATE UNIQUE INDEX "Poster_userId_key" ON "Poster"("userId");
CREATE INDEX "Poster_tag_idx" ON "Poster"("tag");
CREATE INDEX "Poster_verified_idx" ON "Poster"("verified");
CREATE INDEX "Poster_school_idx" ON "Poster"("school");
CREATE INDEX "Poster_district_idx" ON "Poster"("district");
CREATE INDEX "Poster_zipcode_idx" ON "Poster"("zipcode");
CREATE TABLE "new_user" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "role" TEXT NOT NULL DEFAULT 'reader',
    "raffleOptIn" BOOLEAN NOT NULL DEFAULT true,
    "publicityConsent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "posterId" TEXT
);
INSERT INTO "new_user" ("createdAt", "email", "emailVerified", "id", "name", "publicityConsent", "raffleOptIn", "role", "updatedAt") SELECT "createdAt", "email", "emailVerified", "id", "name", "publicityConsent", "raffleOptIn", "role", "updatedAt" FROM "user";
DROP TABLE "user";
ALTER TABLE "new_user" RENAME TO "user";
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "Announcement_class_idx" ON "Announcement"("class");

-- CreateIndex
CREATE INDEX "Class_joinToken_idx" ON "Class"("joinToken");
