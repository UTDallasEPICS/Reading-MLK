-- CreateTable
CREATE TABLE "user" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "session" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "expiresAt" DATETIME NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "account" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
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

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "settings" TEXT NOT NULL,
    CONSTRAINT "Admin_id_fkey" FOREIGN KEY ("id") REFERENCES "account" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Student" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "settings" TEXT NOT NULL,
    "exp" INTEGER NOT NULL DEFAULT 0,
    "streak" INTEGER NOT NULL,

    PRIMARY KEY ("id", "name"),
    CONSTRAINT "Student_id_fkey" FOREIGN KEY ("id") REFERENCES "account" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Announcement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "authorid" INTEGER,
    "postDate" DATETIME NOT NULL,
    "expiryDate" DATETIME,
    "content" TEXT NOT NULL,
    CONSTRAINT "Announcement_authorid_fkey" FOREIGN KEY ("authorid") REFERENCES "Admin" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FormGroup" (
    "fid" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME,
    "rwinid" INTEGER,
    "rwinname" TEXT,
    CONSTRAINT "FormGroup_rwinid_rwinname_fkey" FOREIGN KEY ("rwinid", "rwinname") REFERENCES "Student" ("id", "name") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Form" (
    "fgid" INTEGER NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "authorid" INTEGER,

    PRIMARY KEY ("fgid", "order"),
    CONSTRAINT "Form_fgid_fkey" FOREIGN KEY ("fgid") REFERENCES "FormGroup" ("fid") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Form_authorid_fkey" FOREIGN KEY ("authorid") REFERENCES "Admin" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Component" (
    "fgid" INTEGER NOT NULL,
    "forder" INTEGER NOT NULL,
    "corder" INTEGER NOT NULL DEFAULT 0,
    "Qtype" TEXT NOT NULL DEFAULT 'f',
    "Qtext" TEXT NOT NULL,
    "Qoptions" TEXT,

    PRIMARY KEY ("forder", "fgid", "corder"),
    CONSTRAINT "Component_forder_fgid_fkey" FOREIGN KEY ("forder", "fgid") REFERENCES "Form" ("order", "fgid") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Submission" (
    "sid" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "fgid" INTEGER NOT NULL,
    "forder" INTEGER NOT NULL,
    "submissionDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("sid", "name", "fgid", "forder"),
    CONSTRAINT "Submission_sid_name_fkey" FOREIGN KEY ("sid", "name") REFERENCES "Student" ("id", "name") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Submission_forder_fgid_fkey" FOREIGN KEY ("forder", "fgid") REFERENCES "Form" ("order", "fgid") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Response" (
    "sid" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "fgid" INTEGER NOT NULL,
    "forder" INTEGER NOT NULL,
    "corder" INTEGER NOT NULL,
    "rtext" TEXT NOT NULL,

    PRIMARY KEY ("sid", "name", "fgid", "forder", "corder"),
    CONSTRAINT "Response_sid_name_fkey" FOREIGN KEY ("sid", "name") REFERENCES "Student" ("id", "name") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Response_forder_fgid_corder_fkey" FOREIGN KEY ("forder", "fgid", "corder") REFERENCES "Component" ("forder", "fgid", "corder") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Unlockable" (
    "uid" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "utype" TEXT NOT NULL,
    "uname" TEXT NOT NULL,
    "firstAvailable" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Theme" (
    "uid" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Tcolor" TEXT NOT NULL,
    "Teffect" TEXT NOT NULL,
    CONSTRAINT "Theme_uid_fkey" FOREIGN KEY ("uid") REFERENCES "Unlockable" ("uid") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Animation" (
    "uid" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Atype" TEXT NOT NULL,
    "Aeffect" TEXT NOT NULL,
    CONSTRAINT "Animation_uid_fkey" FOREIGN KEY ("uid") REFERENCES "Unlockable" ("uid") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "account"("userId");

-- CreateIndex
CREATE INDEX "verification_identifier_idx" ON "verification"("identifier");
