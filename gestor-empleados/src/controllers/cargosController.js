const { Cargo, Empleado } = require('../models');

module.exports = {
  // CREATE
  async crear(req, res) {
    try {
      const cargo = await Cargo.create(req.body);
      res.status(201).json(cargo);
    } catch (error) {
      res.status(400).json({ error: 'Error al crear cargo' });
    }
  },

  // READ ALL
  async listar(req, res) {
    try {
      const cargos = await Cargo.findAll({
        include: {
          model: Empleado,
          attributes: ['id', 'nombre']
        }
      });
      res.json(cargos);
    } catch (error) {
      res.status(500).json({ error: 'Error al listar cargos' });
    }
  },

  // READ ONE
  async obtener(req, res) {
    try {
      const cargo = await Cargo.findByPk(req.params.id, {
        include: Empleado
      });
      cargo ? res.json(cargo) : res.status(404).json({ error: 'Cargo no encontrado' });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener cargo' });
    }
  },

  // UPDATE
  async actualizar(req, res) {
    try {
      const [updated] = await Cargo.update(req.body, {
        where: { id: req.params.id }
      });
      updated ? res.json({ mensaje: 'Cargo actualizado' }) : res.status(404).json({ error: 'Cargo no encontrado' });
    } catch (error) {
      res.status(400).json({ error: 'Error al actualizar' });
    }
  },

  // DELETE
  async eliminar(req, res) {
    try {
      const deleted = await Cargo.destroy({
        where: { id: req.params.id }
      });
      deleted ? res.status(204).end() : res.status(404).json({ error: 'Cargo no encontrado' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar' });
    }
  }
};