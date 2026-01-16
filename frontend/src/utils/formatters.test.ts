import { describe, it, expect } from 'vitest';
import {
  formatarMoeda,
  formatarData,
  formatarDataHora,
  validarEmail,
  traduzirStatus,
  getCorStatus,
} from './formatters';

describe('Formatters', () => {
  describe('formatarMoeda', () => {
    it('deve formatar valores em reais', () => {
      expect(formatarMoeda(199.9)).toMatch(/R\$\s*199,90/);
      expect(formatarMoeda(1000)).toMatch(/R\$\s*1\.000,00/);
      expect(formatarMoeda(0)).toMatch(/R\$\s*0,00/);
    });
  });

  describe('formatarData', () => {
    it('deve formatar data no padrão brasileiro', () => {
      const result = formatarData('2024-12-15');
      expect(result).toMatch(/\d{2}\/\d{2}\/2024/);
    });

    it('deve retornar a string original se data for inválida', () => {
      expect(formatarData('data-invalida')).toBe('data-invalida');
    });
  });

  describe('formatarDataHora', () => {
    it('deve formatar data e hora no padrão brasileiro', () => {
      const result = formatarDataHora('2024-12-01T10:30:00');
      expect(result).toContain('01/12/2024');
      expect(result).toContain('10:30');
    });
  });

  describe('validarEmail', () => {
    it('deve validar emails corretos', () => {
      expect(validarEmail('teste@exemplo.com')).toBe(true);
      expect(validarEmail('usuario.nome@dominio.com.br')).toBe(true);
    });

    it('deve invalidar emails incorretos', () => {
      expect(validarEmail('email-invalido')).toBe(false);
      expect(validarEmail('email@')).toBe(false);
      expect(validarEmail('@dominio.com')).toBe(false);
    });
  });

  describe('traduzirStatus', () => {
    it('deve traduzir status corretamente', () => {
      expect(traduzirStatus('pendente')).toBe('Pendente');
      expect(traduzirStatus('enviado')).toBe('Enviado');
      expect(traduzirStatus('erro')).toBe('Erro');
      expect(traduzirStatus(undefined)).toBe('Não enviado');
    });
  });

  describe('getCorStatus', () => {
    it('deve retornar cores corretas para cada status', () => {
      expect(getCorStatus('pendente')).toBe('warning');
      expect(getCorStatus('enviado')).toBe('success');
      expect(getCorStatus('erro')).toBe('error');
      expect(getCorStatus(undefined)).toBe('default');
    });
  });
});
