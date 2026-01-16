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
      const response = await this.resend.emails.send({
        from: process.env.EMAIL_FROM as string,
        to: para,
        subject: assunto,
        text: mensagem,
        attachments: anexos.map((anexo) => ({
          filename: anexo.nome,
          content: Buffer.isBuffer(anexo.conteudo)
            ? anexo.conteudo.toString('base64')
            : Buffer.from(anexo.conteudo, 'utf-8').toString('base64'),
        })),
      });

      if (response.error) {
        throw new Error(response.error.message || 'Erro ao enviar email');
      }
      if (!response.data || !response.data.id) {
        throw new Error(
          'Email não foi aceito pelo servidor. Verifique as configurações.',
        );
      }

      console.log('Email enviado com sucesso:', {
        destinatario: para,
        emailId: response.data.id,
      });
    } catch (erro: any) {
      console.error('Erro ao enviar email:', {
        destinatario: para,
        erro: erro.message,
        statusCode: erro.statusCode,
        detalhes: erro.response?.data || erro.response,
      });

      const mensagemErro = erro.message?.toLowerCase() || '';

      if (
        mensagemErro.includes('can only send') ||
        mensagemErro.includes('testing domain') ||
        mensagemErro.includes('verify a domain') ||
        mensagemErro.includes('testing emails')
      ) {
        const emailMatch = erro.message?.match(/\(([^)]+@[^)]+)\)/);
        const emailAutorizado = emailMatch ? emailMatch[1] : 'seu email verificado';

        throw new InternalServerErrorException(
          `Email não autorizado. Em ambiente de teste do Resend, você só pode enviar para ${emailAutorizado}. Para enviar a outros destinatários, verifique um domínio em resend.com/domains.`,
        );
      }

      if (mensagemErro.includes('invalid email')) {
        throw new InternalServerErrorException(
          'Endereço de email inválido.',
        );
      }

      if (mensagemErro.includes('api key')) {
        throw new InternalServerErrorException(
          'Chave de API inválida ou não configurada.',
        );
      }

      throw new InternalServerErrorException(
        `Erro ao enviar email: ${erro.message || 'Erro desconhecido'}`,
      );
    }
  }
}
