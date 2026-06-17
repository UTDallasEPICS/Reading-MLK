-- CreateIndex
CREATE INDEX "Announcement_postDate_idx" ON "Announcement"("postDate");

-- CreateIndex
CREATE INDEX "Announcement_expiryDate_idx" ON "Announcement"("expiryDate");

-- CreateIndex
CREATE INDEX "Form_formGroup_idx" ON "Form"("formGroup");

-- CreateIndex
CREATE INDEX "FormGroup_startDate_idx" ON "FormGroup"("startDate");

-- CreateIndex
CREATE INDEX "FormGroup_endDate_idx" ON "FormGroup"("endDate");

-- CreateIndex
CREATE INDEX "FormSubmission_submissionDate_idx" ON "FormSubmission"("submissionDate");

-- CreateIndex
CREATE INDEX "PendingEmailChange_expiresAt_idx" ON "PendingEmailChange"("expiresAt");

-- CreateIndex
CREATE INDEX "Student_parentUserId_idx" ON "Student"("parentUserId");

-- CreateIndex
CREATE INDEX "SubmissionResponse_formComponent_idx" ON "SubmissionResponse"("formComponent");

-- CreateIndex
CREATE INDEX "SubmissionResponse_submission_idx" ON "SubmissionResponse"("submission");
