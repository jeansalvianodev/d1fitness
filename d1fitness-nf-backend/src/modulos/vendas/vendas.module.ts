import { Module } from '@nestjs/common';
import { VendasController } from './vendas.controller';
import { VendasService } from './vendas.service';
import { RepositorioVendas } from './repositories/sales.repository';
import { ProvedorVendasMock } from './providers/sales-mock.provider';
import { ProvedorVendasApi } from './providers/sales-api.provider';

@Module({
  controllers: [VendasController],
  providers: [
    VendasService,
    RepositorioVendas,
    ProvedorVendasMock,
    ProvedorVendasApi,
  ],
  exports: [RepositorioVendas],
})
export class VendasModule {}
