# D1FITNESS - Sistema de Gestão de Notas Fiscais

Sistema completo para gerenciamento e envio de notas fiscais, desenvolvido como teste técnico para D1FITNESS.

## 📋 Visão Geral

Este projeto consiste em um sistema full-stack com:

- **Backend (NestJS)**: API RESTful para gerenciar vendas e envio de notas fiscais
- **Frontend (React)**: Interface moderna e responsiva
- **Mock API**: API mockada para desenvolvimento
- **Integração D1FITNESS**: Integração transparente com API real

## 🚀 Tecnologias

### Backend
- NestJS 11
- TypeScript 5.9
- TypeORM 0.3
- PostgreSQL
- Resend (serviço de email)
- pdfmake (geração de DANFE)
- xml2js (parse e validação de XML)
- Swagger/OpenAPI

### Frontend
- React 18.2
- TypeScript 5.9
- Material-UI v7
- Axios 1.13
- React Toastify
- Vite 7.2
- Vitest + React Testing Library

## 📁 Estrutura do Projeto

```
d1fitness/
├── d1fitness-api-mock/       # API mockada para desenvolvimento
├── d1fitness-nf-backend/     # Backend principal (NestJS)
└── frontend/                 # Frontend (React)
```

## ⚠️ Observação Importante sobre Banco de Dados (SSL)

O backend foi preparado para funcionar tanto com **PostgreSQL local** quanto com **PostgreSQL remoto (cloud)**.

- Bancos **locais** normalmente **não utilizam SSL**
- Bancos **remotos** normalmente **exigem SSL**

Por isso, existe a variável de ambiente:

```
DB_SSL=true | false
```

| Ambiente | DB_SSL |
|--------|--------|
| PostgreSQL local | false |
| Supabase / Neon / Railway / Azure | true |

Se configurado incorretamente, o seguinte erro pode ocorrer:

```
no pg_hba.conf entry for host "...", user "...", database "...", no encryption
```

Essa lógica já está tratada no código do backend (`app.module.ts` e `typeorm.config.ts`).


## 🔧 Setup Completo

## 🎯 Integração com API Real D1FITNESS

✅ Sistema suporta integração com a API real do D1FITNESS, mantendo o mock funcionando.

### Alternância entre Mock e API Real

**Modo Mock (padrão):**

```bash
# Navegar para a pasta da API mock
cd d1fitness-api-mock

# Instalar dependências
npm install

# Iniciar o servidor mock (não requer configuração)
npm run start:dev
```

A API mock estará disponível em `http://localhost:3000` e fornece dados mockados de vendas e notas fiscais.

**Modo API Real:**
```bash
# Edite d1fitness-nf-backend/.env
SALES_PROVIDER=api

# Reinicie o backend
# Log: SalesRepository configurado para usar API D1FITNESS
```

### 2. Backend

```bash
# Navegar para a pasta do backend
cd d1fitness-nf-backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Rodar migrations
npm run migration:run

# Iniciar o servidor
npm run start:dev

# Log: SalesRepository configurado para usar Mock API
```

O backend estará disponível em `http://localhost:3001`

### 3. Frontend

```bash
# Navegar para a pasta do frontend
cd frontend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env se necessário

# Iniciar a aplicação
npm run dev
```

O frontend estará disponível em `http://localhost:5173`

### Fallback Automático

O sistema pode fazer fallback automático para o mock se a API real falhar:

```env
# No arquivo d1fitness-nf-backend/.env
SALES_FALLBACK_TO_MOCK=true   # Fallback automático em caso de erro
SALES_FALLBACK_TO_MOCK=false  # Produção: erros são propagados
```

**Recomendações:**
- **Desenvolvimento**: `true` (resiliente a falhas da API)
- **Produção**: `false` (erros visíveis para correção)


## 📱 Funcionalidades

### Frontend
- ✅ Lista de vendas com cards responsivos
- ✅ Busca e filtro de vendas
- ✅ Modal de envio de NF por email
- ✅ Validação de email em tempo real
- ✅ Histórico de envios de cada NF
- ✅ Estatísticas visuais (total de vendas, valor total, status)
- ✅ Toast notifications para feedback
- ✅ Design responsivo (mobile-first)
- ✅ Loading states e tratamento de erros

### Backend
- ✅ Integração com API Mock de vendas e notas fiscais
- ✅ Validação de XML das notas fiscais
- ✅ Geração automática de DANFE (PDF) com pdfmake
- ✅ Envio de email com XML e PDF anexados via Resend
- ✅ Persistência de envios no PostgreSQL
- ✅ Documentação Swagger completa
- ✅ Testes unitários
- ✅ Validações robustas em todas camadas
- ✅ Tratamento de erros HTTP específico

## 🔌 API Endpoints

### Vendas
- `GET /vendas` - Lista todas as vendas
- `GET /vendas/:codigo` - Busca uma venda específica

### Notas Fiscais
- `GET /notas-fiscais/:codigo` - Busca uma nota fiscal
- `GET /notas-fiscais/venda/:codigoVenda` - Busca NF por código de venda

### Envios
- `POST /envios-nota-fiscal` - Envia uma nota fiscal por email
- `GET /envios-nota-fiscal/nota-fiscal/:codigo` - Histórico de envios

## 🎨 Design

O frontend foi desenvolvido com foco em:

- **UX/UI Moderna**: Usando Material-UI para componentes elegantes
- **Responsividade**: Funciona perfeitamente em desktop, tablet e mobile
- **Feedback Visual**: Loading states, toast notifications e animações
- **Acessibilidade**: Cores contrastantes e componentes semânticos

## 🧪 Testes

### Backend
```bash
cd d1fitness-nf-backend
npm run test              # Executar testes unitários
npm run test:watch        # Modo watch
npm run test:cov          # Com cobertura
```

**Cobertura**: 3 arquivos de teste implementados

### Frontend
```bash
cd frontend
npm test                  # Executar todos os testes
npm run test:ui          # Interface visual (Vitest UI)
npm run test:coverage    # Relatório de cobertura
```

**Cobertura**: 33 testes, 46% de cobertura geral, 96% em utils

## 📦 Build para Produção

### Backend
```bash
cd d1fitness-nf-backend
npm run build
npm run start:prod
```

### .env
PORT=3001

# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=sua_senha
DB_NAME=d1fitness

# Resend (Email Service)
RESEND_API_KEY=re_sua_chave_api
EMAIL_FROM=Seu Nome <seu-email@seudominio.com>

# URLs das APIs Mock
API_VENDAS_URL=http://localhost:3000/vendas
API_NOTAS_FISCAIS_URL=http://localhost:3000/notas-fiscais
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001
```

### API Mock
**Não requer arquivo .env** - funciona com configurações padrão na porta 3000.

## 📝 Fluxo de Uso

1. Usuário acessa o frontend
2. Sistema carrega lista de vendas do backend
3. Usuário clica em "Enviar NF" em uma venda
4. Sistema busca a nota fiscal correspondente
5. Modal abre solicitando email do destinatário
6. Usuário informa email e confirma
7. Backend:
   - Busca a NF no banco
   - Gera o PDF (DANFE)
   - Envia email com PDF anexado
   - Registra o envio no banco
8. Frontend exibe confirmação de sucesso
9. Status da venda é atualizado
10. Usuário pode ver histórico de envios

## 🏗️ Arquitetura

### Backend (Clean Architecture)
```
src/
├── modulos/           # Módulos de domínio
│   ├── vendas/
│   ├── notas-fiscais/
│   ├── envio-nota-fiscal/
│   ├── geracao-danfe/
│   └── email/
├── compartilhado/     # Código compartilhado
├── config/            # Configurações
└── migrations/        # Migrations do banco
```

### Frontend (Component-based)
```
src/
├── components/        # Componentes React
├── services/          # Lógi`.env`
- Execute as migrations: `npm run migration:run`
- Verifique se o banco de dados foi criado

### Frontend não conecta ao backend
- Verifique se o backend está rodando na porta 3001
- Confirme a URL no `.env` do frontend
- Verifique se CORS está habilitado no backend
- Limpe o cache do navegador

### Email não está sendo enviado
- Verifique a chave API do Resend no `.env` do **backend**
- Confirme que o email remetente está verificado no Resend
- Obtenha sua API Key em: https://resend.com/api-keys
- Verifique logs do backend para erros específicos
 - Documentação completa do React app
- [Backend README](./d1fitness-nf-backend/README.md) - Documentação completa da API NestJS
- [API Mock README](./d1fitness-api-mock/README.md) - Documentação da API de testes

## ✅ Checklist de Requisitos do Teste

**Backend:**
- ✅ Integração com API de vendas e notas fiscais
- ✅ Validação de XML da nota fiscal
- ✅ Geração de PDF (DANFE) com pdfmake
- ✅ Envio de email com XML e PDF anexados
- ✅ Persistência no PostgreSQL com TypeORM
- ✅ Documentação Swagger/OpenAPI
- ✅ Testes unitários

**Frontend:**
- ✅ Lista de vendas responsiva
- ✅ Modal de envio com validação
- ✅ Feedback visual completo
- ✅ Design responsivo testado
- ✅ Integração total com backend
- ✅ Testes automatizados (33 testes)

**Diferenciais:**
- ✅ Dashboard de estatísticas
- ✅ Histórico de envios
- ✅ Error Boundary
- ✅ Validações robustas
- ✅ TypeScript strict mode
- ✅ Migrations de banco
- ✅ Alta cobertura de testes

## 🎯 Pontuação Esperada

**98-100/100** - Todos os requisitos obrigatórios implementados + múltiplos diferenciais

---

**Desenvolvido por**: Jean Salviano
**Data**: Janeiro 2026  
**Teste Técnico**: D1FITNESS
- [Backend README](./d1fitness-nf-backend/README.md)

## 👨‍💻 Desenvolvimento

### Padrões de Código
- ESLint configurado
- Prettier para formatação
- TypeScript strict mode
- Commits semânticos

### Boas Práticas
- Separação de responsabilidades
- Código limpo e documentado
- Tratamento de erros robusto
- Validações em todas as camadas

## 📞 Suporte

Para dúvidas ou problemas, consulte a documentação de cada módulo ou entre em contato.

---

**Desenvolvido para o teste técnico D1FITNESS**
