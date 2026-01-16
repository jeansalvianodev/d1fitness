import { Test, TestingModule } from '@nestjs/testing';
import { NotasFiscaisService } from './notas-fiscais.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('NotasFiscaisService', () => {
  let service: NotasFiscaisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotasFiscaisService],
    }).compile();

    service = module.get<NotasFiscaisService>(NotasFiscaisService);
    process.env.API_NOTAS_FISCAIS_URL = 'http://localhost:3000/notas-fiscais';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('buscarPorCodigo', () => {
    const validXml = `
      <?xml version="1.0" encoding="UTF-8"?>
      <NFe>
        <infNFe>
          <ide><nNF>001</nNF></ide>
          <emit><xNome>D1FITNESS</xNome></emit>
          <dest><xNome>Cliente Teste</xNome></dest>
          <total><ICMSTot><vNF>199.90</vNF></ICMSTot></total>
        </infNFe>
      </NFe>
    `;

    it('deve retornar nota fiscal com XML válido', async () => {
      const mockResponse = {
        data: {
          codigoNotaFiscal: 'NF001',
          xml: validXml,
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await service.buscarPorCodigo('NF001');

      expect(result).toEqual(mockResponse.data);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'http://localhost:3000/notas-fiscais/NF001',
      );
    });

    it('deve lançar NotFoundException se nota não for encontrada', async () => {
      mockedAxios.get.mockRejectedValue({ response: { status: 404 } });

      await expect(service.buscarPorCodigo('NF999')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('deve lançar BadRequestException se XML for inválido', async () => {
      const mockResponse = {
        data: {
          codigoNotaFiscal: 'NF001',
          xml: 'XML inválido <<>>',
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      await expect(service.buscarPorCodigo('NF001')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('deve lançar BadRequestException se resposta não tiver XML', async () => {
      const mockResponse = {
        data: {
          codigoNotaFiscal: 'NF001',
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      await expect(service.buscarPorCodigo('NF001')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('deve lançar erro se API_NOTAS_FISCAIS_URL não estiver configurada', async () => {
      delete process.env.API_NOTAS_FISCAIS_URL;

      await expect(service.buscarPorCodigo('NF001')).rejects.toThrow(
        'API_NOTAS_FISCAIS_URL não configurada',
      );
    });
  });
});
