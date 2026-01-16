import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Loading } from './Loading';

describe('Loading', () => {
  it('deve renderizar com mensagem padrão', () => {
    render(<Loading />);
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('deve renderizar com mensagem customizada', () => {
    render(<Loading message="Aguarde..." />);
    expect(screen.getByText('Aguarde...')).toBeInTheDocument();
  });

  it('deve mostrar spinner de loading', () => {
    const { container } = render(<Loading />);
    expect(container.querySelector('.MuiCircularProgress-root')).toBeInTheDocument();
  });
});
