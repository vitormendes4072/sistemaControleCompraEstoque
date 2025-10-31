// src/services/replenishment.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface ReplenishmentResult {
  sku: string;
  productTitle: string;
  currentStock: number;
  dailyDemand: number;
  leadTimeDays: number;
  reorderPoint: number;
  suggestedQuantity: number;
  needsReplenishment: boolean;
  daysOfCoverage: number;
}

export class ReplenishmentService {
  
  async calculateReplenishment(): Promise<ReplenishmentResult[]> {
    console.log('🔍 Calculando replenishment...');
    
    try {
      // Buscar produtos ativos com seus snapshots
      const activeProducts = await prisma.product.findMany({
        where: { 
          status: 'active' 
        },
        include: {
          inventorySnapshots: {
            orderBy: { ts: 'desc' },
            take: 2  // Últimos 2 snapshots para calcular demanda
          }
        }
      });

      console.log(`📦 ${activeProducts.length} produtos ativos encontrados`);

      const results: ReplenishmentResult[] = [];

      for (const product of activeProducts) {
        const calculation = await this.calculateForProduct(product);
        results.push(calculation);
      }

      return results;

    } catch (error) {
      console.error('❌ Erro no cálculo:', error);
      throw error;
    }
  }

  private async calculateForProduct(product: any): Promise<ReplenishmentResult> {
    // SEUS CAMPOS EXATOS do schema
    const sku = product.sku;
    const productTitle = product.title;
    
    // SEUS LEAD TIMES: coleta (3) + checkin (3) = 6 dias
    const leadTimeDays = product.leadtimeCollectBd + product.leadtimeCheckinBd;
    
    // 1. Calcular demanda diária
    const dailyDemand = this.calculateDailyDemand(product.inventorySnapshots);
    
    // 2. Calcular estoque atual (usando SEUS campos)
    const currentStock = this.calculateCurrentStock(product.inventorySnapshots);
    
    // 3. Ponto de reposição = demanda × lead time
    const reorderPoint = dailyDemand * leadTimeDays;
    
    // 4. Verificar se precisa repor
    const needsReplenishment = currentStock <= reorderPoint;
    
    // 5. Dias de cobertura (estoque atual ÷ demanda diária)
    const daysOfCoverage = dailyDemand > 0 ? currentStock / dailyDemand : 0;
    
    // 6. Quantidade sugerida para 1 semana
    let suggestedQuantity = dailyDemand * 7;
    
    // 7. Aplicar SEU caseMultiple
    const caseMultiple = product.caseMultiple || 1;
    suggestedQuantity = Math.ceil(suggestedQuantity / caseMultiple) * caseMultiple;

    return {
      sku,
      productTitle,
      currentStock,
      dailyDemand,
      leadTimeDays,
      reorderPoint,
      suggestedQuantity,
      needsReplenishment,
      daysOfCoverage
    };
  }

  /**
   * Calcula demanda baseada nos SEUS snapshots (campo 'ts')
   */
  private calculateDailyDemand(snapshots: any[]): number {
    if (snapshots.length < 2) return 0;

    const [latest, previous] = snapshots;
    
    // Calcula variação do estoque vendável (fulfillable)
    const stockDecrease = previous.fulfillable - latest.fulfillable;
    
    if (stockDecrease <= 0) return 0;

    // Calcula dias entre os SEUS timestamps (ts)
    const daysBetween = this.getDaysBetween(
      new Date(previous.ts),
      new Date(latest.ts)
    );

    return daysBetween > 0 ? stockDecrease / daysBetween : 0;
  }

  /**
   * Calcula estoque atual usando SEUS campos de inventory
   */
  private calculateCurrentStock(snapshots: any[]): number {
    if (snapshots.length === 0) return 0;

    const latest = snapshots[0];
    
    // Estoque disponível = fulfillable + inbound - reserved
    return latest.fulfillable + latest.inbound - latest.reserved;
  }

  private getDaysBetween(startDate: Date, endDate: Date): number {
    const timeDiff = endDate.getTime() - startDate.getTime();
    const daysDiff = timeDiff / (1000 * 3600 * 24);
    return Math.max(1, Math.floor(daysDiff));
  }
}