export const errorHandler = (err, req, res, next) => {
  console.error('\n=== ERRO DETECTADO ===');
  console.error('Timestamp:', new Date().toISOString());
  console.error('Path:', req.path);
  console.error('Method:', req.method);
  console.error('Error:', err);
  console.error('=== FIM DO ERRO ===\n');
  
  // Erro de autenticação/permissão
  if (err.message === 'FORBIDDEN') {
    return res.status(403).json({ 
      message: 'Ação não permitida' 
    });
  }
  
  // Erro de validação do Zod
  if (err.name === 'ZodError') {
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
    // Erro de registro não encontrado
    if (err.code === 'P2025') {
      return res.status(404).json({ 
        message: 'Registro não encontrado' 
      });
    }
    
    // Violação de constraint única
    if (err.code === 'P2002') {
      return res.status(409).json({ 
        message: 'Já existe um registro com estes dados' 
      });
    }
    
    // Outros erros do Prisma
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