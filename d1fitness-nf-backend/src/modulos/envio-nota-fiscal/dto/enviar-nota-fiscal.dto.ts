import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class EnviarNotaFiscalDto {
  @IsString()
  @IsNotEmpty()
  codigoNotaFiscal: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
