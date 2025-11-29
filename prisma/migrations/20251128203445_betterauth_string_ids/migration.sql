/*
  Warnings:

  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - The primary key for the `account` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `session` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `verification` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropIndex
DROP INDEX "users_email_key";

-- DropIndex
DROP INDEX "users_user_name_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "users";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_name" TEXT,
    "first_name" TEXT,
    "last_name" TEXT,
    "preferred_name" TEXT,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "image" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" TEXT
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" DATETIME,
    "refreshTokenExpiresAt" DATETIME,
    "scope" TEXT,
    "password" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_account" ("accessToken", "accessTokenExpiresAt", "accountId", "createdAt", "id", "idToken", "password", "providerId", "refreshToken", "refreshTokenExpiresAt", "scope", "updatedAt", "userId") SELECT "accessToken", "accessTokenExpiresAt", "accountId", "createdAt", "id", "idToken", "password", "providerId", "refreshToken", "refreshTokenExpiresAt", "scope", "updatedAt", "userId" FROM "account";
DROP TABLE "account";
ALTER TABLE "new_account" RENAME TO "account";
CREATE TABLE "new_admin_profile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "admin_id" TEXT NOT NULL,
    CONSTRAINT "admin_profile_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_admin_profile" ("admin_id", "id") SELECT "admin_id", "id" FROM "admin_profile";
DROP TABLE "admin_profile";
ALTER TABLE "new_admin_profile" RENAME TO "admin_profile";
CREATE UNIQUE INDEX "admin_profile_admin_id_key" ON "admin_profile"("admin_id");
CREATE TABLE "new_faculty_profile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "district" TEXT NOT NULL,
    "dual_lang" BOOLEAN NOT NULL,
    "faculty_email" TEXT NOT NULL,
    "school_name" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    CONSTRAINT "faculty_profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_faculty_profile" ("department", "district", "dual_lang", "faculty_email", "grade", "id", "phone_number", "school_name", "user_id") SELECT "department", "district", "dual_lang", "faculty_email", "grade", "id", "phone_number", "school_name", "user_id" FROM "faculty_profile";
DROP TABLE "faculty_profile";
ALTER TABLE "new_faculty_profile" RENAME TO "faculty_profile";
CREATE UNIQUE INDEX "faculty_profile_faculty_email_key" ON "faculty_profile"("faculty_email");
CREATE UNIQUE INDEX "faculty_profile_user_id_key" ON "faculty_profile"("user_id");
CREATE TABLE "new_parent_profile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "zipcode" TEXT NOT NULL,
    "yearly_income" TEXT,
    "birth_date" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "average_number_books" INTEGER NOT NULL,
    "phone_number" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "marital_stat" TEXT,
    "social_media" TEXT,
    "user_id" TEXT NOT NULL,
    CONSTRAINT "parent_profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_parent_profile" ("average_number_books", "birth_date", "gender", "id", "marital_stat", "phone_number", "social_media", "user_id", "yearly_income", "zipcode") SELECT "average_number_books", "birth_date", "gender", "id", "marital_stat", "phone_number", "social_media", "user_id", "yearly_income", "zipcode" FROM "parent_profile";
DROP TABLE "parent_profile";
ALTER TABLE "new_parent_profile" RENAME TO "parent_profile";
CREATE UNIQUE INDEX "parent_profile_phone_number_key" ON "parent_profile"("phone_number");
CREATE UNIQUE INDEX "parent_profile_social_media_key" ON "parent_profile"("social_media");
CREATE UNIQUE INDEX "parent_profile_user_id_key" ON "parent_profile"("user_id");
CREATE TABLE "new_session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "expiresAt" DATETIME NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,
    CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_session" ("createdAt", "expiresAt", "id", "ipAddress", "token", "updatedAt", "userAgent", "userId") SELECT "createdAt", "expiresAt", "id", "ipAddress", "token", "updatedAt", "userAgent", "userId" FROM "session";
DROP TABLE "session";
ALTER TABLE "new_session" RENAME TO "session";
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");
CREATE TABLE "new_verification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_verification" ("createdAt", "expiresAt", "id", "identifier", "updatedAt", "value") SELECT "createdAt", "expiresAt", "id", "identifier", "updatedAt", "value" FROM "verification";
DROP TABLE "verification";
ALTER TABLE "new_verification" RENAME TO "verification";
CREATE UNIQUE INDEX "verification_identifier_key" ON "verification"("identifier");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "user_user_name_key" ON "user"("user_name");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
