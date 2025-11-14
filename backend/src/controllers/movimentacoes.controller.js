const pool = require('../db');

// Criar movimentação (entrada ou saída)
exports.registrarMovimentacao = async (req, res) => {
  const client = await pool.connect();

  try {
    const { produto_id, quantidade, tipo, observacao } = req.body;
    const usuario_id = req.user.id;  // usuário logado

    if (!['entrada', 'saida'].includes(tipo)) {
      return res.status(400).json({ error: "Tipo inválido. Use 'entrada' ou 'saida'." });
    }

    await client.query('BEGIN');

    // Atualiza estoque
    const ajusteEstoque = tipo === 'entrada' ? quantidade : -quantidade;

    await client.query(
      `UPDATE produtos
       SET estoque = estoque + $1
       WHERE id = $2`,
      [ajusteEstoque, produto_id]
    );

    // Registra movimentação (AQUI USAMOS created_by)
    const result = await client.query(
      `INSERT INTO movimentacoes (produto_id, tipo, quantidade, observacao, created_by)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [produto_id, tipo, quantidade, observacao, usuario_id]
    );

    await client.query('COMMIT');

    res.status(201).json({
      message: "Movimentação registrada com sucesso!",
      movimentacao: result.rows[0]
    });

  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};

// Listar movimentações
exports.getMovimentacoes = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        m.*, 
        p.nome AS produto,
        u.name AS usuario
      FROM movimentacoes m
      JOIN produtos p ON m.produto_id = p.id
      JOIN users u ON m.created_by = u.id
      ORDER BY m.id DESC
    `);

    res.json(result.rows);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
