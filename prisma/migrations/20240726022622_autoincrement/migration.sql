-- AlterTable
CREATE SEQUENCE classes_id_seq;
ALTER TABLE "classes" ALTER COLUMN "id" SET DEFAULT nextval('classes_id_seq');
ALTER SEQUENCE classes_id_seq OWNED BY "classes"."id";

-- AlterTable
CREATE SEQUENCE parent_to_kids_id_seq;
ALTER TABLE "parent_to_kids" ALTER COLUMN "id" SET DEFAULT nextval('parent_to_kids_id_seq');
ALTER SEQUENCE parent_to_kids_id_seq OWNED BY "parent_to_kids"."id";

-- AlterTable
CREATE SEQUENCE student_to_classes_id_seq;
ALTER TABLE "student_to_classes" ALTER COLUMN "id" SET DEFAULT nextval('student_to_classes_id_seq');
ALTER SEQUENCE student_to_classes_id_seq OWNED BY "student_to_classes"."id";

-- AlterTable
CREATE SEQUENCE teacher_to_classes_id_seq;
ALTER TABLE "teacher_to_classes" ALTER COLUMN "id" SET DEFAULT nextval('teacher_to_classes_id_seq');
ALTER SEQUENCE teacher_to_classes_id_seq OWNED BY "teacher_to_classes"."id";
