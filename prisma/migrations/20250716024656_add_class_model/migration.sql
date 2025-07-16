-- AlterTable
ALTER TABLE "users" ALTER COLUMN "gender" DROP DEFAULT;

-- CreateTable
CREATE TABLE "teacher_to_class" (
    "teacher_id" INTEGER NOT NULL,
    "class_id" INTEGER NOT NULL,

    CONSTRAINT "teacher_to_class_pkey" PRIMARY KEY ("teacher_id","class_id")
);

-- CreateTable
CREATE TABLE "student_to_class" (
    "student_id" INTEGER NOT NULL,
    "class_id" INTEGER NOT NULL,

    CONSTRAINT "student_to_class_pkey" PRIMARY KEY ("student_id","class_id")
);

-- CreateTable
CREATE TABLE "classes" (
    "id" SERIAL NOT NULL,
    "class_name" TEXT NOT NULL,
    "class_year" INTEGER NOT NULL,
    "school_name" TEXT NOT NULL,
    "school_dist" TEXT NOT NULL,

    CONSTRAINT "classes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "teacher_to_class" ADD CONSTRAINT "teacher_to_class_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teacher_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_to_class" ADD CONSTRAINT "teacher_to_class_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_to_class" ADD CONSTRAINT "student_to_class_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_to_class" ADD CONSTRAINT "student_to_class_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
