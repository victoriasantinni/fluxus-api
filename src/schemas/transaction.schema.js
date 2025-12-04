import { z } from 'zod';

export const createTransactionSchema = z.object({
  descricao: z.string().min(1).max(255),
  valor: z.number().positive(),
  tipo: z.enum(['receita', 'despesa']),
  categoria: z.string().max(100).optional().nullable()
});

export const updateTransactionSchema = z.object({
  descricao: z.string().min(1).max(255).optional(),
  valor: z.number().positive().optional(),
  tipo: z.enum(['receita', 'despesa']).optional(),
  categoria: z.string().max(100).optional().nullable()
}).refine(obj => Object.keys(obj).length > 0, { 
  message: 'Pelo menos um campo deve ser informado' 
});