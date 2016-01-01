var models = require('../models/models.js');

// Autoload :id
exports.load = function(req, res, next, userId) {
  models.User.find({
            where: {
                id: Number(userId)
            }
        }).then(function(user) {
      if (user) {
        req.user = user;
        next();
      } else{next(new Error('No existe userId=' + userId))}
    }
  ).catch(function(error){next(error)});
};

exports.new = function(req, res) {
    var user = models.User.build( // crea objeto user 
        {username: "", password: ""}
    );
    res.render('user/new', {user: user, errors: []});
};

/*exports.registro = function(req, res){
  var user=models.User.build({
    usuario:"Usuario",nip:"Nip",correo:"Correo",
    edad:"Edad",sexo:"Sexo",peso:"Peso"});
  
  res.render('sesion/registro',{user:user});
};*/

exports.registro = function(req, res){
  var user=models.User.build({
    username:"",password:"",correo:"",
    edad:"",sexo:"",peso:""});
  res.render('sesion/registro',{user:user});
};


//POST Recibe los datos para guardar al nuevo usuario en la DB
exports.create = function(req, res) {
    var user = models.User.build( req.body.user );
    user.save({fields: ["username", "password",
      "correo","edad","sexo","peso"]}).then(function(){
        req.session.user = {id:user.id, username:user.username};
        res.redirect('/');
      })
};

// Comprueba si el usuario esta registrado en users
exports.autenticar = function(login, password, callback) {
	models.User.find({
        where: {
            username: login
        }
    }).then(function(user) {
    	if (user) {
    		if(user.validarPassword(password)){
            	callback(null, user);
        	}
        	else { callback(new Error('Password erróneo.')); } 	
      	} else { callback(new Error('No existe user=' + login))}
    }).catch(function(error){callback(error)});
};


// DELETE /user/
exports.destroy = function(req, res) {
  req.user.destroy().then( function() {
    delete req.session.user;
    res.redirect('/');
  }).catch(function(error){next(error)});
};