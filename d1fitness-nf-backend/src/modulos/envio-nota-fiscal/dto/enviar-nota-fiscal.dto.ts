import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EnviarNotaFiscalDto {
  @ApiProperty({
    description: 'Código da nota fiscal a ser enviada',
    example: 'NF001',
  })
  @IsString()
  @IsNotEmpty()
  codigoNotaFiscal: string;

  @ApiProperty({
    description: 'Email do destinatário para receber a nota fiscal',
    example: 'destinatario@exemplo.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
