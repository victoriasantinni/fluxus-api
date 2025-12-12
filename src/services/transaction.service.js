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
  return prisma.transaction.create({
    data: {
      ...data,
      userId,
    },
  });
};

export const update = async (id, data, userId) => {
    // First, check if the transaction exists and belongs to the user
    const existingTransaction = await prisma.transaction.findFirst({
        where: { id, userId }
    });

    if (!existingTransaction) {
        return null;
    }

  return prisma.transaction.update({
    where: { id },
    data,
  });
};

export const remove = async (id, userId) => {
    // First, check if the transaction exists and belongs to the user
    const existingTransaction = await prisma.transaction.findFirst({
        where: { id, userId }
    });

    if (!existingTransaction) {
        return null;
    }

  return prisma.transaction.delete({
    where: { id },
  });
};