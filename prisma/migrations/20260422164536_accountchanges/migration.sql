-- CreateTable
CREATE TABLE "PendingEmailChange" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "newEmail" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PendingEmailChange_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_user" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "role" TEXT NOT NULL DEFAULT 'reader',
    "raffleOptIn" BOOLEAN NOT NULL DEFAULT true,
    "publicityConsent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_user" ("createdAt", "email", "emailVerified", "id", "name", "role", "updatedAt") SELECT "createdAt", "email", "emailVerified", "id", "name", "role", "updatedAt" FROM "user";
DROP TABLE "user";
ALTER TABLE "new_user" RENAME TO "user";
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "PendingEmailChange_token_key" ON "PendingEmailChange"("token");
-- CreateIndex
CREATE UNIQUE INDEX "PendingEmailChange_userId_key" ON "PendingEmailChange"("userId");
-- CreateIndex
CREATE UNIQUE INDEX "PendingEmailChange_newEmail_key" ON "PendingEmailChange"("newEmail");