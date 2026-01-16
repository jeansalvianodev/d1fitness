import { Injectable, NotFoundException } from '@nestjs/common';

const VENDAS_MOCK = [
  { codigoVenda: 'VDA001', codigoNotaFiscal: 'NF001', data: '2024-12-01', cliente: 'João Silva', valor: 199.9 },
  { codigoVenda: 'VDA002', codigoNotaFiscal: 'NF002', data: '2024-12-02', cliente: 'Maria Souza', valor: 299.9 },
  { codigoVenda: 'VDA003', codigoNotaFiscal: 'NF003', data: '2024-12-03', cliente: 'Carlos Pereira', valor: 149.5 },
  { codigoVenda: 'VDA004', codigoNotaFiscal: 'NF004', data: '2024-12-04', cliente: 'Ana Oliveira', valor: 459.0 },
  { codigoVenda: 'VDA005', codigoNotaFiscal: 'NF005', data: '2024-12-05', cliente: 'Bruno Santos', valor: 89.9 },
  { codigoVenda: 'VDA006', codigoNotaFiscal: 'NF006', data: '2024-12-06', cliente: 'Fernanda Lima', valor: 799.9 },
];

@Injectable()
export class NotasFiscaisService {
  buscarPorCodigo(codigo: string) {
    const venda = VENDAS_MOCK.find(v => v.codigoNotaFiscal === codigo);
    
    if (!venda) {
      throw new NotFoundException('Nota fiscal não encontrada');
    }

    const numeroNF = codigo.replace('NF', '');
    const dataEmissao = new Date(venda.data + 'T10:00:00').toISOString();

    return {
      codigoNotaFiscal: codigo,
      xml: `
<?xml version="1.0" encoding="UTF-8"?>
<NFe xmlns="http://www.portalfiscal.inf.br/nfe">
  <infNFe versao="4.00">
    <ide>
      <nNF>${numeroNF}</nNF>
      <serie>1</serie>
      <tpNF>1</tpNF>
      <dhEmi>${dataEmissao}</dhEmi>
    </ide>

    <emit>
      <xNome>D1FITNESS</xNome>
    </emit>

    <dest>
      <xNome>${venda.cliente}</xNome>
    </dest>

    <det nItem="1">
      <prod>
        <xProd>Plano Fitness</xProd>
        <qCom>1</qCom>
        <vUnCom>${venda.valor.toFixed(2)}</vUnCom>
        <vProd>${venda.valor.toFixed(2)}</vProd>
      </prod>
    </det>

    <total>
      <ICMSTot>
        <vNF>${venda.valor.toFixed(2)}</vNF>
      </ICMSTot>
    </total>
  </infNFe>
</NFe>
      `.trim(),
    };
  }
}
