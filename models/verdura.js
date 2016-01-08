// Definicion del modelo de Quiz con validación

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    'Verdura',
    { nombre: {
        type: DataTypes.STRING,
        validate: { notEmpty: {msg: "-> Falta Verdura"}}
      },
      image: {
        type: DataTypes.STRING
      }
    }
  );
}