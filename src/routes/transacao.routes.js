// src/routes/transacao.routes.js

import { Router } from 'express';
import * as controller from '../controllers/transacao.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import { createTransactionSchema, updateTransactionSchema } from '../schemas/transacao.schema.js';

const router = Router();

router.use(authenticate);

router.get('/saldo', controller.getExtractController); 

router.get('/', controller.listTransactions); 

router.get('/:id', controller.getTransaction);
router.put('/:id', validate(updateTransactionSchema), controller.updateTransaction);
router.delete('/:id', controller.deleteTransaction);

router.post('/', validate(createTransactionSchema), controller.createTransaction);

export default router;