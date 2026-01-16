import { DataSource } from 'typeorm';
import { EnvioNotaFiscal } from './src/modulos/envio-nota-fiscal/envio-nota-fiscal.entity';
import 'dotenv/config';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
  entities: [EnvioNotaFiscal],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
