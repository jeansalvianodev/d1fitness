import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { Venda, NotaFiscal, IProvedorVendas } from '../domain/interfaces';

@Injectable()
export class ProvedorVendasMock implements IProvedorVendas {
  private readonly logger = new Logger(ProvedorVendasMock.name);
  private readonly httpClient: AxiosInstance;

  constructor() {
    const baseURL = process.env.API_VENDAS_URL || 'http://localhost:3000';
    
    this.httpClient = axios.create({
      baseURL,
      timeout: 5000,
    });

    this.logger.log(`ProvedorVendasMock inicializado com baseURL: ${baseURL}`);
  }

  async obterVendas(): Promise<Venda[]> {
    try {
      this.logger.debug('Buscando vendas do mock...');
      const response = await this.httpClient.get<Venda[]>('/vendas');
      this.logger.debug(`${response.data.length} vendas retornadas do mock`);
      return response.data;
    } catch (error) {
      this.logger.error('Erro ao buscar vendas do mock:', error.message);
      throw new Error(`Falha ao buscar vendas do mock: ${error.message}`);
    }
  }

  async obterVendaPorCodigo(codigo: string): Promise<Venda> {
    try {
      this.logger.debug(`Buscando venda ${codigo} do mock...`);
      const response = await this.httpClient.get<Venda>(`/vendas/${codigo}`);
      this.logger.debug(`Venda ${codigo} retornada do mock`);
      return response.data;
    } catch (error) {
      this.logger.error(`Erro ao buscar venda ${codigo} do mock:`, error.message);
      throw new Error(`Falha ao buscar venda ${codigo} do mock: ${error.message}`);
    }
  }

  async obterNotaFiscal(codigo: string): Promise<NotaFiscal | NotaFiscal[]> {
    try {
      this.logger.debug(`Buscando nota fiscal ${codigo} do mock...`);
      const response = await this.httpClient.get<NotaFiscal>(`/notas-fiscais/${codigo}`);
      this.logger.debug(`Nota fiscal ${codigo} retornada do mock`);
      return response.data;
    } catch (error) {
      this.logger.error(`Erro ao buscar nota fiscal ${codigo} do mock:`, error.message);
      throw new Error(`Falha ao buscar nota fiscal ${codigo} do mock: ${error.message}`);
    }
  }
}
