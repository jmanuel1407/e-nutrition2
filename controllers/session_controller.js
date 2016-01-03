// MW de autorización de accesos HTTP restringidos
exports.loginRequired = function(req,res,next){
	if(req.session.user){
		next();
	} else{
		res.redirect('/login');
	}
};


// Get /login
exports.new = function(req,res){
	var errors = req.session.errors ||{};
	req.session.errors = {};

	res.render('sesion/ingresar',{errors: errors});
};

//POST /login --Crear la sesion
exports.create = function(req,res){

	var login = req.body.login;
	var password = req.body.password;

	var userController = require('./user_controller');
	userController.autenticar(login,password,function(error,user){
		if (error){//si hay error retornamos a mensajes de error de sesion
			req.session.errors = [{"message":'Se ha producido un error'+error}];
			res.redirect('/login');
			return;
		}
		// Crear req.session.user y guardar campos id y username
		//La sesion se define por la existencia de: req.session user
		req.session.user = {id:user.id, username:user.username};

		res.redirect('/');// redireccion a path a login
	});
};

// DELETE /logout --Destruir sesion
exports.destroy = function(req,res){
	delete req.session.user;
	res.redirect('/'); //redirect a path anterior a login
};