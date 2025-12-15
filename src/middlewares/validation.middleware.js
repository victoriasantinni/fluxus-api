import { ZodError } from 'zod';

export const validate = (schema) => (req, res, next) => {
  try {
    // Garante que req.body existe (pode ser undefined se o body estiver vazio)
    const body = req.body || {};
    schema.parse(body);
    next();
  } catch (error) {
    // Verifica se é um erro do Zod
    if (error instanceof ZodError) {
      // No Zod v4, os erros estão em error.issues, não error.errors
      const zodErrors = error.issues || error.errors || [];
      
      if (Array.isArray(zodErrors) && zodErrors.length > 0) {
        // Formata erros em português brasileiro
        const errors = zodErrors.map(err => {
          const field = err.path?.join('.') || 'raiz';
          let message = 'Campo inválido';
          
          // Traduz todos os códigos de erro do Zod para português brasileiro
          switch (err.code) {
            case 'invalid_type':
              // Se o campo não foi fornecido (undefined), é obrigatório
              if (err.received === 'undefined' || err.message?.includes('received undefined')) {
                message = `O campo "${field}" é obrigatório`;
              } else if (err.message?.includes('Invalid input')) {
                // Traduz mensagens "Invalid input: expected X, received Y"
                const expected = err.expected === 'string' ? 'um texto' : err.expected === 'number' ? 'um número' : err.expected === 'boolean' ? 'um valor booleano' : 'válido';
                message = `O campo "${field}" é obrigatório e deve ser ${expected}`;
              } else {
                // Usa mensagem customizada se disponível, senão cria mensagem genérica
                message = err.message || `O campo "${field}" é obrigatório e deve ser ${err.expected === 'string' ? 'um texto' : err.expected === 'number' ? 'um número' : err.expected === 'boolean' ? 'um valor booleano' : 'válido'}`;
              }
              break;
            case 'invalid_enum_value':
            case 'invalid_value':
              // Para enum, pega as opções válidas
              const enumOptions = err.options || err.values || [];
              if (enumOptions.length > 0) {
                message = `O campo "${field}" deve ser "${enumOptions.join('" ou "')}"`;
              } else {
                // Usa mensagem customizada se disponível
                message = err.message || `O campo "${field}" possui um valor inválido`;
              }
              break;
            case 'too_small':
              // Usa mensagem customizada se disponível
              if (err.message && !err.message.includes('Expected') && !err.message.includes('Received')) {
                message = err.message;
              } else if (err.type === 'string') {
                message = `O campo "${field}" deve ter no mínimo ${err.minimum} caracteres`;
              } else if (err.type === 'number') {
                message = `O campo "${field}" deve ser maior ou igual a ${err.minimum}`;
              } else if (err.type === 'array') {
                message = `O campo "${field}" deve ter no mínimo ${err.minimum} item(s)`;
              }
              break;
            case 'too_big':
              if (err.type === 'string') {
                message = `O campo "${field}" deve ter no máximo ${err.maximum} caracteres`;
              } else if (err.type === 'number') {
                message = `O campo "${field}" deve ser menor ou igual a ${err.maximum}`;
              } else if (err.type === 'array') {
                message = `O campo "${field}" deve ter no máximo ${err.maximum} item(s)`;
              }
              break;
            case 'invalid_string':
              if (err.validation === 'email') {
                message = `O campo "${field}" deve ser um e-mail válido`;
              } else if (err.validation === 'url') {
                message = `O campo "${field}" deve ser uma URL válida`;
              } else {
                message = `O campo "${field}" deve ser um texto válido`;
              }
              break;
            case 'invalid_date':
              message = `O campo "${field}" deve ser uma data válida`;
              break;
            case 'custom':
              message = err.message || `O campo "${field}" é inválido`;
              break;
            default:
              // Usa mensagem customizada do schema se disponível e já estiver em português
              if (err.message && !err.message.match(/Expected|Received|Invalid option/i)) {
                message = err.message;
              } else if (err.message) {
                // Tenta traduzir mensagens comuns do Zod
                message = err.message
                  .replace(/Required/i, 'Obrigatório')
                  .replace(/Expected/i, 'Esperado')
                  .replace(/Received/i, 'Recebido')
                  .replace(/Invalid/i, 'Inválido')
                  .replace(/Invalid option: expected one of/i, 'Opção inválida: deve ser uma das opções');
              } else {
                message = `O campo "${field}" é inválido`;
              }
          }
          
          return {
            campo: field,
            mensagem: message
          };
        });
        
        return res.status(400).json({
          error: 'Erro de validação',
          mensagem: 'Alguns campos estão inválidos. Verifique os detalhes abaixo.',
          erros: errors
        });
      }
      
      // Se for ZodError mas não tiver errors válidos, tenta usar error.issues ou error.format()
      console.error('ZodError sem errors array válido:', error);
      return res.status(400).json({
        error: 'Erro de validação',
        mensagem: 'Os dados fornecidos são inválidos',
        erros: [{
          campo: 'raiz',
          mensagem: error.message || 'Dados inválidos. Verifique os campos obrigatórios.'
        }]
      });
    }

    // Se não for um erro do Zod válido, passa para o próximo middleware de erro
    next(error);
  }
};