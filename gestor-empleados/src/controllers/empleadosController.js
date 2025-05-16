const { Empleado, Cargo } = require('../models');

const empleadoController = {
  async obtenerTodos(req, res) {
    try {
      const empleados = await Empleado.findAll({
        include: {
          model: Cargo,
          attributes: ['id', 'nombre', 'color']
        },
        order: [['nombre', 'ASC']],
        attributes: { exclude: ['createdAt', 'updatedAt'] }
      });
      
      res.json(empleados);
    } catch (error) {
      console.error('Error al obtener empleados:', error);
      res.status(500).json({ 
        error: 'Error al obtener la lista de empleados',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  async crearEmpleado(req, res) {
    try {
      const { nombre, descripcion, area, turno, estado, cargoId } = req.body;
      
      // Validación mejorada
      if (!nombre?.trim() || !cargoId) {
        return res.status(400).json({
          error: 'Datos incompletos',
          required: {
            nombre: 'string (obligatorio)',
            cargoId: 'number (obligatorio)'
          },
          optional: {
            descripcion: 'string',
            area: 'string',
            turno: ['Mañana', 'Tarde', 'Noche'],
            estado: ['active', 'inactive']
          }
        });
      }

      // Verificar existencia del cargo
      const cargoExiste = await Cargo.findByPk(cargoId);
      if (!cargoExiste) {
        return res.status(404).json({
          error: 'Cargo no encontrado',
          cargoId
        });
      }

      const nuevoEmpleado = await Empleado.create({
        nombre: nombre.trim(),
        descripcion: descripcion?.trim() || '',
        area: area?.trim() || cargoExiste.nombre,
        turno: turno || 'Mañana',
        estado: estado || 'active',
        cargoId
      });

      res.status(201).json({
        ...nuevoEmpleado.get({ plain: true }),
        cargo: cargoExiste
      });
      
    } catch (error) {
      console.error('Error al crear empleado:', error);
      res.status(400).json({
        error: 'Error al crear empleado',
        details: error.errors?.map(e => e.message) || error.message
      });
    }
  },

  async obtenerPorId(req, res) {
    try {
      const empleado = await Empleado.findByPk(req.params.id, {
        include: {
          model: Cargo,
          attributes: ['id', 'nombre', 'color']
        },
        attributes: { exclude: ['createdAt', 'updatedAt'] }
      });
      
      if (!empleado) {
        return res.status(404).json({
          error: 'Empleado no encontrado',
          id: req.params.id
        });
      }
      
      res.json(empleado);
    } catch (error) {
      console.error('Error al obtener empleado:', error);
      res.status(500).json({
        error: 'Error al obtener empleado',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  async actualizarEmpleado(req, res) {
    try {
      const empleado = await Empleado.findByPk(req.params.id);
      
      if (!empleado) {
        return res.status(404).json({
          error: 'Empleado no encontrado',
          id: req.params.id
        });
      }
      
      // Validar cargo si se está actualizando
      if (req.body.cargoId) {
        const cargo = await Cargo.findByPk(req.body.cargoId);
        if (!cargo) {
          return res.status(400).json({
            error: 'Cargo no válido',
            cargoId: req.body.cargoId
          });
        }
      }
      
      await empleado.update(req.body);
      
      // Obtener datos actualizados con información del cargo
      const empleadoActualizado = await Empleado.findByPk(req.params.id, {
        include: {
          model: Cargo,
          attributes: ['id', 'nombre', 'color']
        }
      });
      
      res.json(empleadoActualizado);
    } catch (error) {
      console.error('Error al actualizar empleado:', error);
      res.status(400).json({
        error: 'Error al actualizar empleado',
        details: error.errors?.map(e => e.message) || error.message
      });
    }
  },

  async eliminarEmpleado(req, res) {
    try {
      const resultado = await Empleado.destroy({
        where: { id: req.params.id }
      });
      
      if (resultado === 0) {
        return res.status(404).json({
          error: 'Empleado no encontrado',
          id: req.params.id
        });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error('Error al eliminar empleado:', error);
      res.status(500).json({
        error: 'Error al eliminar empleado',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  async obtenerPorCargo(req, res) {
    try {
      // Verificar primero que el cargo existe
      const cargo = await Cargo.findByPk(req.params.cargoId);
      if (!cargo) {
        return res.status(404).json({
          error: 'Cargo no encontrado',
          cargoId: req.params.cargoId
        });
      }
      
      const empleados = await Empleado.findAll({
        where: { cargoId: req.params.cargoId },
        include: {
          model: Cargo,
          attributes: ['id', 'nombre', 'color']
        },
        order: [['nombre', 'ASC']],
        attributes: { exclude: ['createdAt', 'updatedAt'] }
      });
      
      res.json({
        cargo,
        empleados,
        count: empleados.length
      });
    } catch (error) {
      console.error('Error al obtener empleados por cargo:', error);
      res.status(500).json({
        error: 'Error al obtener empleados',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
};

module.exports = empleadoController;