import { Module } from '@nestjs/common';
import { GeracaoDanfeService } from './geracao-danfe.service';

@Module({
  providers: [GeracaoDanfeService],
  exports: [GeracaoDanfeService],
})
export class GeracaoDanfeModule {}
