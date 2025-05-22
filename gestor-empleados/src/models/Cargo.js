const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Cargo', {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'green' // por si no se especifica
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });
};
