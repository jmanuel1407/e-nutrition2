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
           /* req.session.errors = [{"message":'Se ha producido un error'+error}];
            res.redirect("/login");  */
            message
            error.status       
            return;
        }
        req.session.user = {username:user.username};
        res.redirect(req.session.redir.toString());
    });
};

//logout
exports.destroy = function(req, res) {
    delete req.session.user;
    res.redirect("/"); 
};