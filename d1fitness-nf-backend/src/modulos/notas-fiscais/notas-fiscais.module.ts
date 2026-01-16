import { Module } from '@nestjs/common';
import { NotasFiscaisController } from './notas-fiscais.controller';
import { NotasFiscaisService } from './notas-fiscais.service';

@Module({
  controllers: [NotasFiscaisController],
  providers: [NotasFiscaisService],
  exports: [NotasFiscaisService]
})
export class NotasFiscaisModule {}
