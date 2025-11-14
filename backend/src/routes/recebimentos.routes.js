const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const rbac = require('../middlewares/rbac.middleware');
const recebimentoController = require('../controllers/recebimento.controller');

// Criar recebimento (apenas logado)
router.post('/', auth, recebimentoController.createRecebimento);

// Adicionar item ao recebimento (apenas admin)
router.post('/:id/item', auth, rbac(['admin']), recebimentoController.addItem);

// Listar recebimentos
router.get('/', auth, recebimentoController.getRecebimentos);

module.exports = router;
