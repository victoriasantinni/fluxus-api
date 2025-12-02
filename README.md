# Finance Tracker - Squad 6

API de Finanças Pessoais desenvolvida pelo Squad 6 (Módulo 2, Programadores do Amanhã)

## 📋 Estrutura do Projeto

```
Finance_Tracker-squad6/
├── database/              # Banco de dados SQLite (não versionado)
│   └── dev.db            # Arquivo do banco local
├── prisma/
│   ├── generated/        # Prisma Client gerado (não versionado)
│   ├── migrations/       # Histórico de mudanças no banco (versionado!)
│   └── schema.prisma     # Schema do banco de dados
├── src/
│   ├── config/           # Configurações (ex: Prisma Client)
│   ├── controllers/      # Lógica das rotas
│   ├── routes/           # Definição de rotas
│   ├── services/         # Lógica de negócio
│   ├── middlewares/      # Middlewares Express
│   ├── validations/      # Validações
│   └── server.js         # Ponto de entrada da aplicação
├── .env                  # Variáveis de ambiente (não versionado)
├── .env.example          # Exemplo de variáveis (versionado)
└── package.json
```

## 🚀 Configuração Inicial (Primeira vez)

### 1. Clone o repositório
```bash
git clone https://github.com/victoriasantinni/Finance_Tracker-squad6.git
cd Finance_Tracker-squad6
```

### 2. Crie o arquivo `.env`

**Por que fazer isso?**  
O arquivo `.env` contém informações sensíveis (como URLs de banco, senhas, etc.) e **nunca deve ser compartilhado** no GitHub. Cada desenvolvedor precisa criar o seu próprio.

```bash
cp .env.example .env
```

O arquivo `.env` já está configurado corretamente. **Não precisa alterar nada** se estiver trabalhando em ambiente de desenvolvimento local.

### 3. Instale as dependências e configure o banco

**Opção A - Automática (Recomendado):**
```bash
npm run setup
```

Este comando faz **tudo** automaticamente:
- ✅ Instala as dependências do projeto (`npm install`)
- ✅ Cria o banco de dados SQLite em `database/dev.db`
- ✅ Aplica todas as migrations (cria as tabelas)
- ✅ Gera o Prisma Client automaticamente (código para acessar o banco)

**Opção B - Manual:**
```bash
npm install              # 1. Instala dependências
npm run prisma:migrate   # 2. Cria banco, aplica migrations E gera o client
```

> **💡 Dica:** O comando `prisma:migrate` já faz o "generate" automaticamente! Você não precisa rodar comandos separados.

### 4. Inicie o servidor
```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3000`

## 🗄️ Gerenciamento do Banco de Dados

### O que é versionado no GitHub?

✅ **SIM - Versionar:**
- `prisma/migrations/` - Histórico de todas as mudanças no banco
- `prisma/schema.prisma` - Definição das tabelas

❌ **NÃO - Ignorar (.gitignore):**
- `database/` - Banco de dados local de cada desenvolvedor
- `prisma/generated/` - Código gerado automaticamente pelo Prisma

**Por quê?**
- **Migrations** são como "commits" do banco de dados. Todos precisam ter o mesmo histórico para manter os bancos sincronizados.
- **database/** contém dados locais de teste de cada desenvolvedor - não faz sentido versionar.
- **prisma/generated/** é código gerado automaticamente - será criado quando rodar `npm run prisma:generate`.

### Comandos úteis do Prisma

```bash
# Criar e aplicar migration (SEMPRE que alterar schema.prisma)
npm run prisma:migrate
# O que faz:
# 1. Detecta mudanças no schema.prisma
# 2. Cria arquivo de migration (SQL)
# 3. Aplica no banco (cria/altera tabelas)
# 4. Gera o Prisma Client automaticamente ← Importante!

# Abrir interface visual do banco de dados
npm run prisma:studio
# Abre http://localhost:5555 no navegador
# Você pode ver e editar dados diretamente
```

**⚠️ Importante:** Você NÃO precisa rodar `prisma generate` manualmente! O comando `prisma:migrate` já faz isso automaticamente.

## 🔄 Workflow de Desenvolvimento

### Quando você puxa código novo do GitHub:

```bash
git pull origin dev
npm install                 # Instala novas dependências (se houver)
npm run prisma:migrate      # Aplica migrations E gera o client atualizado
```

**Por que fazer isso?**  
Alguém da equipe pode ter adicionado novas tabelas ou campos no `schema.prisma`. O comando `prisma:migrate`:
1. ✅ Aplica as migrations novas no seu banco local
2. ✅ Gera o Prisma Client atualizado automaticamente
3. ✅ Garante que seu banco fique igual ao da equipe

### Quando você modifica o banco de dados:

**Exemplo: Adicionar o model Transaction**

1. **Edite** o arquivo `prisma/schema.prisma`
   ```prisma
   model Transaction {
     // ...
   }
   
   model User {
     id           Int           @id @default(autoincrement())
     // ... campos existentes
     transactions Transaction[] // ← Descomentar essa linha!
   }
   ```

2. **Crie a migration:**
   ```bash
   npm run prisma:migrate
   ```
   - O Prisma vai perguntar o nome da migration
   - Digite algo descritivo: `create_transaction_model`
   - Pressione Enter
   
   **O que acontece automaticamente:**
   - ✅ Cria pasta `prisma/migrations/[data]_create_transaction_model/`
   - ✅ Cria arquivo SQL com os comandos CREATE TABLE
   - ✅ Aplica no banco (tabela é criada)
   - ✅ Gera o Prisma Client atualizado (agora tem `prisma.transaction.create()`, etc.)

3. **Commite as mudanças:**
   ```bash
   git add prisma/schema.prisma prisma/migrations/
   git commit -m "feat: adiciona model Transaction"
   git push
   ```

**⚠️ Importante:** 
- Sempre commite a pasta `prisma/migrations/` quando criar uma migration!
- Nunca edite arquivos de migration já criados
- Não commite a pasta `prisma/generated/` (é gerada automaticamente)

## ⚠️ Observações Importantes

### Tarefas Pendentes

- [ ] **Criar o model Transaction** no arquivo `prisma/schema.prisma`
- [ ] Descomentar a relação `transactions Transaction[]` no model User
- [ ] Criar controllers, services e rotas para Transaction

### Evite Conflitos

- **Nunca edite** arquivos de migration já criados
- **Sempre puxe** código novo antes de criar uma migration
- **Comunique a equipe** quando criar uma migration importante

## 📚 Recursos

- [Documentação Prisma](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate)

---

**Dúvidas?** Pergunte no grupo do Squad 6! 🚀
