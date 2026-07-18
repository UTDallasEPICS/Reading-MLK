/*
  Warnings:

  - You are about to drop the `_ShopItemToStudent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_ShopItemToStudent";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "StudentShopItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "studentId" INTEGER NOT NULL,
    "shopItemId" INTEGER NOT NULL,
    "unlockedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "StudentShopItem_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "StudentShopItem_shopItemId_fkey" FOREIGN KEY ("shopItemId") REFERENCES "ShopItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "StudentShopItem_studentId_idx" ON "StudentShopItem"("studentId");

-- CreateIndex
CREATE INDEX "StudentShopItem_shopItemId_idx" ON "StudentShopItem"("shopItemId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentShopItem_studentId_shopItemId_key" ON "StudentShopItem"("studentId", "shopItemId");
