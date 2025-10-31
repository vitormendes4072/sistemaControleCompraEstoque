// frontend/src/services/api.ts
import axios from 'axios';
import type { ReplenishmentResponse } from '../types/replenishment'; // ← Adicione 'type'

const API_BASE_URL = '/api';

export const api = {
  async getReplenishment(): Promise<ReplenishmentResponse> {
    try {
      const response = await axios.get(`${API_BASE_URL}/replenishment`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar dados de replenishment:', error);
      throw new Error('Falha ao carregar dados do estoque');
    }
  }
};