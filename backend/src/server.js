// src/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');  // <-- usa o pool importado do db.js

const authRoutes = require('./routes/auth.routes');
const produtosRoutes = require('./routes/produtos.routes');
const fornecedoresRoutes = require('./routes/fornecedores.routes');
const recebimentosRoutes = require('./routes/recebimentos.routes');
const movimentacoesRoutes = require('./routes/movimentacoes.routes')
const inventarioRoutes = require('./routes/inventario.routes')
const logsRoutes = require('./routes/logs.routes')
const dashboardRoutes = require('./routes/dashboard.routes')

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/produtos', produtosRoutes);
app.use('/api/fornecedores', fornecedoresRoutes);
app.use('/api/recebimentos', recebimentosRoutes);
app.use('/api/movimentacoes', movimentacoesRoutes)
app.use('/api/inventario', inventarioRoutes)
app.use('/api/logs', logsRoutes)
app.use('/api/dashboard', dashboardRoutes)


// Testar conexão com o banco
pool.connect()
  .then(() => console.log('✅ Banco de dados conectado com sucesso!'))
  .catch(err => console.error('❌ Erro ao conectar no banco:', err));

// Subir servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
