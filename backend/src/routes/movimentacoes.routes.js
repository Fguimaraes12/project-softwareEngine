const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const movimentacaoController = require('../controllers/movimentacoes.controller');

// Registrar movimentação
router.post('/', auth, movimentacaoController.registrarMovimentacao);

// Listar movimentações
router.get('/', auth, movimentacaoController.getMovimentacoes);

module.exports = router;
