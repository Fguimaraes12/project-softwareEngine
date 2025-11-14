-- ============================================
-- SCHEMA DO SISTEMA DE ESTOQUE (SGE FORTAL)
-- Execute este arquivo dentro do banco projetc-sge-fortal
-- ============================================

-- Tabela de usuários
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150),
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(200) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT now()
);

-- Tabela de produtos
CREATE TABLE produtos (
  id SERIAL PRIMARY KEY,
  sku VARCHAR(80) UNIQUE,
  nome VARCHAR(200) NOT NULL,
  descricao TEXT,
  estoque INT DEFAULT 0,
  custo_medio NUMERIC(12,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);

-- Tabela de fornecedores
CREATE TABLE fornecedores (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(200) NOT NULL,
  cnpj VARCHAR(20),
  telefone VARCHAR(20),
  email VARCHAR(150),
  endereco TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Tabela de recebimentos
CREATE TABLE recebimentos (
  id SERIAL PRIMARY KEY,
  fornecedor_id INT REFERENCES fornecedores(id) ON DELETE SET NULL ON UPDATE CASCADE,
  created_by INT REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
  created_at TIMESTAMP DEFAULT now()
);

-- Itens do recebimento
CREATE TABLE recebimento_items (
  id SERIAL PRIMARY KEY,
  recebimento_id INT REFERENCES recebimentos(id) ON DELETE CASCADE ON UPDATE CASCADE,
  produto_id INT REFERENCES produtos(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  quantidade INT NOT NULL,
  lote VARCHAR(80),
  custo NUMERIC(12,2),
  created_at TIMESTAMP DEFAULT now()
);

-- Movimentações de estoque
CREATE TABLE movimentacoes (
  id SERIAL PRIMARY KEY,
  produto_id INT REFERENCES produtos(id) ON DELETE CASCADE ON UPDATE CASCADE,
  tipo VARCHAR(50),
  quantidade INT,
  observacao TEXT,
  created_by INT REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
  created_at TIMESTAMP DEFAULT now()
);

-- Inventário
CREATE TABLE inventarios (
  id SERIAL PRIMARY KEY,
  produto_id INT REFERENCES produtos(id) ON DELETE CASCADE ON UPDATE CASCADE,
  quantidade_contada INT,
  data_inventario TIMESTAMP DEFAULT now(),
  criado_por INT REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Logs do sistema
CREATE TABLE logs (
  id SERIAL PRIMARY KEY,
  usuario_id INT REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
  acao TEXT,
  data TIMESTAMP DEFAULT now()
);
