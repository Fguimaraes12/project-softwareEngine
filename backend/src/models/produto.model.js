const db = require('../db');

async function getAllProdutos() {
  return db.query('SELECT * FROM produtos ORDER BY id');
}

module.exports = { getAllProdutos };
