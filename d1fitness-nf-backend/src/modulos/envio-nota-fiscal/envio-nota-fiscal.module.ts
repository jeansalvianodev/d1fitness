import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvioNotaFiscal } from './envio-nota-fiscal.entity';
import { EnvioNotaFiscalService } from './envio-nota-fiscal.service';
import { EnvioNotaFiscalController } from './envio-nota-fiscal.controller';
import { NotasFiscaisModule } from '../notas-fiscais/notas-fiscais.module';
import { GeracaoDanfeModule } from '../geracao-danfe/geracao-danfe.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EnvioNotaFiscal]),
    NotasFiscaisModule,
    GeracaoDanfeModule,
    EmailModule,
  ],
  controllers: [EnvioNotaFiscalController],
  providers: [EnvioNotaFiscalService],
})
export class EnvioNotaFiscalModule {}
