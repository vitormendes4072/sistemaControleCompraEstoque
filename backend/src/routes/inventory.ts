import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

// Validação do POST /api/inventory
const snapshotSchema = z.object({
  sku: z.string().min(1),
  ts: z.string().datetime().optional(), // se não vier, usamos agora
  fulfillable: z.number().int().nonnegative().default(0),
  reserved: z.number().int().nonnegative().default(0),
  inbound: z.number().int().nonnegative().default(0),
  unsellable: z.number().int().nonnegative().default(0),
  transfer: z.number().int().nonnegative().default(0),
});

/**
 * GET /api/inventory?sku=CANETA-TOUCH-168&from=2025-10-01&to=2025-10-31
 * Lista snapshots por SKU e/ou intervalo de datas (opcionais).
 */
router.get('/', async (req, res) => {
  const { sku, from, to } = req.query as { sku?: string; from?: string; to?: string };

  let productId: string | undefined;
  if (sku) {
    const p = await prisma.product.findUnique({ where: { sku } });
    if (!p) return res.status(404).json({ error: 'SKU não encontrado' });
    productId = p.id;
  }

  const where: any = {};
  if (productId) where.productId = productId;
  if (from || to) {
    where.ts = {};
    if (from) where.ts.gte = new Date(from);
    if (to) where.ts.lte = new Date(to);
  }

  const rows = await prisma.inventorySnapshot.findMany({
    where,
    orderBy: [{ productId: 'asc' }, { ts: 'asc' }],
  });

  res.json(rows);
});

/**
 * POST /api/inventory
 * Registra um snapshot para um SKU (idempotente por (productId, ts))
 * Body JSON: { sku, ts?, fulfillable, reserved, inbound, unsellable, transfer }
 */
router.post('/', async (req, res) => {
  try {
    const parsed = snapshotSchema.parse(req.body);

    // resolve productId pelo sku
    const product = await prisma.product.findUnique({ where: { sku: parsed.sku } });
    if (!product) return res.status(404).json({ error: 'SKU não encontrado' });

    const ts = parsed.ts ? new Date(parsed.ts) : new Date();

    // usa a unique composta productId_ts
    const upserted = await prisma.inventorySnapshot.upsert({
      where: { productId_ts: { productId: product.id, ts } },
      update: {
        fulfillable: parsed.fulfillable,
        reserved: parsed.reserved,
        inbound: parsed.inbound,
        unsellable: parsed.unsellable,
        transfer: parsed.transfer,
      },
      create: {
        productId: product.id,
        ts,
        fulfillable: parsed.fulfillable,
        reserved: parsed.reserved,
        inbound: parsed.inbound,
        unsellable: parsed.unsellable,
        transfer: parsed.transfer,
      },
    });

    return res.status(201).json(upserted);
  } catch (err: any) {
    if (err?.name === 'ZodError') {
      return res.status(400).json({ error: 'Dados inválidos', details: err.flatten() });
    }
    return res.status(500).json({ error: 'Erro ao registrar snapshot' });
  }
});

export default router;
