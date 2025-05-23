const { Empleado, Cargo, Calificacion } = require('../models');
const { Parser } = require('json2csv');

module.exports = {
  async crear(req, res) {
    try {
      const { CargoId, ...empleadoData } = req.body;

      // Verificar si el cargo existe
      if (CargoId) {
        const cargo = await Cargo.findByPk(CargoId);
        if (!cargo) {
          return res.status(400).json({ error: 'El cargo especificado no existe' });
        }
      }

      const empleado = await Empleado.create({
        ...empleadoData,
        CargoId: CargoId || null
      });

      // Obtener el empleado con relaciones
      const empleadoConCargo = await Empleado.findByPk(empleado.id, {
        include: {
          model: Cargo,
          as: 'Cargo'
        }
      });

      res.status(201).json(empleadoConCargo);
    } catch (error) {
      res.status(400).json({ 
        error: 'Error al crear empleado',
        detalles: error.message 
      });
    }
  },

  async listar(req, res) {
    try {
      const empleados = await Empleado.findAll({
        include: {
          model: Cargo,
          as: 'Cargo',
          attributes: ['id', 'nombre', 'color']
        }
      });
      res.json(empleados);
    } catch (error) {
      res.status(500).json({ 
        error: 'Error al listar empleados',
        detalles: error.message 
      });
    }
  },

  async obtener(req, res) {
    try {
      const empleado = await Empleado.findByPk(req.params.id, {
        include: {
          model: Cargo,
          as: 'Cargo'
        }
      });
      
      if (!empleado) {
        return res.status(404).json({ error: 'Empleado no encontrado' });
      }
      
      res.json(empleado);
    } catch (error) {
      res.status(500).json({ 
        error: 'Error al obtener empleado',
        detalles: error.message 
      });
    }
  },

  async actualizar(req, res) {
    try {
      const { CargoId, ...datos } = req.body;

      // Verificar si el cargo existe
      if (CargoId) {
        const cargo = await Cargo.findByPk(CargoId);
        if (!cargo) {
          return res.status(400).json({ error: 'El cargo especificado no existe' });
        }
      }

      const [updated] = await Empleado.update(
        { ...datos, CargoId },
        { where: { id: req.params.id } }
      );

      if (!updated) {
        return res.status(404).json({ error: 'Empleado no encontrado' });
      }

      const empleadoActualizado = await Empleado.findByPk(req.params.id, {
        include: {
          model: Cargo,
          as: 'Cargo'
        }
      });

      res.json(empleadoActualizado);
    } catch (error) {
      res.status(400).json({ 
        error: 'Error al actualizar empleado',
        detalles: error.message 
      });
    }
  },

  async eliminar(req, res) {
    try {
      const empleado = await Empleado.findByPk(req.params.id);
      
      if (!empleado) {
        return res.status(404).json({ error: 'Empleado no encontrado' });
      }

      await empleado.destroy();
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ 
        error: 'Error al eliminar empleado',
        detalles: error.message 
      });
    }
  },

  async calificar(req, res) {
    try {
      const empleado = await Empleado.findByPk(req.params.id);
      if (!empleado) {
        return res.status(404).json({ error: 'Empleado no encontrado' });
      }
      const { calificaciones } = req.body;
      const nuevaCalificacion = await Calificacion.create({
        EmpleadoId: empleado.id,
        criterios: calificaciones,
        fecha: new Date()
      });
      res.status(201).json(nuevaCalificacion);
    } catch (error) {
      res.status(400).json({ error: 'Error al guardar calificación', detalles: error.message });
    }
  },

  async exportarTodasCalificacionesCSV(req, res) {
    try {
      // Definir los criterios con texto completo y orden
      const criteriosCalificacion = [
        {
          id: 'innovacion_motivacion',
          nombre: 'Innovar estrategias permanentes para mantener la motivación, alegría y amor por la institución o modalidad de atención integral'
        },
        {
          id: 'evaluacion_proactividad',
          nombre: 'Evaluar el estado de pro actividad y motivación de las niñas y niños con la institución, los ambientes educativos, el talento humano y la rutina pedagógica'
        },
        {
          id: 'valoracion_cualitativa',
          nombre: 'Apoyar el diseño y aplicación de valoración cualitativa del desarrollo de los niños y niñas'
        },
        {
          id: 'deteccion_temprana',
          nombre: 'Detección temprana de atrasos en el desarrollo y diseño de estrategias de apoyo para trabajar con los niños y sus familias'
        },
        {
          id: 'proyectos_pedagogicos',
          nombre: 'Apoyar el diseño e implementación de proyectos pedagógicos que respondan a una educación inclusiva y pertinente'
        },
        {
          id: 'planeacion_seguimiento',
          nombre: 'Participar en las estrategias de planeación, seguimiento y evaluación del proceso'
        },
        {
          id: 'sistematizacion',
          nombre: 'Organizar y sistematizar información sobre las acciones adelantadas con los niños, niñas familias y comunidades'
        },
        {
          id: 'mejora_practicas',
          nombre: 'Liderar procesos de trabajo para el mejoramiento permanente de las prácticas pedagógicas con los niños'
        },
        {
          id: 'remision_casos',
          nombre: 'Remisión a las autoridades competentes los casos de maltrato infantil'
        }
      ];
      const empleados = await Empleado.findAll({
        include: [
          { model: Cargo, as: 'Cargo' },
          { model: Calificacion, as: 'Calificaciones' }
        ]
      });
      const rows = [];
      empleados.forEach(empleado => {
        if (empleado.Calificaciones && empleado.Calificaciones.length > 0) {
          // Tomar la última calificación
          const calificacion = empleado.Calificaciones[empleado.Calificaciones.length - 1];
          const criterios = calificacion.criterios;
          criteriosCalificacion.forEach((criterio, idx) => {
            rows.push({
              cedula: idx === 0 ? empleado.cedula || '' : '',
              nombre: idx === 0 ? empleado.nombre : '',
              cargo: idx === 0 ? (empleado.Cargo ? empleado.Cargo.nombre : '') : '',
              criterio: criterio.nombre,
              cumple: criterios[criterio.id] || ''
            });
          });
          // Agregar línea en blanco después de cada empleado
          rows.push({
            cedula: '',
            nombre: '',
            cargo: '',
            criterio: '',
            cumple: ''
          });
        }
      });
      if (rows.length === 0) {
        return res.status(404).json({ error: 'No hay calificaciones para exportar' });
      }
      const fields = [
        { label: 'Cedula', value: 'cedula' },
        { label: 'Nombre', value: 'nombre' },
        { label: 'Cargo', value: 'cargo' },
        { label: 'Criterio', value: 'criterio' },
        { label: 'cumple(si/no/nA)', value: 'cumple' }
      ];
      const parser = new Parser({ fields });
      const csv = parser.parse(rows);
      res.header('Content-Type', 'text/csv');
      res.attachment('calificaciones_empleados.csv');
      return res.send(csv);
    } catch (error) {
      res.status(500).json({ error: 'Error al exportar CSV', detalles: error.message });
    }
  },

  async listarCalificaciones(req, res) {
    try {
      const empleado = await Empleado.findByPk(req.params.id, {
        include: [
          { model: Calificacion, as: 'Calificaciones' }
        ]
      });
      if (!empleado) {
        return res.status(404).json({ error: 'Empleado no encontrado' });
      }
      res.json(empleado.Calificaciones || []);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener calificaciones', detalles: error.message });
    }
  }
};