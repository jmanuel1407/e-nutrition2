// Definicion del modelo de Quiz con validación

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    'Fruta',
    { nombre: {
        type: DataTypes.STRING,
        validate: { notEmpty: {msg: "-> Falta Fruta"}}
      },
      image: {
        type: DataTypes.STRING
      }
    }
  );
}