// frontend/src/components/Dashboard.tsx
import React from 'react';
import type { ReplenishmentProduct } from '../types/replenishment';

interface DashboardProps {
  products: ReplenishmentProduct[];
  loading: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ products, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Carregando dados do replenishment...</div>
      </div>
    );
  }

  const criticalProducts = products.filter(p => p.needsReplenishment);
  const stableProducts = products.filter(p => !p.needsReplenishment);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        📦 Dashboard de Replenishment - VEntregaz FBA
      </h1>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold text-gray-700">Total de Produtos</h3>
          <p className="text-3xl font-bold text-blue-600">{products.length}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
          <h3 className="text-lg font-semibold text-gray-700">Precisam Repor</h3>
          <p className="text-3xl font-bold text-red-600">{criticalProducts.length}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h3 className="text-lg font-semibold text-gray-700">Estáveis</h3>
          <p className="text-3xl font-bold text-green-600">{stableProducts.length}</p>
        </div>
      </div>

      {/* Produtos Críticos */}
      {criticalProducts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4">🚨 Produtos que Precisam de Reposição</h2>
          <div className="grid gap-4">
            {criticalProducts.map(product => (
              <div key={product.sku} className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-lg">{product.productTitle}</h3>
                <p className="text-gray-600">SKU: {product.sku}</p>
                <div className="flex gap-4 mt-2">
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                    Estoque: {product.currentStock}
                  </span>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                    Dias Restantes: {Math.floor(product.daysOfCoverage)}
                  </span>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                    Sugerido: {product.suggestedQuantity} unidades
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Produtos Estáveis */}
      <div>
        <h2 className="text-2xl font-bold text-green-600 mb-4">✅ Produtos Estáveis</h2>
        <div className="grid gap-4">
          {stableProducts.map(product => (
            <div key={product.sku} className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-lg">{product.productTitle}</h3>
              <p className="text-gray-600">SKU: {product.sku}</p>
              <div className="flex gap-4 mt-2">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                  Estoque: {product.currentStock}
                </span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                  Dias de Cobertura: {Math.floor(product.daysOfCoverage)}
                </span>
                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                  Demanda: {product.dailyDemand.toFixed(1)}/dia
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;