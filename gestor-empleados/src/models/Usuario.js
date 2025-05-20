const { Sequelize } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Usuario', {
      usuario: {
        type: Sequelize.STRING,
        unique: true
      },
      contraseña: Sequelize.STRING
    }, { timestamps: false });
  };