import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Resend } from 'resend';

type AnexoEmail = {
  nome: string;
  conteudo: Buffer;
  tipo: string;
};

@Injectable()
export class EmailService {
  private resend = new Resend(process.env.RESEND_API_KEY);

  async enviar(
    para: string,
    assunto: string,
    mensagem: string,
    anexos: AnexoEmail[],
  ): Promise<void> {
    try {
      await this.resend.emails.send({
        from: process.env.EMAIL_FROM as string,
        to: para,
        subject: assunto,
        text: mensagem,
        attachments: anexos.map((anexo) => ({
          filename: anexo.nome,
          content: anexo.conteudo.toString('base64'),
          type: anexo.tipo,
        })),
      });
    } catch {
      throw new InternalServerErrorException('Erro ao enviar email');
    }
  }
}
