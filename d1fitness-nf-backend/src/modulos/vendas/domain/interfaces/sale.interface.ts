export interface Venda {
  codigo?: number;
  codigoVenda?: string;
  data: string;
  cliente: string;
  documento?: string;
  valor: number;
  statusEnvioNF?: 'pendente' | 'enviado' | 'erro';
  codigoNotaFiscal?: string;
}
