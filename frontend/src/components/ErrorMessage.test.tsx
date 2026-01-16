import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorMessage } from './ErrorMessage';

describe('ErrorMessage', () => {
  it('deve renderizar mensagem de erro', () => {
    render(<ErrorMessage message="Erro ao carregar dados" />);
    expect(screen.getByText('Erro ao carregar dados')).toBeInTheDocument();
  });

  it('deve mostrar botão de retry quando callback fornecido', () => {
    const onRetry = vi.fn();
    render(<ErrorMessage message="Erro ao carregar dados" onRetry={onRetry} />);
    
    expect(screen.getByText('Tentar Novamente')).toBeInTheDocument();
  });

  it('deve chamar onRetry ao clicar no botão', () => {
    const onRetry = vi.fn();
    render(<ErrorMessage message="Erro ao carregar dados" onRetry={onRetry} />);
    
    const retryButton = screen.getByText('Tentar Novamente');
    fireEvent.click(retryButton);
    
    expect(onRetry).toHaveBeenCalled();
  });

  it('não deve mostrar botão quando onRetry não fornecido', () => {
    render(<ErrorMessage message="Erro ao carregar dados" />);
    expect(screen.queryByText('Tentar Novamente')).not.toBeInTheDocument();
  });
});
