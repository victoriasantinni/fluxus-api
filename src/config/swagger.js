import swaggerJsdoc from 'swagger-jsdoc';
import dotenv from 'dotenv';

dotenv.config();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Fluxus: Seu Rastreador de Finanças Pessoais',
      version: '1.0.0',
      description: `
## Fluxus: Seu Rastreador de Finanças Pessoais

API REST para gerenciamento de finanças pessoais desenvolvida por:

- **Ana Victoria Santinni**
- **Maxine Athos**
- **Vitória Queiroz**
- **Breno Araujo**
- **Hudson Júnio**
- **Marcelo Henrique**
- **Poliana Vitoria**

### 🔐 Autenticação

Esta API usa **JWT (JSON Web Token)** para autenticação.

#### Como usar:
1. Crie uma conta em \`POST /usuarios\`
2. Faça login em \`POST /usuarios/login\` para obter o token
3. Clique no botão **"Authorize"** 🔓 acima
4. Cole apenas o token (o "Bearer" já está configurado automaticamente)
5. Agora você pode acessar as rotas protegidas!

### 📌 Rotas Públicas (não precisam de token)
- \`POST /usuarios\` - Criar conta
- \`POST /usuarios/login\` - Fazer login
- \`GET /health\` - Verificar status da API

### 🔒 Rotas Protegidas (precisam de token)
- Todas as rotas de \`/transacoes\`
- \`GET /usuarios/me\` - Ver perfil
      `,
      contact: {
        name: 'Equipe Fluxus',
      },
    },
    servers: [
      {
        url: `https://${process.env.HOST || 'fluxus-api-service.onrender.com'}`,
        description: 'Produção',
      },
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Desenvolvimento Local',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Cole apenas o token JWT obtido no login. O prefixo "Bearer" já está configurado automaticamente.',
        },
      },
      schemas: {
        Usuario: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            email: { type: 'string', format: 'email', example: 'usuario@email.com' },
            nome: { type: 'string', example: 'João Silva' },
            criadoEm: { type: 'string', format: 'date-time' },
            atualizadoEm: { type: 'string', format: 'date-time' },
          },
        },
        UsuarioCreate: {
          type: 'object',
          required: ['email', 'senha'],
          properties: {
            email: { type: 'string', format: 'email', example: 'usuario@email.com' },
            senha: { type: 'string', minLength: 8, example: 'senha12345' },
            nome: { type: 'string', example: 'João Silva' },
          },
        },
        Login: {
          type: 'object',
          required: ['email', 'senha'],
          properties: {
            email: { type: 'string', format: 'email', example: 'joao@email.com' },
            senha: { type: 'string', example: 'senha123' },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            token: { 
              type: 'string', 
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' 
            },
          },
        },
        Transacao: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            descricao: { type: 'string', example: 'Salário mensal' },
            valor: { type: 'number', format: 'float', example: 5000.00 },
            tipo: { type: 'string', enum: ['receita', 'despesa'], example: 'receita' },
            categoria: { type: 'string', example: 'Salário' },
            usuarioId: { type: 'integer', example: 1 },
            criadoEm: { type: 'string', format: 'date-time' },
            atualizadoEm: { type: 'string', format: 'date-time' },
          },
        },
        TransacaoCreate: {
          type: 'object',
          required: ['descricao', 'valor', 'tipo', 'categoria'],
          properties: {
            descricao: { type: 'string', minLength: 1, maxLength: 255, example: 'Salário mensal' },
            valor: { type: 'number', format: 'float', minimum: 0.01, example: 5000.00 },
            tipo: { type: 'string', enum: ['receita', 'despesa'], example: 'receita' },
            categoria: { type: 'string', minLength: 1, maxLength: 100, example: 'Salário' },
          },
        },
        TransacaoUpdate: {
          type: 'object',
          properties: {
            descricao: { type: 'string', minLength: 1, maxLength: 255, example: 'Salário atualizado' },
            valor: { type: 'number', format: 'float', minimum: 0.01, example: 5500.00 },
            tipo: { type: 'string', enum: ['receita', 'despesa'], example: 'receita' },
            categoria: { type: 'string', maxLength: 100, example: 'Salário' },
          },
        },
        Extrato: {
          type: 'object',
          properties: {
            totalReceita: { type: 'number', format: 'float', example: 6500.00 },
            totalDespesa: { type: 'number', format: 'float', example: 1989.80 },
            saldoAtual: { type: 'number', format: 'float', example: 4510.20 },
          },
        },
        Erro: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Mensagem de erro' },
            message: { type: 'string', example: 'Detalhes do erro' },
          },
        },
        ErroValidacao: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Erro de Validação (Zod)' },
            details: { type: 'object' },
          },
        },
      },
    },
    tags: [
      { name: 'Health', description: 'Verificação de status da API' },
      { name: 'Usuários', description: 'Gerenciamento de usuários e autenticação' },
      { name: 'Transações', description: 'CRUD de transações financeiras' },
    ],
  },
  apis: ['./src/routes/*.js', './src/docs/*.js'],
};

export const swaggerSpec = swaggerJsdoc(options);

