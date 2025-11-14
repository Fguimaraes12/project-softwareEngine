const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const rbac = require("../middlewares/rbac.middleware");
const logsController = require("../controllers/logs.controller");

router.get("/", auth, rbac(["admin"]), logsController.getLogs);

module.exports = router;
