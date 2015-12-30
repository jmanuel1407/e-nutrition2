// Definicion del modelo de User con validación y encriptación de passwords
var crypto = require('crypto');
var key = process.env.PASSWORD_ENCRYPTION_KEY;

module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define('User', {
        username:  DataTypes.STRING,
        password: {
            type: DataTypes.STRING,
            validate: { notEmpty: {msg: "-> Falta password"}},
            set: function (password) {
                var encripted = crypto.createHmac('sha1', key).update(password).digest('hex');
                // Evita passwords vacíos
                if (password === '') {
                    encripted = '';
                }
                this.setDataValue('password', encripted);
            }
        },

        correo: DataTypes.STRING,
        edad: DataTypes.STRING,
        sexo: DataTypes.STRING,
        peso: DataTypes.STRING,
        
        isAdmin: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            }    
        },
        
        {
            instanceMethods: {
                validarPassword: function (password) {
                    var encripted = crypto.createHmac('sha1', key).update(password).digest('hex');
                    return encripted === this.password;
                }
            }    
        }
    );

    return User;
}