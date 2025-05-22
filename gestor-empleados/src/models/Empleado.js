const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Empleado', {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    area: {
      type: DataTypes.STRING,
      allowNull: true
    },
    turno: {
      type: DataTypes.STRING,
      allowNull: true
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'activo'  // o 'pendiente' o 'inactivo'
    },
    icono: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });
};
