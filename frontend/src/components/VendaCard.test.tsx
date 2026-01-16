import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { VendaCard } from './VendaCard';
import type { Venda } from '../types';

const mockVenda: Venda = {
  codigo: 1,
  codigoVenda: 'VDA001',
  data: '2024-12-01',
  cliente: 'João Silva',
  valor: 199.9,
  statusEnvioNF: 'pendente',
  codigoNotaFiscal: 'NF001',
};

describe('VendaCard', () => {
  it('deve renderizar informações da venda', () => {
    const onEnviarNF = vi.fn();
    
    render(<VendaCard venda={mockVenda} onEnviarNF={onEnviarNF} />);

    expect(screen.getByText('João Silva')).toBeInTheDocument();
    expect(screen.getByText(/R\$ 199,90/)).toBeInTheDocument();
    expect(screen.getByText(/\d{2}\/\d{2}\/2024/)).toBeInTheDocument();
  });

  it('deve chamar onEnviarNF ao clicar no botão', () => {
    const onEnviarNF = vi.fn();
    
    render(<VendaCard venda={mockVenda} onEnviarNF={onEnviarNF} />);

    const button = screen.getByText('Enviar NF');
    fireEvent.click(button);

    expect(onEnviarNF).toHaveBeenCalledWith(mockVenda);
  });

  it('deve mostrar status correto', () => {
    const onEnviarNF = vi.fn();
    
    render(<VendaCard venda={mockVenda} onEnviarNF={onEnviarNF} />);

    expect(screen.getByText('Pendente')).toBeInTheDocument();
  });

  it('deve desabilitar botão quando loading', () => {
    const onEnviarNF = vi.fn();
    
    render(<VendaCard venda={mockVenda} onEnviarNF={onEnviarNF} loading={true} />);

    const button = screen.getByText('Enviar NF');
    expect(button).toBeDisabled();
  });

  it('deve mostrar botão de histórico quando callback fornecido', () => {
    const onEnviarNF = vi.fn();
    const onVerHistorico = vi.fn();
    
    render(
      <VendaCard 
        venda={mockVenda} 
        onEnviarNF={onEnviarNF} 
        onVerHistorico={onVerHistorico}
      />
    );

    expect(screen.getByText('Ver Histórico')).toBeInTheDocument();
  });
});
