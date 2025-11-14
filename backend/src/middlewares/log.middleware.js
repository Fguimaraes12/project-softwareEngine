const logsController = require('../controllers/logs.controller');

module.exports = (acao) => {
  return (req, res, next) => {
    const userId = req.user?.id;
    if (userId) {
      logsController.registrarLog(userId, acao);
    }
    next();
  };
};
