//var models = require ('../models/models.js');

exports.fruta = function(req, res){
	res.render('menu/fruta');
};

exports.verdura = function(req, res){
	res.render('menu/verdura');
};

exports.planta = function(req, res){
	res.render('menu/planta');
};

exports.cereal = function(req, res){
	res.render('menu/cereal');
};


exports.perfil = function(req, res){
	res.render('sesion/perfil');
};

exports.notas = function(req, res){
	res.render('sesion/notas');
};

//View Recetas
exports.showFrutas = function(req,res){
		res.render('menu/frutas/1');
};
exports.showVerduras = function(req,res){
		res.render('menu/verduras/1');
};
exports.showPlantas = function(req,res){
		res.render('menu/plantas/1');
};
exports.showCereales = function(req,res){
		res.render('menu/frutas/1');
};