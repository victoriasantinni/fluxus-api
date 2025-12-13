import jwt from 'jsonwebtoken';
import { config } from '../config/index.js'; 

const SECRET = config.jwtSecret;

// Gera um novo Token JWT
export const generateToken = (payload) => {
    // O payload deve incluir dados essenciais, como o ID do usuário (userId)
    return jwt.sign(payload, SECRET, { 
        expiresIn: '1d' // Token expira em 1 dia
    });
};