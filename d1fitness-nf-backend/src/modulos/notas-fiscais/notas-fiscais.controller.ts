import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { NotasFiscaisService } from './notas-fiscais.service';

@ApiTags('Notas Fiscais')
@Controller('notas-fiscais')
export class NotasFiscaisController {
  constructor(private readonly notasService: NotasFiscaisService) {}

  @Get(':codigo')
  @ApiOperation({ 
    summary: 'Buscar nota fiscal por código',
    description: 'Retorna os dados da nota fiscal incluindo o XML. Valida se o XML é válido.'
  })
  @ApiParam({ 
    name: 'codigo', 
    description: 'Código da nota fiscal',
    example: 'NF001'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Nota fiscal encontrada',
    schema: {
      example: {
        codigoNotaFiscal: 'NF001',
        xml: '<?xml version="1.0" encoding="UTF-8"?>...'
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'XML inválido' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Nota fiscal não encontrada' 
  })
  buscar(@Param('codigo') codigo: string) {
    return this.notasService.buscarPorCodigo(codigo);
  }
}
