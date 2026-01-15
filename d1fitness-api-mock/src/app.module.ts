import { Module } from '@nestjs/common';
import { VendasModule } from './modulos/vendas/vendas.module';
import { NotasFiscaisModule } from './modulos/notas-fiscais/notas-fiscais.module';

@Module({
  imports: [VendasModule, NotasFiscaisModule],
})
export class AppModule {}
