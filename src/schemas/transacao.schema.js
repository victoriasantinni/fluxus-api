import { z } from 'zod';

export const createTransactionSchema = z.object({
  descricao: z.string({
    required_error: 'O campo "descricao" é obrigatório',
    invalid_type_error: 'O campo "descricao" deve ser um texto'
  })
    .trim()
    .min(1, 'O campo "descricao" é obrigatório e não pode estar vazio')
    .max(255, 'O campo "descricao" deve ter no máximo 255 caracteres'),
  valor: z.number({
    required_error: 'O campo "valor" é obrigatório',
    invalid_type_error: 'O campo "valor" deve ser um número'
  }).positive('O campo "valor" deve ser um número positivo maior que zero'),
  tipo: z.enum(['receita', 'despesa'], {
    required_error: 'O campo "tipo" é obrigatório',
    invalid_type_error: 'O campo "tipo" deve ser "receita" ou "despesa"'
  }).refine(val => val === 'receita' || val === 'despesa', {
    message: 'O campo "tipo" deve ser "receita" ou "despesa"'
  }),
  categoria: z.string()
    .trim()
    .max(100, 'O campo "categoria" deve ter no máximo 100 caracteres')
    .optional()
    .nullable()
    .transform(val => val === '' || val === null ? null : val)
});

export const updateTransactionSchema = z.object({
  descricao: z.string().min(1, 'O campo "descricao" não pode estar vazio').max(255, 'O campo "descricao" deve ter no máximo 255 caracteres').optional(),
  valor: z.number().positive('O campo "valor" deve ser um número positivo maior que zero').optional(),
  tipo: z.enum(['receita', 'despesa'], {
    invalid_type_error: 'O campo "tipo" deve ser "receita" ou "despesa"'
  }).refine(val => val === 'receita' || val === 'despesa', {
    message: 'O campo "tipo" deve ser "receita" ou "despesa"'
  }).optional(),
  categoria: z.string().max(100, 'O campo "categoria" deve ter no máximo 100 caracteres').optional().nullable()
}).refine(obj => Object.keys(obj).length > 0, { 
  message: 'Pelo menos um campo deve ser informado para atualização' 
});