import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EnvioNotaFiscal } from './envio-nota-fiscal.entity';
import { NotasFiscaisService } from '../notas-fiscais/notas-fiscais.service';
import { GeracaoDanfeService } from '../geracao-danfe/geracao-danfe.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class EnvioNotaFiscalService {
  constructor(
    @InjectRepository(EnvioNotaFiscal)
    private readonly envioRepository: Repository<EnvioNotaFiscal>,
    private readonly notasService: NotasFiscaisService,
    private readonly danfeService: GeracaoDanfeService,
    private readonly emailService: EmailService,
  ) {}

  async enviar(codigoNotaFiscal: string, email: string) {
    const registro = this.envioRepository.create({
      codigoNotaFiscal,
      emailDestino: email,
      status: 'PROCESSANDO',
    });

    await this.envioRepository.save(registro);

    try {
      const nota = await this.notasService.buscarPorCodigo(codigoNotaFiscal);

      const pdf = await this.danfeService.gerar(nota.xml);

      await this.emailService.enviar(
        email,
        `Nota Fiscal #${codigoNotaFiscal} - D1FITNESS`,
        'Olá! Segue em anexo a sua Nota Fiscal conforme solicitado.',
        [
          {
            nome: `${codigoNotaFiscal}.xml`,
            conteudo: Buffer.from(nota.xml, 'utf-8'),
            tipo: 'application/xml',
          },
          {
            nome: `${codigoNotaFiscal}.pdf`,
            conteudo: pdf,
            tipo: 'application/pdf',
          },
        ],
      );

      registro.status = 'SUCESSO';
      await this.envioRepository.save(registro);

      return { mensagem: 'Nota Fiscal enviada com sucesso' };
    } catch (erro: any) {
      registro.status = 'ERRO';
      registro.mensagemErro = erro.message || 'Erro desconhecido';
      await this.envioRepository.save(registro);

      console.error('Erro ao processar envio de nota fiscal:', {
        codigoNotaFiscal,
        email,
        erro: erro.message,
        registroId: registro.id,
      });

      throw erro;
    }
  }

  async buscarPorNotaFiscal(codigoNotaFiscal: string) {
    return this.envioRepository.find({
      where: { codigoNotaFiscal },
      order: { dataEnvio: 'DESC' },
    });
  }
}
