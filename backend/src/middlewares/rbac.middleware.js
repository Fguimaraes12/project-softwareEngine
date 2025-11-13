function permit(...allowedRoles) {
  return (req, res, next) => {
    const { user } = req;
    if (!user) return res.status(401).json({ error: 'Usuário não autenticado' });
    if (allowedRoles.includes(user.role)) return next();
    return res.status(403).json({ error: 'Acesso negado: permissão insuficiente' });
  };
}

module.exports = { permit };
