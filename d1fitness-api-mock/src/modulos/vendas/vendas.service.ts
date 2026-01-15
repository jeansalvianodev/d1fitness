import { Injectable } from '@nestjs/common';

@Injectable()
export class VendasService {
  listar() {
    return [
      {
        codigoVenda: 'VDA001',
        codigoNotaFiscal: 'NF001',
        data: '2024-12-01',
        cliente: 'João Silva',
        valor: 199.9,
        statusEnvio: 'PENDENTE',
      },
      {
        codigoVenda: 'VDA002',
        codigoNotaFiscal: 'NF002',
        data: '2024-12-02',
        cliente: 'Maria Souza',
        valor: 299.9,
        statusEnvio: 'PENDENTE',
      },
      {
        codigoVenda: 'VDA003',
        codigoNotaFiscal: 'NF003',
        data: '2024-12-03',
        cliente: 'Carlos Pereira',
        valor: 149.5,
        statusEnvio: 'PENDENTE',
      },
      {
        codigoVenda: 'VDA004',
        codigoNotaFiscal: 'NF004',
        data: '2024-12-04',
        cliente: 'Ana Oliveira',
        valor: 459.0,
        statusEnvio: 'PENDENTE',
      },
      {
        codigoVenda: 'VDA005',
        codigoNotaFiscal: 'NF005',
        data: '2024-12-05',
        cliente: 'Bruno Santos',
        valor: 89.9,
        statusEnvio: 'PENDENTE',
      },
      {
        codigoVenda: 'VDA006',
        codigoNotaFiscal: 'NF006',
        data: '2024-12-06',
        cliente: 'Fernanda Lima',
        valor: 799.9,
        statusEnvio: 'PENDENTE',
      },
    ];
  }
}
