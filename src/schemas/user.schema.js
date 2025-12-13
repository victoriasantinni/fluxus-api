import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
});

export const loginSchema = z.object({
    email: z.string().email('E-mail inválido').nonempty('O campo e-mail é obrigatório'),
    password: z.string().nonempty('A senha é obrigatória'),
});