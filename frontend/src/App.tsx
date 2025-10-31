import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import { api } from './services/api';
import type { ReplenishmentProduct } from './types/replenishment';

function App() {
  const [products, setProducts] = useState<ReplenishmentProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReplenishmentData = async () => {
      try {
        const response = await api.getReplenishment();
        if (response.success) {
          setProducts(response.data);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        // Fallback com dados mockados
        setProducts([
          {
            sku: "DORMIO-PILLOW-MEMO-STD",
            productTitle: "Travesseiro DORMIO Viscoelástico Padrão",
            currentStock: 40,
            dailyDemand: 4,
            leadTimeDays: 6,
            reorderPoint: 24,
            suggestedQuantity: 28,
            needsReplenishment: false,
            daysOfCoverage: 10
          },
          {
            sku: "ECOFLOW-RIVER-127V",
            productTitle: "EcoFlow River 3 (127V)",
            currentStock: 5,
            dailyDemand: 1,
            leadTimeDays: 6,
            reorderPoint: 6,
            suggestedQuantity: 7,
            needsReplenishment: true,
            daysOfCoverage: 5
          },
          {
            sku: "CANETA-TOUCH-168",
            productTitle: "Kit Canetas Touch 168 cores",
            currentStock: 83,
            dailyDemand: 4,
            leadTimeDays: 6,
            reorderPoint: 24,
            suggestedQuantity: 36,
            needsReplenishment: false,
            daysOfCoverage: 20.75
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadReplenishmentData();
  }, []);

  return <Dashboard products={products} loading={loading} />;
}

export default App;