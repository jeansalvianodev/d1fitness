import { Venda } from './sale.interface';
import { NotaFiscal } from './invoice.interface';

export interface IProvedorVendas {
  obterVendas(): Promise<Venda[]>;
  obterVendaPorCodigo(codigo: string): Promise<Venda>;
  obterNotaFiscal(codigo: string): Promise<NotaFiscal | NotaFiscal[]>;
}
