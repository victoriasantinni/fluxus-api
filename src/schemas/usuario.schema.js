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
  nome: z.string().optional(),
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