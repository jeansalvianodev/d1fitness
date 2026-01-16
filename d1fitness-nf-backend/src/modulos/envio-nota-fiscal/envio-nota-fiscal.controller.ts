import { Controller, Post, Body } from '@nestjs/common';
import { EnvioNotaFiscalService } from './envio-nota-fiscal.service';
import { EnviarNotaFiscalDto } from './dto/enviar-nota-fiscal.dto';

@Controller('envios-nota-fiscal')
export class EnvioNotaFiscalController {
  constructor(private readonly service: EnvioNotaFiscalService) {}

  @Post()
  enviar(@Body() dto: EnviarNotaFiscalDto) {
    return this.service.enviar(
      dto.codigoNotaFiscal,
      dto.email,
    );
  }
}
