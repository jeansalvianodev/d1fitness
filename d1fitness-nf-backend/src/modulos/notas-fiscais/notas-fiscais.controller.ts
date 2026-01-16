import { Controller, Get, Param } from '@nestjs/common';
import { NotasFiscaisService } from './notas-fiscais.service';

@Controller('notas-fiscais')
export class NotasFiscaisController {
  constructor(private readonly notasService: NotasFiscaisService) {}

  @Get(':codigo')
  buscar(@Param('codigo') codigo: string) {
    return this.notasService.buscarPorCodigo(codigo);
  }
}
