const pool = require("../db");

exports.getLogs = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        l.*, 
        u.name AS usuario
      FROM logs l
      LEFT JOIN users u ON u.id = l.usuario_id
      ORDER BY l.id DESC
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar logs", error: error.message });
  }
};
