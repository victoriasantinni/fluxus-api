import * as transactionService from '../services/transaction.service.js';

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

    const transactions = await transactionService.getAllByUserId(userId, limit, offset);

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

    const transaction = await transactionService.getById(id, userId);

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

    const transaction = await transactionService.create({
      descricao: descricao.trim(),
      valor,
      tipo,
      categoria: categoria ? categoria.trim() : null,
    }, userId);

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

    const { descricao, valor, tipo, categoria } = req.body;

    const updateData = {
        ...(descricao && { descricao: descricao.trim() }),
        ...(valor && { valor }),
        ...(tipo && { tipo }),
        ...(categoria && { categoria: categoria.trim() }),
      };

    const transaction = await transactionService.update(id, updateData, userId);

    if (!transaction) {
        return res.status(404).json({ error: 'Transação não encontrada' });
    }

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

    const transaction = await transactionService.remove(id, userId);

    if (!transaction) {
        return res.status(404).json({ error: 'Transação não encontrada' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar transação:', error);
    next(error);
  }
};