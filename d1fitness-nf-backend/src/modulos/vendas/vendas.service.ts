import { Injectable } from '@nestjs/common';
import { RepositorioVendas } from './repositories/sales.repository';

@Injectable()
export class VendasService {
  constructor(private readonly repositorioVendas: RepositorioVendas) {}

  async listar() {
    return await this.repositorioVendas.obterVendas();
  }

  async buscarPorCodigo(codigo: string) {
    return await this.repositorioVendas.obterVendaPorCodigo(codigo);
  }
}
