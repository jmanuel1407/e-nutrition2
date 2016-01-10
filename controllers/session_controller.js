var models = require('../models/models.js');
// MW de autorización de accesos HTTP restringidos
exports.loginRequired = function(req, res, next){
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

// Get /login   -- Formulario de login
exports.new = function(req, res) {
    var errors = req.session.errors || {};
    req.session.errors = {};

    res.render('sesion/ingresar', {errors: errors});
};

// POST /login   -- Crear la sesion si usuario se autentica
exports.create = function(req, res) {

    var login     = req.body.login;
    var password  = req.body.password;

    var userController = require('./user_controller');
    userController.autenticar(login, password, function(error, user) {

        if (error) {  // si hay error retornamos mensajes de error de sesión
            req.session.errors = [{"message": 'Se ha producido un error: '+error}];
            res.redirect("/login");        
            return;
        }

        // Crear req.session.user y guardar campos   id  y  username
        // La sesión se define por la existencia de:    req.session.user
        req.session.user = {id:user.id, username:user.username, image:user.image, peso:user.peso, isAdmin:user.isAdmin};

        res.redirect(req.session.redir.toString());// redirección a path anterior a login
    });
};

// DELETE /logout   -- Destruir sesion 
exports.destroy = function(req, res) {
    delete req.session.user;
    res.redirect(req.session.redir.toString()); // redirect a path anterior a login
};
exports.perfil = function(req, res){
    var options = {};
    console.log("usuario");
    console.log(req.user);
  if(req.user){
    options.where = {UserId: req.user.id}
  }
   console.log("option");
  console.log(options);
  models.Control.findAll().then(
    function(controles) {
         console.log("controles");
        console.log(controles);
      res.render('sesion/perfil', {controles: controles, errors: []});
    }
  ).catch(function(error){next(error)});

};

exports.notas = function(req, res){
    res.render('sesion/notas');
};
exports.foto = function(req, res){
    res.render('sesion/tomarFoto');
};