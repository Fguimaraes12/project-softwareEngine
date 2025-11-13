const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const authController = {
  async register(req, res) {
    try {
      const { name, email, password, role } = req.body;

      const existingUser = await User.findByEmail(email);
      if (existingUser) return res.status(400).json({ message: 'Usuário já existe' });

      const passwordHash = await bcrypt.hash(password, 10);
      const user = await User.create(name, email, passwordHash, role);

      res.status(201).json({ message: 'Usuário criado com sucesso', user });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao registrar usuário', error: error.message });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findByEmail(email);
      if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) return res.status(401).json({ message: 'Senha incorreta' });

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.json({ message: 'Login bem-sucedido', token });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao fazer login', error: error.message });
    }
  },
};

module.exports = authController;
