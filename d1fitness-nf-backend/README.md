# D1FITNESS - Sistema de Envio de Notas Fiscais

Backend da aplicação de automação de envio de Notas Fiscais por email, desenvolvido como teste técnico para D1FITNESS.

## Sobre o Projeto

Este sistema automatiza o processo de envio de Notas Fiscais eletrônicas (NF-e) por email. Ele consome APIs de vendas e notas fiscais, processa arquivos XML, gera PDFs no formato DANFE e envia tudo por email com anexos.

**Funcionalidades principais:**
- Integração com API de vendas (mock ou API real D1FITNESS)
- Busca de notas fiscais por código com validação de XML
- Geração de DANFE (PDF) a partir do XML da NF-e
- Envio de email com XML e PDF em anexo
- Rastreamento de envios com registro em banco de dados
- Alternância entre mock e API real via configuração

## Integração com API D1FITNESS

O sistema suporta dois modos de operação:

### Modo Mock (padrão)
Consome API local mockada em `http://localhost:3000`

### Modo API Real
Consome API D1FITNESS em `https://d1-teste-dev-fullstack.morefocus.com.br`

**Alternar entre os modos:**
```env
# No arquivo .env
SALES_PROVIDER=mock  # ou 'api'
```

A arquitetura utiliza padrão Repository para abstrair a origem dos dados, permitindo que o código não precise saber se está usando mock ou API real.

## Tecnologias Utilizadas

- **NestJS** - Framework Node.js para construção de APIs robustas
- **TypeORM** - ORM para gerenciamento do banco de dados
- **PostgreSQL** - Banco de dados relacional
- **Resend** - Serviço de envio de emails transacionais
- **pdfmake** - Geração de PDFs
- **xml2js** - Parser e validação de XML
- **Swagger/OpenAPI** - Documentação interativa da API

## Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [PostgreSQL](https://www.postgresql.org/) (versão 14 ou superior)
- [Git](https://git-scm.com/)
- Uma conta no [Resend](https://resend.com) para envio de emails

## Configuração do Banco de Dados

> **⚠️ IMPORTANTE - SEGURANÇA:**  
> Este projeto utiliza um banco PostgreSQL remoto **apenas para fins de demonstração**.  
> Por questões de segurança, **não incluí credenciais reais** no repositório.  
> Para testar o projeto, você **não precisa usar meu banco remoto**.  
> Basta criar seu próprio banco local ou remoto e configurar o arquivo `.env` com suas credenciais.  
> Use os placeholders do `.env.example` para substituir `DB_USER`, `DB_PASS`, `DB_HOST` e `DB_NAME`.  
> Isso garante que você terá um ambiente totalmente funcional sem acessar dados de terceiros.

### ⚠️ Observação Importante sobre SSL (PostgreSQL)

Este projeto foi ajustado para funcionar tanto com **PostgreSQL local** quanto com **PostgreSQL remoto (cloud)**.

- Bancos **locais** normalmente **não utilizam SSL**
- Bancos **remotos** normalmente **exigem SSL**

Para suportar ambos os cenários, foi criada a variável de ambiente:

```env
DB_SSL=true | false
```

#### Como configurar corretamente:

| Ambiente | DB_SSL |
|--------|--------|
| PostgreSQL local | false |
| Supabase / Neon / Railway / Azure | true |

Se `DB_SSL` estiver configurado incorretamente, o seguinte erro pode ocorrer:

```
no pg_hba.conf entry for host "...", user "...", database "...", no encryption
```

Esse comportamento é esperado e indica que o banco remoto exige conexão criptografada.

### Opção 1: Banco Local (Recomendado para testes)

```bash
# Criar um banco local no PostgreSQL
createdb d1fitness_test

# Ou via psql
psql -U postgres
CREATE DATABASE d1fitness_test;
```

### Opção 2: Banco Remoto

Você pode usar qualquer serviço de PostgreSQL:
- [Supabase](https://supabase.com) (gratuito)
- [Neon](https://neon.tech) (gratuito)
- [Railway](https://railway.app)
- Azure Database for PostgreSQL

**Dica:** Configure o firewall para permitir seu IP ou use `0.0.0.0/0` apenas em ambientes de teste.

## Instalação e Setup

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd d1fitness-nf-backend
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:

```env
# Porta do servidor
PORT=3001

# Configurações do Banco de Dados PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS="sua_senha_aqui"
DB_NAME=d1fitness_test
DB_SSL=false  # false para banco local, true para remoto

# Configuração do Resend (Serviço de Email)
RESEND_API_KEY=re_sua_chave_api_aqui
EMAIL_FROM=Seu Nome <seu-email@seudominio.com>

# Provider de vendas: 'mock' ou 'api'
SALES_PROVIDER=mock

# URL da API real D1FITNESS (usado quando SALES_PROVIDER=api)
SALES_API_BASE_URL=https://d1-teste-dev-fullstack.morefocus.com.br

# Fallback para mock em caso de erro
SALES_FALLBACK_TO_MOCK=false

# URLs da API Mock (usadas quando SALES_PROVIDER=mock)
API_VENDAS_URL=http://localhost:3000/vendas
API_NOTAS_FISCAIS_URL=http://localhost:3000/notas-fiscais
```

## Ordem correta de inicialização (IMPORTANTE)

A ordem correta para iniciar o ambiente local é:

1. **API Mock**
2. **Backend**
3. **Frontend**

Isso evita erros por dependência de serviços (o backend depende da mock para consumir vendas e notas fiscais).

### 4. Execute a API Mock

A API mock simula os endpoints de vendas e notas fiscais. Abra um **novo terminal** e execute:

```bash
cd ../d1fitness-api-mock
npm install
npm run start:dev
```

A API mock estará disponível em `http://localhost:3000`

### 5. Execute as migrations

As migrations criam as tabelas necessárias no banco de dados:

```bash
npm run migration:run
```

Isso criará a tabela `envios_notas_fiscais` com os seguintes campos:
- `id` (UUID)
- `codigoNotaFiscal` (string)
- `emailDestino` (string)
- `status` (PROCESSANDO | SUCESSO | ERRO)
- `mensagemErro` (string, nullable)
- `dataEnvio` (timestamp)

### 6. Execute o backend

No terminal do backend, execute:

```bash
npm run start:dev
```

O backend estará disponível em `http://localhost:3001`

### 7. Execute o frontend

No terminal do frontend, execute:

```bash
cd ../d1fitness-frontend
npm install
npm run start
```

## Endpoints Disponíveis

### 1. Listar Vendas

```http
GET http://localhost:3001/vendas
```

**Resposta:**
```json
[
  {
    "id": "1",
    "data": "2026-01-15",
    "cliente": "Cliente Teste",
    "valor": 199.90,
    "codigoNotaFiscal": "NF001"
  }
]
```

### 2. Buscar Nota Fiscal

```http
GET http://localhost:3001/notas-fiscais/NF001
```

**Resposta:**
```json
{
  "codigoNotaFiscal": "NF001",
  "xml": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>..."
}
```

### 3. Enviar Nota Fiscal por Email

```http
POST http://localhost:3001/envios-nota-fiscal
Content-Type: application/json

{
  "codigoNotaFiscal": "NF001",
  "email": "destinatario@email.com"
}
```

**Resposta de sucesso:**
```json
{
  "mensagem": "Nota Fiscal enviada com sucesso"
}
```

**Resposta de erro (email não autorizado):**
```json
{
  "message": "Email não autorizado. Em ambiente de teste do Resend, você só pode enviar para seu-email@exemplo.com. Para enviar a outros destinatários, verifique um domínio em resend.com/domains.",
  "error": "Internal Server Error",
  "statusCode": 500
}
```

## Documentação Interativa (Swagger)

Acesse a documentação interativa da API em:

```
http://localhost:3001/docs
```

Você pode testar todos os endpoints diretamente pelo navegador.

## Estrutura do Projeto

```
src/
├── modulos/
│   ├── vendas/
│   │   ├── domain/
│   │   │   └── interfaces/      # Interfaces do domínio (Sale, Invoice)
│   │   ├── providers/           # Providers (mock e API real)
│   │   │   ├── sales-mock.provider.ts
│   │   │   ├── sales-api.provider.ts
│   │   │   ├── mappers/         # Mapeadores de dados
│   │   │   └── types/           # Tipos da API D1FITNESS
│   │   ├── repositories/        # Repository Pattern
│   │   │   └── sales.repository.ts
│   │   ├── vendas.controller.ts
│   │   ├── vendas.service.ts
│   │   └── vendas.module.ts
│   ├── notas-fiscais/           # Busca e validação de NF
│   ├── email/                   # Serviço de envio de emails
│   ├── envio-nota-fiscal/       # Lógica de envio de NF
│   └── geracao-danfe/           # Geração de PDF (DANFE)
├── migrations/                  # Migrations do banco de dados
├── app.module.ts
└── main.ts
```

### Arquitetura da Integração

O sistema utiliza padrão **Repository** com **Strategy Pattern** para alternar entre providers:

```
Controller → Service → Repository → Provider (Mock ou API) → Dados
```

- **Repository**: Decide qual provider usar baseado em `SALES_PROVIDER`
- **Providers**: Implementam interface `ISalesProvider`
- **Mappers**: Transformam dados da API D1FITNESS para formato do domínio

## Comandos Úteis

```bash
# Desenvolvimento com hot-reload
npm run start:dev

# Build para produção
npm run build

# Executar em produção
npm run start:prod

# Gerar nova migration
npm run migration:generate -- src/migrations/NomeDaMigration

# Executar migrations
npm run migration:run

# Reverter última migration
npm run migration:revert

# Formatar código
npm run format

# Lint
npm run lint
```

## Testando a Aplicação

### Cenário completo de teste:

1. **Inicie a API mock** (terminal 1):
   ```bash
   cd d1fitness-api-mock
   npm run start:dev
   ```

2. **Inicie o backend** (terminal 2):
   ```bash
   cd d1fitness-nf-backend
   npm run migration:run
   npm run start:dev
   ```

3. **Inicie o frontend** (terminal 3):
   ```bash
   cd d1fitness-frontend
   npm run start
   ```

4. **Liste as vendas disponíveis:**
   ```bash
   curl http://localhost:3001/vendas
   ```

5. **Busque uma nota fiscal:**
   ```bash
   curl http://localhost:3001/notas-fiscais/NF001
   ```

6. **Envie a nota fiscal por email** (use o email da sua conta Resend em teste):
   ```bash
   curl -X POST http://localhost:3001/envios-nota-fiscal \
     -H "Content-Type: application/json" \
     -d '{"codigoNotaFiscal": "NF001", "email": "seu-email@exemplo.com"}'
   ```

7. **Verifique seu email** - Você receberá:
   - XML da nota fiscal em anexo
   - PDF (DANFE) em anexo

## Logs e Rastreabilidade

O sistema registra detalhadamente:
- Tentativas de envio de email
- Erros específicos (domínio não verificado, email inválido, etc.)
- ID do registro no banco para rastreamento
- Status de cada envio (PROCESSANDO → SUCESSO/ERRO)

Exemplo de log no console:
```
Email enviado com sucesso: { destinatario: 'teste@email.com', emailId: 'abc123' }
```

Ou em caso de erro:
```
Erro ao enviar email: {
  destinatario: 'teste@email.com',
  erro: 'You can only send testing emails to...',
  registroId: 'uuid-do-registro'
}
```

## Tratamento de Erros

O sistema possui tratamento robusto de erros:

- **XML inválido** → HTTP 400 com mensagem clara
- **Nota fiscal não encontrada** → HTTP 404
- **Email não autorizado (Resend)** → HTTP 500 com instrução de como resolver
- **Erro ao gerar PDF** → HTTP 500 com detalhes no log
- **Falha de conexão com API externa** → HTTP apropriado com contexto

Todos os erros são registrados no banco na tabela `envios_notas_fiscais` para auditoria.

## Boas Práticas Implementadas

- ✅ Separação de responsabilidades (módulos independentes)
- ✅ Validação de entrada com class-validator
- ✅ Logging estruturado para debugging
- ✅ Mensagens de erro amigáveis ao usuário
- ✅ Rastreabilidade de operações (IDs únicos)
- ✅ Migrations versionadas para banco de dados
- ✅ Variáveis de ambiente para configurações sensíveis
- ✅ Documentação automática com Swagger
- ✅ Tratamento de erros em múltiplas camadas

## Troubleshooting

### Erro: "ECONNREFUSED" ao conectar no banco

Verifique se:
- O PostgreSQL está rodando
- As credenciais no `.env` estão corretas
- O firewall permite conexão na porta 5432

### Erro: "API_VENDAS_URL não configurada"

Configure as URLs da API mock no arquivo `.env`

### Email não é enviado (ambiente de teste Resend)

Em ambiente de teste com `@resend.dev`, você só pode enviar para o email que criou a conta.  
Solução: Use o mesmo email ou configure um domínio verificado.

### Erro: "no pg_hba.conf entry for host ..., no encryption"

Esse erro geralmente acontece quando o banco remoto exige SSL e o `DB_SSL` está configurado como `false`.

**Solução:** defina `DB_SSL=true` no `.env` e reinicie o backend.

### Migration falha

```bash
# Verifique se o banco existe e está acessível
npm run typeorm -- query "SELECT NOW()"

# Se necessário, recrie o banco
npm run migration:revert
npm run migration:run
```

## Licença

Este projeto foi desenvolvido como teste técnico para D1FITNESS.
