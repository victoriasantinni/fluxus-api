// error.middleware.js

// NOTA: MANTENHA O IMPORT DO ZodError mesmo que não o usemos diretamente no 'instanceof'
import { ZodError } from 'zod'; 

export const errorHandler = (err, req, res, next) => {
  console.error('\n=== ERRO DETECTADO ===');
  console.error('Timestamp:', new Date().toISOString());
  console.error('Path:', req.path);
  console.error('Method:', req.method);
  console.error('Error:', err);
  console.error('Error name:', err?.name);
  console.error('Error code:', err?.code);
  console.error('Error message:', err?.message);
  console.error('Error stack:', err?.stack);
  console.error('=== FIM DO ERRO ===\n');
  
  // Erro de autenticação/permissão (FORBIDDEN)
  if (err.message === 'FORBIDDEN') {
    return res.status(403).json({ 
      error: 'Ação não permitida',
      mensagem: 'Você não tem permissão para realizar esta ação'
    });
  }
  
  // Trata erros do Zod (fallback caso passe pelo validation middleware)
  if (err instanceof ZodError && Array.isArray(err.errors)) {
    const formattedErrors = err.errors.map(error => ({
      campo: error.path?.join('.') || 'raiz',
      mensagem: error.message || 'Campo inválido'
    }));
    
    return res.status(400).json({ 
      error: 'Erro de validação',
      mensagem: 'Alguns campos estão inválidos. Verifique os detalhes abaixo.',
      erros: formattedErrors 
    });
  }
  
  // Erros do Prisma
  if (err.code?.startsWith('P')) {
    const prismaErrors = {
      'P2025': { status: 404, error: 'Registro não encontrado' },
      'P2002': { status: 409, error: 'Dados duplicados', mensagem: `Já existe um registro com este ${err.meta?.target?.[0] || 'campo'}` },
      'P2003': { status: 400, error: 'Referência inválida', mensagem: 'O registro referenciado não existe ou é inválido' },
      'P2011': { status: 400, error: 'Campo obrigatório ausente', mensagem: `O campo "${err.meta?.constraint || 'campo'}" é obrigatório e não pode ser nulo` },
      'P2012': { status: 400, error: 'Campo obrigatório ausente', mensagem: `O campo "${err.meta?.path || 'campo'}" é obrigatório e não foi fornecido` },
      'P2014': { status: 400, error: 'Relação obrigatória ausente', mensagem: 'Uma relação obrigatória não foi fornecida' }
    };
    
    const prismaError = prismaErrors[err.code];
    if (prismaError) {
      return res.status(prismaError.status).json(prismaError);
    }
    
    return res.status(500).json({ 
      error: 'Erro no banco de dados',
      mensagem: 'Ocorreu um erro ao processar a operação no banco de dados',
      code: err.code
    });
  }
  
  // Erros do Prisma sem código (validação)
  if (err.name?.includes('Prisma') || err.message?.toLowerCase().includes('prisma')) {
    if (err.message?.match(/required|missing|null|constraint/i)) {
      return res.status(400).json({ 
        error: 'Campo obrigatório ausente',
        mensagem: 'Um ou mais campos obrigatórios não foram fornecidos ou estão inválidos'
      });
    }
    return res.status(400).json({ 
      error: 'Erro de validação',
      mensagem: 'Os dados fornecidos não são válidos. Verifique os campos obrigatórios.'
    });
  }
  
  // TypeError
  if (err instanceof TypeError) {
    return res.status(400).json({ 
      error: 'Dados inválidos',
      mensagem: err.message?.includes('Cannot read properties') 
        ? 'Alguns campos obrigatórios estão faltando ou em formato inválido'
        : 'Os dados fornecidos estão em formato inválido ou incompleto'
    });
  }
  
  // Erro genérico
  return res.status(500).json({ 
    error: 'Erro interno do servidor',
    mensagem: 'Ocorreu um erro inesperado. Tente novamente mais tarde.',
    detail: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};