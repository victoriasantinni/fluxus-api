import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { config } from './config/index.js';
import { swaggerSpec } from './config/swagger.js';
import transacaoRoutes from './routes/transacao.routes.js';
import authRoutes from './routes/auth.routes.js';
import { prisma } from './lib/prisma.js';
import { errorHandler } from './middlewares/error.middleware.js';

// Importa documentação Swagger
import './docs/swagger.docs.js';

const app = express();
const PORT = config.port;

// Middlewares
app.use(cors());
app.use(express.json());

// Swagger UI - Documentação da API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Fluxus: Seu Rastreador de Finanças Pessoais - Documentação',
}));

// Rota raiz
app.get('/', (req, res) => {
    res.json({
        message: 'Fluxus: Seu Rastreador de Finanças Pessoais',
        version: '1.0.0',
        documentation: '/api-docs',
        endpoints: {
            autenticacao: {
                registrar: '/register',
                login: '/login',
                logout: '/logout',
                perfil: '/me'
            },
            transacoes: {
                listar: '/transacoes',
                criar: '/transacoes',
                extrato: '/transacoes/saldo',
                buscar: '/transacoes/:id',
                atualizar: '/transacoes/:id',
                deletar: '/transacoes/:id'
            },
            sistema: {
                health: '/health',
                docs: '/api-docs'
            }
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

// Rotas da aplicação
app.use('/transacoes', transacaoRoutes);
app.use('/', authRoutes); // Rotas de autenticação: /register, /login, /logout, /me

// Rota não encontrada (404)
app.use((req, res) => {
    res.status(404).json({
        error: 'Rota não encontrada',
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString()
    });
});

// Middleware de erro (USAR O EXISTENTE)
app.use(errorHandler);

// Inicia servidor
async function startServer() {
    try {
        await prisma.$connect();
        console.log('✅ Conectado ao banco PostgreSQL');

        app.listen(PORT, () => {
            const isProduction = config.nodeEnv === 'production';
            const host = isProduction 
                ? (config.host || 'fluxus-api-service.onrender.com')
                : (config.host || 'localhost');
            const protocol = isProduction ? 'https' : 'http';
            const baseUrl = isProduction 
                ? `${protocol}://${host}`
                : `${protocol}://${host}:${PORT}`;
            
            console.log('\n' + '='.repeat(50));
            console.log('🚀 Servidor iniciado com sucesso!');
            console.log('='.repeat(50));
            console.log(`📍 Porta: ${PORT}`);
            console.log(`🌐 URL: ${baseUrl}`);
            console.log(`📚 Docs: ${baseUrl}/api-docs`);
            console.log(`💚 Health: ${baseUrl}/health`);
            console.log('='.repeat(50));
        });
    } catch (error) {
        console.error(' Erro ao iniciar servidor:', error);
        process.exit(1);
    }
}

startServer();