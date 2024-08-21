/*
  Warnings:

  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
CREATE SEQUENCE admin_profile_id_seq;
ALTER TABLE "admin_profile" ALTER COLUMN "id" SET DEFAULT nextval('admin_profile_id_seq');
ALTER SEQUENCE admin_profile_id_seq OWNED BY "admin_profile"."id";

-- AlterTable
CREATE SEQUENCE faculty_profile_id_seq;
ALTER TABLE "faculty_profile" ALTER COLUMN "id" SET DEFAULT nextval('faculty_profile_id_seq');
ALTER SEQUENCE faculty_profile_id_seq OWNED BY "faculty_profile"."id";

-- AlterTable
CREATE SEQUENCE parent_profile_id_seq;
ALTER TABLE "parent_profile" ALTER COLUMN "id" SET DEFAULT nextval('parent_profile_id_seq'),
ALTER COLUMN "yearly_income" SET DATA TYPE TEXT,
ALTER COLUMN "password" SET DATA TYPE TEXT;
ALTER SEQUENCE parent_profile_id_seq OWNED BY "parent_profile"."id";

-- AlterTable
CREATE SEQUENCE student_profile_id_seq;
ALTER TABLE "student_profile" ALTER COLUMN "id" SET DEFAULT nextval('student_profile_id_seq');
ALTER SEQUENCE student_profile_id_seq OWNED BY "student_profile"."id";

-- DropTable
DROP TABLE "user";

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "user_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "client_cuid" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_user_name_key" ON "users"("user_name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
