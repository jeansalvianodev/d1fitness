import { Venda, NotaFiscal } from '../../domain/interfaces';
import { RespostaVendaD1, RespostaNotaFiscalD1 } from '../types/d1-api.types';

export function mapearVendaD1ParaDominio(respostaApi: RespostaVendaD1): Venda {
  const vendaApi = respostaApi.venda || respostaApi;
  
  return {
    codigo: vendaApi.Codigo,
    codigoVenda: vendaApi.CodigoVenda || String(vendaApi.Codigo),
    data: vendaApi.DataVenda || new Date().toISOString(),
    cliente: vendaApi.ClienteNome || 'Cliente não informado',
    documento: vendaApi.ClienteDocumento,
    valor: vendaApi.ValorTotal ? parseFloat(vendaApi.ValorTotal) : 0,
    statusEnvioNF: 'pendente',
    codigoNotaFiscal: vendaApi.CodigoNotaFiscal ? String(vendaApi.CodigoNotaFiscal) : undefined,
  };
}

export function mapearNotaFiscalD1ParaDominio(respostaApi: RespostaNotaFiscalD1): NotaFiscal {
  const nfApi = respostaApi.nota_fiscal || respostaApi;
  
  const xml = nfApi.NotaFiscalXML || nfApi.Xml || nfApi.XML || nfApi.xml;
  
  return {
    codigoNotaFiscal: String(nfApi.Codigo || nfApi.CodigoVenda || ''),
    xml: xml,
    codigo: nfApi.Codigo,
    codigoVenda: nfApi.CodigoVenda,
    numeroNF: String(nfApi.NotaFiscalNumero || ''),
    serie: String(nfApi.NotaFiscalSerie || ''),
    chaveAcesso: nfApi.NotaFiscalEletronica,
    dataEmissao: nfApi.DataEmissao,
    valorTotal: nfApi.ValorTotal ? parseFloat(nfApi.ValorTotal) : undefined,
    xmlNfe: xml,
  };
}
