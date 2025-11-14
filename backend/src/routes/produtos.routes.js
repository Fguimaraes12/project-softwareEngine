const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const rbac = require('../middlewares/rbac.middleware');
const produtoController = require('../controllers/produto.controller');

// Listar produtos (qualquer usuário autenticado)
router.get('/', auth, produtoController.getProdutos);

// Buscar 1 produto
router.get('/:id', auth, produtoController.getProdutoById);

// Criar produto (somente admin)
router.post('/', auth, rbac(['admin']), produtoController.createProduto);

// Atualizar produto (somente admin)
router.put('/:id', auth, rbac(['admin']), produtoController.updateProduto);

// Deletar produto (somente admin)
router.delete('/:id', auth, rbac(['admin']), produtoController.deleteProduto);

module.exports = router;
