import { prisma } from '../lib/prisma.js';

export const getAllByUserId = async (userId, limit, offset) => {
  return prisma.transaction.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
  });
};

export const getById = async (id, userId) => {
  return prisma.transaction.findFirst({
    where: { id, userId },
  });
};

export const create = async (data, userId) => {
  const valor = parseFloat(data.valor); 
  
  return prisma.transaction.create({
    data: {
      ...data,
      userId,
      valor, 
    },
  });
};

export const getExtract = async (userId) => {
    const results = await prisma.transaction.groupBy({
        _sum: {
            valor: true, 
        },
        where: {
            userId: userId,
        },
        by: ['tipo'], 
    });

    let totalReceita = 0;
    let totalDespesa = 0;

    results.forEach(item => {
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

export const update = async (id, data, userId) => {
    const existingTransaction = await prisma.transaction.findFirst({
        where: { id }
    });

    if (!existingTransaction) {
        return { status: 404 };
    }
    
    if (existingTransaction.userId !== userId) {
        return { status: 403 };
    }
    
    if (data.valor) {
        data.valor = parseFloat(data.valor);
    }

    const updatedTransaction = await prisma.transaction.update({
        where: { id },
        data,
    });

    return { status: 200, transaction: updatedTransaction };
};

export const remove = async (id, userId) => {
    const existingTransaction = await prisma.transaction.findFirst({
        where: { id }
    });

    if (!existingTransaction) {
        return { status: 404 };
    }

    if (existingTransaction.userId !== userId) {
        return { status: 403 };
    }

    await prisma.transaction.delete({
        where: { id },
    });

    return { status: 204 };
};