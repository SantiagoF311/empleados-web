const { Empleado, Cargo } = require('../models');

module.exports = {
  // CREATE
  async crear(req, res) {
    try {
      const empleado = await Empleado.create(req.body);
      res.status(201).json(empleado);
    } catch (error) {
      res.status(400).json({ error: 'Error al crear empleado' });
    }
  },

  // READ ALL
  async listar(req, res) {
    try {
      const empleados = await Empleado.findAll({
        include: {
          model: Cargo,
          attributes: ['id', 'nombre', 'color']
        }
      });
      res.json(empleados);
    } catch (error) {
      res.status(500).json({ error: 'Error al listar empleados' });
    }
  },

  // READ ONE
  async obtener(req, res) {
    try {
      const empleado = await Empleado.findByPk(req.params.id, {
        include: Cargo
      });
      empleado ? res.json(empleado) : res.status(404).json({ error: 'Empleado no encontrado' });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener empleado' });
    }
  },

  // UPDATE
  async actualizar(req, res) {
    try {
      const [updated] = await Empleado.update(req.body, {
        where: { id: req.params.id }
      });
      updated ? res.json({ mensaje: 'Empleado actualizado' }) : res.status(404).json({ error: 'Empleado no encontrado' });
    } catch (error) {
      res.status(400).json({ error: 'Error al actualizar' });
    }
  },

  // DELETE
  async eliminar(req, res) {
    try {
      const deleted = await Empleado.destroy({
        where: { id: req.params.id }
      });
      deleted ? res.status(204).end() : res.status(404).json({ error: 'Empleado no encontrado' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar' });
    }
  }
};