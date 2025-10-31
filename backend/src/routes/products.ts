// src/routes/products.ts
import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db';

// schema de validação do corpo (POST/PATCH)
const productBodySchema = z.object({
  sku: z.string().min(1),
  title: z.string().min(1),
  asin: z.string().optional().nullable(),
  ean: z.string().optional().nullable(),
  brand: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  unitsPerCase: z.number().int().positive().default(1),
  caseMultiple: z.number().int().positive().default(1),
  leadtimeCollectBd: z.number().int().nonnegative().default(3),
  leadtimeCheckinBd: z.number().int().nonnegative().default(3),
  cutoffHour: z.string().default('12:00'),
  status: z.enum(['active', 'inactive', 'archived']).default('active'),
});

const router = Router();

/**
 * GET /api/products
 * Lista todos os produtos
 */
router.get('/', async (_req, res) => {
  const items = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  });
  res.json(items);
});

/**
 * GET /api/products/:sku
 * Busca produto pelo SKU
 */
router.get('/:sku', async (req, res) => {
  const { sku } = req.params;
  const item = await prisma.product.findUnique({ where: { sku } });
  if (!item) return res.status(404).json({ error: 'Produto não encontrado' });
  res.json(item);
});

/**
 * POST /api/products
 * Cria produto com validação
 */
router.post('/', async (req, res) => {
  try {
    const data = productBodySchema.parse(req.body);

    const created = await prisma.product.create({ data });
    return res.status(201).json(created);
  } catch (err: any) {
    // erro de validação Zod
    if (err?.name === 'ZodError') {
      return res.status(400).json({ error: 'Dados inválidos', details: err.flatten() });
    }
    // SKU duplicado (unique constraint)
    if (err?.code === 'P2002') {
      return res.status(409).json({ error: 'SKU já cadastrado' });
    }
    return res.status(500).json({ error: 'Erro ao criar produto' });
  }
});

export default router;
