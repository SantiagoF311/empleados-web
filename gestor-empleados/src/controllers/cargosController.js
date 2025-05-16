import { Cargo } from '../models';

const cargoController = {
  async obtenerTodos(req, res) {
    try {
      const cargos = await Cargo.findAll({
        include: [{
          association: 'Empleados',
          attributes: ['id']
        }],
        order: [['nombre', 'ASC']]
      });
      
      const cargosConConteo = cargos.map(cargo => ({
        ...cargo.get({ plain: true }),
        cantidadEmpleados: cargo.Empleados.length
      }));
      
      res.json(cargosConConteo);
    } catch (error) {
      console.error('Error al obtener cargos:', error);
      res.status(500).json({ 
        error: 'Error al obtener cargos',
        details: process.env.NODE_ENV === 'development' ? error.message : null
      });
    }
  },

  async crearCargo(req, res) {
    try {
      const { nombre, descripcion, icono, color } = req.body;
      
      if (!nombre?.trim() || !icono || !color) {
        return res.status(400).json({ 
          error: 'Campos obligatorios faltantes',
          required: { nombre: 'string', icono: 'string', color: 'string' },
          received: { nombre, icono, color }
        });
      }
      
      const nuevoCargo = await Cargo.create({
        nombre: nombre.trim(),
        descripcion: descripcion?.trim() || '',
        icono,
        color
      });
      
      res.status(201).json(nuevoCargo);
    } catch (error) {
      console.error('Error al crear cargo:', error);
      res.status(400).json({ 
        error: 'Error al crear cargo',
        details: error.errors?.map(e => e.message) || error.message 
      });
    }
  },

  async obtenerPorId(req, res) {
    try {
      const cargo = await Cargo.findByPk(req.params.id, {
        include: ['Empleados']
      });
      
      if (!cargo) {
        return res.status(404).json({ 
          error: 'Cargo no encontrado',
          id: req.params.id
        });
      }
      
      res.json({
        ...cargo.get({ plain: true }),
        cantidadEmpleados: cargo.Empleados.length
      });
    } catch (error) {
      console.error('Error al obtener cargo:', error);
      res.status(500).json({ 
        error: 'Error al obtener cargo',
        details: process.env.NODE_ENV === 'development' ? error.message : null
      });
    }
  },

  async actualizarCargo(req, res) {
    try {
      const [affectedCount] = await Cargo.update(req.body, {
        where: { id: req.params.id }
      });
      
      if (affectedCount === 0) {
        return res.status(404).json({ 
          error: 'Cargo no encontrado',
          id: req.params.id
        });
      }
      
      const cargoActualizado = await Cargo.findByPk(req.params.id);
      res.json(cargoActualizado);
    } catch (error) {
      console.error('Error al actualizar cargo:', error);
      res.status(400).json({ 
        error: 'Error al actualizar cargo',
        details: error.errors?.map(e => e.message) || error.message 
      });
    }
  },

  async eliminarCargo(req, res) {
    try {
      const deletedCount = await Cargo.destroy({
        where: { id: req.params.id }
      });
      
      if (deletedCount === 0) {
        return res.status(404).json({ 
          error: 'Cargo no encontrado',
          id: req.params.id
        });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error('Error al eliminar cargo:', error);
      res.status(500).json({ 
        error: 'Error al eliminar cargo',
        details: process.env.NODE_ENV === 'development' ? error.message : null,
        warning: 'Todos los empleados asociados fueron eliminados automáticamente'
      });
    }
  }
};

export default cargoController;