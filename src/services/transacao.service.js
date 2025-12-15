import { prisma } from '../lib/prisma.js';

export const getAllByUserId = async (usuarioId, limit, offset) => {
  return prisma.transacao.findMany({
    where: { usuarioId },
    orderBy: { criadoEm: 'desc' },
    take: limit,
    skip: offset,
  });
};

export const getById = async (id, usuarioId) => {
  return prisma.transacao.findFirst({
    where: { id, usuarioId },
  });
};

export const create = async (data, usuarioId) => {
  try {
    // Zod já validou os dados, então podemos confiar que estão corretos
    return await prisma.transacao.create({
      data: {
        ...data,
        usuarioId,
        valor: parseFloat(data.valor),
      },
    });
  } catch (error) {
    // Re-lança o erro para ser tratado pelo error middleware
    console.error('Erro no service create:', error);
    throw error;
  }
};

export const getExtract = async (usuarioId) => {
  const results = await prisma.transacao.groupBy({
    _sum: {
      valor: true,
    },
    where: {
      usuarioId: usuarioId,
    },
    by: ['tipo'],
  });

  let totalReceita = 0;
  let totalDespesa = 0;

  results.forEach((item) => {
    const total = item._sum.valor || 0;
    if (item.tipo === 'receita') {
      totalReceita = total;
    } else if (item.tipo === 'despesa') {
      totalDespesa = total;
    }
  });

  const saldoAtual = totalReceita - totalDespesa;

  return {
    totalReceita,
    totalDespesa,
    saldoAtual,
  };
};

export const update = async (id, data, usuarioId) => {
  const existingTransaction = await prisma.transacao.findFirst({
    where: { id },
  });

  if (!existingTransaction) {
    return { status: 404 };
  }

  if (existingTransaction.usuarioId !== usuarioId) {
    return { status: 403 };
  }

  // Zod já validou os dados, então podemos confiar que estão corretos
  if (data.valor) {
    data.valor = parseFloat(data.valor);
  }

  const updatedTransaction = await prisma.transacao.update({
    where: { id },
    data,
  });

  return { status: 200, transaction: updatedTransaction };
};

export const remove = async (id, usuarioId) => {
  const existingTransaction = await prisma.transacao.findFirst({
    where: { id },
  });

  if (!existingTransaction) {
    return { status: 404 };
  }

  if (existingTransaction.usuarioId !== usuarioId) {
    return { status: 403 };
  }

  await prisma.transacao.delete({
    where: { id },
  });

  return { status: 204 };
};