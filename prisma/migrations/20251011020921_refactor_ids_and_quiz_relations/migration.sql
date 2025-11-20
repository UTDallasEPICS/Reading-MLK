/*
  Warnings:

  - The primary key for the `parent_to_kids` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `student_to_classes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `teacher_to_classes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `id` to the `parent_to_kids` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `student_to_classes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `teacher_to_classes` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_parent_to_kids" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "parent_id" INTEGER NOT NULL,
    "child_id" INTEGER NOT NULL,
    CONSTRAINT "parent_to_kids_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "parent_profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "parent_to_kids_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "student_profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_parent_to_kids" ("child_id", "parent_id") SELECT "child_id", "parent_id" FROM "parent_to_kids";
DROP TABLE "parent_to_kids";
ALTER TABLE "new_parent_to_kids" RENAME TO "parent_to_kids";
CREATE UNIQUE INDEX "parent_to_kids_parent_id_child_id_key" ON "parent_to_kids"("parent_id", "child_id");
CREATE TABLE "new_student_to_classes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "class_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,
    CONSTRAINT "student_to_classes_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "student_to_classes_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student_profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_student_to_classes" ("class_id", "student_id") SELECT "class_id", "student_id" FROM "student_to_classes";
DROP TABLE "student_to_classes";
ALTER TABLE "new_student_to_classes" RENAME TO "student_to_classes";
CREATE UNIQUE INDEX "student_to_classes_class_id_student_id_key" ON "student_to_classes"("class_id", "student_id");
CREATE TABLE "new_teacher_to_classes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "class_id" INTEGER NOT NULL,
    "teacher_id" INTEGER NOT NULL,
    CONSTRAINT "teacher_to_classes_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "teacher_to_classes_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "faculty_profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_teacher_to_classes" ("class_id", "teacher_id") SELECT "class_id", "teacher_id" FROM "teacher_to_classes";
DROP TABLE "teacher_to_classes";
ALTER TABLE "new_teacher_to_classes" RENAME TO "teacher_to_classes";
CREATE UNIQUE INDEX "teacher_to_classes_class_id_teacher_id_key" ON "teacher_to_classes"("class_id", "teacher_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
