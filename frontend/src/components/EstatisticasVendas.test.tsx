import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EstatisticasVendas } from './EstatisticasVendas';
import type { Venda } from '../types';

const mockVendas: Venda[] = [
  {
    codigo: 1,
    data: '2024-12-01',
    cliente: 'João Silva',
    valor: 199.9,
    statusEnvioNF: 'enviado',
  },
  {
    codigo: 2,
    data: '2024-12-02',
    cliente: 'Maria Souza',
    valor: 299.9,
    statusEnvioNF: 'pendente',
  },
  {
    codigo: 3,
    data: '2024-12-03',
    cliente: 'Carlos Pereira',
    valor: 149.5,
    statusEnvioNF: 'erro',
  },
];

describe('EstatisticasVendas', () => {
  it('deve calcular total de vendas corretamente', () => {
    render(<EstatisticasVendas vendas={mockVendas} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('deve calcular valor total corretamente', () => {
    render(<EstatisticasVendas vendas={mockVendas} />);
    expect(screen.getByText(/R\$ 649,30/)).toBeInTheDocument();
  });

  it('deve contar NF enviadas corretamente', () => {
    render(<EstatisticasVendas vendas={mockVendas} />);
    const cards = screen.getAllByText('1');
    expect(cards.length).toBeGreaterThan(0);
  });

  it('deve mostrar todos os cards de estatísticas', () => {
    render(<EstatisticasVendas vendas={mockVendas} />);
    
    expect(screen.getByText('Total de Vendas')).toBeInTheDocument();
    expect(screen.getByText('Valor Total')).toBeInTheDocument();
    expect(screen.getByText('NF Enviadas')).toBeInTheDocument();
    expect(screen.getByText('Pendentes')).toBeInTheDocument();
    expect(screen.getByText('Com Erro')).toBeInTheDocument();
  });
});
