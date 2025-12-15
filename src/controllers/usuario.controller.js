import * as usuarioService from '../services/usuario.service.js';

export const createUser = async (req, res, next) => {
    try {
        // Se já estiver logado, retorna erro
        if (req.user) {
            return res.status(403).json({
                error: 'Você já está logado',
                message: 'Para criar uma nova conta, você precisa fazer logout primeiro'
            });
        }
        
        const usuario = await usuarioService.create(req.body);
        res.status(201).json(usuario);
    } catch (error) {
        next(error);
    }
}

export const login = async (req, res, next) => {
    try {
        // Se já estiver logado, redireciona para /me
        if (req.user) {
            return res.redirect(302, '/me');
        }
        
        const { email, senha } = req.body;
        const token = await usuarioService.login(email, senha);
        res.json({ token });
    } catch (error) {
        next(error);
    }
}

export const logout = async (req, res, next) => {
    try {
        // JWT é stateless, então não há token para invalidar no servidor
        // O cliente deve descartar o token
        // Em produção, você poderia implementar uma blacklist de tokens
        res.json({
            message: 'Logout realizado com sucesso',
            note: 'Descarte o token no cliente'
        });
    } catch (error) {
        next(error);
    }
}

export const getMe = async (req, res, next) => {
    try {
        const usuario = await usuarioService.getById(req.user.userId);
        res.json(usuario);
    } catch (error) {
        next(error);
    }
}