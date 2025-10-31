import React, { useState } from 'react';
import type { Product } from '../../types/product';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ products, onEdit, onDelete }) => {
  const [sortField, setSortField] = useState<keyof Product>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');

  // Função para ordenar produtos
  const sortedProducts = [...products].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue === undefined || bValue === undefined) return 0;
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  // ✅ CORREÇÃO DEFINITIVA: Função para filtrar produtos com proteção total
  const filteredProducts = sortedProducts.filter(product => {
    const searchLower = searchTerm.toLowerCase();
    
    return (
      (product.name?.toLowerCase() || '').includes(searchLower) ||
      (product.sku?.toLowerCase() || '').includes(searchLower) ||
      (product.category?.toLowerCase() || '').includes(searchLower) ||
      (product.supplier?.toLowerCase() || '').includes(searchLower)
    );
  });

  const handleSort = (field: keyof Product) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: keyof Product) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStockStatus = (product: Product) => {
    if (product.currentStock <= product.minStock) {
      return { text: 'Crítico', color: 'bg-red-100 text-red-800' };
    } else if (product.currentStock <= product.minStock * 1.5) {
      return { text: 'Atenção', color: 'bg-yellow-100 text-yellow-800' };
    } else {
      return { text: 'Normal', color: 'bg-green-100 text-green-800' };
    }
  };

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">📦</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Nenhum produto cadastrado
        </h3>
        <p className="text-gray-500">
          Comece adicionando seu primeiro produto ao sistema.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header com busca */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Produtos Cadastrados ({filteredProducts.length})
          </h2>
          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Buscar por nome, SKU, categoria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('sku')}
              >
                <div className="flex items-center space-x-1">
                  <span>SKU</span>
                  <span className="text-xs">{getSortIcon('sku')}</span>
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center space-x-1">
                  <span>Produto</span>
                  <span className="text-xs">{getSortIcon('name')}</span>
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('category')}
              >
                <div className="flex items-center space-x-1">
                  <span>Categoria</span>
                  <span className="text-xs">{getSortIcon('category')}</span>
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('currentStock')}
              >
                <div className="flex items-center space-x-1">
                  <span>Estoque</span>
                  <span className="text-xs">{getSortIcon('currentStock')}</span>
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('sellingPrice')}
              >
                <div className="flex items-center space-x-1">
                  <span>Preço</span>
                  <span className="text-xs">{getSortIcon('sellingPrice')}</span>
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('isActive')}
              >
                <div className="flex items-center space-x-1">
                  <span>Status</span>
                  <span className="text-xs">{getSortIcon('isActive')}</span>
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.map((product) => {
              const stockStatus = getStockStatus(product);
              return (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 font-mono">
                      {product.sku || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {product.name || '-'}
                    </div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {product.description || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.category || '-'}</div>
                    <div className="text-sm text-gray-500">{product.supplier || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {product.currentStock} un
                    </div>
                    <div className="text-xs">
                      <span className={`inline-flex px-2 py-1 rounded-full ${stockStatus.color}`}>
                        {stockStatus.text}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Min: {product.minStock} / Max: {product.maxStock}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(product.sellingPrice)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Custo: {formatCurrency(product.costPrice)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      product.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onEdit(product)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="Editar produto"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => onDelete(product)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Excluir produto"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Empty state quando não há resultados na busca */}
      {filteredProducts.length === 0 && products.length > 0 && (
        <div className="p-8 text-center">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Nenhum produto encontrado
          </h3>
          <p className="text-gray-500">
            Tente ajustar os termos da busca.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductTable;