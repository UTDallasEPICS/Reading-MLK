ALTER TABLE "Poster" RENAME TO "Coach";
ALTER TABLE "_ClassToPoster" RENAME TO "_ClassToCoach";

DROP INDEX "Poster_tag_idx";
DROP INDEX "Poster_verified_idx";
DROP INDEX "Poster_school_idx";
DROP INDEX "Poster_district_idx";
DROP INDEX "Poster_zipcode_idx";
DROP INDEX "_ClassToPoster_AB_unique";
DROP INDEX "_ClassToPoster_B_index";

CREATE INDEX "Coach_tag_idx" ON "Coach"("tag");
CREATE INDEX "Coach_verified_idx" ON "Coach"("verified");
CREATE INDEX "Coach_school_idx" ON "Coach"("school");
CREATE INDEX "Coach_district_idx" ON "Coach"("district");
CREATE INDEX "Coach_zipcode_idx" ON "Coach"("zipcode");
CREATE UNIQUE INDEX "_ClassToCoach_AB_unique" ON "_ClassToCoach"("A", "B");
CREATE INDEX "_ClassToCoach_B_index" ON "_ClassToCoach"("B");

UPDATE "user" SET "role" = 'coach' WHERE "role" = 'poster';
