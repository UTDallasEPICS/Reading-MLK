/*
  Warnings:

  - You are about to drop the `Answer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Book` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Video` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AnswerToQuizResponse` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_AnswerToQuizResponse" DROP CONSTRAINT "_AnswerToQuizResponse_A_fkey";

-- DropForeignKey
ALTER TABLE "_AnswerToQuizResponse" DROP CONSTRAINT "_AnswerToQuizResponse_B_fkey";

-- DropTable
DROP TABLE "Answer";

-- DropTable
DROP TABLE "Book";

-- DropTable
DROP TABLE "Video";

-- DropTable
DROP TABLE "_AnswerToQuizResponse";

-- CreateTable
CREATE TABLE "books" (
    "id" SERIAL NOT NULL,
    "book_title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "isbn" TEXT NOT NULL,
    "page_count" INTEGER NOT NULL,

    CONSTRAINT "books_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "video_form" (
    "id" SERIAL NOT NULL,
    "vid_length" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "book_id" INTEGER NOT NULL,

    CONSTRAINT "video_form_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "books_isbn_key" ON "books"("isbn");

-- AddForeignKey
ALTER TABLE "video_form" ADD CONSTRAINT "video_form_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
