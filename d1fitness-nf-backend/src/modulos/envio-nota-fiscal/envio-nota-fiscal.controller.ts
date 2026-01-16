import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EnvioNotaFiscalService } from './envio-nota-fiscal.service';
import { EnviarNotaFiscalDto } from './dto/enviar-nota-fiscal.dto';

@ApiTags('Envio de Notas Fiscais')
@Controller('envios-nota-fiscal')
export class EnvioNotaFiscalController {
  constructor(private readonly service: EnvioNotaFiscalService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Enviar nota fiscal por email',
    description: 'Busca a nota fiscal, gera o PDF (DANFE) e envia por email com XML e PDF em anexo'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Nota fiscal enviada com sucesso',
    schema: {
      example: { mensagem: 'Nota Fiscal enviada com sucesso' }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dados inválidos ou XML malformado' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Nota fiscal não encontrada' 
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Erro ao enviar email ou gerar PDF' 
  })
  enviar(@Body() dto: EnviarNotaFiscalDto) {
    return this.service.enviar(
      dto.codigoNotaFiscal,
      dto.email,
    );
  }

  @Get('nota-fiscal/:codigo')
  @ApiOperation({ 
    summary: 'Buscar histórico de envios de uma nota fiscal',
    description: 'Retorna todos os envios realizados para uma nota fiscal específica'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Histórico de envios encontrado'
  })
  buscarPorNotaFiscal(@Param('codigo') codigo: string) {
    return this.service.buscarPorNotaFiscal(codigo);
  }
}
