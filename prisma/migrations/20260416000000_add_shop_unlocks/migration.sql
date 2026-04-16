ALTER TABLE "ShopItem" ADD COLUMN "cost" INTEGER NOT NULL DEFAULT 0;

CREATE TABLE "StudentShopItem" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "studentId" INTEGER NOT NULL,
  "shopItemId" INTEGER NOT NULL,
  "unlockedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "StudentShopItem_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "StudentShopItem_shopItemId_fkey" FOREIGN KEY ("shopItemId") REFERENCES "ShopItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "StudentShopItem_studentId_shopItemId_key" ON "StudentShopItem"("studentId", "shopItemId");
CREATE INDEX "StudentShopItem_studentId_idx" ON "StudentShopItem"("studentId");
CREATE INDEX "StudentShopItem_shopItemId_idx" ON "StudentShopItem"("shopItemId");
