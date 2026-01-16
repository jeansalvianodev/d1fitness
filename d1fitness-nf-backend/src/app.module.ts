import 'dotenv/config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendasModule } from './modulos/vendas/vendas.module';
import { NotasFiscaisModule } from './modulos/notas-fiscais/notas-fiscais.module';
import { GeracaoDanfeModule } from './modulos/geracao-danfe/geracao-danfe.module';
import { EmailModule } from './modulos/email/email.module';
import { EnvioNotaFiscalModule } from './modulos/envio-nota-fiscal/envio-nota-fiscal.module';

const isSSL = process.env.DB_SSL === 'true';

console.log('ENV CHECK', {
  DB_USER: process.env.DB_USER,
  DB_NAME: process.env.DB_NAME,
  DB_SSL: process.env.DB_SSL,
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,

      autoLoadEntities: true,
      synchronize: false,

      ssl: isSSL,
      ...(isSSL && {
        extra: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
      }),
    }),

    VendasModule,
    NotasFiscaisModule,
    GeracaoDanfeModule,
    EmailModule,
    EnvioNotaFiscalModule,
  ],
})
export class AppModule {}
