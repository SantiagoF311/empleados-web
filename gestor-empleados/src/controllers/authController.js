const { Usuario } = require('../models');

module.exports = {
  login: async (req, res) => {
    const { usuario, contraseña } = req.body;
    if (usuario === 'admin' && contraseña === 'admin123') {
      return res.json({ mensaje: 'Bienvenido admin' });
    }
    res.status(401).json({ error: 'Credenciales inválidas' });
  }
};