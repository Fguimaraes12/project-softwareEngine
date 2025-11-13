// Script para verificar e criar tabelas se necessário
require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function checkAndCreateTables() {
  try {
    console.log('🔄 Conectando ao banco de dados...');
    console.log('📊 Banco:', process.env.DATABASE_URL.split('/').pop());
    
    // Verifica se a tabela users existe
    const checkUsers = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);

    if (checkUsers.rows[0].exists) {
      console.log('✅ Tabela "users" já existe!');
      console.log('📋 Verificando outras tabelas...');
      
      // Lista todas as tabelas
      const tables = await pool.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name;
      `);
      
      console.log('\n📊 Tabelas existentes:');
      tables.rows.forEach(row => {
        console.log(`   - ${row.table_name}`);
      });
      
    } else {
      console.log('❌ Tabela "users" NÃO existe!');
      console.log('🔄 Criando todas as tabelas...\n');
      
      // Lê o arquivo schema.sql
      const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
      
      if (fs.existsSync(schemaPath)) {
        const schema = fs.readFileSync(schemaPath, 'utf8');
        // Remove comentários e executa cada comando
        const commands = schema
          .split(';')
          .map(cmd => cmd.trim())
          .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));
        
        for (const command of commands) {
          if (command.toLowerCase().includes('create table')) {
            try {
              await pool.query(command + ';');
              const tableName = command.match(/create table\s+(\w+)/i)?.[1];
              if (tableName) {
                console.log(`✅ Tabela "${tableName}" criada!`);
              }
            } catch (err) {
              console.error(`❌ Erro ao criar tabela:`, err.message);
            }
          }
        }
        
        console.log('\n✨ Processo concluído!');
      } else {
        console.error('❌ Arquivo schema.sql não encontrado!');
      }
    }
    
    await pool.end();
  } catch (error) {
    console.error('❌ Erro:', error.message);
    await pool.end();
    process.exit(1);
  }
}

checkAndCreateTables();

