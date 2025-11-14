const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const controller = require('../controllers/dashboard.controller');

router.get('/resumo', auth, controller.getResumoGeral);
router.get('/ultimas-movimentacoes', auth, controller.getUltimasMovimentacoes);
router.get('/baixo-estoque', auth, controller.getBaixoEstoque);

module.exports = router;
