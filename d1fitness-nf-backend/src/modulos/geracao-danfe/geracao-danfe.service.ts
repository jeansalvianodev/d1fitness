import { Injectable, BadRequestException } from '@nestjs/common';
import { parseStringPromise } from 'xml2js';
import PdfPrinter from 'pdfmake';

@Injectable()
export class GeracaoDanfeService {
  async gerar(xml: string): Promise<Buffer> {
    let dados;

    try {
      dados = await parseStringPromise(xml, { explicitArray: false });
    } catch {
      throw new BadRequestException('XML inválido');
    }

    const infNFe = dados?.nfeProc?.NFe?.infNFe;

    if (!infNFe) {
      throw new BadRequestException('Estrutura de NF inválida');
    }

    const ide = infNFe.ide;
    const emit = infNFe.emit;
    const dest = infNFe.dest;
    const total = infNFe.total?.ICMSTot;
    const produtos = Array.isArray(infNFe.det)
      ? infNFe.det
      : [infNFe.det];

    const itens = produtos.map((item) => ({
      descricao: item.prod.xProd,
      quantidade: item.prod.qCom,
      valorUnitario: item.prod.vUnCom,
      valorTotal: item.prod.vProd,
    }));

    const fonts = {
      Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
      },
    };

    const printer = new PdfPrinter(fonts);

    const docDefinition = {
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60],
      content: [
        { text: 'DANFE', style: 'titulo', alignment: 'center' },
        {
          text: `NF-e Nº ${ide.nNF}  Série ${ide.serie}`,
          style: 'subtitulo',
          alignment: 'center',
        },
        { text: `Chave de Acesso: ${infNFe.$.Id.replace('NFe', '')}` },
        { text: ' ' },

        { text: 'Emitente', style: 'secao' },
        { text: emit.xNome },
        { text: emit.enderEmit?.xLgr },

        { text: ' ' },
        { text: 'Destinatário', style: 'secao' },
        { text: dest.xNome },
        { text: dest.enderDest?.xLgr },

        { text: ' ' },
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

        { text: ' ' },
        { text: 'Totais', style: 'secao' },
        { text: `Valor Total da Nota: R$ ${total?.vNF}` },
        { text: `Data de Emissão: ${ide.dhEmi}` },
      ],
      styles: {
        titulo: {
          fontSize: 18,
          bold: true,
        },
        subtitulo: {
          fontSize: 12,
          margin: [0, 5, 0, 10],
        },
        secao: {
          fontSize: 12,
          bold: true,
          margin: [0, 10, 0, 5],
        },
      },
      defaultStyle: {
        font: 'Helvetica',
        fontSize: 9,
      },
    };

    return new Promise((resolve) => {
      const pdfDoc = printer.createPdfKitDocument(docDefinition);
      const chunks: Buffer[] = [];

      pdfDoc.on('data', (chunk) => chunks.push(chunk));
      pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));

      pdfDoc.end();
    });
  }
}
