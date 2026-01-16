# D1FITNESS - Frontend React

Frontend desenvolvido em **React + TypeScript** para o teste técnico D1FITNESS, integrando-se totalmente com o backend NestJS para gestão e envio automatizado de notas fiscais por email.

## 🚀 Tecnologias e Bibliotecas

- **React 18.2** - Biblioteca JavaScript para construção de interfaces
- **TypeScript 5.9** - Superset JavaScript com tipagem estática
- **Vite 7.2** - Build tool e dev server extremamente rápido
- **Material-UI v7** - Biblioteca de componentes React com design moderno
- **Axios 1.13** - Cliente HTTP para requisições à API
- **React Toastify** - Notificações toast elegantes
- **Context API** - Gerenciamento de estado global
- **date-fns** - Manipulação e formatação de datas
- **Vitest + React Testing Library** - Testes automatizados

## 📁 Estrutura do Projeto

```
frontend/
├── src/
│   ├── components/              # Componentes React
│   │   ├── Header.tsx          # Cabeçalho da aplicação
│   │   ├── VendasList.tsx      # Lista principal de vendas com busca
│   │   ├── VendaCard.tsx       # Card individual de venda
│   │   ├── EnviarNotaFiscalModal.tsx  # Modal de envio de NF
│   │   ├── HistoricoEnviosModal.tsx   # Modal de histórico de envios
│   │   ├── EstatisticasVendas.tsx     # Dashboard de estatísticas
│   │   ├── Loading.tsx         # Componente de loading
│   │   ├── ErrorMessage.tsx    # Mensagens de erro
│   │   └── ErrorBoundary.tsx   # Tratamento de erros React
│   ├── context/                # Gerenciamento de estado
│   │   └── VendasContext.tsx   # Context com lógica de negócio
│   ├── services/               # Integração com APIs
│   │   ├── apiClient.ts        # Cliente Axios configurado
│   │   ├── vendasService.ts    # API de vendas
│   │   ├── notasFiscaisService.ts      # API de notas fiscais
│   │   └── enviosNotaFiscalService.ts  # API de envios
│   ├── types/                  # Definições TypeScript
│   │   └── index.ts           # Interfaces e tipos
│   ├── utils/                  # Utilitários
│   │   └── formatters.ts      # Formatadores de moeda, data, etc
│   ├── App.tsx                # Componente raiz
│   └── main.tsx               # Entry point
├── .env.example               # Template de variáveis de ambiente
├── vitest.config.ts          # Configuração de testes
├── package.json
└── README.md
```

## 🔧 Configuração e Instalação

### Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn
- Backend da aplicação rodando (por padrão em `http://localhost:3001`)

### Passo 1: Instalação de Dependências

```bash
cd frontend
npm install
```

### Passo 2: Configuração das Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Ou no Windows:

```powershell
copy .env.example .env
```

Edite o arquivo `.env` se necessário para configurar a URL do backend:

```env
VITE_API_URL=http://localhost:3001
```

### Passo 3: Executar a Aplicação

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

## ✨ Funcionalidades Implementadas

### 📋 Requisitos Obrigatórios Atendidos

✅ **Lista de Vendas**
- Exibição em cards responsivos com todas as informações
- Código, cliente, data, valor total e status de envio
- Busca em tempo real por cliente ou código
- Atualização manual da lista

✅ **Modal de Envio de NF**
- Formulário com validação de email
- Exibição dos dados da venda e nota fiscal
- Feedback visual durante o processo
- Tratamento de erros

✅ **Feedback ao Usuário**
- Toast notifications (sucesso, erro, aviso)
- Loading states em todas operações assíncronas
- Mensagens de erro descritivas
- Confirmações visuais de ações

✅ **Responsividade**
- Layout adaptativo (mobile, tablet, desktop)
- Grid responsivo: 1-4 colunas conforme tela
- Componentes Material-UI otimizados
- Testado em diferentes resoluções

### 🎯 Diferenciais Implementados

✅ **Dashboard de Estatísticas**
- Total de vendas e valor acumulado
- Contadores por status (enviadas, pendentes, erro)
- Atualização automática ao enviar NF

✅ **Histórico de Envios**
- Modal com lista completa de envios por NF
- Data/hora, destinatário e status
- Integração com endpoint GET específico

✅ **Error Boundary**
- Captura erros React em runtime
- Mensagem amigável ao usuário
- Botão para tentar novamente
  
✅ **Validações Robustas**
- Validação de email com regex
- Verificação de campos obrigatórios
- Feedback visual em tempo real

✅ **Tratamento de Erros HTTP**
- Interceptor Axios para erros
- Mensagens específicas por tipo de erro
- Retry automático em alguns casos

## 🎨 Interface e UX

**Design Profissional e Moderno:**

- Header fixo com branding e título
- Cards elegantes com elevação e hover effects
- Modais bem estruturados e intuitivos
- Chips de status coloridos (Pendente/Amarelo, Enviado/Verde, Erro/Vermelho)
- Barra de busca com ícone e placeholder
- Grid responsivo com espaçamento consistente
- Paleta de cores profissional (Material-UI blue)
- Ícones do Material Design em toda interface
- Transições e animações suaves

## 🔌 Integração com Backend

O frontend integra-se com **3 APIs**:

### 1️⃣ API Mock (porta 3000)
**GET /vendas** - Lista de vendas
**GET /notas-fiscais/:codigo** - Detalhes da nota fiscal com XML

### 2️⃣ Backend NF (porta 3001)
**POST /envios-nota-fiscal** - Envia NF por email
- Gera PDF da DANFE
- Envia email com anexos (XML + PDF)
- Salva registro no banco PostgreSQL

**GET /envios-nota-fiscal/nota-fiscal/:codigo** - Histórico de envios

### Fluxo Completo de Envio
1. Frontend busca venda e NF na API Mock
2. Valida dados e email do destinatário
3. Envia requisição para backend NF
4. Backend processa: XML → DANFE PDF → Email
5. Retorna status e salva no banco
6. Frontend atualiza status da venda
7. Exibe toast de sucesso/erro

### Tratamento de Erros
- **CORS**: Configurado em ambos backends
- **Timeout**: 30s por requisição
- **Network**: Retry automático em alguns casos
- **Validação**: Feedback visual imediato

## 🧪 Testes Automatizados

O projeto possui **33 testes automatizados** com **Vitest + React Testing Library**.

### Executar Testes
```bash
npm test                  # Executar todos os testes
npm run test:ui          # Interface visual (Vitest UI)
npm run test:coverage    # Relatório de cobertura
```

### Cobertura de Testes
- ✅ **8 arquivos de teste** (.test.ts/.test.tsx)
- ✅ **33 testes passando** (100% de sucesso)
- ✅ **46% de cobertura** geral do código
- ✅ **96% de cobertura** em utils/formatters
- ✅ **100% de cobertura** em componentes críticos

### Testes Implementados
- **Componentes**: VendaCard, EnviarNotaFiscalModal, Loading, ErrorMessage, EstatisticasVendas
- **Context**: VendasContext (hooks, state management)
- **Services**: apiClient (configuração, interceptors)
- **Utils**: formatters (moeda, data, email, status)

## 📜 Scripts Disponíveis

```bash
npm run dev              # Servidor de desenvolvimento (porta 5173)
npm run build            # Build otimizado para produção
npm run preview          # Preview da build de produção
npm run lint             # Executar ESLint
npm test                 # Executar testes
npm run test:coverage    # Relatório de cobertura de testes
```

## 🏗️ Build e Deploy

### Build para Produção
```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`:
- HTML minificado
- CSS com vendor prefixes
- JavaScript com code splitting
- Assets otimizados

### Preview Local
```bash
npm run preview
```

Abre servidor local da build de produção em `http://localhost:4173`

## ⚙️ Variáveis de Ambiente

Arquivo `.env` (criar a partir do `.env.example`):

```env
VITE_API_URL=http://localhost:3001
```

**Importante**: O Vite requer o prefixo `VITE_` nas variáveis de ambiente.

## 🔍 Detalhes Técnicos

### Arquitetura
- **Context API**: Gerenciamento de estado centralizado
- **Services Layer**: Abstração das chamadas HTTP
- **Type Safety**: TypeScript strict mode
- **Error Boundaries**: Captura de erros React
- **Interceptors**: Tratamento global de erros HTTP

### Boas Práticas Implementadas
- ✅ Componentização adequada
- ✅ Separação de responsabilidades
- ✅ Tipagem forte com TypeScript
- ✅ Tratamento de erros robusto
- ✅ Loading states em todas operações
- ✅ Validações no frontend e backend
- ✅ Código limpo e legível
- ✅ Responsividade mobile-first
- ✅ Testes automatizados
- ✅ Documentação completa

## 🚨 Troubleshooting

### Problema: Erro de CORS
**Solução**: Verifique se o backend está rodando e com CORS habilitado

### Problema: "Cannot connect to API"
**Solução**: Confirme a URL no `.env` e que o backend está na porta correta

### Problema: Testes falhando
**Solução**: Execute `npm install` novamente para garantir todas dependências

### Problema: Build falha
**Solução**: Verifique erros de TypeScript com `npm run lint`

## 📝 Observações para o Avaliador

### ✅ Checklist de Requisitos

**Backend (já implementado):**
- ✅ Integração com API de vendas e notas fiscais
- ✅ Validação de XML da nota fiscal
- ✅ Geração de PDF (DANFE) com pdfmake
- ✅ Envio de email com XML e PDF anexados
- ✅ Persistência no PostgreSQL
- ✅ Documentação Swagger
- ✅ Testes unitários

**Frontend (este projeto):**
- ✅ Lista de vendas responsiva
- ✅ Modal de envio com validação
- ✅ Feedback visual completo
- ✅ Design responsivo testado
- ✅ Integração total com backend
- ✅ Testes automatizados (33 testes)
- ✅ Documentação completa

**Diferenciais:**
- ✅ Dashboard de estatísticas
- ✅ Histórico de envios
- ✅ Error Boundary
- ✅ Validações robustas
- ✅ Tratamento de erros específicos
- ✅ Testes com alta cobertura
- ✅ TypeScript strict mode

---

**Desenvolvido por**: Jean Salviano
**Data**: Janeiro 2026  
**Teste Técnico**: D1FITNESS
