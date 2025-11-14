const pool = require('../db');

// Registrar inventário
exports.registrarInventario = async (req, res) => {
  const client = await pool.connect();

  try {
    const { produto_id, quantidade_contada } = req.body;
    const userId = req.user.id;

    if (!produto_id || quantidade_contada === undefined) {
      return res.status(400).json({ error: "produto_id e quantidade_contada são obrigatórios" });
    }

    await client.query("BEGIN");

    // 1. Registrar inventário
    const inventario = await client.query(
      `INSERT INTO inventarios (produto_id, quantidade_contada, criado_por)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [produto_id, quantidade_contada, userId]
    );

    // 2. Atualizar estoque do produto
    await client.query(
      `UPDATE produtos
       SET estoque = $1
       WHERE id = $2`,
      [quantidade_contada, produto_id]
    );

    await client.query("COMMIT");

    res.status(201).json({
      message: "Inventário registrado e estoque atualizado!",
      inventario: inventario.rows[0]
    });

  } catch (error) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};


// Listar inventários
exports.listarInventarios = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT i.*, p.nome AS produto, u.name AS contado_por
      FROM inventarios i
      JOIN produtos p ON p.id = i.produto_id
      JOIN users u ON u.id = i.criado_por
      ORDER BY i.id DESC
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
