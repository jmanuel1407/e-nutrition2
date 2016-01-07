// Definicion del modelo de Quiz con validación

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    'Receta',
    { nombre: {
        type: DataTypes.STRING,
        validate: { notEmpty: {msg: "-> Falta nombre"}}
      },
      intro:{
        type: DataTypes.STRING,
        validate: { notEmpty: {msg: "-> Falta intro"}}
      },

      ingredientes: {
        type: DataTypes.STRING,
        validate: { notEmpty: {msg: "-> Falta ingredientes"}}
      },
      preparacion:{
        type: DataTypes.STRING,
        validate: { notEmpty: {msg: "-> Falta preparación"}}
      },
      image: {
        type: DataTypes.STRING
      }
    }
  );
}