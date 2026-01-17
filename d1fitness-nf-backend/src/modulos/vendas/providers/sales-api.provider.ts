import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { Venda, NotaFiscal, IProvedorVendas } from '../domain/interfaces';
import { RespostaListaVendasD1, RespostaVendaD1, RespostaNotaFiscalD1 } from './types/d1-api.types';
import { mapearVendaD1ParaDominio, mapearNotaFiscalD1ParaDominio } from './mappers/d1-api.mapper';

@Injectable()
export class ProvedorVendasApi implements IProvedorVendas {
  private readonly logger = new Logger(ProvedorVendasApi.name);
  private readonly httpClient: AxiosInstance;

  constructor() {
    const baseURL = process.env.SALES_API_BASE_URL || 'https://d1-teste-dev-fullstack.morefocus.com.br';
    
    this.httpClient = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.logger.log(`ProvedorVendasApi inicializado com baseURL: ${baseURL}`);
  }

  async obterVendas(): Promise<Venda[]> {
    try {
      this.logger.debug('Buscando lista de vendas da API D1FITNESS...');
      
      const respostaLista = await this.httpClient.get<any>('/listarVendas');
      this.logger.debug('Resposta bruta /listarVendas:', JSON.stringify(respostaLista.data).substring(0, 500));
      
      let codigosVendas: string[] = [];
      
      if (Array.isArray(respostaLista.data)) {
        codigosVendas = respostaLista.data;
      } else if (respostaLista.data?.vendas && Array.isArray(respostaLista.data.vendas)) {
        codigosVendas = respostaLista.data.vendas;
      } else if (respostaLista.data?.data && Array.isArray(respostaLista.data.data)) {
        codigosVendas = respostaLista.data.data;
      }

      this.logger.debug(`${codigosVendas.length} códigos de vendas encontrados`);

      const promessasVendas = codigosVendas.map(codigo => this.obterVendaPorCodigo(String(codigo)));
      const vendas = await Promise.all(promessasVendas);

      this.logger.debug(`${vendas.length} vendas completas retornadas da API D1FITNESS`);
      return vendas;
    } catch (error) {
      this.logger.error('Erro ao buscar vendas da API D1FITNESS:', error.message);
      
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new Error('Timeout ao buscar vendas da API D1FITNESS');
        }
        if (error.response) {
          throw new Error(`API D1FITNESS retornou erro ${error.response.status}: ${error.response.statusText}`);
        }
        if (error.request) {
          throw new Error('API D1FITNESS não respondeu à requisição');
        }
      }
      
      throw new Error(`Falha ao buscar vendas da API D1FITNESS: ${error.message}`);
    }
  }

  async obterVendaPorCodigo(codigo: string): Promise<Venda> {
    try {
      this.logger.debug(`Buscando venda ${codigo} da API D1FITNESS...`);
      
      const resposta = await this.httpClient.get<RespostaVendaD1>(`/Venda/${codigo}`);
      this.logger.debug(`Resposta bruta /Venda/${codigo}:`, JSON.stringify(resposta.data));
      const venda = mapearVendaD1ParaDominio(resposta.data);
      
      this.logger.debug(`Venda ${codigo} retornada e mapeada da API D1FITNESS`);
      return venda;
    } catch (error) {
      this.logger.error(`Erro ao buscar venda ${codigo} da API D1FITNESS:`, error.message);
      
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new Error(`Timeout ao buscar venda ${codigo} da API D1FITNESS`);
        }
        if (error.response?.status === 404) {
          throw new Error(`Venda ${codigo} não encontrada na API D1FITNESS`);
        }
        if (error.response) {
          throw new Error(`API D1FITNESS retornou erro ${error.response.status}: ${error.response.statusText}`);
        }
      }
      
      throw new Error(`Falha ao buscar venda ${codigo} da API D1FITNESS: ${error.message}`);
    }
  }

  async obterNotaFiscal(codigo: string): Promise<NotaFiscal | NotaFiscal[]> {
    try {
      this.logger.debug(`Buscando nota fiscal ${codigo} da API D1FITNESS...`);
      
      const resposta = await this.httpClient.get<RespostaNotaFiscalD1 | RespostaNotaFiscalD1[]>(`/NF/${codigo}`);
      this.logger.debug(`Resposta bruta /NF/${codigo}:`, JSON.stringify(resposta.data).substring(0, 1000));
      
      if (Array.isArray(resposta.data)) {
        const notasFiscais = resposta.data.map(mapearNotaFiscalD1ParaDominio);
        this.logger.debug(`${notasFiscais.length} notas fiscais retornadas e mapeadas da API D1FITNESS`);
        return notasFiscais;
      } else {
        const notaFiscal = mapearNotaFiscalD1ParaDominio(resposta.data);
        this.logger.debug(`Nota fiscal ${codigo} retornada e mapeada da API D1FITNESS`);
        this.logger.debug(`NF mapeada - Codigo: ${notaFiscal.codigo}, XML existe: ${!!notaFiscal.xml}, Tamanho XML: ${notaFiscal.xml?.length || 0}`);
        return notaFiscal;
      }
    } catch (error) {
      this.logger.error(`Erro ao buscar nota fiscal ${codigo} da API D1FITNESS:`, error.message);
      
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new Error(`Timeout ao buscar nota fiscal ${codigo} da API D1FITNESS`);
        }
        if (error.response?.status === 404) {
          throw new Error(`Nota fiscal ${codigo} não encontrada na API D1FITNESS`);
        }
        if (error.response) {
          throw new Error(`API D1FITNESS retornou erro ${error.response.status}: ${error.response.statusText}`);
        }
      }
      
      throw new Error(`Falha ao buscar nota fiscal ${codigo} da API D1FITNESS: ${error.message}`);
    }
  }
}
