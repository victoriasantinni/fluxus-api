import { prisma } from '../lib/prisma.js';

// Helper para pegar userId com segurança
const getUserId = (req) => {
  if (!req.user || !req.user.id) {
    throw new Error('Usuário não autenticado');
  }
  return parseInt(req.user.id);
};

export const listTransactions = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const limit = Math.min(parseInt(req.query.limit) || 100, 100);
    const offset = parseInt(req.query.offset) || 0;

    console.log(`Listando transações para usuário ${userId}`);

    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    });

    console.log(`Encontradas ${transactions.length} transações`);
    res.json(transactions);
  } catch (error) {
    console.error('Erro ao listar transações:', error);
    next(error);
  }
};

export const getTransaction = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    console.log(`Buscando transação ${id} para usuário ${userId}`);

    const transaction = await prisma.transaction.findFirst({
      where: { id, userId }
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }

    res.json(transaction);
  } catch (error) {
    console.error('Erro ao buscar transação:', error);
    next(error);
  }
};

export const createTransaction = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const { descricao, valor, tipo, categoria } = req.body;

    console.log('Dados recebidos:', req.body);
    console.log(`Criando transação para usuário ${userId}`);

    // Validação básica
    if (!descricao || !valor || !tipo) {
      return res.status(400).json({ 
        error: 'Descrição, valor e tipo são obrigatórios',
        received: { descricao, valor, tipo, categoria }
      });
    }

    if (tipo !== 'receita' && tipo !== 'despesa') {
      return res.status(400).json({ 
        error: 'Tipo deve ser "receita" ou "despesa"',
        received: tipo
      });
    }

    const valorNumber = parseFloat(valor);
    if (isNaN(valorNumber) || valorNumber <= 0) {
      return res.status(400).json({ 
        error: 'Valor deve ser um número positivo',
        received: valor
      });
    }

    const transaction = await prisma.transaction.create({
      data: {
        descricao: descricao.trim(),
        valor: valorNumber,
        tipo,
        categoria: categoria ? categoria.trim() : null,
        userId
      }
    });

    console.log(`Transação criada com ID ${transaction.id}`);
    res.status(201).json(transaction);
  } catch (error) {
    console.error('Erro ao criar transação:', error);
    next(error);
  }
};

export const updateTransaction = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    console.log(`Atualizando transação ${id} para usuário ${userId}`);

    // Verifica se transação existe e pertence ao usuário
    const existing = await prisma.transaction.findFirst({
      where: { id, userId }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }

    const { descricao, valor, tipo, categoria } = req.body;
    
    // Validação do tipo se fornecido
    if (tipo && tipo !== 'receita' && tipo !== 'despesa') {
      return res.status(400).json({ 
        error: 'Tipo deve ser "receita" ou "despesa"' 
      });
    }

    // Validação do valor se fornecido
    if (valor !== undefined) {
      const valorNumber = parseFloat(valor);
      if (isNaN(valorNumber) || valorNumber <= 0) {
        return res.status(400).json({ 
          error: 'Valor deve ser um número positivo' 
        });
      }
    }

    const updateData = {};
    
    if (descricao !== undefined) updateData.descricao = descricao.trim();
    if (valor !== undefined) updateData.valor = parseFloat(valor);
    if (tipo !== undefined) updateData.tipo = tipo;
    if (categoria !== undefined) {
      updateData.categoria = categoria ? categoria.trim() : null;
    }

    // Verifica se há algo para atualizar
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ 
        error: 'Nenhum campo fornecido para atualização' 
      });
    }

    const transaction = await prisma.transaction.update({
      where: { id },
      data: updateData
    });

    console.log(`Transação ${id} atualizada com sucesso`);
    res.json(transaction);
  } catch (error) {
    console.error('Erro ao atualizar transação:', error);
    next(error);
  }
};

export const deleteTransaction = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    console.log(`Deletando transação ${id} para usuário ${userId}`);

    // Verifica se transação existe e pertence ao usuário
    const existing = await prisma.transaction.findFirst({
      where: { id, userId }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }

    await prisma.transaction.delete({
      where: { id }
    });

    console.log(`Transação ${id} deletada com sucesso`);
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar transação:', error);
    next(error);
  }
};