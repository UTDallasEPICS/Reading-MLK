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
    "settings" JSONB,
    "account" INTEGER NOT NULL,
    CONSTRAINT "Admin_account_fkey" FOREIGN KEY ("account") REFERENCES "account" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Student" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "settings" JSONB,
    "exp" INTEGER NOT NULL DEFAULT 0,
    "parent" INTEGER NOT NULL,
    CONSTRAINT "Student_parent_fkey" FOREIGN KEY ("parent") REFERENCES "account" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Announcement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "author" INTEGER,
    "postDate" DATETIME NOT NULL,
    "expiryDate" DATETIME,
    "content" TEXT NOT NULL,
    CONSTRAINT "Announcement_author_fkey" FOREIGN KEY ("author") REFERENCES "Admin" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FormGroup" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME,
    "raffleWinner" INTEGER,
    CONSTRAINT "FormGroup_raffleWinner_fkey" FOREIGN KEY ("raffleWinner") REFERENCES "Student" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Form" (
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

-- CreateTable
CREATE TABLE "FormComponent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "form" INTEGER NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "questionType" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "questionOptions" JSONB,
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
    "dateAvailable" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ShopTheme" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shopItem" INTEGER NOT NULL,
    "themeColor" TEXT NOT NULL,
    "themeEffect" JSONB,
    CONSTRAINT "ShopTheme_shopItem_fkey" FOREIGN KEY ("shopItem") REFERENCES "ShopItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ShopAnimation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shopItem" INTEGER NOT NULL,
    "animationType" TEXT NOT NULL,
    "animationEffect" JSONB,
    CONSTRAINT "ShopAnimation_shopItem_fkey" FOREIGN KEY ("shopItem") REFERENCES "ShopItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
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

-- CreateIndex
CREATE UNIQUE INDEX "Admin_account_key" ON "Admin"("account");

-- CreateIndex
CREATE UNIQUE INDEX "ShopTheme_shopItem_key" ON "ShopTheme"("shopItem");

-- CreateIndex
CREATE UNIQUE INDEX "ShopAnimation_shopItem_key" ON "ShopAnimation"("shopItem");
