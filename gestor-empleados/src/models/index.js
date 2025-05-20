const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../db/database.sqlite'),
  logging: false
});

// Importar modelos
const Usuario = require('./Cargo')(sequelize);
const Cargo = require('./Cargo')(sequelize);
const Empleado = require('./Empleado')(sequelize);

// Definir relaciones
Cargo.hasMany(Empleado);
Empleado.belongsTo(Cargo);

// Función para inicializar la base de datos
async function initializeDatabase() {
  try {
    // Sincronizar modelos (force: true borrará y recreará las tablas)
    await sequelize.sync({ force: true });
    
    // Crear usuario admin
    await Usuario.create({ usuario: 'admin', contraseña: 'admin123' });

    // Crear cargos de ejemplo
    const cargo1 = await Cargo.create({ nombre: 'Gerente', color: 'azul' });
    const cargo2 = await Cargo.create({ nombre: 'Desarrollador', color: 'verde' });

    // Crear empleados de ejemplo
    await Empleado.create({ nombre: 'Ana Pérez', area: 'Dirección', CargoId: cargo1.id });
    await Empleado.create({ nombre: 'Carlos López', area: 'TI', CargoId: cargo2.id });

    console.log('✅ Base de datos inicializada con datos de ejemplo');
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error);
  }
}

// Llamar a la función de inicialización
initializeDatabase();

module.exports = {
  sequelize,
  Usuario,
  Cargo,
  Empleado
};