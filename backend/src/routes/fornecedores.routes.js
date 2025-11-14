const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const rbac = require('../middlewares/rbac.middleware');
const fornecedorController = require('../controllers/fornecedor.controller');

// Listar fornecedores
router.get('/', auth, fornecedorController.getFornecedores);

// Buscar por ID
router.get('/:id', auth, fornecedorController.getFornecedorById);

// Criar fornecedor (somente admin)
router.post('/', auth, rbac(['admin']), fornecedorController.createFornecedor);

// Atualizar fornecedor (somente admin)
router.put('/:id', auth, rbac(['admin']), fornecedorController.updateFornecedor);

// Deletar fornecedor (somente admin)
router.delete('/:id', auth, rbac(['admin']), fornecedorController.deleteFornecedor);

module.exports = router;
