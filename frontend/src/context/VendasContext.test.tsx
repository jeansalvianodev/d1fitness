import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { VendasProvider, useVendas } from './VendasContext';
import * as vendasService from '../services/vendasService';
import * as notasFiscaisService from '../services/notasFiscaisService';
import type { ReactNode } from 'react';

vi.mock('../services/vendasService');
vi.mock('../services/notasFiscaisService');
vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

const wrapper = ({ children }: { children: ReactNode }) => (
  <VendasProvider>{children}</VendasProvider>
);

describe('VendasContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve carregar vendas com sucesso', async () => {
    const mockVendas = [
      { codigo: 1, data: '2024-12-01', cliente: 'João', valor: 199.9 },
    ];

    vi.spyOn(vendasService.vendasService, 'getAll').mockResolvedValue(mockVendas);

    const { result } = renderHook(() => useVendas(), { wrapper });

    await waitFor(() => {
      result.current.carregarVendas();
    });

    await waitFor(() => {
      expect(result.current.vendas).toEqual(mockVendas);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });
  });

  it('deve buscar nota fiscal com sucesso', async () => {
    const mockNotaFiscal = {
      codigoNotaFiscal: 'NF001',
      xml: '<xml></xml>',
    };

    vi.spyOn(notasFiscaisService.notasFiscaisService, 'getByCodigo')
      .mockResolvedValue(mockNotaFiscal);

    const { result } = renderHook(() => useVendas(), { wrapper });

    const notaFiscal = await result.current.buscarNotaFiscal('NF001');

    expect(notaFiscal).toEqual(mockNotaFiscal);
  });

  it('deve atualizar status da venda', async () => {
    const mockVendas = [
      { codigo: 1, data: '2024-12-01', cliente: 'João', valor: 199.9, statusEnvioNF: 'pendente' as const },
    ];

    vi.spyOn(vendasService.vendasService, 'getAll').mockResolvedValue(mockVendas);

    const { result } = renderHook(() => useVendas(), { wrapper });

    await waitFor(() => {
      result.current.carregarVendas();
    });

    result.current.atualizarStatusVenda(1, 'enviado');

    await waitFor(() => {
      expect(result.current.vendas[0].statusEnvioNF).toBe('enviado');
    });
  });
});
