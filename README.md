# 💰 Fluxus: Seu Rastreador de Finanças Pessoais

API REST para gerenciamento de finanças pessoais. Controle suas receitas e despesas de forma simples e segura.

## 🌐 Links

- **🌍 API:** [https://fluxus-api-service.onrender.com](https://fluxus-api-service.onrender.com)
- **📚 Swagger:** [https://fluxus-api-service.onrender.com/api-docs](https://fluxus-api-service.onrender.com/api-docs)
- **💚 Health:** [https://fluxus-api-service.onrender.com/health](https://fluxus-api-service.onrender.com/health)

## 🚀 Funcionalidades

- ✅ CRUD completo de transações (receitas e despesas)
- ✅ Extrato automático (saldo, total de receitas e despesas)
- ✅ Autenticação JWT
- ✅ Categorização de transações
- ✅ Paginação de resultados
- ✅ Documentação Swagger interativa

## 🛠️ Endpoints

**Autenticação:**
- `POST /register` - Criar conta
- `POST /login` - Fazer login
- `POST /logout` - Fazer logout
- `GET /me` - Ver perfil

> **Observações:** `POST /login` redireciona para `/me` se já estiver logado. `POST /register` e `GET /register` retornam erro 403 se já estiver logado. `GET /me` redireciona para `/login` se não estiver logado.

**Transações:**
- `GET /transacoes` - Listar transações
- `GET /transacoes/saldo` - Ver extrato
- `GET /transacoes/:id` - Buscar transação
- `POST /transacoes` - Criar transação
- `PUT /transacoes/:id` - Atualizar transação
- `DELETE /transacoes/:id` - Deletar transação

> Todas as rotas de transações requerem autenticação.

## 🧪 Testando a API

### 1. Swagger (Recomendado)

Acesse [https://fluxus-api-service.onrender.com/api-docs](https://fluxus-api-service.onrender.com/api-docs) e teste diretamente no navegador.

**Como autenticar:**
1. Faça login em `POST /login`
2. Copie o token retornado
3. Clique em "Authorize" 🔓 no topo da página
4. Cole o token (sem "Bearer")

**⚠️ Nota:** 
- Se você já estiver logado e tentar fazer login, será redirecionado automaticamente para `/me`
- Se você já estiver logado e tentar registrar uma nova conta, receberá um erro 403 informando que precisa fazer logout primeiro

### 2. Postman/Insomnia

**⚠️ Pré-requisito:** Instale o [Postman](https://www.postman.com/downloads/) ou [Insomnia](https://insomnia.rest/download)

📥 **Download da collection:** [`collections/Fluxus_API.postman_collection.zip`](./collections/Fluxus_API.postman_collection.zip)

#### Como Importar e Configurar

1. **Importe a collection:**
   - No Postman: Clique em "Import" → Selecione o arquivo ZIP
   - No Insomnia: "Create" → "Import From" → "File" → Selecione o JSON (extraia do ZIP primeiro)

2. **Configure a variável `baseUrl`:**
   
   **No Postman:**
   - Clique com botão direito na collection "Fluxus Finance Tracker API"
   - Selecione "Edit"
   - Vá na aba "Variables"
   - Edite o valor de `baseUrl`:
     - **Produção:** `https://fluxus-api-service.onrender.com` // Exemplo
     - **Local:** `http://localhost:3000`
   - Clique em "Save"
   
   **No Insomnia:**
   - Clique no ícone de engrenagem (⚙️) ao lado da collection
   - Adicione/edite a variável `baseUrl` com o valor desejado

3. **Faça login e obtenha o token:**
   - Execute o endpoint "Login" dentro da pasta "Usuários"
   - Use as credenciais de teste (ex: `joao@email.com` / `senha123`)
   - O token será **salvo automaticamente** na variável `token` da collection
   - Isso acontece porque há um script automático no endpoint "Login" que captura o token da resposta

4. **Pronto!** Todas as requisições protegidas já usarão o token automaticamente

#### 🔄 Como o Token é Salvo Automaticamente?

O endpoint "Login" possui um script de teste que:
1. Verifica se a resposta foi bem-sucedida (status 200)
2. Extrai o token do JSON retornado
3. Salva automaticamente na variável de collection `token`
4. Todas as outras requisições usam `{{token}}` no header Authorization

Você pode ver isso funcionando no console do Postman após fazer login.

#### 🌐 Usar Token do Postman no Navegador Chrome

Se você quiser usar o token obtido no Postman para testar a API diretamente no navegador:

1. **Obtenha o token no Postman:**
   - Execute o endpoint "Login"
   - Copie o token da resposta JSON

2. **Instale uma extensão do Chrome:**
   - **ModHeader** (recomendado): [Chrome Web Store](https://chrome.google.com/webstore/detail/modheader/idgpnmonknjnojddfkpgkljpfnnfcklj)
   - Ou **Requestly**: [Chrome Web Store](https://chrome.google.com/webstore/detail/requestly/mdnleldcmiljblolnjhpnblkcekpdkpa)

3. **Configure o ModHeader:**
   - Clique no ícone da extensão na barra de ferramentas
   - Adicione um novo header:
     - **Name:** `Authorization`
     - **Value:** `Bearer SEU_TOKEN_AQUI` (cole o token completo)
   - Ative o toggle para habilitar o header

4. **Teste no navegador:**
   - Acesse: `https://fluxus-api-service.onrender.com/transacoes`
   - O header Authorization será enviado automaticamente
   - Você verá suas transações (se o token for válido)

5. **Para desativar:**
   - Desative o toggle no ModHeader quando não precisar mais

**⚠️ Dica:** O token expira em 24 horas. Se receber erro 401, faça login novamente no Postman e atualize o token no ModHeader.

## 💻 Instalação Local

### Pré-requisitos

- Node.js 18+
- PostgreSQL 12+ (ou SQLite)
- Postman ou Insomnia (opcional, para testes)

### Passos

1. **Clone e instale:**
```bash
git clone https://github.com/victoriasantinni/fluxus-api.git
cd fluxus-api
npm install
```

2. **Configure o `.env`:**
```bash
cp .env.example .env
```

Edite o arquivo `.env` e configure:
- `DATABASE_URL` com suas credenciais do PostgreSQL
- `JWT_SECRET` com uma chave secreta forte (mínimo 32 caracteres)
  - Você pode gerar uma online em: [Token Generator](https://it-tools.tech/token-generator)

3. **Configure o banco:**
```bash
npm run setup
```

4. **Inicie o servidor:**
```bash
npm run dev
```

A API estará disponível em `http://localhost:3000`

## 📦 Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm start` | Inicia em produção |
| `npm run dev` | Inicia em desenvolvimento |
| `npm run token` | Gera token JWT para testes |
| `npm run setup` | Instala, migra e popula banco |
| `npm run prisma:studio` | Abre Prisma Studio |

## 🔐 Autenticação

### Obter Token

**Produção:**
1. Crie uma conta: `POST /register`
2. Faça login: `POST /login`
3. Use o token retornado

**⚠️ Nota:** Se você já estiver logado, essas rotas retornarão erro 403 informando que você precisa fazer logout primeiro.

**Desenvolvimento:**
```bash
npm run token        # Token para usuário ID 1
npm run token 2      # Token para usuário ID 2
```

### Usar Token

Adicione o header em requisições protegidas:
```
Authorization: Bearer seu_token_aqui
```

**⚠️ Sobre JWT_SECRET:**

O `JWT_SECRET` é a chave secreta usada para assinar os tokens JWT. Você pode gerar uma chave segura online em [Token Generator](https://it-tools.tech/token-generator) ou usar qualquer string aleatória forte (mínimo 32 caracteres). Configure essa chave na variável de ambiente `JWT_SECRET` no arquivo `.env` (veja `.env.example`).

## 🧪 Dados de Teste

Após `npm run setup`, você terá:

| Email | Senha |
|-------|-------|
| joao@email.com | senha123 |
| maria@email.com | senha123 |
| admin@fluxus.com | admin123 |

## 🌍 Deploy em Produção

**Variáveis de ambiente necessárias:**
- `NODE_ENV=production`
- `HOST` (domínio do servidor)
- `DATABASE_URL` (string de conexão do PostgreSQL)
- `JWT_SECRET` (chave secreta forte para assinar tokens JWT - mínimo 32 caracteres)
  - Você pode gerar uma online em: [Token Generator](https://it-tools.tech/token-generator)

**Comandos no Render (ou similar):**
- **Build:** `npm run build:deploy`
- **Start:** `npm start`

**Popular o banco com dados de teste (opcional):**

Como o plano básico do Render não permite Shell, você pode rodar o seed localmente apontando para o banco de produção:

1. **Configure o `.env` local** com a `DATABASE_URL` de produção (do Prisma Postgres)
2. **Execute localmente:**
   ```bash
   npm run prisma:seed
   ```

> **⚠️ Atenção:** O seed limpa todos os dados existentes antes de popular. Use apenas na primeira vez ou quando quiser resetar o banco. Certifique-se de estar usando a `DATABASE_URL` correta antes de executar!

## 🏗️ Tecnologias

- Node.js + Express
- Prisma + PostgreSQL
- JWT + bcrypt
- Zod (validação)
- Swagger/OpenAPI

## 📁 Estrutura

```
fluxus-api/
├── collections/          # Collection Postman/Insomnia
├── prisma/               # Schema e migrations
├── src/
│   ├── config/           # Configurações
│   ├── controllers/      # Controladores
│   ├── docs/             # Swagger docs
│   ├── middlewares/      # Middlewares
│   ├── routes/           # Rotas
│   ├── schemas/          # Validação Zod
│   ├── services/         # Lógica de negócio
│   └── utils/            # Utilitários
└── README.md
```

## 👥 Equipe

- Ana Victoria Santinni
- Maxine Athos
- Vitória Queiroz
- Breno Araujo
- Hudson Júnio
- Marcelo Henrique
- Poliana Vitoria

## 📄 Licença

ISC

---

**Desenvolvido com ❤️ pela equipe Fluxus**