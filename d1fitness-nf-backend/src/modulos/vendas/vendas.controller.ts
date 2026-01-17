import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
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
  async listar() {
    return this.vendasService.listar();
  }

  @Get(':codigo')
  @ApiOperation({ 
    summary: 'Buscar venda por código',
    description: 'Retorna os dados de uma venda específica'
  })
  @ApiParam({ 
    name: 'codigo', 
    description: 'Código da venda',
    example: '1'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Venda encontrada',
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Venda não encontrada' 
  })
  buscarPorCodigo(@Param('codigo') codigo: string) {
    return this.vendasService.buscarPorCodigo(codigo);
  }
}
