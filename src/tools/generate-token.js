import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const userId = Number(process.argv[2] || 1);
const token = jwt.sign({ userId }, process.env.JWT_SECRET || 'troca_por_uma_chave_secreta_forte', { expiresIn: '7d' });
console.log(token);
