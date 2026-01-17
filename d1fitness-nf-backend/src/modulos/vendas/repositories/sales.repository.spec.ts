import { Test, TestingModule } from '@nestjs/testing';
import { RepositorioVendas } from './sales.repository';
import { ProvedorVendasMock } from '../providers/sales-mock.provider';
import { ProvedorVendasApi } from '../providers/sales-api.provider';

describe('RepositorioVendas', () => {
  let repositorio: RepositorioVendas;
  let provedorMock: ProvedorVendasMock;
  let provedorApi: ProvedorVendasApi;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RepositorioVendas,
        ProvedorVendasMock,
        ProvedorVendasApi,
      ],
    }).compile();

    repositorio = module.get<RepositorioVendas>(RepositorioVendas);
    provedorMock = module.get<ProvedorVendasMock>(ProvedorVendasMock);
    provedorApi = module.get<ProvedorVendasApi>(ProvedorVendasApi);
  });

  it('deve estar definido', () => {
    expect(repositorio).toBeDefined();
  });

  it('deve retornar informações sobre o provider em uso', () => {
    const info = repositorio.obterInfoProvedor();
    expect(info).toHaveProperty('tipo');
    expect(info).toHaveProperty('usandoApi');
    expect(['mock', 'api']).toContain(info.tipo);
  });

  describe('obterVendas', () => {
    it('deve retornar array de vendas', async () => {
      const vendas = await repositorio.obterVendas();
      expect(Array.isArray(vendas)).toBe(true);
    });

    it('cada venda deve ter a estrutura correta', async () => {
      const vendas = await repositorio.obterVendas();
      if (vendas.length > 0) {
        const venda = vendas[0];
        expect(venda).toHaveProperty('data');
        expect(venda).toHaveProperty('cliente');
        expect(venda).toHaveProperty('valor');
      }
    });
  });

  describe('obterVendaPorCodigo', () => {
    it('deve retornar uma venda específica', async () => {
      const vendas = await repositorio.obterVendas();
      if (vendas.length > 0) {
        const codigo = vendas[0].codigoVenda || vendas[0].codigo?.toString() || '1';
        const venda = await repositorio.obterVendaPorCodigo(codigo);
        expect(venda).toBeDefined();
        expect(venda).toHaveProperty('cliente');
      }
    });
  });

  describe('obterNotaFiscal', () => {
    it('deve retornar nota fiscal ou array de notas fiscais', async () => {
      const vendas = await repositorio.obterVendas();
      const vendaComNF = vendas.find(v => v.codigoNotaFiscal);
      
      if (vendaComNF?.codigoNotaFiscal) {
        const notaFiscal = await repositorio.obterNotaFiscal(vendaComNF.codigoNotaFiscal);
        expect(notaFiscal).toBeDefined();
        
        if (Array.isArray(notaFiscal)) {
          expect(notaFiscal.length).toBeGreaterThan(0);
          expect(notaFiscal[0]).toHaveProperty('codigoNotaFiscal');
        } else {
          expect(notaFiscal).toHaveProperty('codigoNotaFiscal');
        }
      }
    });
  });
});
