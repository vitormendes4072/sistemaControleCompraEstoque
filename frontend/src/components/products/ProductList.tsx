import React, { useState, useEffect } from 'react';
import type { Product, ProductFormData } from '../../types/product';
import { productService } from '../../services/productService';
import ProductTable from './ProductTable';
import ProductForm from './ProductForm';
import DeleteModal from './DeleteModal';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [formLoading, setFormLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    product: Product | null;
    loading: boolean;
  }>({
    isOpen: false,
    product: null,
    loading: false
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      alert('Erro ao carregar produtos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingProduct(undefined);
    setShowForm(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = (product: Product) => {
    setDeleteModal({
      isOpen: true,
      product,
      loading: false
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.product?.id) return;
    
    try {
      setDeleteModal(prev => ({ ...prev, loading: true }));
      await productService.deleteProduct(deleteModal.product.id);
      await loadProducts();
      setDeleteModal({ isOpen: false, product: null, loading: false });
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      alert('Erro ao excluir produto. Tente novamente.');
      setDeleteModal(prev => ({ ...prev, loading: false }));
    }
  };

  const handleCancelDelete = () => {
    setDeleteModal({ isOpen: false, product: null, loading: false });
  };

  const handleSubmit = async (formData: ProductFormData) => {
    try {
      setFormLoading(true);
      
      if (editingProduct?.id) {
        await productService.updateProduct(editingProduct.id, formData);
      } else {
        await productService.createProduct(formData);
      }
      
      setShowForm(false);
      setEditingProduct(undefined);
      await loadProducts(); // Recarrega a lista
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      alert('Erro ao salvar produto. Tente novamente.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(undefined);
  };

  if (loading) {
    return (
      <div className="min-h-64 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-lg text-gray-600">Carregando produtos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestão de Produtos</h1>
              <p className="text-gray-600 mt-2">
                Cadastre, edite e gerencie seus produtos no sistema
              </p>
            </div>
            
            <button
              onClick={handleCreate}
              disabled={showForm}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span className="mr-2">+</span>
              Novo Produto
            </button>
          </div>
        </div>

        {/* Conteúdo */}
        {showForm ? (
          <ProductForm
            product={editingProduct}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={formLoading}
          />
        ) : (
          <ProductTable
            products={products}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {/* Estatísticas */}
        {!showForm && products.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
              <div className="text-2xl font-bold text-blue-600">{products.length}</div>
              <div className="text-sm text-gray-600">Total de Produtos</div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
              <div className="text-2xl font-bold text-green-600">
                {products.filter(p => p.isActive).length}
              </div>
              <div className="text-sm text-gray-600">Produtos Ativos</div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
              <div className="text-2xl font-bold text-red-600">
                {products.filter(p => p.currentStock <= p.minStock).length}
              </div>
              <div className="text-sm text-gray-600">Estoque Crítico</div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
              <div className="text-2xl font-bold text-purple-600">
                {products.filter(p => !p.isActive).length}
              </div>
              <div className="text-sm text-gray-600">Produtos Inativos</div>
            </div>
          </div>
        )}

        {/* Dica inicial quando não há produtos */}
        {!showForm && products.length === 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Bem-vindo ao Sistema de Produtos!
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Você ainda não tem produtos cadastrados. Clique no botão abaixo para adicionar seu primeiro produto ao sistema.
            </p>
            <button
              onClick={handleCreate}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <span className="mr-2">+</span>
              Adicionar Primeiro Produto
            </button>
          </div>
        )}

        {/* Delete Modal */}
        <DeleteModal
          isOpen={deleteModal.isOpen}
          product={deleteModal.product}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          loading={deleteModal.loading}
        />
      </div>
    </div>
  );
};

export default ProductList;