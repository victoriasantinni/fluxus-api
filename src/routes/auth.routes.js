import { Router } from 'express';
import * as usuarioController from '../controllers/usuario.controller.js';
import { validate } from '../middlewares/validation.middleware.js';
import { createUserSchema, loginSchema } from '../schemas/usuario.schema.js';
import { authenticate, optionalAuth } from '../middlewares/auth.middleware.js';

const router = Router();

// Rotas POST (API)
router.post('/register', optionalAuth, validate(createUserSchema), usuarioController.createUser);
router.post('/login', optionalAuth, validate(loginSchema), usuarioController.login);
router.post('/logout', authenticate, usuarioController.logout);

// Rotas GET (navegador)
router.get('/register', optionalAuth, (req, res) => {
    // Se já estiver logado, informa que precisa fazer logout primeiro
    if (req.user) {
        return res.status(403).json({
            error: 'Você já está logado',
            message: 'Para criar uma nova conta, você precisa fazer logout primeiro'
        });
    }
    
    // Se não estiver logado, mostra mensagem informativa
    res.json({
        message: 'Para criar uma conta, use POST /register',
        method: 'POST',
        endpoint: '/register',
        body: {
            email: 'string (obrigatório)',
            senha: 'string (mínimo 8 caracteres)',
            nome: 'string (opcional)'
        },
        documentation: '/api-docs'
    });
});

router.get('/login', optionalAuth, (req, res) => {
    // Se já estiver logado, redireciona para /me
    if (req.user) {
        return res.redirect(302, '/me');
    }
    
    // Se não estiver logado, mostra mensagem informativa
    res.json({
        message: 'Para fazer login, use POST /login',
        method: 'POST',
        endpoint: '/login',
        body: {
            email: 'string (obrigatório)',
            senha: 'string (obrigatório)'
        },
        documentation: '/api-docs'
    });
});

router.get('/logout', optionalAuth, (req, res) => {
    // Se não estiver logado, informa
    if (!req.user) {
        return res.status(401).json({
            error: 'Você não está logado',
            message: 'Faça login primeiro para poder fazer logout'
        });
    }
    
    // Se estiver logado, faz logout (mesmo comportamento do POST)
    res.json({
        message: 'Logout realizado com sucesso',
        note: 'Descarte o token no cliente'
    });
});

// Rota privada - perfil do usuário
router.get('/me', optionalAuth, (req, res, next) => {
    // Se não estiver logado, redireciona para /login
    if (!req.user) {
        return res.redirect(302, '/login');
    }
    // Se estiver logado, chama o controller
    usuarioController.getMe(req, res, next);
});

export default router;

