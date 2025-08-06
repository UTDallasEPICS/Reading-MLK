-- AlterTable
ALTER TABLE "quizzes" ADD COLUMN     "name" TEXT NOT NULL DEFAULT 'Untitled Quiz';

-- CreateTable
CREATE TABLE "assignment_to_classes" (
    "assignment_id" INTEGER NOT NULL,
    "class_id" INTEGER NOT NULL,

    CONSTRAINT "assignment_to_classes_pkey" PRIMARY KEY ("assignment_id","class_id")
);

-- CreateTable
CREATE TABLE "assignment_to_students" (
    "assignment_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,

    CONSTRAINT "assignment_to_students_pkey" PRIMARY KEY ("assignment_id","student_id")
);

-- AddForeignKey
ALTER TABLE "assignment_to_classes" ADD CONSTRAINT "assignment_to_classes_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "quizzes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignment_to_classes" ADD CONSTRAINT "assignment_to_classes_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignment_to_students" ADD CONSTRAINT "assignment_to_students_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "quizzes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignment_to_students" ADD CONSTRAINT "assignment_to_students_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student_profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
