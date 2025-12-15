/**
 * @swagger
 * /health:
 *   get:
 *     summary: Verificar status da API
 *     description: Retorna o status de saúde da API e conexão com o banco de dados
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API funcionando corretamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: healthy
 *                 database:
 *                   type: string
 *                   example: connected
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       500:
 *         description: Erro na conexão com o banco
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Criar novo usuário
 *     description: |
 *       Registra um novo usuário no sistema. A senha será criptografada com bcrypt.
 *       
 *       **⚠️ Se você já estiver logado, receberá um erro 403 informando que precisa fazer logout primeiro.**
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioCreate'
 *           examples:
 *             exemplo1:
 *               summary: Usuário completo
 *               value:
 *                 email: "usuario@email.com"
 *                 senha: "senha12345"
 *                 nome: "João Silva"
 *             exemplo2:
 *               summary: Usuário sem nome
 *               value:
 *                 email: "usuario@email.com"
 *                 senha: "senha12345"
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroValidacao'
 *       403:
 *         description: Usuário já está logado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Você já está logado"
 *                 message:
 *                   type: string
 *                   example: "Para criar uma nova conta, você precisa fazer logout primeiro"
 *       409:
 *         description: E-mail já cadastrado
 *   
 *   get:
 *     summary: Informações sobre registro (via navegador)
 *     description: |
 *       Retorna informações sobre como criar uma conta quando acessado via navegador (GET).
 *       Se já estiver logado, retorna erro 403.
 *     tags: [Autenticação]
 *     responses:
 *       200:
 *         description: Informações sobre como registrar
 *       403:
 *         description: Usuário já está logado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Você já está logado"
 *                 message:
 *                   type: string
 *                   example: "Para criar uma nova conta, você precisa fazer logout primeiro"
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Fazer login
 *     description: |
 *       Autentica o usuário e retorna um token JWT válido por 24 horas.
 *       
 *       **⚠️ Se você já estiver logado, será redirecionado automaticamente para `/me`.**
 *       
 *       **Como usar o token:**
 *       1. Copie o token retornado
 *       2. Clique no botão "Authorize" 🔓 no topo da página
 *       3. Cole apenas o token (o prefixo "Bearer" já está configurado automaticamente)
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *           examples:
 *             usuarioTeste:
 *               summary: Usuário de teste (seed)
 *               value:
 *                 email: "joao@email.com"
 *                 senha: "senha123"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: E-mail ou senha incorretos
 *       302:
 *         description: Usuário já está logado - redirecionado para /me
 *   
 *   get:
 *     summary: Fazer login (via navegador)
 *     description: |
 *       Quando acessado via navegador (GET), se já estiver logado, redireciona para `/me`.
 *       Se não estiver logado, retorna informações sobre como fazer login.
 *     tags: [Autenticação]
 *     responses:
 *       302:
 *         description: Usuário já está logado - redirecionado para /me
 *       200:
 *         description: Informações sobre como fazer login
 */

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Fazer logout
 *     description: |
 *       Realiza logout do usuário. Como JWT é stateless, o token não é invalidado no servidor.
 *       O cliente deve descartar o token após receber sucesso.
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logout realizado com sucesso"
 *                 note:
 *                   type: string
 *                   example: "Descarte o token no cliente"
 *       401:
 *         description: Token ausente ou inválido
 *   
 *   get:
 *     summary: Fazer logout (via navegador)
 *     description: |
 *       Realiza logout do usuário quando acessado via navegador (GET).
 *       Se não estiver logado, retorna erro 401.
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logout realizado com sucesso"
 *                 note:
 *                   type: string
 *                   example: "Descarte o token no cliente"
 *       401:
 *         description: Usuário não está logado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Você não está logado"
 *                 message:
 *                   type: string
 *                   example: "Faça login primeiro para poder fazer logout"
 */

/**
 * @swagger
 * /me:
 *   get:
 *     summary: Ver meu perfil
 *     description: |
 *       Retorna os dados do usuário autenticado (sem a senha).
 *       
 *       **⚠️ Se você não estiver logado, será redirecionado automaticamente para `/login`.**
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do usuário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       302:
 *         description: Usuário não está logado - redirecionado para /login
 */

/**
 * @swagger
 * /transacoes:
 *   get:
 *     summary: Listar minhas transações
 *     description: Retorna todas as transações do usuário autenticado com suporte a paginação
 *     tags: [Transações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *           maximum: 100
 *         description: Quantidade máxima de registros (máx. 100)
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Quantidade de registros para pular (paginação)
 *     responses:
 *       200:
 *         description: Lista de transações
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transacao'
 *       401:
 *         description: Token ausente ou inválido
 *
 *   post:
 *     summary: Criar nova transação
 *     description: Cria uma nova transação (receita ou despesa) para o usuário autenticado
 *     tags: [Transações]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TransacaoCreate'
 *           examples:
 *             receita:
 *               summary: Exemplo de receita
 *               value:
 *                 descricao: "Salário mensal"
 *                 valor: 5000.00
 *                 tipo: "receita"
 *                 categoria: "Salário"
 *             despesa:
 *               summary: Exemplo de despesa
 *               value:
 *                 descricao: "Conta de luz"
 *                 valor: 150.00
 *                 tipo: "despesa"
 *                 categoria: "Contas"
 *     responses:
 *       201:
 *         description: Transação criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transacao'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroValidacao'
 *       401:
 *         description: Token ausente ou inválido
 */

/**
 * @swagger
 * /transacoes/saldo:
 *   get:
 *     summary: Ver extrato / saldo
 *     description: Retorna o total de receitas, despesas e saldo atual do usuário
 *     tags: [Transações]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Extrato do usuário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Extrato'
 *             example:
 *               totalReceita: 6500.00
 *               totalDespesa: 1989.80
 *               saldoAtual: 4510.20
 *       401:
 *         description: Token ausente ou inválido
 */

/**
 * @swagger
 * /transacoes/{id}:
 *   get:
 *     summary: Buscar transação por ID
 *     description: Retorna uma transação específica (apenas se pertencer ao usuário)
 *     tags: [Transações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da transação
 *         example: 1
 *     responses:
 *       200:
 *         description: Dados da transação
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transacao'
 *       401:
 *         description: Token ausente ou inválido
 *       404:
 *         description: Transação não encontrada
 *
 *   put:
 *     summary: Atualizar transação
 *     description: Atualiza uma transação existente (apenas se pertencer ao usuário)
 *     tags: [Transações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da transação
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TransacaoUpdate'
 *           example:
 *             descricao: "Salário atualizado"
 *             valor: 5500.00
 *     responses:
 *       200:
 *         description: Transação atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transacao'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token ausente ou inválido
 *       403:
 *         description: Sem permissão (transação de outro usuário)
 *       404:
 *         description: Transação não encontrada
 *
 *   delete:
 *     summary: Deletar transação
 *     description: Remove uma transação permanentemente (apenas se pertencer ao usuário)
 *     tags: [Transações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da transação
 *         example: 1
 *     responses:
 *       204:
 *         description: Transação deletada com sucesso (sem conteúdo)
 *       401:
 *         description: Token ausente ou inválido
 *       403:
 *         description: Sem permissão (transação de outro usuário)
 *       404:
 *         description: Transação não encontrada
 */

