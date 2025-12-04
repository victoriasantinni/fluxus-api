import { Router } from 'express';
import * as controller from '../controllers/transaction.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

// Todas as rotas exigem autenticação
router.use(authenticate);

// Rotas CRUD
router.get('/', controller.listTransactions);
router.get('/:id', controller.getTransaction);
router.post('/', controller.createTransaction);
router.put('/:id', controller.updateTransaction);
router.delete('/:id', controller.deleteTransaction);

export default router;