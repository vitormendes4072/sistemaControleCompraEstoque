// frontend/src/App.tsx - CÓDIGO CORRIGIDO
import { useState, useEffect } from 'react';
import axios from 'axios';

// Interface para os dados da API
interface ReplenishmentData {
  success: boolean;
  data: Array<{
    sku: string;
    productTitle: string;
    currentStock: number;
    dailyDemand: number;
    leadTimeDays: number;
    reorderPoint: number;
    suggestedQuantity: number;
    needsReplenishment: boolean;
    daysOfCoverage: number;
  }>;
  summary: {
    totalProducts: number;
    needsReplenishment: number;
    averageCoverage: number;
  };
}

function App() {
  const [data, setData] = useState<ReplenishmentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await axios.get('/api/replenishment');
        setData(response.data);
      } catch (error) {
        console.error('Erro:', error);
        setData({ 
          success: false,
          data: [],
          summary: {
            totalProducts: 0,
            needsReplenishment: 0,
            averageCoverage: 0
          }
        });
      } finally {
        setLoading(false);
      }
    };

    testConnection();
  }, []);

  if (loading) return <div>Testando conexão com backend...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>🚀 Teste de Conexão - VEntregaz FBA</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default App;