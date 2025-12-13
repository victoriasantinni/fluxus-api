// error.middleware.js

// NOTA: MANTENHA O IMPORT DO ZodError mesmo que não o usemos diretamente no 'instanceof'
import { ZodError } from 'zod'; 

export const errorHandler = (err, req, res, next) => {
  console.error('\n=== ERRO DETECTADO ===');
  console.error('Timestamp:', new Date().toISOString());
  console.error('Path:', req.path);
  console.error('Method:', req.method);
  console.error('Error:', err);
  console.error('=== FIM DO ERRO ===\n');
  
  // Erro de autenticação/permissão (FORBIDDEN)
  if (err.message === 'FORBIDDEN') {
    return res.status(403).json({ 
      message: 'Ação não permitida' 
    });
  }
  
  // **SOLUÇÃO PARA O 500:** Checagem de Estrutura do Zod
  // Trata o erro se ele tiver a estrutura de erro do Zod (propriedade 'errors' que é um array)
  if (err && Array.isArray(err.errors)) {
    const formattedErrors = err.errors.map(error => ({
      field: error.path.join('.'),
      message: error.message
    }));
    
    return res.status(400).json({ 
      message: 'Dados inválidos',
      errors: formattedErrors 
    });
  }
  
  // Erro do Prisma
  if (err.code && err.code.startsWith('P')) {
    
    if (err.code === 'P2025') {
      return res.status(404).json({ 
        message: 'Registro não encontrado' 
      });
    }
    
    if (err.code === 'P2002') {
      return res.status(409).json({ 
        message: 'Já existe um registro com estes dados' 
      });
    }
    
    return res.status(500).json({ 
      message: 'Erro no banco de dados',
      code: err.code 
    });
  }
  
  // Erro genérico
  return res.status(500).json({ 
    message: 'Erro interno do servidor',
    detail: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};