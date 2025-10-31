export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  category?: string;
  inStock: boolean;
  currentStock: number;
  minStock: number;
  maxStock: number;
  costPrice: number;
  sellingPrice: number;
  leadTimeDays: number;
  dailyDemand: number;
  sku: string;
  supplier?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductFormData {
  name: string;
  price: number;
  description?: string;
  category?: string;
  inStock: boolean;
  currentStock: number;
  minStock: number;
  maxStock: number;
  costPrice: number;
  sellingPrice: number;
  leadTimeDays: number;
  dailyDemand: number;
  isActive: boolean;
  sku: string;
  supplier?: string;
}