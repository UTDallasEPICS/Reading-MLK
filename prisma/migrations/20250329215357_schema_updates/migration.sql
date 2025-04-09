/*
  Warnings:

  - You are about to drop the `Question` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Quiz` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QuizResponse` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_quiz_id_fkey";

-- DropTable
DROP TABLE "Question";

-- DropTable
DROP TABLE "Quiz";

-- DropTable
DROP TABLE "QuizResponse";

-- CreateTable
CREATE TABLE "quizzes" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "quizzes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" SERIAL NOT NULL,
    "quiz_id" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "feedback" TEXT NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "multiple_choice_question" (
    "id" SERIAL NOT NULL,
    "question_id" INTEGER NOT NULL,

    CONSTRAINT "multiple_choice_question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "multiple_choice_options" (
    "id" SERIAL NOT NULL,
    "questionId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,

    CONSTRAINT "multiple_choice_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "free_response_question" (
    "id" SERIAL NOT NULL,
    "question_id" INTEGER NOT NULL,

    CONSTRAINT "free_response_question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_responses" (
    "id" SERIAL NOT NULL,
    "studentProfileId" INTEGER NOT NULL,
    "quizId" INTEGER NOT NULL,

    CONSTRAINT "quiz_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Answer" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "multiple_choice_answers" (
    "id" SERIAL NOT NULL,
    "quizResponseId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "selectedOption" TEXT NOT NULL,

    CONSTRAINT "multiple_choice_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "free_response_answers" (
    "id" SERIAL NOT NULL,
    "quizResponseId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "responseText" TEXT NOT NULL,

    CONSTRAINT "free_response_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AnswerToQuizResponse" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "multiple_choice_question_question_id_key" ON "multiple_choice_question"("question_id");

-- CreateIndex
CREATE UNIQUE INDEX "free_response_question_question_id_key" ON "free_response_question"("question_id");

-- CreateIndex
CREATE UNIQUE INDEX "_AnswerToQuizResponse_AB_unique" ON "_AnswerToQuizResponse"("A", "B");

-- CreateIndex
CREATE INDEX "_AnswerToQuizResponse_B_index" ON "_AnswerToQuizResponse"("B");

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quizzes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "multiple_choice_question" ADD CONSTRAINT "multiple_choice_question_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "multiple_choice_options" ADD CONSTRAINT "multiple_choice_options_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "multiple_choice_question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "free_response_question" ADD CONSTRAINT "free_response_question_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_responses" ADD CONSTRAINT "quiz_responses_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "student_profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_responses" ADD CONSTRAINT "quiz_responses_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "multiple_choice_answers" ADD CONSTRAINT "multiple_choice_answers_quizResponseId_fkey" FOREIGN KEY ("quizResponseId") REFERENCES "quiz_responses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "multiple_choice_answers" ADD CONSTRAINT "multiple_choice_answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "free_response_answers" ADD CONSTRAINT "free_response_answers_quizResponseId_fkey" FOREIGN KEY ("quizResponseId") REFERENCES "quiz_responses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "free_response_answers" ADD CONSTRAINT "free_response_answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnswerToQuizResponse" ADD CONSTRAINT "_AnswerToQuizResponse_A_fkey" FOREIGN KEY ("A") REFERENCES "Answer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnswerToQuizResponse" ADD CONSTRAINT "_AnswerToQuizResponse_B_fkey" FOREIGN KEY ("B") REFERENCES "quiz_responses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
