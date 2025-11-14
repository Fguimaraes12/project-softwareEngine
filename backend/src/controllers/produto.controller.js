const pool = require('../db');
const { registrarLog } = require("../utils/logs"); // <-- IMPORTANTE

// Criar produto
exports.createProduto = async (req, res) => {
  try {
    const { sku, nome, descricao, estoque, custo_medio } = req.body;

    const result = await pool.query(
      `INSERT INTO produtos (sku, nome, descricao, estoque, custo_medio)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [sku, nome, descricao, estoque ?? 0, custo_medio ?? 0]
    );

    // 🔥 Registrar log
    registrarLog(req.user.id, `Criou o produto ${nome}`);

    res.status(201).json({
      message: 'Produto criado com sucesso!',
      produto: result.rows[0]
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Listar produtos
exports.getProdutos = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM produtos ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Buscar por ID
exports.getProdutoById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM produtos WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    res.json(result.rows[0]);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Atualizar produto
exports.updateProduto = async (req, res) => {
  try {
    const { id } = req.params;
    const { sku, nome, descricao, estoque, custo_medio } = req.body;

    const result = await pool.query(
      `UPDATE produtos SET 
        sku = $1,
        nome = $2,
        descricao = $3,
        estoque = $4,
        custo_medio = $5
       WHERE id = $6
       RETURNING *`,
      [sku, nome, descricao, estoque, custo_medio, id]
    );

    // 🔥 Registrar log
    registrarLog(req.user.id, `Atualizou o produto ID ${id}`);

    res.json({
      message: "Produto atualizado com sucesso!",
      produto: result.rows[0]
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Deletar produto
exports.deleteProduto = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM produtos WHERE id = $1', [id]);

    // 🔥 Registrar log
    registrarLog(req.user.id, `Deletou o produto ID ${id}`);

    res.json({ message: "Produto deletado com sucesso!" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
