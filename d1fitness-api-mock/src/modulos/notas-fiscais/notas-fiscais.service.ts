import { Injectable, NotFoundException } from '@nestjs/common';

const VENDAS_MOCK = [
  {
    codigoVenda: 'VDA001',
    codigoNotaFiscal: 'NF001',
    data: '2024-12-01',
    cliente: 'João Silva',
    valor: 199.9,
  },
  {
    codigoVenda: 'VDA002',
    codigoNotaFiscal: 'NF002',
    data: '2024-12-02',
    cliente: 'Maria Souza',
    valor: 299.9,
  },
  {
    codigoVenda: 'VDA003',
    codigoNotaFiscal: 'NF003',
    data: '2024-12-03',
    cliente: 'Carlos Pereira',
    valor: 149.5,
  },
  {
    codigoVenda: 'VDA004',
    codigoNotaFiscal: 'NF004',
    data: '2024-12-04',
    cliente: 'Ana Oliveira',
    valor: 459.0,
  },
  {
    codigoVenda: 'VDA005',
    codigoNotaFiscal: 'NF005',
    data: '2024-12-05',
    cliente: 'Bruno Santos',
    valor: 89.9,
  },
  {
    codigoVenda: 'VDA006',
    codigoNotaFiscal: 'NF006',
    data: '2024-12-06',
    cliente: 'Fernanda Lima',
    valor: 799.9,
  },
];

@Injectable()
export class NotasFiscaisService {
  private gerarChaveAcesso(numeroNF: string, dataEmissao: string): string {
    const uf = '35';
    const aamm = dataEmissao.substring(2, 4) + dataEmissao.substring(5, 7);
    const cnpj = '12345678000199';
    const mod = '55';
    const serie = '001';
    const nf = numeroNF.padStart(9, '0');
    const tpEmis = '1';
    const cNF = (parseInt(numeroNF) * 123456)
      .toString()
      .padStart(8, '0')
      .substring(0, 8);

    const chave = uf + aamm + cnpj + mod + serie + nf + tpEmis + cNF;

    let soma = 0;
    let multiplicador = 2;

    for (let i = chave.length - 1; i >= 0; i--) {
      soma += parseInt(chave[i]) * multiplicador;
      multiplicador = multiplicador === 9 ? 2 : multiplicador + 1;
    }

    const resto = soma % 11;
    const dv = resto < 2 ? 0 : 11 - resto;

    return chave + dv;
  }

  buscarPorCodigo(codigo: string) {
    const venda = VENDAS_MOCK.find((v) => v.codigoNotaFiscal === codigo);

    if (!venda) {
      throw new NotFoundException('Nota fiscal não encontrada');
    }

    const numeroNF = codigo.replace('NF', '');
    const dataEmissao = new Date(venda.data + 'T10:00:00').toISOString();
    const chaveAcesso = this.gerarChaveAcesso(numeroNF, dataEmissao);

    const baseCalculo = venda.valor;
    const valorICMS = baseCalculo * 0.18;
    const valorPIS = baseCalculo * 0.0165;
    const valorCOFINS = baseCalculo * 0.076;

    return {
      codigoNotaFiscal: codigo,
      xml: `
<?xml version="1.0" encoding="UTF-8"?>
<NFe xmlns="http://www.portalfiscal.inf.br/nfe">
  <infNFe Id="NFe${chaveAcesso}" versao="4.00">
    <ide>
      <cUF>35</cUF>
      <cNF>${chaveAcesso.substring(35, 43)}</cNF>
      <natOp>Venda de Servico</natOp>
      <mod>55</mod>
      <serie>1</serie>
      <nNF>${numeroNF}</nNF>
      <dhEmi>${dataEmissao}</dhEmi>
      <tpNF>1</tpNF>
      <idDest>1</idDest>
      <cMunFG>3550308</cMunFG>
      <tpImp>1</tpImp>
      <tpEmis>1</tpEmis>
      <cDV>${chaveAcesso.substring(43)}</cDV>
      <tpAmb>2</tpAmb>
      <finNFe>1</finNFe>
      <indFinal>1</indFinal>
      <indPres>1</indPres>
      <procEmi>0</procEmi>
      <verProc>1.0.0</verProc>
    </ide>

    <emit>
      <CNPJ>12345678000199</CNPJ>
      <xNome>D1FITNESS ACADEMIA LTDA</xNome>
      <xFant>D1FITNESS</xFant>
      <enderEmit>
        <xLgr>Avenida Paulista</xLgr>
        <nro>1000</nro>
        <xBairro>Bela Vista</xBairro>
        <cMun>3550308</cMun>
        <xMun>Sao Paulo</xMun>
        <UF>SP</UF>
        <CEP>01310100</CEP>
        <cPais>1058</cPais>
        <xPais>Brasil</xPais>
        <fone>1130001000</fone>
      </enderEmit>
      <IE>123456789012</IE>
      <CRT>3</CRT>
    </emit>

    <dest>
      <CPF>${this.gerarCPF(numeroNF)}</CPF>
      <xNome>${venda.cliente}</xNome>
      <enderDest>
        <xLgr>Rua das Flores</xLgr>
        <nro>${(parseInt(numeroNF) * 10).toString()}</nro>
        <xBairro>Centro</xBairro>
        <cMun>3550308</cMun>
        <xMun>Sao Paulo</xMun>
        <UF>SP</UF>
        <CEP>01000000</CEP>
        <cPais>1058</cPais>
        <xPais>Brasil</xPais>
      </enderDest>
      <indIEDest>9</indIEDest>
      <email>cliente@email.com</email>
    </dest>

    <det nItem="1">
      <prod>
        <cProd>PLAN001</cProd>
        <cEAN>SEM GTIN</cEAN>
        <xProd>Plano Mensal Academia - Musculacao e Aerobico</xProd>
        <NCM>99999999</NCM>
        <CFOP>5933</CFOP>
        <uCom>UN</uCom>
        <qCom>1.0000</qCom>
        <vUnCom>${venda.valor.toFixed(2)}</vUnCom>
        <vProd>${venda.valor.toFixed(2)}</vProd>
        <cEANTrib>SEM GTIN</cEANTrib>
        <uTrib>UN</uTrib>
        <qTrib>1.0000</qTrib>
        <vUnTrib>${venda.valor.toFixed(2)}</vUnTrib>
        <indTot>1</indTot>
      </prod>
      <imposto>
        <ICMS>
          <ICMSSN102>
            <orig>0</orig>
            <CSOSN>102</CSOSN>
          </ICMSSN102>
        </ICMS>
        <PIS>
          <PISOutr>
            <CST>99</CST>
            <vBC>${baseCalculo.toFixed(2)}</vBC>
            <pPIS>1.65</pPIS>
            <vPIS>${valorPIS.toFixed(2)}</vPIS>
          </PISOutr>
        </PIS>
        <COFINS>
          <COFINSOutr>
            <CST>99</CST>
            <vBC>${baseCalculo.toFixed(2)}</vBC>
            <pCOFINS>7.60</pCOFINS>
            <vCOFINS>${valorCOFINS.toFixed(2)}</vCOFINS>
          </COFINSOutr>
        </COFINS>
      </imposto>
    </det>

    <total>
      <ICMSTot>
        <vBC>${baseCalculo.toFixed(2)}</vBC>
        <vICMS>0.00</vICMS>
        <vICMSDeson>0.00</vICMSDeson>
        <vFCP>0.00</vFCP>
        <vBCST>0.00</vBCST>
        <vST>0.00</vST>
        <vFCPST>0.00</vFCPST>
        <vFCPSTRet>0.00</vFCPSTRet>
        <vProd>${venda.valor.toFixed(2)}</vProd>
        <vFrete>0.00</vFrete>
        <vSeg>0.00</vSeg>
        <vDesc>0.00</vDesc>
        <vII>0.00</vII>
        <vIPI>0.00</vIPI>
        <vIPIDevol>0.00</vIPIDevol>
        <vPIS>${valorPIS.toFixed(2)}</vPIS>
        <vCOFINS>${valorCOFINS.toFixed(2)}</vCOFINS>
        <vOutro>0.00</vOutro>
        <vNF>${venda.valor.toFixed(2)}</vNF>
      </ICMSTot>
    </total>

    <transp>
      <modFrete>9</modFrete>
    </transp>

    <pag>
      <detPag>
        <indPag>0</indPag>
        <tPag>03</tPag>
        <vPag>${venda.valor.toFixed(2)}</vPag>
      </detPag>
    </pag>

    <infAdic>
      <infCpl>Documento emitido por D1FITNESS Academia - Validade do plano: 30 dias a partir da data de emissao</infCpl>
    </infAdic>
  </infNFe>
</NFe>
      `.trim(),
    };
  }

  private gerarCPF(numeroNF: string): string {
    const base = numeroNF.padStart(9, '0');
    return (
      base.substring(0, 3) +
      '.' +
      base.substring(3, 6) +
      '.' +
      base.substring(6, 9) +
      '-00'
    );
  }
}
