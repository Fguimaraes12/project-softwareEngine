const pool = require('../db');

// Criar fornecedor
exports.createFornecedor = async (req, res) => {
  try {
    const { nome, cnpj, telefone, email, endereco } = req.body;

    const result = await pool.query(
      `INSERT INTO fornecedores (nome, cnpj, telefone, email, endereco)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [nome, cnpj, telefone, email, endereco]
    );

    res.status(201).json({
      message: "Fornecedor criado com sucesso!",
      fornecedor: result.rows[0]
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Listar fornecedores
exports.getFornecedores = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM fornecedores ORDER BY id DESC`);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Buscar fornecedor por ID
exports.getFornecedorById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT * FROM fornecedores WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Fornecedor não encontrado" });
    }

    res.json(result.rows[0]);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Atualizar fornecedor
exports.updateFornecedor = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, cnpj, telefone, email, endereco } = req.body;

    const result = await pool.query(
      `UPDATE fornecedores SET 
        nome = $1,
        cnpj = $2,
        telefone = $3,
        email = $4,
        endereco = $5
       WHERE id = $6
       RETURNING *`,
      [nome, cnpj, telefone, email, endereco, id]
    );

    res.json({
      message: "Fornecedor atualizado com sucesso!",
      fornecedor: result.rows[0]
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Deletar fornecedor
exports.deleteFornecedor = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(`DELETE FROM fornecedores WHERE id = $1`, [id]);

    res.json({ message: "Fornecedor deletado com sucesso!" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
