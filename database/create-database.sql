-- ============================================
-- CRIAR BANCO DE DADOS DO SISTEMA DE ESTOQUE
-- Execute este arquivo conectado ao banco "postgres"
-- ============================================

CREATE DATABASE "projetc-sge-fortal"
  WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'Portuguese_Brazil.1252'
    LC_CTYPE = 'Portuguese_Brazil.1252'
    TEMPLATE = template0;
