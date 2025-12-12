import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { validate } from '../middlewares/validation.middleware.js';
import { createUserSchema, loginSchema } from '../schemas/user.schema.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/users', validate(createUserSchema), userController.createUser);
router.post('/login', validate(loginSchema), userController.login);
router.get('/users/me', authenticate, userController.getMe);

export default router;
