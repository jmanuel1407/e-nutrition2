var express = require('express');
var multer  = require('multer');
var router = express.Router();

var enutritionController = require('../controllers/e-nutrition_controller');
var sessionController = require('../controllers/session_controller');
var userController = require('../controllers/user_controller');

//router.param('userId', userController.load); 


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'E-nutrition' });
});

router.get('/login',sessionController.new);//form login
router.post('/login',sessionController.create);//crear seseión
router.get('/logout',sessionController.destroy);//destruir sesión

router.get('/menu/fruta',enutritionController.fruta);
router.get('/menu/verdura',enutritionController.verdura);
router.get('/menu/planta',enutritionController.planta);
router.get('/menu/cereal',enutritionController.cereal);
//router.get('/sesion/registro',userController.registro);
//router.post('/sesion/create',userController.create);
router.get('/perfil',enutritionController.perfil);
router.get('/notas',enutritionController.notas);


module.exports = router;

























