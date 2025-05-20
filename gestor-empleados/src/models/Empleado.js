const { Sequelize } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Empleado', {
    nombre: Sequelize.STRING,
    area: Sequelize.STRING
  });
};