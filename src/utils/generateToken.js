// src/utils/generateToken.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Carrega variáveis de ambiente
dotenv.config();

// Pega o userId do argumento (padrão: 1)
const userId = process.argv[2] ? parseInt(process.argv[2]) : 1;
const secret = process.env.JWT_SECRET;

// Verifica se o JWT_SECRET está configurado
if (!secret) {
  console.error(' ERRO: JWT_SECRET não configurado no arquivo .env');
  console.log('\n Adicione esta linha ao seu arquivo .env:');
  console.log('JWT_SECRET="sua_chave_secreta_aqui"');
  console.log('\n Exemplo rápido:');
  console.log('echo JWT_SECRET="minha_senha_super_secreta" >> .env');
  process.exit(1);
}

// Gera o token
const token = jwt.sign(
  { 
    userId,
    iat: Math.floor(Date.now() / 1000), // issued at
    exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // expira em 7 dias
  },
  secret,
  { 
    algorithm: 'HS256'
  }
);

// Mostra o token
console.log('\n' + '='.repeat(50));
console.log(' TOKEN GERADO COM SUCESSO');
console.log('='.repeat(50));
console.log(` User ID: ${userId}`);
console.log(` Validade: 7 dias`);
console.log(` Secret: ${secret.substring(0, 10)}... (primeiros 10 chars)`);
console.log('='.repeat(50));
console.log('\n TOKEN JWT:\n');
console.log(token);
console.log('\n EXEMPLOS DE USO:\n');

console.log('1. Listar transações:');
console.log(`curl -H "Authorization: Bearer ${token}" http://localhost:3000/transacoes\n`);

console.log('2. Criar transação:');
console.log(`curl -X POST http://localhost:3000/transacoes \\`);
console.log(`  -H "Authorization: Bearer ${token}" \\`);
console.log(`  -H "Content-Type: application/json" \\`);
console.log(`  -d '{"descricao":"Salário","valor":5000,"tipo":"receita","categoria":"Trabalho"}'`);

console.log('\n' + '='.repeat(50));
console.log(' Dica: Salve este token para usar no Postman/Insomnia');
console.log('='.repeat(50));