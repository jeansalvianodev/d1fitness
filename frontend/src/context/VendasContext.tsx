import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Venda, NotaFiscal } from '../types';
import { vendasService } from '../services/vendasService';
import { notasFiscaisService } from '../services/notasFiscaisService';
import { toast } from 'react-toastify';

interface VendasContextData {
  vendas: Venda[];
  loading: boolean;
  error: string | null;
  carregarVendas: () => Promise<void>;
  buscarNotaFiscal: (codigoNotaFiscal: string | number) => Promise<NotaFiscal | null>;
  atualizarStatusVenda: (codigoVenda: number | string, status: 'pendente' | 'enviado' | 'erro') => void;
}

const VendasContext = createContext<VendasContextData>({} as VendasContextData);

interface VendasProviderProps {
  children: ReactNode;
}

export const VendasProvider: React.FC<VendasProviderProps> = ({ children }) => {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const carregarVendas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await vendasService.getAll();      console.log('Vendas carregadas do backend:', data);      setVendas(data);
    } catch (err) {
      const errorMessage = 'Erro ao carregar vendas. Verifique se o backend está rodando.';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Erro ao carregar vendas:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const buscarNotaFiscal = useCallback(async (codigoNotaFiscal: string | number): Promise<NotaFiscal | null> => {
    if (!codigoNotaFiscal) {
      console.error('Código de nota fiscal inválido');
      return null;
    }
    
    try {
      const notaFiscal = await notasFiscaisService.getByCodigo(codigoNotaFiscal);
      return notaFiscal;
    } catch (err) {
      console.error('Erro ao buscar nota fiscal:', err);
      toast.error('Erro ao buscar nota fiscal');
      return null;
    }
  }, []);

  const atualizarStatusVenda = useCallback(
    (codigoVenda: number | string, status: 'pendente' | 'enviado' | 'erro') => {
      setVendas((vendasAtuais) =>
        vendasAtuais.map((venda) => {
          const codigo = venda.codigo?.toString() || venda.codigoVenda;
          return codigo === codigoVenda.toString() 
            ? { ...venda, statusEnvioNF: status } 
            : venda;
        })
      );
    },
    []
  );

  return (
    <VendasContext.Provider
      value={{
        vendas,
        loading,
        error,
        carregarVendas,
        buscarNotaFiscal,
        atualizarStatusVenda,
      }}
    >
      {children}
    </VendasContext.Provider>
  );
};

export const useVendas = () => {
  const context = useContext(VendasContext);
  if (!context) {
    throw new Error('useVendas deve ser usado dentro de VendasProvider');
  }
  return context;
};
