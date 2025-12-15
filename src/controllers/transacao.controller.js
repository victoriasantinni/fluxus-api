import * as transacaoService from "../services/transacao.service.js";

const getUserId = (req) => {
  if (!req.user || !req.user.userId) {
    throw new Error("Usuário não autenticado");
  }

  return parseInt(req.user.userId);
};

export const listTransactions = async (req, res, next) => {
  try {
    const userId = getUserId(req);

    const limit = Math.min(parseInt(req.query.limit) || 100, 100);
    const offset = parseInt(req.query.offset) || 0;

    const transactions = await transacaoService.getAllByUserId(
      userId,
      limit,
      offset
    );

    res.json(transactions);
  } catch (error) {
    console.error("Erro ao listar transações:", error);
    next(error);
  }
};

export const getExtractController = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const extract = await transacaoService.getExtract(userId);
    return res.status(200).json(extract);
  } catch (error) {
    console.error("Erro ao gerar extrato:", error);
    next(error);
  }
};

export const getTransaction = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const transaction = await transacaoService.getById(id, userId);

    if (!transaction) {
      return res.status(404).json({ error: "Transação não encontrada" });
    }

    res.json(transaction);
  } catch (error) {
    console.error("Erro ao buscar transação:", error);
    next(error);
  }
};

export const createTransaction = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const { descricao, valor, tipo, categoria } = req.body;

    // Zod já validou e fez trim, então podemos confiar que estão corretos
    const transaction = await transacaoService.create(
      {
        descricao,
        valor,
        tipo,
        categoria: categoria || null,
      },
      userId
    );

    res.status(201).json(transaction);
  } catch (error) {
    console.error("Erro ao criar transação:", error);
    next(error);
  }
};

export const updateTransaction = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ 
        error: "Erro de validação",
        mensagem: "ID inválido"
      });
    }

    const { descricao, valor, tipo, categoria } = req.body;

    // Zod já validou os dados, então podemos confiar que estão corretos
    const updateData = {};
    
    if (descricao !== undefined) {
      updateData.descricao = descricao.trim();
    }
    if (valor !== undefined) {
      updateData.valor = valor;
    }
    if (tipo !== undefined) {
      updateData.tipo = tipo;
    }
    if (categoria !== undefined) {
      updateData.categoria = categoria?.trim() || null;
    }

    const result = await transacaoService.update(id, updateData, userId);

    if (result.status === 404) {
      return res.status(404).json({ 
        error: "Transação não encontrada",
        mensagem: "A transação solicitada não foi encontrada"
      });
    }
    if (result.status === 403) {
      return res
        .status(403)
        .json({
          error: "Ação não permitida",
          mensagem: "Você não tem permissão para atualizar esta transação"
        });
    }

    res.json(result.transaction);
  } catch (error) {
    console.error("Erro ao atualizar transação:", error);
    next(error);
  }
};

export const deleteTransaction = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const result = await transacaoService.remove(id, userId);

    if (result.status === 404) {
      return res.status(404).json({ error: "Transação não encontrada." });
    }
    if (result.status === 403) {
      return res
        .status(403)
        .json({ error: "Você não tem permissão para deletar esta transação." });
    }

    res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar transação:", error);
    next(error);
  }
};
