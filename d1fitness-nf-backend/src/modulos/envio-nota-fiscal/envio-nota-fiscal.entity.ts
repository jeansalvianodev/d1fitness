import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('envios_notas_fiscais')
export class EnvioNotaFiscal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  codigoNotaFiscal: string;

  @Column()
  emailDestino: string;

  @Column()
  status: string;

  @Column({ nullable: true })
  mensagemErro: string;

  @CreateDateColumn()
  dataEnvio: Date;
}
