import React from 'react';
import type { ReplenishmentProduct } from '../types/replenishment';

interface DashboardProps {
  products: ReplenishmentProduct[];
  loading: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ products, loading }) => {
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Carregando dados do replenishment...</p>
        </div>
      </div>
    );
  }

  const criticalProducts = products.filter(p => p.needsReplenishment);
  const stableProducts = products.filter(p => !p.needsReplenishment);
  
  const averageCoverage = products.length > 0 
    ? products.reduce((sum, p) => sum + p.daysOfCoverage, 0) / products.length 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 pt-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <span className="text-3xl">📦</span>
          </div>
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            Dashboard de Replenishment
          </h1>
          <p className="text-xl text-gray-500 font-medium">VEntregaz FBA - Controle de Estoque Inteligente</p>
        </div>

        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="group bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl shadow-xl p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl mb-4 group-hover:bg-white/30 transition-colors">
                <span className="text-4xl">📊</span>
              </div>
              <h3 className="text-sm font-bold text-blue-100 uppercase tracking-wide mb-2">Total de Produtos</h3>
              <p className="text-5xl font-black text-white">{products.length}</p>
            </div>
          </div>

          <div className="group bg-gradient-to-br from-red-500 to-red-600 rounded-3xl shadow-xl p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl mb-4 group-hover:bg-white/30 transition-colors">
                <span className="text-4xl">🚨</span>
              </div>
              <h3 className="text-sm font-bold text-red-100 uppercase tracking-wide mb-2">Precisam Repor</h3>
              <p className="text-5xl font-black text-white">{criticalProducts.length}</p>
            </div>
          </div>

          <div className="group bg-gradient-to-br from-green-500 to-green-600 rounded-3xl shadow-xl p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl mb-4 group-hover:bg-white/30 transition-colors">
                <span className="text-4xl">✅</span>
              </div>
              <h3 className="text-sm font-bold text-green-100 uppercase tracking-wide mb-2">Estáveis</h3>
              <p className="text-5xl font-black text-white">{stableProducts.length}</p>
            </div>
          </div>

          <div className="group bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl shadow-xl p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl mb-4 group-hover:bg-white/30 transition-colors">
                <span className="text-4xl">📅</span>
              </div>
              <h3 className="text-sm font-bold text-purple-100 uppercase tracking-wide mb-2">Cobertura Média</h3>
              <p className="text-5xl font-black text-white">{averageCoverage.toFixed(1)}<span className="text-2xl ml-1">dias</span></p>
            </div>
          </div>
        </div>

        {/* Seção de Produtos Críticos */}
        {criticalProducts.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center mb-8">
              <div className="bg-gradient-to-br from-red-500 to-pink-500 p-3 rounded-2xl mr-4 shadow-lg">
                <span className="text-3xl">🚨</span>
              </div>
              <div>
                <h2 className="text-3xl font-black text-gray-800">Produtos que Precisam de Reposição Urgente</h2>
                <p className="text-gray-500 mt-1">Atenção imediata necessária</p>
              </div>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {criticalProducts.map(product => (
                <div key={product.sku} className="group bg-white rounded-3xl shadow-xl border-2 border-red-200 hover:border-red-400 hover:shadow-2xl transition-all duration-300 overflow-hidden">
                  <div className="bg-gradient-to-r from-red-500 to-pink-500 p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-xl text-white leading-tight flex-1 mr-2">{product.productTitle}</h3>
                      <span className="bg-white text-red-600 text-xs font-black px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap">URGENTE</span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <p className="text-sm text-gray-500 mb-6 font-mono bg-gray-50 px-3 py-2 rounded-lg inline-block">SKU: {product.sku}</p>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-red-50 rounded-xl">
                        <span className="text-sm font-semibold text-gray-600">Estoque Atual:</span>
                        <span className="font-black text-xl text-red-600">{product.currentStock} <span className="text-sm">un</span></span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-orange-50 rounded-xl">
                        <span className="text-sm font-semibold text-gray-600">Dias Restantes:</span>
                        <span className="font-black text-xl text-orange-600">{Math.floor(product.daysOfCoverage)} <span className="text-sm">dias</span></span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
                        <span className="text-sm font-semibold text-gray-600">Reposição Sugerida:</span>
                        <span className="font-black text-xl text-blue-600">{product.suggestedQuantity} <span className="text-sm">un</span></span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                        <span className="text-sm font-semibold text-gray-600">Demanda Diária:</span>
                        <span className="font-black text-xl text-gray-700">{product.dailyDemand}<span className="text-sm">/dia</span></span>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-4 shadow-lg">
                        <p className="text-sm font-bold text-white text-center flex items-center justify-center">
                          <span className="text-xl mr-2">⚠️</span>
                          Estoque crítico! Repor imediatamente
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Seção de Produtos Estáveis */}
        <div>
          <div className="flex items-center mb-8">
            <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-3 rounded-2xl mr-4 shadow-lg">
              <span className="text-3xl">✅</span>
            </div>
            <div>
              <h2 className="text-3xl font-black text-gray-800">Produtos com Estoque Estável</h2>
              <p className="text-gray-500 mt-1">Situação controlada</p>
            </div>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {stableProducts.map(product => (
              <div key={product.sku} className="group bg-white rounded-3xl shadow-xl border-2 border-green-200 hover:border-green-400 hover:shadow-2xl transition-all duration-300 overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-xl text-white leading-tight flex-1 mr-2">{product.productTitle}</h3>
                    <span className="bg-white text-green-600 text-xs font-black px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap">ESTÁVEL</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <p className="text-sm text-gray-500 mb-6 font-mono bg-gray-50 px-3 py-2 rounded-lg inline-block">SKU: {product.sku}</p>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-xl">
                      <span className="text-sm font-semibold text-gray-600">Estoque Atual:</span>
                      <span className="font-black text-xl text-green-600">{product.currentStock} <span className="text-sm">un</span></span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
                      <span className="text-sm font-semibold text-gray-600">Dias de Cobertura:</span>
                      <span className="font-black text-xl text-blue-600">{Math.floor(product.daysOfCoverage)} <span className="text-sm">dias</span></span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-xl">
                      <span className="text-sm font-semibold text-gray-600">Ponto de Reposição:</span>
                      <span className="font-black text-xl text-orange-600">{product.reorderPoint} <span className="text-sm">un</span></span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                      <span className="text-sm font-semibold text-gray-600">Demanda Diária:</span>
                      <span className="font-black text-xl text-gray-700">{product.dailyDemand}<span className="text-sm">/dia</span></span>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-4 shadow-lg">
                      <p className="text-sm font-bold text-white text-center flex items-center justify-center">
                        <span className="text-xl mr-2">✅</span>
                        Estoque dentro dos parâmetros seguros
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>Última atualização: {new Date().toLocaleString('pt-BR')}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;