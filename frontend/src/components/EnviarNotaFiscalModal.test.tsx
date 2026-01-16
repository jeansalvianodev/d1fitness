import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EnviarNotaFiscalModal } from './EnviarNotaFiscalModal';
import type { Venda, NotaFiscal } from '../types';

const mockVenda: Venda = {
  codigo: 1,
  codigoVenda: 'VDA001',
  data: '2024-12-01',
  cliente: 'João Silva',
  valor: 199.9,
};

const mockNotaFiscal: NotaFiscal = {
  codigoNotaFiscal: 'NF001',
  codigo: 1,
  numeroNF: '001',
  serie: '1',
};

describe('EnviarNotaFiscalModal', () => {
  it('deve renderizar modal quando aberto', () => {
    const onClose = vi.fn();
    const onEnviar = vi.fn();

    render(
      <EnviarNotaFiscalModal
        open={true}
        onClose={onClose}
        venda={mockVenda}
        notaFiscal={mockNotaFiscal}
        onEnviar={onEnviar}
      />
    );

    expect(screen.getByText('Enviar Nota Fiscal')).toBeInTheDocument();
    expect(screen.getByText('João Silva')).toBeInTheDocument();
  });

  it('deve validar email vazio', async () => {
    const onClose = vi.fn();
    const onEnviar = vi.fn();

    render(
      <EnviarNotaFiscalModal
        open={true}
        onClose={onClose}
        venda={mockVenda}
        notaFiscal={mockNotaFiscal}
        onEnviar={onEnviar}
      />
    );

    const enviarButton = screen.getByText('Enviar');
    fireEvent.click(enviarButton);

    await waitFor(() => {
      const messages = screen.getAllByText('Por favor, informe um email');
      expect(messages.length).toBeGreaterThan(0);
    });

    expect(onEnviar).not.toHaveBeenCalled();
  });

  it('deve validar formato de email', async () => {
    const onClose = vi.fn();
    const onEnviar = vi.fn();

    render(
      <EnviarNotaFiscalModal
        open={true}
        onClose={onClose}
        venda={mockVenda}
        notaFiscal={mockNotaFiscal}
        onEnviar={onEnviar}
      />
    );

    const emailInput = screen.getByLabelText(/Email do destinatário/i);
    fireEvent.change(emailInput, { target: { value: 'email-invalido' } });

    const enviarButton = screen.getByText('Enviar');
    fireEvent.click(enviarButton);

    await waitFor(() => {
      const messages = screen.getAllByText('Por favor, informe um email válido');
      expect(messages.length).toBeGreaterThan(0);
    });

    expect(onEnviar).not.toHaveBeenCalled();
  });

  it('deve enviar email válido', async () => {
    const onClose = vi.fn();
    const onEnviar = vi.fn().mockResolvedValue(undefined);

    render(
      <EnviarNotaFiscalModal
        open={true}
        onClose={onClose}
        venda={mockVenda}
        notaFiscal={mockNotaFiscal}
        onEnviar={onEnviar}
      />
    );

    const emailInput = screen.getByLabelText(/Email do destinatário/i);
    fireEvent.change(emailInput, { target: { value: 'teste@exemplo.com' } });

    const enviarButton = screen.getByText('Enviar');
    fireEvent.click(enviarButton);

    await waitFor(() => {
      expect(onEnviar).toHaveBeenCalledWith('teste@exemplo.com');
    });
  });

  it('deve chamar onClose ao cancelar', () => {
    const onClose = vi.fn();
    const onEnviar = vi.fn();

    render(
      <EnviarNotaFiscalModal
        open={true}
        onClose={onClose}
        venda={mockVenda}
        notaFiscal={mockNotaFiscal}
        onEnviar={onEnviar}
      />
    );

    const cancelButton = screen.getByText('Cancelar');
    fireEvent.click(cancelButton);

    expect(onClose).toHaveBeenCalled();
  });
});
