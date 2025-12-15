import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string({
    required_error: 'O campo "email" é obrigatório',
    invalid_type_error: 'O campo "email" deve ser um texto'
  }).email('O campo "email" deve ser um e-mail válido (exemplo: usuario@email.com)'),
  senha: z.string({
    required_error: 'O campo "senha" é obrigatório',
    invalid_type_error: 'O campo "senha" deve ser um texto'
  }).min(8, 'O campo "senha" deve ter no mínimo 8 caracteres'),
  nome: z.string({
    required_error: 'O campo "nome" é obrigatório',
    invalid_type_error: 'O campo "nome" deve ser um texto'
  }).min(1, 'O campo "nome" não pode estar vazio').max(255, 'O campo "nome" deve ter no máximo 255 caracteres'),
});

export const loginSchema = z.object({
  email: z.string({
    required_error: 'O campo "email" é obrigatório',
    invalid_type_error: 'O campo "email" deve ser um texto'
  }).email('O campo "email" deve ser um e-mail válido (exemplo: usuario@email.com)'),
  senha: z.string({
    required_error: 'O campo "senha" é obrigatório',
    invalid_type_error: 'O campo "senha" deve ser um texto'
  }).min(1, 'O campo "senha" é obrigatório'),
});