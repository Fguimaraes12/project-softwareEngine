const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const User = {
  async create(name, email, passwordHash, role = 'user') {
    const result = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, passwordHash, role]
    );
    return result.rows[0];
  },

  async findByEmail(email) {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  },
};

module.exports = User;
