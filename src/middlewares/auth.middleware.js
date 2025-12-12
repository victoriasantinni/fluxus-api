import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ 
        error: 'Token de autenticação ausente',
        message: 'Envie o token no header: Authorization: Bearer <seu_token>'
      });
    }
    
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Formato de token inválido',
        message: 'Use o formato: Bearer <seu_token>',
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        error: 'Token não fornecido' 
      });
    }
    
    const secret = config.jwtSecret;
    if (!secret) {
      throw new Error('JWT_SECRET não está definido nas variáveis de ambiente');
    }
    
    const payload = jwt.verify(token, secret);
    
    if (!payload.userId) {
      return res.status(401).json({ 
        error: 'Token inválido: userId não encontrado',
      });
    }
    
    req.user = { 
      id: parseInt(payload.userId) 
    };
    
    next();
  } catch (error) {
    console.error(' Erro de autenticação:', error.message);
    
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