// Script para criar o banco de dados sge-fortaleza777
require('dotenv').config();
const { Pool } = require('pg');

// Conecta ao banco de dados padrão 'postgres' para criar o novo banco
const adminPool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: 'postgres', // Conecta ao banco padrão para criar o novo
});

const dbName = 'sge-fortaleza777';

async function createDatabase() {
  try {
    console.log('🔄 Conectando ao PostgreSQL...');
    
    // Verifica se o banco já existe
    const checkDb = await adminPool.query(
      "SELECT datname FROM pg_database WHERE datname = $1",
      [dbName]
    );

    if (checkDb.rows.length > 0) {
      console.log(`⚠️  O banco de dados "${dbName}" já existe!`);
      await adminPool.end();
      return;
    }

    // Cria o banco de dados
    await adminPool.query(`CREATE DATABASE "${dbName}";`);
    console.log(`✅ Banco de dados "${dbName}" criado com sucesso!`);
    
    await adminPool.end();
    
    // Agora conecta ao novo banco e executa o schema
    console.log('🔄 Aplicando schema...');
    const dbPool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: dbName,
    });

    const fs = require('fs');
    const path = require('path');
    const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
    
    if (fs.existsSync(schemaPath)) {
      const schema = fs.readFileSync(schemaPath, 'utf8');
      await dbPool.query(schema);
      console.log('✅ Schema aplicado com sucesso!');
    } else {
      console.log('⚠️  Arquivo schema.sql não encontrado. Pulando aplicação do schema.');
    }

    await dbPool.end();
    console.log('✨ Processo concluído!');
    
  } catch (error) {
    console.error('❌ Erro ao criar banco de dados:', error.message);
    await adminPool.end();
    process.exit(1);
  }
}

createDatabase();

