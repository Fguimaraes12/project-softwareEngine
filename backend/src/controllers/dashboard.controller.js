const pool = require('../db');

// Estatísticas principais
exports.getResumoGeral = async (req, res) => {
  try {
    const totalProdutos = await pool.query("SELECT COUNT(*) FROM produtos");
    const totalFornecedores = await pool.query("SELECT COUNT(*) FROM fornecedores");
    const totalMovimentacoes = await pool.query("SELECT COUNT(*) FROM movimentacoes");

    const estoqueTotal = await pool.query(`
      SELECT COALESCE(SUM(estoque), 0) AS total
      FROM produtos
    `);

    res.json({
      produtos: totalProdutos.rows[0].count,
      fornecedores: totalFornecedores.rows[0].count,
      movimentacoes: totalMovimentacoes.rows[0].count,
      estoque_total: estoqueTotal.rows[0].total
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Últimas movimentações
exports.getUltimasMovimentacoes = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT m.*, p.nome AS produto, u.name AS usuario
      FROM movimentacoes m
      JOIN produtos p ON p.id = m.produto_id
      JOIN users u ON u.id = m.created_by
      ORDER BY m.id DESC
      LIMIT 10
    `);

    res.json(result.rows);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Produtos com baixo estoque
exports.getBaixoEstoque = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM produtos
      WHERE estoque < 5
      ORDER BY estoque ASC
    `);

    res.json(result.rows);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
