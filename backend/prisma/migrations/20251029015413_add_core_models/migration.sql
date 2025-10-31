-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('active', 'inactive', 'archived');

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "asin" VARCHAR(16),
    "ean" VARCHAR(14),
    "title" TEXT NOT NULL,
    "brand" TEXT,
    "category" TEXT,
    "status" "ProductStatus" NOT NULL DEFAULT 'active',
    "unitsPerCase" INTEGER NOT NULL DEFAULT 1,
    "caseMultiple" INTEGER NOT NULL DEFAULT 1,
    "leadtimeCollectBd" INTEGER NOT NULL DEFAULT 3,
    "leadtimeCheckinBd" INTEGER NOT NULL DEFAULT 3,
    "cutoffHour" TEXT NOT NULL DEFAULT '12:00',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "orderedAt" TIMESTAMP(3) NOT NULL,
    "qty" INTEGER NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventorySnapshot" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "ts" TIMESTAMP(3) NOT NULL,
    "fulfillable" INTEGER NOT NULL DEFAULT 0,
    "reserved" INTEGER NOT NULL DEFAULT 0,
    "inbound" INTEGER NOT NULL DEFAULT 0,
    "unsellable" INTEGER NOT NULL DEFAULT 0,
    "transfer" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "InventorySnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventorySnapshot" ADD CONSTRAINT "InventorySnapshot_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
