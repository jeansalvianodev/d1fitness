import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendasModule } from './modulos/vendas/vendas.module';
import { NotasFiscaisModule } from './modulos/notas-fiscais/notas-fiscais.module';
import { GeracaoDanfeModule } from './modulos/geracao-danfe/geracao-danfe.module';
import { EmailModule } from './modulos/email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: false,
      ssl: true,
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    }),
    VendasModule,
    NotasFiscaisModule,
    GeracaoDanfeModule,
    EmailModule
  ],
})
export class AppModule {}
