const { Usuario } = require('../models');
const jwt = require('jsonwebtoken');
const config = require('../config');
const bcrypt = require('bcryptjs');

const authController = {

  async login(req, res) {
    try {
      const { nombreUsuario, contraseña } = req.body;
      
      // Validación de campos
      if (!nombreUsuario?.trim() || !contraseña?.trim()) {
        return res.status(400).json({ 
          error: 'Campos requeridos faltantes',
          details: ['nombreUsuario', 'contraseña']
        });
      }

      // Buscar usuario incluyendo contraseña (aunque esté excluida en el modelo)
      const usuario = await Usuario.scope('withPassword').findOne({ 
        where: { nombreUsuario } 
      });

      if (!usuario || !bcrypt.compareSync(contraseña, usuario.contraseña)) {
        return res.status(401).json({ 
          error: 'Credenciales inválidas',
          details: 'Verifique su nombre de usuario y contraseña'
        });
      }

      // Generar token
      const token = jwt.sign(
        { 
          id: usuario.id,
          nombreUsuario: usuario.nombreUsuario,
          rol: usuario.rol 
        },
        config.JWT_SECRET,
        { expiresIn: '8h' }
      );

      // Excluir contraseña en la respuesta
      const usuarioResponse = usuario.get({ plain: true });
      delete usuarioResponse.contraseña;

      res.json({
        success: true,
        token,
        usuario: usuarioResponse
      });

    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({ 
        error: 'Error en el servidor',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  async verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1]; // Extraer token de "Bearer <token>"
    
    if (!token) {
      return res.status(403).json({ 
        error: 'Acceso no autorizado',
        details: 'Token de autenticación no proporcionado'
      });
    }
    
    try {
      const decoded = jwt.verify(token, config.JWT_SECRET);
      
      // Verificar si el usuario aún existe en la base de datos
      const usuario = await Usuario.findByPk(decoded.id);
      if (!usuario) {
        return res.status(401).json({ 
          error: 'Token inválido',
          details: 'Usuario no existe'
        });
      }

      req.usuario = decoded;
      next();
    } catch (error) {
      console.error('Error en verificación de token:', error);
      
      const message = error.name === 'TokenExpiredError' 
        ? 'Token expirado' 
        : 'Token inválido';
      
      return res.status(401).json({ 
        error: 'Autenticación fallida',
        details: message
      });
    }
  },

  // Middleware para verificar roles
  checkRole(roles = []) {
    return (req, res, next) => {
      if (!req.usuario) {
        return res.status(403).json({ error: 'Acceso no autorizado' });
      }
      
      if (!roles.includes(req.usuario.rol)) {
        return res.status(403).json({ 
          error: 'Permisos insuficientes',
          requiredRoles: roles,
          currentRole: req.usuario.rol
        });
      }
      
      next();
    };
  }
};

module.exports = authController;