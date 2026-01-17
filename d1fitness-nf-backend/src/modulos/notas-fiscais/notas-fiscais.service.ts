import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { parseStringPromise } from 'xml2js';
import { RepositorioVendas } from '../vendas/repositories/sales.repository';

@Injectable()
export class NotasFiscaisService {
  constructor(private readonly repositorioVendas: RepositorioVendas) {}

  async buscarPorCodigo(codigo: string) {
    let notaFiscal;

    try {
      const resultado = await this.repositorioVendas.obterNotaFiscal(codigo);
      notaFiscal = Array.isArray(resultado) ? resultado[0] : resultado;
      
      if (!notaFiscal) {
        throw new NotFoundException('Nota fiscal não encontrada');
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException('Nota fiscal não encontrada');
    }

    const xml = notaFiscal.xml || notaFiscal.xmlNfe;
    
    if (!xml) {
      throw new BadRequestException('XML não disponível na API D1FITNESS para esta nota fiscal');
    }
    
    try {
      await parseStringPromise(xml);
    } catch (erro) {
      throw new BadRequestException(`XML inválido: ${erro.message}`);
    }

    return {
      ...notaFiscal,
      xml,
    };
  }
}
