import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateEnvioNotaFiscalTable1234567890123 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'envios_notas_fiscais',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'codigoNotaFiscal',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'emailDestino',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '20',
            isNullable: false,
            default: "'PROCESSANDO'",
          },
          {
            name: 'mensagemErro',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'dataEnvio',
            type: 'timestamp',
            isNullable: false,
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'envios_notas_fiscais',
      new TableIndex({
        name: 'IDX_ENVIO_NOTA_FISCAL_CODIGO',
        columnNames: ['codigoNotaFiscal'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('envios_notas_fiscais');
  }
}
