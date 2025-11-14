const pool = require('../db');

// Criar um recebimento
exports.createRecebimento = async (req, res) => {
  try {
    const { fornecedor_id } = req.body;
    const userId = req.user.id;

    const result = await pool.query(
      `INSERT INTO recebimentos (fornecedor_id, created_by)
       VALUES ($1, $2)
       RETURNING *`,
      [fornecedor_id, userId]
    );

    res.status(201).json({
      message: "Recebimento criado com sucesso!",
      recebimento: result.rows[0]
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Adicionar item ao recebimento
exports.addItem = async (req, res) => {
  const client = await pool.connect();

  try {
    const recebimento_id = req.params.id;
    const { produto_id, quantidade, lote, custo } = req.body;

    await client.query('BEGIN');

    // 1. Insere item de recebimento
    const item = await client.query(
      `INSERT INTO recebimento_items 
       (recebimento_id, produto_id, quantidade, lote, custo)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [recebimento_id, produto_id, quantidade, lote, custo]
    );

    // 2. Atualiza o estoque do produto
    await client.query(
      `UPDATE produtos 
       SET estoque = estoque + $1,
           custo_medio = $2
       WHERE id = $3`,
      [quantidade, custo, produto_id]
    );

    await client.query('COMMIT');

    res.status(201).json({
      message: "Item adicionado e estoque atualizado!",
      item: item.rows[0]
    });

  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};

// Listar todos os recebimentos
exports.getRecebimentos = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.*, f.nome AS fornecedor, u.name AS criado_por
      FROM recebimentos r
      JOIN fornecedores f ON r.fornecedor_id = f.id
      JOIN users u ON r.created_by = u.id
      ORDER BY r.id DESC
    `);

    res.json(result.rows);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
