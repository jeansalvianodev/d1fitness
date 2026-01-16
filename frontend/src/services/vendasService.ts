import apiClient from './apiClient';
import type { Venda } from '../types';

export const vendasService = {
  async getAll(): Promise<Venda[]> {
    const response = await apiClient.get<Venda[]>('/vendas');
    return response.data;
  },

  async getByCodigo(codigo: number): Promise<Venda> {
    const response = await apiClient.get<Venda>(`/vendas/${codigo}`);
    return response.data;
  },
};
