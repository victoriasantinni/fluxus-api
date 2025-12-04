import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
  try {
    console.log('Headers recebidos:', req.headers);
    
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      console.log(' Token ausente');
      return res.status(401).json({ 
        error: 'Token de autenticação ausente',
        message: 'Envie o token no header: Authorization: Bearer <seu_token>'
      });
    }
    
    if (!authHeader.startsWith('Bearer ')) {
      console.log(' Formato inválido:', authHeader);
      return res.status(401).json({ 
        error: 'Formato de token inválido',
        message: 'Use o formato: Bearer <seu_token>',
        received: authHeader
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      console.log(' Token vazio');
      return res.status(401).json({ 
        error: 'Token não fornecido' 
      });
    }
    
    console.log('Token recebido:', token.substring(0, 20) + '...');
    
    const secret = process.env.JWT_SECRET || 'chave_secreta_padrao_mude_no_env';
    console.log('Secret:', secret.substring(0, 10) + '...');
    
    const payload = jwt.verify(token, secret);
    console.log('Payload decodificado:', payload);
    
    if (!payload.userId) {
      console.log(' Payload sem userId:', payload);
      return res.status(401).json({ 
        error: 'Token inválido: userId não encontrado',
        payload: payload
      });
    }
    
    req.user = { 
      id: parseInt(payload.userId) 
    };
    
    console.log(' Usuário autenticado:', req.user);
    next();
  } catch (error) {
    console.error(' Erro de autenticação:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Token inválido',
        message: 'O token fornecido é inválido'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expirado',
        message: 'O token expirou, gere um novo'
      });
    }
    
    return res.status(401).json({ 
      error: 'Falha na autenticação',
      detail: error.message 
    });
  }
};