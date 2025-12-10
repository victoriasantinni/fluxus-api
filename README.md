# Finance Tracker - Squad 6

Bem-vindo ao Finance Tracker, a API de controle financeiro desenvolvida pelo Squad 6 (Módulo 2, Programadores do Amanhã).
Este projeto foi criado para ajudar pessoas a organizarem suas finanças de forma simples — registrando entradas, saídas e acompanhando o fluxo de gastos ao longo do tempo.

## 📋 Estrutura do Projeto

Antes de colocar a mão no código, é importante entender como o projeto está organizado. A estrutura abaixo mostra onde cada parte da aplicação vive — desde o schema do banco, até as rotas, controllers e serviços.
Essa divisão facilita o trabalho em equipe, mantém o código limpo e ajuda cada pessoa do Squad a saber exatamente onde mexer quando for implementar novas funcionalidades.
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

🚀 Configuração Inicial (Primeira vez)

Se esta é sua primeira vez rodando o Finance Tracker no seu computador, aqui é o seu ponto de partida.
Essas etapas garantem que você tenha o ambiente certinho para trabalhar, com as dependências instaladas, o banco configurado e o servidor pronto para rodar.

1. Clone o repositório
git clone https://github.com/victoriasantinni/Finance_Tracker-squad6.git
cd Finance_Tracker-squad6

2. Crie o arquivo .env

O projeto usa variáveis de ambiente para guardar dados sensíveis — como a URL do banco.
Por segurança, esse arquivo não vai para o Git, então cada pessoa cria o seu próprio:

cp .env.example .env


Agora preencha com a configuração correta para o seu ambiente:

Ambiente de Desenvolvimento

Exemplo usando SQLite:

NODE_ENV=development
DATABASE_URL="file:./dev.db"


Exemplo usando PostgreSQL com schema dev:

NODE_ENV=development
DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<database>?schema=dev"

Ambiente de Produção (Render)
NODE_ENV=production
DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<database>?schema=public"

3. Instale as dependências e configure o banco

Aqui você escolhe entre a forma mais rápida ou a manual.

Opção A — automática (recomendada):

npm run setup


Esse comando cuida de tudo para você:

Instala dependências

Cria o banco

Aplica migrations

Gera o Prisma Client

Opção B — manual:

npm install
npm run prisma:migrate

4. Inicie o servidor
npm run dev


A API vai rodar em: http://localhost:3000

🗄️ Gerenciamento do Banco de Dados

Aqui você encontra tudo que precisa saber sobre como o banco funciona no projeto e o que deve (ou não) ser versionado.

O que vai para o Git?

Essa separação garante que o projeto seja seguro e organizado para todo o squad.

Vai pro Git:

prisma/migrations/

prisma/schema.prisma

Não vai pro Git:

database/

prisma/generated/

O motivo?

As migrations são o “histórico oficial” do banco — todos precisam delas.

O banco local é só seu e não faz sentido compartilhar.

O Prisma Client é gerado automaticamente.

Comandos úteis do Prisma

Esses são os comandos que você mais vai usar durante o desenvolvimento:

npm run prisma:migrate


Esse comando faz:

Detecta mudanças no schema

Cria uma migration

Aplica no banco

Gera o Prisma Client

Para visualizar e editar o banco na sua máquina:

npm run prisma:studio

🔄 Workflow de Desenvolvimento

Essa parte explica como manter seu ambiente alinhado com o da equipe e como criar migrations de forma correta (e sem dor de cabeça).

Quando puxar código do GitHub
git pull origin dev
npm install
npm run prisma:migrate


Isso garante que seu banco e seu Prisma Client estejam atualizados com a nova versão do projeto.

Quando você alterar o schema do banco

Exemplo: criar o model Transaction.

Edite o schema.prisma

Rode:

npm run prisma:migrate


Commite:

git add prisma/schema.prisma prisma/migrations/
git commit -m "feat: adiciona model Transaction"
git push


Regra de ouro: Nunca edite migrations antigas.

⚠️ Observações Importantes

Antes de continuar o desenvolvimento, vale alinhar algumas recomendações que ajudam o squad inteiro:

Puxe o código antes de criar migrations

Não edite migrations prontas

Comunique mudanças grandes

Sempre commit migrations novas

Tarefas Pendentes

 Criar o model Transaction

 Voltar o relacionamento transactions em User

 Criar rotas, controllers e serviços de Transaction

📚 Recursos

Aqui estão os links que mais usamos durante o projeto:

Documentação do Prisma

Prisma Schema Reference

Guia do Prisma Migrate
---

**Dúvidas?** Pergunte no grupo do Squad 6! 🚀
