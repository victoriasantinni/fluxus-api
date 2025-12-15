import { prisma } from '../lib/prisma.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

const saltRounds = 10;

export const create = async (data) => {
  const senhaHash = await bcrypt.hash(data.senha, saltRounds);
  
  return prisma.usuario.create({
    data: {
      email: data.email,
      nome: data.nome,
      senha: senhaHash,
    },
  });
};

export const findByEmail = async (email) => {
  return prisma.usuario.findUnique({
    where: { email },
  });
};

export const login = async (email, senha) => {
  const usuario = await prisma.usuario.findUnique({
    where: { email },
  });
  
  if (!usuario) {
    throw new Error('Usuário ou senha inválidos');
  }
  
  const match = await bcrypt.compare(senha, usuario.senha);
  
  if (!match) {
    throw new Error('Usuário ou senha inválidos');
  }
  
  const token = jwt.sign({ userId: usuario.id }, config.jwtSecret, {
    expiresIn: '1d',
  });
  
  return token;
};

export const getById = async (id) => {
  const usuario = await prisma.usuario.findUnique({
    where: { id },
  });

  if (!usuario) {
    throw new Error('Usuário não encontrado');
  }

  // Remove a senha do retorno por segurança
  const { senha, ...usuarioSemSenha } = usuario;
  return usuarioSemSenha;
};