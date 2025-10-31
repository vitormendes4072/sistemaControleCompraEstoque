import { useState, useEffect } from 'react';
import Dashboard from './components/dashboard/Dashboard';
import ProductList from './components/products/ProductList';
import { api } from './services/api';
import type { ReplenishmentProduct } from './types/replenishment';

type View = 'dashboard' | 'products';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
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

  const getNavButtonClass = (view: View) => 
    `px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
      currentView === view
        ? 'bg-blue-600 text-white shadow-lg transform scale-105'
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
    }`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header com Navegação */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo e Título */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  VEntregaz FBA
                </h1>
                <p className="text-xs text-gray-500">Sistema de Controle de Estoque</p>
              </div>
            </div>

            {/* Navegação */}
            <nav className="flex space-x-2">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={getNavButtonClass('dashboard')}
              >
                <span className="flex items-center space-x-2">
                  <span>📊</span>
                  <span>Dashboard</span>
                </span>
              </button>
              <button
                onClick={() => setCurrentView('products')}
                className={getNavButtonClass('products')}
              >
                <span className="flex items-center space-x-2">
                  <span>📦</span>
                  <span>Produtos</span>
                </span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main>
        {currentView === 'dashboard' && (
          <Dashboard products={products} loading={loading} />
        )}
        {currentView === 'products' && (
          <ProductList />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              © 2024 VEntregaz FBA. Todos os direitos reservados.
            </p>
            <div className="text-sm text-gray-500">
              v1.0.0
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;