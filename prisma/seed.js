// prisma/seed.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...\n');

  // Limpa os dados existentes (ordem importa por causa das foreign keys)
  await prisma.transacao.deleteMany();
  await prisma.usuario.deleteMany();

  console.log('🗑️  Dados antigos removidos\n');

  // Cria usuários de exemplo
  const senhaHash = await bcrypt.hash('senha123', 10);

  const usuario1 = await prisma.usuario.create({
    data: {
      email: 'joao@email.com',
      nome: 'João Silva',
      senha: senhaHash,
    },
  });

  const usuario2 = await prisma.usuario.create({
    data: {
      email: 'maria@email.com',
      nome: 'Maria Santos',
      senha: senhaHash,
    },
  });

  const usuario3 = await prisma.usuario.create({
    data: {
      email: 'admin@fluxus.com',
      nome: 'Administrador',
      senha: await bcrypt.hash('admin123', 10),
    },
  });

  console.log('👤 Usuários criados:');
  console.log(`   - ${usuario1.nome} (${usuario1.email})`);
  console.log(`   - ${usuario2.nome} (${usuario2.email})`);
  console.log(`   - ${usuario3.nome} (${usuario3.email})\n`);

  // Cria transações para o usuário 1 (João)
  const transacoesJoao = await prisma.transacao.createMany({
    data: [
      {
        descricao: 'Salário mensal',
        valor: 5000.00,
        tipo: 'receita',
        categoria: 'Salário',
        usuarioId: usuario1.id,
      },
      {
        descricao: 'Freelance desenvolvimento web',
        valor: 1500.00,
        tipo: 'receita',
        categoria: 'Freelance',
        usuarioId: usuario1.id,
      },
      {
        descricao: 'Aluguel apartamento',
        valor: 1200.00,
        tipo: 'despesa',
        categoria: 'Moradia',
        usuarioId: usuario1.id,
      },
      {
        descricao: 'Conta de luz',
        valor: 150.00,
        tipo: 'despesa',
        categoria: 'Contas',
        usuarioId: usuario1.id,
      },
      {
        descricao: 'Supermercado semanal',
        valor: 450.00,
        tipo: 'despesa',
        categoria: 'Alimentação',
        usuarioId: usuario1.id,
      },
      {
        descricao: 'Academia mensal',
        valor: 89.90,
        tipo: 'despesa',
        categoria: 'Saúde',
        usuarioId: usuario1.id,
      },
      {
        descricao: 'Internet fibra',
        valor: 99.90,
        tipo: 'despesa',
        categoria: 'Contas',
        usuarioId: usuario1.id,
      },
    ],
  });

  // Cria transações para o usuário 2 (Maria)
  const transacoesMaria = await prisma.transacao.createMany({
    data: [
      {
        descricao: 'Salário CLT',
        valor: 4200.00,
        tipo: 'receita',
        categoria: 'Salário',
        usuarioId: usuario2.id,
      },
      {
        descricao: 'Venda de produtos artesanais',
        valor: 800.00,
        tipo: 'receita',
        categoria: 'Vendas',
        usuarioId: usuario2.id,
      },
      {
        descricao: 'Aluguel casa',
        valor: 900.00,
        tipo: 'despesa',
        categoria: 'Moradia',
        usuarioId: usuario2.id,
      },
      {
        descricao: 'Plano de saúde',
        valor: 350.00,
        tipo: 'despesa',
        categoria: 'Saúde',
        usuarioId: usuario2.id,
      },
      {
        descricao: 'Transporte público',
        valor: 200.00,
        tipo: 'despesa',
        categoria: 'Transporte',
        usuarioId: usuario2.id,
      },
      {
        descricao: 'Curso online',
        valor: 49.90,
        tipo: 'despesa',
        categoria: 'Educação',
        usuarioId: usuario2.id,
      },
    ],
  });

  // Cria transações para o admin
  const transacoesAdmin = await prisma.transacao.createMany({
    data: [
      {
        descricao: 'Bônus trimestral',
        valor: 3000.00,
        tipo: 'receita',
        categoria: 'Bônus',
        usuarioId: usuario3.id,
      },
      {
        descricao: 'Investimento em ações',
        valor: 1000.00,
        tipo: 'despesa',
        categoria: 'Investimentos',
        usuarioId: usuario3.id,
      },
    ],
  });

  console.log('💰 Transações criadas:');
  console.log(`   - João: ${transacoesJoao.count} transações`);
  console.log(`   - Maria: ${transacoesMaria.count} transações`);
  console.log(`   - Admin: ${transacoesAdmin.count} transações\n`);

  // Mostra resumo
  const totalUsuarios = await prisma.usuario.count();
  const totalTransacoes = await prisma.transacao.count();

  console.log('=' .repeat(50));
  console.log('✅ Seed concluído com sucesso!');
  console.log('=' .repeat(50));
  console.log(`📊 Total de usuários: ${totalUsuarios}`);
  console.log(`📊 Total de transações: ${totalTransacoes}`);
  console.log('=' .repeat(50));
  console.log('\n🔐 Credenciais de teste:');
  console.log('   Email: joao@email.com    | Senha: senha123');
  console.log('   Email: maria@email.com   | Senha: senha123');
  console.log('   Email: admin@fluxus.com  | Senha: admin123');
  console.log('=' .repeat(50));
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Erro no seed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });

