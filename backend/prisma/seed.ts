// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // ---------- Produtos ----------
  const p1 = await prisma.product.upsert({
    where: { sku: 'DORMIO-PILLOW-MEMO-STD' },
    update: {},
    create: {
      sku: 'DORMIO-PILLOW-MEMO-STD',
      asin: 'B0ABCDE123',
      ean: '7891234567890',
      title: 'Travesseiro DORMIO Viscoelástico Padrão',
      brand: 'DORMIO',
      category: 'Cama e Banho',
      unitsPerCase: 4,
      caseMultiple: 4,
      leadtimeCollectBd: 3,
      leadtimeCheckinBd: 3,
    },
  });

  const p2 = await prisma.product.upsert({
    where: { sku: 'CANETA-TOUCH-168' },
    update: {},
    create: {
      sku: 'CANETA-TOUCH-168',
      title: 'Kit Canetas Touch 168 cores',
      brand: 'VENTREGAZ',
      category: 'Papelaria',
      unitsPerCase: 12,
      caseMultiple: 12,
      leadtimeCollectBd: 3,
      leadtimeCheckinBd: 3,
    },
  });

  const p3 = await prisma.product.upsert({
    where: { sku: 'ECOFLOW-RIVER3-127V' },
    update: {},
    create: {
      sku: 'ECOFLOW-RIVER3-127V',
      asin: 'B0RIVER3BR',
      ean: '6921815627001',
      title: 'EcoFlow River 3 (127V)',
      brand: 'EcoFlow',
      category: 'Energia',
      unitsPerCase: 1,
      caseMultiple: 1,
      leadtimeCollectBd: 3,
      leadtimeCheckinBd: 3,
    },
  });

  console.log('Seed (products) ok:', p1.sku, p2.sku, p3.sku);

  // ---------- InventorySnapshot ----------
  const now = new Date();
  const d1 = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const bySku: Record<
    string,
    {
      now: { fulfillable: number; reserved: number; inbound: number; unsellable: number; transfer: number };
      d1:  { fulfillable: number; reserved: number; inbound: number; unsellable: number; transfer: number };
    }
  > = {
    'DORMIO-PILLOW-MEMO-STD': {
      now: { fulfillable: 18, reserved: 2, inbound: 24, unsellable: 0, transfer: 0 },
      d1:  { fulfillable: 22, reserved: 1, inbound: 24, unsellable: 0, transfer: 0 },
    },
    'CANETA-TOUCH-168': {
      now: { fulfillable: 40, reserved: 5, inbound: 48, unsellable: 1, transfer: 0 },
      d1:  { fulfillable: 44, reserved: 3, inbound: 48, unsellable: 0, transfer: 0 },
    },
    'ECOFLOW-RIVER3-127V': {
      now: { fulfillable: 3, reserved: 0, inbound: 2, unsellable: 0, transfer: 0 },
      d1:  { fulfillable: 4, reserved: 0, inbound: 2, unsellable: 0, transfer: 0 },
    },
  };

  const products = await prisma.product.findMany({ select: { id: true, sku: true } });

  for (const p of products) {
    const cfg = bySku[p.sku];
    if (!cfg) continue;

    // D-1
    {
      const existing = await prisma.inventorySnapshot.findUnique({
        where: { productId_ts: { productId: p.id, ts: d1 } },
      });

      if (existing) {
        await prisma.inventorySnapshot.update({
          where: { id: existing.id },
          data: cfg.d1,
        });
      } else {
        await prisma.inventorySnapshot.create({
          data: { productId: p.id, ts: d1, ...cfg.d1 },
        });
      }
    }

    // Agora
    {
      const existing = await prisma.inventorySnapshot.findUnique({
        where: { productId_ts: { productId: p.id, ts: now } },
      });

      if (existing) {
        await prisma.inventorySnapshot.update({
          where: { id: existing.id },
          data: cfg.now,
        });
      } else {
        await prisma.inventorySnapshot.create({
          data: { productId: p.id, ts: now, ...cfg.now },
        });
      }
    }
  }

  console.log('Seed (inventory snapshots) ok para:', products.map((x) => x.sku).join(', '));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
