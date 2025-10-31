import type { Product, ProductFormData } from '../types/product';

export const productService = {
  // Buscar todos os produtos
  async getProducts(): Promise<Product[]> {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('Erro ao buscar produtos');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw error;
    }
  },

  // Buscar produto por ID
  async getProductById(id: string): Promise<Product> {
    try {
      const response = await fetch(`/api/products/${id}`);
      if (!response.ok) {
        throw new Error('Produto não encontrado');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      throw error;
    }
  },

  // Criar produto
  async createProduct(productData: ProductFormData): Promise<Product> {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      
      if (!response.ok) {
        throw new Error('Erro ao criar produto');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      throw error;
    }
  },

  // Atualizar produto
  async updateProduct(id: string, productData: ProductFormData): Promise<Product> {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      
      if (!response.ok) {
        throw new Error('Erro ao atualizar produto');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      throw error;
    }
  },

  // Deletar produto
  async deleteProduct(id: string): Promise<void> {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Erro ao deletar produto');
      }
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      throw error;
    }
  }
};