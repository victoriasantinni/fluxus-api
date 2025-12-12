import { Router } from 'express';
import * as controller from '../controllers/transaction.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import { createTransactionSchema, updateTransactionSchema } from '../schemas/transaction.schema.js';

const router = Router();

// Todas as rotas exigem autenticação
router.use(authenticate);

// Rotas CRUD
router.get('/', controller.listTransactions);
router.get('/:id', controller.getTransaction);
router.post('/', validate(createTransactionSchema), controller.createTransaction);
router.put('/:id', validate(updateTransactionSchema), controller.updateTransaction);
router.delete('/:id', controller.deleteTransaction);

export default router;