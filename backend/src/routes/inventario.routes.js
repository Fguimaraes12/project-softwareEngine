const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const rbac = require('../middlewares/rbac.middleware');
const controller = require('../controllers/inventario.controller');

// Registrar inventário (apenas admin)
router.post('/', auth, rbac(['admin']), controller.registrarInventario);

// Listar inventários
router.get('/', auth, controller.listarInventarios);

module.exports = router;
