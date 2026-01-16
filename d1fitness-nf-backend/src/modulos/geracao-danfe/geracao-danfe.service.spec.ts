import { Test, TestingModule } from '@nestjs/testing';
import { GeracaoDanfeService } from './geracao-danfe.service';
import { BadRequestException } from '@nestjs/common';

describe('GeracaoDanfeService', () => {
  let service: GeracaoDanfeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeracaoDanfeService],
    }).compile();

    service = module.get<GeracaoDanfeService>(GeracaoDanfeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('gerar', () => {
    const validXml = `
      <?xml version="1.0" encoding="UTF-8"?>
      <NFe>
        <infNFe>
          <ide>
            <nNF>001</nNF>
            <serie>1</serie>
            <dhEmi>2026-01-15T10:30:00-03:00</dhEmi>
          </ide>
          <emit>
            <xNome>D1FITNESS</xNome>
          </emit>
          <dest>
            <xNome>Cliente Teste</xNome>
          </dest>
          <det nItem="1">
            <prod>
              <xProd>Produto Teste</xProd>
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
    `;

    it('deve gerar PDF a partir de XML válido', async () => {
      const result = await service.gerar(validXml);

      expect(result).toBeInstanceOf(Buffer);
      expect(result.length).toBeGreaterThan(0);
    });

    it('deve lançar BadRequestException para XML inválido', async () => {
      const invalidXml = 'XML inválido <<>>';

      await expect(service.gerar(invalidXml)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.gerar(invalidXml)).rejects.toThrow('XML inválido');
    });

    it('deve lançar BadRequestException se XML não tiver estrutura de NF', async () => {
      const xmlSemNF = `
        <?xml version="1.0" encoding="UTF-8"?>
        <root>
          <data>teste</data>
        </root>
      `;

      await expect(service.gerar(xmlSemNF)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.gerar(xmlSemNF)).rejects.toThrow(
        'Estrutura de NF inválida',
      );
    });
  });
});
