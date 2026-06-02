CREATE INDEX "Form_formGroup_idx" ON "Form"("formGroup");
CREATE INDEX "FormSubmission_submissionDate_idx" ON "FormSubmission"("submissionDate");
CREATE INDEX "PendingEmailChange_expiresAt_idx" ON "PendingEmailChange"("expiresAt");
CREATE INDEX "Student_parentUserId_idx" ON "Student"("parentUserId");
