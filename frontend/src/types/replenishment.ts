// frontend/src/types/replenishment.ts
export interface ReplenishmentProduct {
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

export interface ReplenishmentResponse {
  success: boolean;
  data: ReplenishmentProduct[];
  summary: {
    totalProducts: number;
    needsReplenishment: number;
    averageCoverage: number;
  };
}