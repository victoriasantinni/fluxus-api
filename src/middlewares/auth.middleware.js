import jwt from 'jsonwebtoken';
import * as userRepository from '../repositories/UserRepository.js';
import * as authConfig from '../config/AuthConfig.js'; 

export const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                error: 'Token de autenticação ausente ou formato inválido',
                message: 'Use o formato: Authorization: Bearer <seu_token>'
            });
        }
        
        const token = authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ 
                error: 'Token não fornecido' 
            });
        }
        
        // CORRIGIDO: Agora puxa a chave do AuthConfig.JWT_SECRET
        const secret = authConfig.JWT_SECRET || 'chave_secreta_padrao_mude_no_env'; 
        
        const payload = jwt.verify(token, secret);
        
        const user = await userRepository.findByEmail(payload.email); 

        if (!user) {
             return res.status(401).json({ 
                 error: 'Token inválido: Usuário não encontrado no sistema.'
             });
        }
        
        req.user = user; 
        
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                error: 'Token inválido',
                message: 'O token fornecido é inválido'
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                error: 'Token expirado',
                message: 'O token expirou, gere um novo'
            });
        }
        
        return res.status(401).json({ 
            error: 'Falha na autenticação',
            detail: error.message 
        });
    }
};