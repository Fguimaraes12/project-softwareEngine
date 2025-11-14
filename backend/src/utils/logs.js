const pool = require("../db");

exports.registrarLog = async (usuario_id, acao) => {
  try {
    await pool.query(
      "INSERT INTO logs (usuario_id, acao) VALUES ($1, $2)",
      [usuario_id, acao]
    );
  } catch (error) {
    console.error("Erro ao registrar log:", error.message);
  }
};
