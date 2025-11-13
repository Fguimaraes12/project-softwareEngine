const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth.middleware');
const { permit } = require('../middlewares/rbac.middleware');
const { createRecebimento, listRecebimentos } = require('../controllers/recebimento.controller');

/**
 * @swagger
 * /api/recebimento:
 *   get:
 *     summary: Lista todos os recebimentos
 *   post:
 *     summary: Cria um novo recebimento de mercadorias
 */

router.get('/', authenticate, permit('admin', 'warehouse', 'auditor'), listRecebimentos);
router.post('/', authenticate, permit('admin', 'warehouse'), createRecebimento);

module.exports = router;
