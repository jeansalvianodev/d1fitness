import { Injectable, BadRequestException } from '@nestjs/common';
import { parseStringPromise } from 'xml2js';

const pdfMake = require('pdfmake/build/pdfmake');
const vfsFonts = require('pdfmake/build/vfs_fonts');

pdfMake.vfs = vfsFonts.pdfMake ? vfsFonts.pdfMake.vfs : vfsFonts.vfs;

@Injectable()
export class GeracaoDanfeService {
  async gerar(xml: string): Promise<Buffer> {
    let dados: any;

    try {
      dados = await parseStringPromise(xml, { explicitArray: false });
    } catch {
      throw new BadRequestException('XML inválido');
    }

    const infNFe = dados?.nfeProc?.NFe?.infNFe || dados?.NFe?.infNFe;
    if (!infNFe) {
      throw new BadRequestException('Estrutura de NF inválida');
    }

    const ide = infNFe.ide;
    const emit = infNFe.emit;
    const dest = infNFe.dest;
    const total = infNFe.total?.ICMSTot;

    const itens = infNFe.det
      ? (Array.isArray(infNFe.det) ? infNFe.det : [infNFe.det]).map((item) => ({
          descricao: item.prod?.xProd ?? '-',
          quantidade: item.prod?.qCom ?? '-',
          valorUnitario: item.prod?.vUnCom ?? '-',
          valorTotal: item.prod?.vProd ?? '-',
        }))
      : [];

    const docDefinition: any = {
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60],
      content: [
        { text: 'DANFE', style: 'titulo', alignment: 'center' },
        {
          text: `NF-e Nº ${ide.nNF}${ide.serie ? '  Série ' + ide.serie : ''}`,
          style: 'subtitulo',
          alignment: 'center',
        },
        {
          text: infNFe.$?.Id
            ? `Chave de Acesso: ${infNFe.$.Id.replace('NFe', '')}`
            : '',
        },
        { text: ' ' },

        { text: 'Emitente', style: 'secao' },
        { text: emit.xNome ?? '-' },
        { text: emit.enderEmit?.xLgr ?? '-' },

        { text: ' ' },
        { text: 'Destinatário', style: 'secao' },
        { text: dest.xNome ?? '-' },
        { text: dest.enderDest?.xLgr ?? '-' },

        ...(itens.length
          ? [
              { text: ' ', margin: [0, 5] },
              { text: 'Produtos', style: 'secao' },
              {
                table: {
                  widths: ['*', 60, 80, 80],
                  body: [
                    ['Descrição', 'Qtd', 'Vlr Unit.', 'Vlr Total'],
                    ...itens.map((i) => [
                      i.descricao,
                      i.quantidade,
                      `R$ ${i.valorUnitario}`,
                      `R$ ${i.valorTotal}`,
                    ]),
                  ],
                },
              },
            ]
          : []),

        { text: ' ', margin: [0, 5] },
        { text: 'Totais', style: 'secao' },
        { text: `Valor Total da Nota: R$ ${total?.vNF ?? '-'}` },
        { text: `Data de Emissão: ${ide.dhEmi ?? '-'}` },
      ],
      styles: {
        titulo: { fontSize: 18, bold: true },
        subtitulo: { fontSize: 12, margin: [0, 5, 0, 10] },
        secao: { fontSize: 12, bold: true, margin: [0, 10, 0, 5] },
      },
      defaultStyle: { fontSize: 9 },
    };

    return new Promise<Buffer>((resolve, reject) => {
      try {
        const pdfDocGenerator = pdfMake.createPdf(docDefinition);
        pdfDocGenerator.getBuffer((buffer: Buffer) =>
          resolve(Buffer.from(buffer)),
        );
      } catch (err) {
        console.error('ERRO PDFMAKE >>>', err);
        reject(new BadRequestException('Erro ao gerar PDF'));
      }
    });
  }
}
