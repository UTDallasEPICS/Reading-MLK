-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_quiz_responses" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "studentProfileId" INTEGER NOT NULL,
    "quizId" INTEGER NOT NULL,
    "submittedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "quiz_responses_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "student_profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "quiz_responses_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "quizzes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_quiz_responses" ("id", "quizId", "studentProfileId") SELECT "id", "quizId", "studentProfileId" FROM "quiz_responses";
DROP TABLE "quiz_responses";
ALTER TABLE "new_quiz_responses" RENAME TO "quiz_responses";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
