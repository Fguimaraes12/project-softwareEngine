// test-db.js
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.query('SELECT NOW()')
  .then(res => {
    console.log('✅ Conectado com sucesso! Data/hora do servidor:', res.rows[0].now);
    pool.end();
  })
  .catch(err => {
    console.error('❌ Erro ao conectar com o banco:', err.message);
    pool.end();
  });
