// MW de autorización de accesos HTTP restringidos
exports.loginRequired = function(req, res, next){
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

//Formulario de login
exports.new = function(req, res) {
    var errors = req.session.errors || {};
    req.session.errors = {};
    res.render('sesion/ingresar', {errors: errors});
};

//Crear la sesion si usuario se autentica
exports.create = function(req, res) {
    var login     = req.body.login;
    var password  = req.body.password;

    var userController = require('./user_controller');
    userController.autenticar(login, password, function(error, user) {
        if (error) {  
            res.redirect("/login");        
            return;
        }
        req.session.user = {id:user.id, username:user.username, isAdmin:user.isAdmin};
        res.redirect("/");
    });
};

//logout
exports.destroy = function(req, res) {
    delete req.session.user;
    res.redirect("/"); 
};