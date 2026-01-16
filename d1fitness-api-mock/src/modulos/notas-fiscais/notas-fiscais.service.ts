import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class NotasFiscaisService {
  buscarPorCodigo(codigo: string) {
    if (!['NF001', 'NF002'].includes(codigo)) {
      throw new NotFoundException('Nota fiscal não encontrada');
    }

    const numeroNF = codigo.replace('NF', '');
    const dataEmissao = new Date().toISOString(); // 👈 data atual

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
      <xNome>Cliente Teste</xNome>
    </dest>

    <det nItem="1">
      <prod>
        <xProd>Plano Fitness</xProd>
        <qCom>1</qCom>
        <vUnCom>199.90</vUnCom>
        <vProd>199.90</vProd>
      </prod>
    </det>

    <total>
      <ICMSTot>
        <vNF>199.90</vNF>
      </ICMSTot>
    </total>
  </infNFe>
</NFe>
      `.trim(),
    };
  }
}
