// src/routes/replenishment.ts (VERSÃO CORRIGIDA)
import { Router, Request, Response } from 'express';
import { ReplenishmentService } from '../services/replenishment';

const router = Router();
const replenishmentService = new ReplenishmentService();

router.get('/', async (req: Request, res: Response) => {
  console.log('📬 Recebida requisição para replenishment');
  
  try {
    const replenishmentData = await replenishmentService.calculateReplenishment();
    
    res.json({
      success: true,
      data: replenishmentData,
      summary: {
        totalProducts: replenishmentData.length,
        needsReplenishment: replenishmentData.filter(p => p.needsReplenishment).length,
        averageCoverage: replenishmentData.reduce((sum, p) => sum + p.daysOfCoverage, 0) / replenishmentData.length
      }
    });

  } catch (error) {
    console.error('💥 ERRO COMPLETO no replenishment:', error);
    
    // CORREÇÃO: Tratar error como unknown
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: errorMessage,
      stack: errorStack, // Agora seguro para TypeScript
      details: String(error)
    });
  }
});

export default router;