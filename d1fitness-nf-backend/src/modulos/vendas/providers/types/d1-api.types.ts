export interface RespostaListaVendasD1 {
  [key: string]: any;
}

export interface RespostaVendaD1 {
  success?: boolean;
  venda?: {
    Codigo?: number;
    CodigoVenda?: string;
    DataVenda?: string;
    ClienteNome?: string;
    ValorTotal?: string;
    CodigoNotaFiscal?: number;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface RespostaNotaFiscalD1 {
  success?: boolean;
  nota_fiscal?: {
    Codigo?: number;
    CodigoVenda?: number;
    NotaFiscalNumero?: number;
    NotaFiscalSerie?: number;
    NotaFiscalEletronica?: string;
    NotaFiscalXML?: string;
    DataEmissao?: string;
    ValorTotal?: string;
    [key: string]: any;
  };
  [key: string]: any;
}
