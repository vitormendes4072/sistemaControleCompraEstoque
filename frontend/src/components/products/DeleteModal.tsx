import React from 'react';
import type { Product } from '../../types/product';

interface DeleteModalProps {
  isOpen: boolean;
  product: Product | null;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  product,
  onConfirm,
  onCancel,
  loading = false
}) => {
  if (!isOpen || !product) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  const getStockInfo = (product: Product) => {
    if (product.currentStock > 0) {
      return {
        message: `⚠️ Atenção: Este produto possui ${product.currentStock} unidades em estoque.`,
        type: 'warning'
      };
    }
    return {
      message: '✅ Este produto não possui unidades em estoque.',
      type: 'info'
    };
  };

  const stockInfo = getStockInfo(product);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-red-600 text-lg">🗑️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Confirmar Exclusão
            </h3>
          </div>
          <button
            onClick={onCancel}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4">
            <p className="text-gray-700 mb-3">
              Tem certeza que deseja excluir o produto <strong>"{product.name}"</strong>?
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="text-sm text-gray-600 space-y-2">
                <div><strong>SKU:</strong> {product.sku}</div>
                <div><strong>Categoria:</strong> {product.category}</div>
                <div><strong>Fornecedor:</strong> {product.supplier}</div>
                <div><strong>Estoque atual:</strong> {product.currentStock} unidades</div>
              </div>
            </div>

            <div className={`text-sm p-3 rounded-lg mb-4 ${
              stockInfo.type === 'warning' 
                ? 'bg-yellow-50 text-yellow-800 border border-yellow-200' 
                : 'bg-blue-50 text-blue-800 border border-blue-200'
            }`}>
              {stockInfo.message}
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800 font-medium">
                ⚠️ Esta ação não pode ser desfeita. O produto será permanentemente removido do sistema.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Excluindo...
              </div>
            ) : (
              'Sim, Excluir Produto'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;