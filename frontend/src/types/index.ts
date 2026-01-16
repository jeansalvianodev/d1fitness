export interface Venda {
  codigo?: number;
  codigoVenda?: string;
  data: string;
  cliente: string;
  valor: number;
  statusEnvioNF?: 'pendente' | 'enviado' | 'erro';
  codigoNotaFiscal?: string;
}

export interface NotaFiscal {
  codigoNotaFiscal: string;
  xml?: string;
  codigo?: number;
  codigoVenda?: number;
  numeroNF?: string;
  serie?: string;
  chaveAcesso?: string;
  dataEmissao?: string;
  valorTotal?: number;
  xmlNfe?: string;
}

export interface EnvioNotaFiscal {
  id?: string;
  codigoNotaFiscal: string;
  emailDestino: string;
  dataEnvio?: string;
  status?: string;
  mensagemErro?: string;
}

export interface EnviarNotaFiscalDTO {
  codigoNotaFiscal: string;
  email: string;
}

export interface ApiError {
  message: string;
  statusCode?: number;
  error?: string;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}
