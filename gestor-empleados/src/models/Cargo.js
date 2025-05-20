const { Sequelize } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Cargo', {
    nombre: Sequelize.STRING,
    color: Sequelize.STRING
  });
};