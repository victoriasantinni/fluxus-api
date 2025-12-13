import { ZodError } from 'zod';

export const validate = (schema) => (req, res, next) => {
  try {
    // Tenta validar o corpo da requisição (req.body) contra o schema do Zod
    schema.parse(req.body);
    next();
  } catch (error) {
    // Verifica se o erro capturado é uma falha de validação do Zod
    if (error instanceof ZodError) {
        
        // Formata o erro usando o método nativo .format() do Zod
        const formattedError = error.format();
        
        // Retorna imediatamente a resposta 400 Bad Request com os detalhes do erro
        return res.status(400).json({
            error: 'Erro de Validação (Zod)',
            details: formattedError 
        });
    }

    // Se for um erro que não seja do Zod (ex: erro de servidor ou middleware), passa para o próximo tratador de erros
    next(error);
  }
};