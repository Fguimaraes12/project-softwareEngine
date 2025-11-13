const db = require('../db');

async function createRecebimento(req, res) {
  try {
    const { fornecedor_id, items } = req.body;
    const rec = await db.query(
      'INSERT INTO recebimentos (fornecedor_id, created_by) VALUES ($1, $2) RETURNING id, created_at',
      [fornecedor_id, req.user.id]
    );

    const recebimentoId = rec.rows[0].id;

    for (const it of items) {
      await db.query(
        `INSERT INTO recebimento_items (recebimento_id, produto_id, quantidade, lote, custo)
         VALUES ($1, $2, $3, $4, $5)`,
        [recebimentoId, it.produto_id, it.quantidade, it.lote || null, it.custo]
      );
    }

    res.status(201).json({ message: 'Recebimento criado com sucesso!', id: recebimentoId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar recebimento' });
  }
}

async function listRecebimentos(req, res) {
  try {
    const result = await db.query('SELECT * FROM recebimentos ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar recebimentos' });
  }
}

module.exports = { createRecebimento, listRecebimentos };
