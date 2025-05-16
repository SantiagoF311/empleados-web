const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
const bcrypt = require('bcryptjs');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../db/database.sqlite'),
  logging: console.log,
  define: {
    timestamps: true,
    paranoid: true,
    underscored: true
  }
});

// Modelo Cargo con colores actualizados
const Cargo = sequelize.define('Cargo', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El nombre del cargo no puede estar vacío' }
    }
  },
  descripcion: DataTypes.TEXT,
  icono: {
    type: DataTypes.STRING,
    allowNull: false
  },
  color: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['green', 'red', 'blue', 'yellow', 'purple', 'orange', 'pink']]
    }
  }
}, {
  tableName: 'cargos'
});

// Modelo Empleado con validaciones mejoradas
const Empleado = sequelize.define('Empleado', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El nombre no puede estar vacío' },
      len: {
        args: [2, 50],
        msg: 'El nombre debe tener entre 2 y 50 caracteres'
      }
    }
  },
  descripcion: DataTypes.TEXT,
  area: {
    type: DataTypes.STRING,
    allowNull: false
  },
  turno: {
    type: DataTypes.STRING,
    defaultValue: 'Mañana',
    validate: {
      isIn: [['Mañana', 'Tarde', 'Noche', 'Completo']]
    }
  },
  estado: {
    type: DataTypes.STRING,
    defaultValue: 'active',
    validate: {
      isIn: [['active', 'inactive', 'vacation', 'suspended']]
    }
  }
}, {
  tableName: 'empleados',
  indexes: [
    { fields: ['nombre'] },
    { fields: ['cargoId'] }
  ]
});

// Modelo Usuario (sin cambios)
const Usuario = sequelize.define('Usuario', {
  // ... (mantener igual que en tu código actual)
});

// Relaciones mejoradas
Cargo.hasMany(Empleado, {
  foreignKey: {
    name: 'cargoId',
    allowNull: false
  },
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  hooks: true
});

Empleado.belongsTo(Cargo, {
  foreignKey: 'cargoId',
  as: 'cargo'
});

// Método para validar contraseña
Usuario.prototype.validarContraseña = function(contraseña) {
  return bcrypt.compareSync(contraseña, this.contraseña);
};

// Datos iniciales completos
async function inicializarDB() {
  try {
    await sequelize.sync({ force: true }); // Cambiar a false después del primer uso

    const cargosData = [
      {
        nombre: 'Gestor de alimentos',
        descripcion: 'Responsable de la gestión y preparación de alimentos',
        icono: '🍳',
        color: 'green',
        Empleados: [
          { nombre: 'Adriana', area: 'Cocina', turno: 'Mañana' },
          { nombre: 'Laudis', area: 'Cocina', turno: 'Mañana' },
          { nombre: 'Yolima', area: 'Cocina', turno: 'Tarde' },
          { nombre: 'Helena', area: 'Cocina', turno: 'Tarde' }
        ]
      },
      // ... (agregar todos los otros cargos y empleados que mencionaste)
      {
        nombre: 'Enfermera',
        descripcion: 'Servicios de enfermería',
        icono: '💉',
        color: 'pink',
        Empleados: [
          { nombre: 'Adriana', area: 'Salud', turno: 'Completo' }
        ]
      }
    ];

    // Crear cargos con empleados
    for (const cargoData of cargosData) {
      await Cargo.create(cargoData, {
        include: [Empleado]
      });
    }

    // Usuario admin
    await Usuario.create({
      nombreUsuario: 'admin',
      contraseña: 'admin123',
      rol: 'admin'
    });

    console.log('✅ Base de datos inicializada con éxito');
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error);
  }
}

// Inicializar
inicializarDB();

module.exports = {
  sequelize,
  Cargo,
  Empleado,
  Usuario
};