-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_user" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "role" TEXT NOT NULL DEFAULT 'reader',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_user" ("createdAt", "email", "emailVerified", "id", "name", "role", "updatedAt") SELECT "createdAt", "email", "emailVerified", "id", "name", "role", "updatedAt" FROM "user";
DROP TABLE "user";
ALTER TABLE "new_user" RENAME TO "user";
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
CREATE TABLE "new_FormGroup" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME,
    "class" TEXT NOT NULL,
    CONSTRAINT "FormGroup_class_fkey" FOREIGN KEY ("class") REFERENCES "Class" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_FormGroup" ("class", "endDate", "id", "startDate") SELECT "class", "endDate", "id", "startDate" FROM "FormGroup";
DROP TABLE "FormGroup";
ALTER TABLE "new_FormGroup" RENAME TO "FormGroup";
CREATE INDEX "FormGroup_class_idx" ON "FormGroup"("class");
CREATE INDEX "FormGroup_startDate_idx" ON "FormGroup"("startDate");
CREATE INDEX "FormGroup_endDate_idx" ON "FormGroup"("endDate");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
