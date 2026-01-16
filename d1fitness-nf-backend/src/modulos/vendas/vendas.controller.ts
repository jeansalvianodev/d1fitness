import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { VendasService } from './vendas.service';

@ApiTags('Vendas')
@Controller('vendas')
export class VendasController {
  constructor(private readonly vendasService: VendasService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Listar vendas',
    description: 'Retorna lista de vendas da API externa contendo código da nota fiscal'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de vendas retornada com sucesso',
    schema: {
      example: [
        {
          id: '1',
          data: '2026-01-15',
          cliente: 'Cliente Teste',
          valor: 199.90,
          codigoNotaFiscal: 'NF001'
        }
      ]
    }
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Erro ao buscar vendas da API externa' 
  })
  listar() {
    return this.vendasService.listar();
  }
}
