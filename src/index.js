import express from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import transactionRoutes from './routes/transaction.routes.js';
import userRoutes from './routes/user.routes.js';
import { prisma } from './lib/prisma.js';

const app = express();
const PORT = config.port;

// Middlewares
app.use(cors());
app.use(express.json());

// Rota raiz
app.get('/', (req, res) => {
    res.json({
        message: 'API de Transações Financeiras',
        version: '1.0.0',
        endpoints: {
            transacoes: '/transacoes',
            users: '/users',
            login: '/users/login', // Alterei para refletir a URL CORRETA
            health: '/health'
        },
        status: 'online'
    });
});

// Health check
app.get('/health', async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.json({
            status: 'healthy',
            database: 'connected',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            status: 'unhealthy',
            database: 'disconnected',
            error: error.message
        });
    }
});

// Rotas da aplicação (INTEGRAÇÃO CORRIGIDA)
app.use('/transactions', transactionRoutes);
app.use('/users', userRoutes); // CORREÇÃO: Adicionando o prefixo /users

// Rota não encontrada (404)
app.use((req, res) => {
    res.status(404).json({
        error: 'Rota não encontrada',
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString()
    });
});

// Middleware de erro (deve ser o último)
app.use((err, req, res, next) => {
    // Verifica se é um erro de validação (pode variar dependendo da biblioteca)
    if (err.name === 'ValidationError') { 
        console.error('Erro de Validação:', err.message);
        // Tenta pegar os detalhes específicos do erro (ex: Joi.details)
        const errorMessage = err.details ? err.details.map(d => d.message).join('; ') : err.message;
        
        return res.status(400).json({
            error: 'Erro de Validação',
            details: errorMessage
        });
    }

    // Erros gerais (500)
    console.error('Erro Interno do Servidor:', err.message);
    res.status(500).json({ 
        error: err.message || 'Erro interno do servidor'
    });
});

// Inicia servidor
async function startServer() {
    try {
        await prisma.$connect();
        console.log(' Conectado ao banco SQLite');

        app.listen(PORT, () => {
            console.log('\n' + '='.repeat(50));
            console.log(' Servidor iniciado com sucesso!');
            console.log('='.repeat(50));
            console.log(` Porta: ${PORT}`);
            console.log(` URL: http://localhost:${PORT}`);
            console.log(` Health: http://localhost:${PORT}/health`);
            console.log('='.repeat(50));
        });
    } catch (error) {
        console.error(' Erro ao iniciar servidor:', error);
        process.exit(1);
    }
}

startServer();