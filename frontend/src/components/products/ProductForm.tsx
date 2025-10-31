import React, { useState, useEffect } from 'react';
import type { Product, ProductFormData } from '../../types/product';

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState<ProductFormData>({
    sku: '',
    name: '',
    description: '',
    category: '',
    supplier: '',
    currentStock: 0,
    minStock: 0,
    maxStock: 0,
    costPrice: 0,
    sellingPrice: 0,
    price: 0,
    inStock: true,
    leadTimeDays: 0,
    dailyDemand: 0,
    isActive: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setFormData({
        sku: product.sku || '',
        name: product.name || '',
        description: product.description || '',
        category: product.category || '',
        supplier: product.supplier || '',
        currentStock: product.currentStock || 0,
        minStock: product.minStock || 0,
        maxStock: product.maxStock || 0,
        costPrice: product.costPrice || 0,
        sellingPrice: product.sellingPrice || 0,
        price: product.price || 0,
        inStock: product.inStock ?? true,
        leadTimeDays: product.leadTimeDays || 0,
        dailyDemand: product.dailyDemand || 0,
        isActive: product.isActive ?? true
      });
    }
  }, [product]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.sku.trim()) newErrors.sku = 'SKU é obrigatório';
    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.category?.trim()) newErrors.category = 'Categoria é obrigatória';
    if (!formData.supplier?.trim()) newErrors.supplier = 'Fornecedor é obrigatório';
    if (formData.minStock < 0) newErrors.minStock = 'Estoque mínimo não pode ser negativo';
    if (formData.maxStock < 0) newErrors.maxStock = 'Estoque máximo não pode ser negativo';
    if (formData.maxStock <= formData.minStock) newErrors.maxStock = 'Estoque máximo deve ser maior que o mínimo';
    if (formData.costPrice < 0) newErrors.costPrice = 'Preço de custo não pode ser negativo';
    if (formData.sellingPrice < 0) newErrors.sellingPrice = 'Preço de venda não pode ser negativo';
    if (formData.leadTimeDays < 0) newErrors.leadTimeDays = 'Lead time não pode ser negativo';
    if (formData.dailyDemand < 0) newErrors.dailyDemand = 'Demanda diária não pode ser negativa';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    const processedValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
                          type === 'number' ? parseFloat(value) || 0 : 
                          value;

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    // Limpa erro do campo quando usuário começa a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const inputClassName = (fieldName: string) => 
    `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      errors[fieldName] ? 'border-red-500' : 'border-gray-300'
    }`;

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {product ? 'Editar Produto' : 'Novo Produto'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* SKU */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SKU *
            </label>
            <input
              type="text"
              name="sku"
              value={formData.sku || ''}
              onChange={handleChange}
              required
              className={inputClassName('sku')}
              placeholder="Ex: PROD-001"
            />
            {errors.sku && <p className="text-red-500 text-sm mt-1">{errors.sku}</p>}
          </div>

          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Produto *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              required
              className={inputClassName('name')}
              placeholder="Nome completo do produto"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria *
            </label>
            <input
              type="text"
              name="category"
              value={formData.category || ''}
              onChange={handleChange}
              required
              className={inputClassName('category')}
              placeholder="Ex: Eletrônicos, Cama e Banho"
            />
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>

          {/* Fornecedor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fornecedor *
            </label>
            <input
              type="text"
              name="supplier"
              value={formData.supplier || ''}
              onChange={handleChange}
              required
              className={inputClassName('supplier')}
              placeholder="Nome do fornecedor"
            />
            {errors.supplier && <p className="text-red-500 text-sm mt-1">{errors.supplier}</p>}
          </div>

          {/* Estoque Atual */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estoque Atual
            </label>
            <input
              type="number"
              name="currentStock"
              value={formData.currentStock || 0}
              onChange={handleChange}
              min="0"
              className={inputClassName('currentStock')}
            />
          </div>

          {/* Estoque Mínimo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estoque Mínimo *
            </label>
            <input
              type="number"
              name="minStock"
              value={formData.minStock || 0}
              onChange={handleChange}
              required
              min="0"
              className={inputClassName('minStock')}
            />
            {errors.minStock && <p className="text-red-500 text-sm mt-1">{errors.minStock}</p>}
          </div>

          {/* Estoque Máximo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estoque Máximo *
            </label>
            <input
              type="number"
              name="maxStock"
              value={formData.maxStock || 0}
              onChange={handleChange}
              required
              min="0"
              className={inputClassName('maxStock')}
            />
            {errors.maxStock && <p className="text-red-500 text-sm mt-1">{errors.maxStock}</p>}
          </div>

          {/* Lead Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lead Time (dias) *
            </label>
            <input
              type="number"
              name="leadTimeDays"
              value={formData.leadTimeDays || 0}
              onChange={handleChange}
              required
              min="0"
              className={inputClassName('leadTimeDays')}
            />
            {errors.leadTimeDays && <p className="text-red-500 text-sm mt-1">{errors.leadTimeDays}</p>}
          </div>

          {/* Demanda Diária */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Demanda Diária *
            </label>
            <input
              type="number"
              name="dailyDemand"
              value={formData.dailyDemand || 0}
              onChange={handleChange}
              required
              min="0"
              step="0.1"
              className={inputClassName('dailyDemand')}
            />
            {errors.dailyDemand && <p className="text-red-500 text-sm mt-1">{errors.dailyDemand}</p>}
          </div>

          {/* Preço de Custo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preço de Custo *
            </label>
            <input
              type="number"
              name="costPrice"
              value={formData.costPrice || 0}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className={inputClassName('costPrice')}
            />
            {errors.costPrice && <p className="text-red-500 text-sm mt-1">{errors.costPrice}</p>}
          </div>

          {/* Preço de Venda */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preço de Venda *
            </label>
            <input
              type="number"
              name="sellingPrice"
              value={formData.sellingPrice || 0}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className={inputClassName('sellingPrice')}
            />
            {errors.sellingPrice && <p className="text-red-500 text-sm mt-1">{errors.sellingPrice}</p>}
          </div>

          {/* Preço */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preço *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price || 0}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className={inputClassName('price')}
            />
          </div>

          {/* In Stock */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="inStock"
              checked={formData.inStock}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Em estoque
            </label>
          </div>
        </div>

        {/* Descrição */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descrição
          </label>
          <textarea
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Descrição detalhada do produto"
          />
        </div>

        {/* Status Ativo */}
        <div className="flex items-center mt-6">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">
            Produto ativo
          </label>
        </div>

        {/* Botões */}
        <div className="flex justify-end space-x-4 pt-6 mt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Salvando...' : (product ? 'Atualizar Produto' : 'Criar Produto')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;