import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class VendasService {
  async listar() {
    const url = process.env.API_VENDAS_URL;

    if (!url) {
      throw new Error('API_VENDAS_URL não configurada');
    }

    const response = await axios.get(url);
    return response.data;
  }
}
