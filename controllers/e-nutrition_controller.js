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