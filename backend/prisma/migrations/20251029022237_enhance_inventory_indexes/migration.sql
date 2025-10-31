/*
  Warnings:

  - A unique constraint covering the columns `[productId,ts]` on the table `InventorySnapshot` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."InventorySnapshot" DROP CONSTRAINT "InventorySnapshot_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Order" DROP CONSTRAINT "Order_productId_fkey";

-- CreateIndex
CREATE INDEX "InventorySnapshot_productId_ts_idx" ON "InventorySnapshot"("productId", "ts");

-- CreateIndex
CREATE UNIQUE INDEX "InventorySnapshot_productId_ts_key" ON "InventorySnapshot"("productId", "ts");

-- CreateIndex
CREATE INDEX "Order_productId_orderedAt_idx" ON "Order"("productId", "orderedAt");

-- CreateIndex
CREATE INDEX "Product_sku_idx" ON "Product"("sku");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventorySnapshot" ADD CONSTRAINT "InventorySnapshot_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
