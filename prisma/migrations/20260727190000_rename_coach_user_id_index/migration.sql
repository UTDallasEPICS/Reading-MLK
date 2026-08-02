DROP INDEX "Poster_userId_key";

CREATE UNIQUE INDEX "Coach_userId_key" ON "Coach"("userId");
