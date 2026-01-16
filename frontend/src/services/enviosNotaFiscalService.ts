import apiClient from './apiClient';
import type { EnvioNotaFiscal, EnviarNotaFiscalDTO } from '../types';

export const enviosNotaFiscalService = {
  async enviar(data: EnviarNotaFiscalDTO): Promise<EnvioNotaFiscal> {
    const response = await apiClient.post<EnvioNotaFiscal>('/envios-nota-fiscal', data);
    return response.data;
  },

  async getByNotaFiscal(codigoNotaFiscal: string | number): Promise<EnvioNotaFiscal[]> {
    const response = await apiClient.get<EnvioNotaFiscal[]>(
      `/envios-nota-fiscal/nota-fiscal/${codigoNotaFiscal}`
    );
    return response.data;
  },

  async getAll(): Promise<EnvioNotaFiscal[]> {
    const response = await apiClient.get<EnvioNotaFiscal[]>('/envios-nota-fiscal');
    return response.data;
  },
};
