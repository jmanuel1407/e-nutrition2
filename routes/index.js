var express = require('express');
var multer  = require('multer');
var router = express.Router();

var frutasController = require('../controllers/frutas_controller');
var recetasController = require('../controllers/recetas_controller');

var sessionController = require('../controllers/session_controller');
var userController = require('../controllers/user_controller');

// Página de entrada (home page)
router.get('/', function(req, res) {
  res.render('index', { title: 'E-Nutrition', errors: []});
});

// Autoload de comandos con ids
router.param('frutaId', frutasController.load);  // autoload :frutaId
router.param('recetaId', recetasController.load);  // autoload :frutaId
router.param('userId', userController.load);  // autoload :userId

// Definición de rutas de sesion
router.get('/login',  sessionController.new);     // formulario login
router.post('/login', sessionController.create);  // crear sesión
router.get('/logout', sessionController.destroy); // destruir sesión

// Definición de rutas de cuenta
router.get('/user/new',  userController.new);     // formulario sign un
router.post('/user',  userController.create);     // registrar usuario
router.get('/user/:userId(\\d+)/edit',  sessionController.loginRequired, userController.ownershipRequired, userController.edit);     // editar información de cuenta
router.put('/user/:userId(\\d+)',  sessionController.loginRequired, userController.ownershipRequired, userController.update);     // actualizar información de cuenta
router.delete('/user/:userId(\\d+)',  sessionController.loginRequired, userController.ownershipRequired, userController.destroy);     // borrar cuenta

// Definición de rutas de /quizes
router.get('/frutas',                      frutasController.index);
router.get('/frutas/new', 				   frutasController.new);
router.get('/frutas/:frutaId(\\d+)/edit',   sessionController.loginRequired, frutasController.ownershipRequired, frutasController.edit);
router.put('/frutas/:frutaId(\\d+)',        sessionController.loginRequired, frutasController.ownershipRequired, multer({ dest: './public/media/'}), frutasController.update);
router.delete('/frutas/:frutaId(\\d+)',     sessionController.loginRequired, frutasController.ownershipRequired, frutasController.destroy);
router.post('/frutas/create',              sessionController.loginRequired, multer({ dest: './public/media/'}), frutasController.create);
router.get('/frutas/:ingrediente', recetasController.show);
router.get('/perfil', sessionController.perfil);
router.get('/perfil/foto', sessionController.foto);
router.get('/notas',sessionController.notas);

module.exports = router;