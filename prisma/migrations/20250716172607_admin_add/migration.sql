-- CreateTable
CREATE TABLE "AdminProfile" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "AdminProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminProfile_username_key" ON "AdminProfile"("username");

-- CreateIndex
CREATE UNIQUE INDEX "AdminProfile_email_key" ON "AdminProfile"("email");
