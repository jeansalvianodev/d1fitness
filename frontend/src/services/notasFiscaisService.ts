import apiClient from './apiClient';
import type { NotaFiscal } from '../types';

export const notasFiscaisService = {
  async getByCodigo(codigo: string | number): Promise<NotaFiscal> {
    const response = await apiClient.get<NotaFiscal>(`/notas-fiscais/${codigo}`);
    return response.data;
  },

  async getByCodigoVenda(codigoVenda: number): Promise<NotaFiscal> {
    const response = await apiClient.get<NotaFiscal>(`/notas-fiscais/venda/${codigoVenda}`);
    return response.data;
  },
};
