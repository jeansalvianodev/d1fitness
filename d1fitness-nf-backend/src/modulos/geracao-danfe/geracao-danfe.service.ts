import { Injectable, BadRequestException } from '@nestjs/common';
import { parseStringPromise } from 'xml2js';

const pdfMake = require('pdfmake/build/pdfmake');
const vfsFonts = require('pdfmake/build/vfs_fonts');

pdfMake.vfs = vfsFonts.pdfMake ? vfsFonts.pdfMake.vfs : vfsFonts.vfs;

@Injectable()
export class GeracaoDanfeService {
  private gerarCodigoBarras(chave: string): string {
    const alturas = chave.split('').map((d) => 10 + parseInt(d) * 1.5);
    const barras = alturas
      .map(
        (h, i) =>
          `<rect x="${i * 4}" y="${25 - h}" width="2.5" height="${h}" fill="black"/>`,
      )
      .join('');
    return `<svg width="180" height="30" xmlns="http://www.w3.org/2000/svg">${barras}</svg>`;
  }

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
    const chaveAcesso = infNFe.$?.Id?.replace('NFe', '') ?? '';

    const itens = infNFe.det
      ? (Array.isArray(infNFe.det) ? infNFe.det : [infNFe.det]).map((item) => ({
          descricao: item.prod?.xProd ?? '-',
          quantidade: item.prod?.qCom ?? '-',
          valorUnitario: item.prod?.vUnCom ?? '-',
          valorTotal: item.prod?.vProd ?? '-',
        }))
      : [];

    const formatarEndereco = (end: any) => {
      if (!end) return '-';
      const partes = [
        end.xLgr,
        end.nro ? `nº ${end.nro}` : null,
        end.xBairro,
        end.xMun,
        end.UF,
        end.CEP ? `CEP: ${end.CEP}` : null,
      ].filter(Boolean);
      return partes.join(', ');
    };

    const docDefinition: any = {
      pageSize: 'A4',
      pageMargins: [15, 15, 15, 15],
      content: [
        {
          table: {
            widths: ['*'],
            body: [
              [
                {
                  text: 'DANFE',
                  style: 'danfeTitle',
                  alignment: 'center',
                  border: [true, true, true, false],
                  margin: [0, 3, 0, 0],
                },
              ],
              [
                {
                  text: 'Documento Auxiliar da Nota Fiscal Eletrônica',
                  style: 'danfeSubtitle',
                  alignment: 'center',
                  border: [true, false, true, true],
                  margin: [0, 0, 0, 3],
                },
              ],
            ],
          },
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
          },
        },

        chaveAcesso
          ? {
              table: {
                widths: ['*'],
                body: [
                  [
                    {
                      stack: [
                        {
                          text: 'CHAVE DE ACESSO',
                          style: 'labelBold',
                          alignment: 'center',
                        },
                        {
                          svg: this.gerarCodigoBarras(chaveAcesso),
                          alignment: 'center',
                          margin: [0, 2, 0, 2],
                        },
                        {
                          text: chaveAcesso.replace(
                            /(\d{4})(?=\d)/g,
                            '$1 ',
                          ),
                          style: 'chaveAcessoNumeros',
                          alignment: 'center',
                        },
                      ],
                      margin: [5, 3, 5, 3],
                    },
                  ],
                ],
              },
              layout: 'lightHorizontalLines',
              margin: [0, 1, 0, 0],
            }
          : {},

        {
          table: {
            widths: ['*', '*', '*'],
            body: [
              [
                { text: 'NÚMERO', style: 'labelBold' },
                { text: 'SÉRIE', style: 'labelBold' },
                { text: 'DATA DE EMISSÃO', style: 'labelBold' },
              ],
              [
                { text: ide.nNF ?? '-', style: 'value' },
                { text: ide.serie ?? '-', style: 'value' },
                {
                  text: ide.dhEmi
                    ? new Date(ide.dhEmi).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '-',
                  style: 'value',
                },
              ],
            ],
          },
          layout: 'lightHorizontalLines',
          margin: [0, 2, 0, 0],
        },

        {
          table: {
            widths: ['*'],
            body: [
              [{ text: 'EMITENTE', style: 'sectionHeader' }],
              [
                {
                  stack: [
                    { text: emit.xNome ?? '-', style: 'valueBold' },
                    {
                      text: emit.CNPJ
                        ? `CNPJ: ${emit.CNPJ}`
                        : '-',
                      style: 'infoLabel',
                    },
                    {
                      text: formatarEndereco(emit.enderEmit),
                      style: 'info',
                    },
                    {
                      text: emit.IE ? `IE: ${emit.IE}` : '',
                      style: 'infoLabel',
                    },
                  ],
                  margin: [5, 3, 5, 3],
                },
              ],
            ],
          },
          layout: 'lightHorizontalLines',
          margin: [0, 2, 0, 0],
        },

        {
          table: {
            widths: ['*'],
            body: [
              [{ text: 'DESTINATÁRIO / REMETENTE', style: 'sectionHeader' }],
              [
                {
                  stack: [
                    { text: dest.xNome ?? '-', style: 'valueBold' },
                    {
                      text: dest.CPF
                        ? `CPF: ${dest.CPF}`
                        : dest.CNPJ
                          ? `CNPJ: ${dest.CNPJ}`
                          : '-',
                      style: 'infoLabel',
                    },
                    {
                      text: formatarEndereco(dest.enderDest),
                      style: 'info',
                    },
                  ],
                  margin: [5, 3, 5, 3],
                },
              ],
            ],
          },
          layout: 'lightHorizontalLines',
          margin: [0, 2, 0, 0],
        },

        itens.length
          ? {
              table: {
                widths: ['*', 50, 60, 60],
                body: [
                  [
                    { text: 'DESCRIÇÃO DO PRODUTO / SERVIÇO', style: 'tableHeader' },
                    { text: 'QUANT.', style: 'tableHeader', alignment: 'center' },
                    { text: 'VLR. UNIT.', style: 'tableHeader', alignment: 'right' },
                    { text: 'VLR. TOTAL', style: 'tableHeader', alignment: 'right' },
                  ],
                  ...itens.map((i) => [
                    { text: i.descricao, style: 'tableValue' },
                    { text: i.quantidade, style: 'tableValue', alignment: 'center' },
                    { text: `R$ ${i.valorUnitario}`, style: 'tableValue', alignment: 'right' },
                    { text: `R$ ${i.valorTotal}`, style: 'tableValue', alignment: 'right' },
                  ]),
                ],
              },
              layout: {
                hLineWidth: () => 1,
                vLineWidth: () => 1,
                hLineColor: () => '#000000',
                vLineColor: () => '#000000',
              },
              margin: [0, 2, 0, 0],
            }
          : {},

        {
          table: {
            widths: ['*', 100],
            body: [
              [{ text: 'CÁLCULO DO IMPOSTO', style: 'sectionHeader', colSpan: 2 }, {}],
              [
                { text: 'Base de Cálculo ICMS', style: 'labelBold' },
                { text: `R$ ${total?.vBC ?? '0.00'}`, style: 'value', alignment: 'right' },
              ],
              [
                { text: 'Valor ICMS', style: 'labelBold' },
                { text: `R$ ${total?.vICMS ?? '0.00'}`, style: 'value', alignment: 'right' },
              ],
              [
                { text: 'Valor PIS', style: 'labelBold' },
                { text: `R$ ${total?.vPIS ?? '0.00'}`, style: 'value', alignment: 'right' },
              ],
              [
                { text: 'Valor COFINS', style: 'labelBold' },
                { text: `R$ ${total?.vCOFINS ?? '0.00'}`, style: 'value', alignment: 'right' },
              ],
              [
                { text: 'VALOR TOTAL DA NOTA', style: 'totalLabel', bold: true },
                {
                  text: `R$ ${total?.vNF ?? '0.00'}`,
                  style: 'totalValue',
                  alignment: 'right',
                  bold: true,
                },
              ],
            ],
          },
          layout: 'lightHorizontalLines',
          margin: [0, 2, 0, 0],
        },

        infNFe.infAdic?.infCpl
          ? {
              table: {
                widths: ['*'],
                body: [
                  [{ text: 'INFORMAÇÕES COMPLEMENTARES', style: 'sectionHeader' }],
                  [{ text: infNFe.infAdic.infCpl, style: 'info', margin: [5, 3, 5, 3] }],
                ],
              },
              layout: 'lightHorizontalLines',
              margin: [0, 2, 0, 0],
            }
          : {},
      ],
      styles: {
        danfeTitle: {
          fontSize: 14,
          bold: true,
        },
        danfeSubtitle: {
          fontSize: 7,
        },
        sectionHeader: {
          fontSize: 7,
          bold: true,
          fillColor: '#eeeeee',
          margin: [3, 2],
        },
        tableHeader: {
          fontSize: 7,
          bold: true,
          fillColor: '#eeeeee',
          margin: [2, 2],
        },
        tableValue: {
          fontSize: 8,
          margin: [2, 1],
        },
        label: {
          fontSize: 7,
          margin: [3, 1],
        },
        labelBold: {
          fontSize: 7,
          bold: true,
          margin: [3, 1],
        },
        value: {
          fontSize: 8,
          margin: [3, 1],
        },
        valueBold: {
          fontSize: 9,
          bold: true,
          margin: [0, 0],
        },
        info: {
          fontSize: 7,
          margin: [0, 0.5],
        },
        infoLabel: {
          fontSize: 7,
          bold: true,
          margin: [0, 0.5],
        },
        totalLabel: {
          fontSize: 9,
          margin: [3, 2],
        },
        totalValue: {
          fontSize: 10,
          margin: [3, 2],
        },
        chaveAcessoNumeros: {
          fontSize: 7,
          margin: [0, 1],
        },
      },
      defaultStyle: {
        fontSize: 8,
      },
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
