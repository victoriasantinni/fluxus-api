import { prisma } from '../lib/prisma.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

const saltRounds = 10;

export const create = async (data) => {
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);
    const user = await prisma.user.create({
        data: {
            ...data,
            password: hashedPassword,
        },
    });
    // eslint-disable-next-line no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
};


export const findByEmail = async (email) => {
    const user = await prisma.user.findUnique({
        where: { email },
    });
    return user;
};


export const login = async (email, password) => {
    const user = await prisma.user.findUnique({ 
        where: { email },
    });
    if (!user) {
        throw new Error('Usuário ou senha inválidos');
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw new Error('Usuário ou senha inválidos');
    }
    const token = jwt.sign({ userId: user.id }, config.jwtSecret, {
        expiresIn: '1d',
    });
    return token;
};

export const getById = async (id) => {
    const user = await prisma.user.findUnique({
        where: { id },
    });
    
    if (!user) { // verificação se o usuário existe, para retornar erro 404
        throw new Error('Usuário não encontrado');
    }
    
    // eslint-disable-next-line no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
};