-- Remove any existing duplicate submissions first so the unique index can be created safely.
DELETE FROM "FormSubmission"
WHERE "id" NOT IN (
  SELECT MIN("id")
  FROM "FormSubmission"
  GROUP BY "student", "form"
);

CREATE UNIQUE INDEX "FormSubmission_student_form_key"
ON "FormSubmission"("student", "form");
