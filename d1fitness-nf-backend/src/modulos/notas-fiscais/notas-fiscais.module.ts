import { Module } from '@nestjs/common';
import { NotasFiscaisController } from './notas-fiscais.controller';
import { NotasFiscaisService } from './notas-fiscais.service';
import { VendasModule } from '../vendas/vendas.module';

@Module({
  imports: [VendasModule],
  controllers: [NotasFiscaisController],
  providers: [NotasFiscaisService],
  exports: [NotasFiscaisService]
})
export class NotasFiscaisModule {}
