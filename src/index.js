import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import transactionRoutes from './routes/transaction.routes.js';
import { prisma } from './lib/prisma.js';
import { configureSwagger } from './docs/swagger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

configureSwagger(app);

// Middlewares
app.use(cors());
app.use(express.json());

// Log de requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: 'API de Transações Financeiras',
    version: '1.0.0',
    endpoints: {
      transacoes: '/transacoes',
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

// Rotas da aplicação
app.use('/transacoes', transactionRoutes);

// Rota não encontrada (404) - FORMA CORRETA
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
  console.error('Erro:', err);
  
  if (err.message === 'Usuário não autenticado') {
    return res.status(401).json({ error: 'Não autenticado' });
  }
  
  res.status(500).json({ 
    error: 'Erro interno do servidor'
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
      console.log(` API: http://localhost:${PORT}/transacoes`);
      console.log(` Health: http://localhost:${PORT}/health`);
      console.log('='.repeat(50));
      console.log('\n  Todas as rotas exigem autenticação JWT');
      console.log(' Header: Authorization: Bearer <token>\n');
    });
  } catch (error) {
    console.error(' Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}
export default app;


