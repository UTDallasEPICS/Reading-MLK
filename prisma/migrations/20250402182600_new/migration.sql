-- AlterTable
ALTER TABLE "_AnswerToQuizResponse" ADD CONSTRAINT "_AnswerToQuizResponse_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_AnswerToQuizResponse_AB_unique";
