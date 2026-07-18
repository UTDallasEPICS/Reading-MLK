-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Announcement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "postDate" DATETIME NOT NULL,
    "expiryDate" DATETIME,
    "content" JSONB,
    "author" TEXT NOT NULL,
    "class" TEXT NOT NULL DEFAULT 'c8f15743-c8e8-406a-9528-c9ae3b9afab7',
    CONSTRAINT "Announcement_author_fkey" FOREIGN KEY ("author") REFERENCES "Poster" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Announcement_class_fkey" FOREIGN KEY ("class") REFERENCES "Class" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Announcement" ("author", "class", "content", "expiryDate", "id", "postDate") SELECT "author", "class", "content", "expiryDate", "id", "postDate" FROM "Announcement";
DROP TABLE "Announcement";
ALTER TABLE "new_Announcement" RENAME TO "Announcement";
CREATE INDEX "Announcement_postDate_idx" ON "Announcement"("postDate");
CREATE INDEX "Announcement_expiryDate_idx" ON "Announcement"("expiryDate");
CREATE INDEX "Announcement_class_idx" ON "Announcement"("class");
CREATE TABLE "new_FormGroup" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME,
    "class" TEXT NOT NULL DEFAULT 'c8f15743-c8e8-406a-9528-c9ae3b9afab7',
    "raffleWinner" INTEGER,
    CONSTRAINT "FormGroup_class_fkey" FOREIGN KEY ("class") REFERENCES "Class" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "FormGroup_raffleWinner_fkey" FOREIGN KEY ("raffleWinner") REFERENCES "Student" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_FormGroup" ("class", "endDate", "id", "raffleWinner", "startDate") SELECT "class", "endDate", "id", "raffleWinner", "startDate" FROM "FormGroup";
DROP TABLE "FormGroup";
ALTER TABLE "new_FormGroup" RENAME TO "FormGroup";
CREATE INDEX "FormGroup_class_idx" ON "FormGroup"("class");
CREATE INDEX "FormGroup_startDate_idx" ON "FormGroup"("startDate");
CREATE INDEX "FormGroup_endDate_idx" ON "FormGroup"("endDate");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "Class_joinToken_idx" ON "Class"("joinToken");
