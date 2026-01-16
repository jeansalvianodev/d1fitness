import { Test, TestingModule } from '@nestjs/testing';
import { VendasService } from './vendas.service';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('VendasService', () => {
  let service: VendasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VendasService],
    }).compile();

    service = module.get<VendasService>(VendasService);
    process.env.API_VENDAS_URL = 'http://localhost:3000/vendas';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('listar', () => {
    it('deve retornar lista de vendas da API externa', async () => {
      const mockVendas = [
        {
          id: '1',
          data: '2026-01-15',
          cliente: 'Cliente Teste',
          valor: 199.90,
          codigoNotaFiscal: 'NF001',
        },
      ];

      mockedAxios.get.mockResolvedValue({ data: mockVendas });

      const result = await service.listar();

      expect(result).toEqual(mockVendas);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'http://localhost:3000/vendas',
      );
    });

    it('deve lançar erro se API_VENDAS_URL não estiver configurada', async () => {
      delete process.env.API_VENDAS_URL;

      await expect(service.listar()).rejects.toThrow(
        'API_VENDAS_URL não configurada',
      );
    });

    it('deve propagar erro se a API externa falhar', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Erro de conexão'));

      await expect(service.listar()).rejects.toThrow('Erro de conexão');
    });
  });
});
