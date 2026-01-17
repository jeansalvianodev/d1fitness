import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Venda, NotaFiscal, IProvedorVendas } from '../domain/interfaces';
import { ProvedorVendasMock } from '../providers/sales-mock.provider';
import { ProvedorVendasApi } from '../providers/sales-api.provider';

@Injectable()
export class RepositorioVendas implements OnModuleInit {
  private readonly logger = new Logger(RepositorioVendas.name);
  private provedor: IProvedorVendas;
  private readonly tipoProvedor: string;

  constructor(
    private readonly provedorMock: ProvedorVendasMock,
    private readonly provedorApi: ProvedorVendasApi,
  ) {
    this.tipoProvedor = process.env.SALES_PROVIDER || 'mock';
  }

  onModuleInit() {
    if (this.tipoProvedor === 'api') {
      this.provedor = this.provedorApi;
      this.logger.log(' RepositorioVendas configurado para usar API D1FITNESS');
    } else {
      this.provedor = this.provedorMock;
      this.logger.log(' RepositorioVendas configurado para usar Mock API');
    }
  }

  async obterVendas(): Promise<Venda[]> {
    try {
      return await this.provedor.obterVendas();
    } catch (error) {
      this.logger.error(`Erro ao buscar vendas via ${this.tipoProvedor}:`, error.message);
      
      if (this.tipoProvedor === 'api' && process.env.SALES_FALLBACK_TO_MOCK === 'true') {
        this.logger.warn('Tentando fallback para mock...');
        try {
          return await this.provedorMock.obterVendas();
        } catch (fallbackError) {
          this.logger.error('Fallback para mock também falhou:', fallbackError.message);
          throw error;
        }
      }
      
      throw error;
    }
  }

  async obterVendaPorCodigo(codigo: string): Promise<Venda> {
    try {
      return await this.provedor.obterVendaPorCodigo(codigo);
    } catch (error) {
      this.logger.error(`Erro ao buscar venda ${codigo} via ${this.tipoProvedor}:`, error.message);
      
      if (this.tipoProvedor === 'api' && process.env.SALES_FALLBACK_TO_MOCK === 'true') {
        this.logger.warn(`Tentando fallback para mock (venda ${codigo})...`);
        try {
          return await this.provedorMock.obterVendaPorCodigo(codigo);
        } catch (fallbackError) {
          this.logger.error('Fallback para mock também falhou:', fallbackError.message);
          throw error;
        }
      }
      
      throw error;
    }
  }

  async obterNotaFiscal(codigo: string): Promise<NotaFiscal | NotaFiscal[]> {
    try {
      return await this.provedor.obterNotaFiscal(codigo);
    } catch (error) {
      this.logger.error(`Erro ao buscar nota fiscal ${codigo} via ${this.tipoProvedor}:`, error.message);
      
      if (this.tipoProvedor === 'api' && process.env.SALES_FALLBACK_TO_MOCK === 'true') {
        this.logger.warn(`Tentando fallback para mock (NF ${codigo})...`);
        try {
          return await this.provedorMock.obterNotaFiscal(codigo);
        } catch (fallbackError) {
          this.logger.error('Fallback para mock também falhou:', fallbackError.message);
          throw error;
        }
      }
      
      throw error;
    }
  }

  obterInfoProvedor(): { tipo: string; usandoApi: boolean } {
    return {
      tipo: this.tipoProvedor,
      usandoApi: this.tipoProvedor === 'api',
    };
  }
}
