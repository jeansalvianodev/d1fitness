import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class NotasFiscaisService {
  buscarPorCodigo(codigo: string) {
    if (codigo !== 'NF001' && codigo !== 'NF002') {
      throw new NotFoundException('Nota fiscal não encontrada');
    }

    return {
      codigoNotaFiscal: codigo,
      xml: `
        <NFe>
          <infNFe>
            <ide>
              <nNF>${codigo}</nNF>
            </ide>
            <emit>
              <xNome>D1FITNESS</xNome>
            </emit>
            <dest>
              <xNome>Cliente Teste</xNome>
            </dest>
            <total>
              <ICMSTot>
                <vNF>199.90</vNF>
              </ICMSTot>
            </total>
          </infNFe>
        </NFe>
      `,
    };
  }
}
