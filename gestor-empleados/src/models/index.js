const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../db/database.sqlite'),
  logging: false
});

// Importar modelos
const Usuario = require('../models/Usuario')(sequelize);
const Cargo = require('../models/Cargo')(sequelize);
const Empleado = require('../models/Empleado')(sequelize);

// Definir relaciones
Cargo.hasMany(Empleado);
Empleado.belongsTo(Cargo);

async function initializeDatabase() {
  try {
    await sequelize.sync({ force: true });

    // Usuario admin
    await Usuario.create({ usuario: 'admin', contrasena: 'admin123' });

    // Crea cargos con colores válidos según tu CSS
    const cargo1 = await Cargo.create({
      nombre: 'Gerente',
      color: 'blue', // no "azul", es inglés para coincidir con CSS
      descripcion: 'Encargado general de la empresa'
    });
    const cargo2 = await Cargo.create({
      nombre: 'Desarrollador',
      color: 'green', // no "verde"
      descripcion: 'Desarrollo de software'
    });

    // Empleados asignados a cargos
    await Empleado.create({
      nombre: 'Ana Pérez',
      area: 'Dirección',
      turno: 'Mañana',
      estado: 'activo',
      icono: '👩‍💼',
      descripcion: 'Directora general',
      CargoId: cargo1.id
    });

    await Empleado.create({
      nombre: 'Carlos López',
      area: 'TI',
      turno: 'Tarde',
      estado: 'pendiente',
      icono: '💻',
      descripcion: 'Programador backend',
      CargoId: cargo2.id
    });

    console.log('✅ Base de datos inicializada con datos de ejemplo');
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error);
  }
}

initializeDatabase();

module.exports = {
  sequelize,
  Usuario,
  Cargo,
  Empleado
};
