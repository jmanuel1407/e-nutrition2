// Definicion del modelo de Quiz con validación

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    'Cereal',
    { nombre: {
        type: DataTypes.STRING,
        validate: { notEmpty: {msg: "-> Falta Cereal"}}
      },
      image: {
        type: DataTypes.STRING
      }
    }
  );
}