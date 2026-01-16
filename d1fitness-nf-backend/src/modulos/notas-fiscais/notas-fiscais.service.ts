import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { parseStringPromise } from 'xml2js';

@Injectable()
export class NotasFiscaisService {
  async buscarPorCodigo(codigo: string) {
    const url = process.env.API_NOTAS_FISCAIS_URL;

    if (!url) {
      throw new Error('API_NOTAS_FISCAIS_URL não configurada');
    }

    let response;

    try {
      response = await axios.get(`${url}/${codigo}`);
    } catch {
      throw new NotFoundException('Nota fiscal não encontrada');
    }

    if (!response.data?.xml) {
      throw new BadRequestException('Nota fiscal sem XML');
    }

    try {
      await parseStringPromise(response.data.xml);
    } catch {
      throw new BadRequestException('XML inválido');
    }

    return response.data;
  }
}
