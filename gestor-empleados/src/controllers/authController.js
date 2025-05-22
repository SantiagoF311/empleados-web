const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

const SECRET_KEY = 'laurenesbova';

module.exports = {
  login: async (req, res) => {
    console.log("Body recibido:", req.body);
    const { usuario, contrasena } = req.body;
    console.log('usuario:', usuario); // depuración
    console.log('contrasena:', contrasena); // depuración

    if (!usuario || !contrasena) {
      return res.status(400).json({ mensaje: 'Faltan credenciales' });
    }

    // Buscar el usuario en la base de datos
    const user = await Usuario.findOne({ where: { usuario, contrasena } });

    if (user) {
      // Generar token
      const token = jwt.sign({ usuario: user.usuario }, SECRET_KEY, { expiresIn: '1h' });

      return res.json({ mensaje: 'Autenticado correctamente', token });
    }

    res.status(401).json({ error: 'Credenciales inválidas' });
  }
};
