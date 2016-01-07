module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    'Control',
    { fecha: {
        type: DataTypes.STRING},
        peso: {
        type: DataTypes.STRING}
      }
  );
}