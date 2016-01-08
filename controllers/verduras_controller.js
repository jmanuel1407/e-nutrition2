var models = require('../models/models.js');

// MW que permite acciones solamente si el quiz objeto pertenece al usuario logeado o si es cuenta admin
exports.ownershipRequired = function(req, res, next){
    var logUser = req.session.user.id;
    var isAdmin = req.session.user.isAdmin;

    if (isAdmin ) {
        next();
    } else {
        res.redirect('/');
    }
};

// Autoload :id
exports.load = function(req, res, next, VerduraId) {
  models.Verdura.find({
            include: [{
                model: models.Receta
            }]
        }).then(function(verdura) {
      if (verdura) {
        req.verdura = verdura;
        next();
      } else{next(new Error('No existe verduraId=' + verduraId))}
    }
  ).catch(function(error){next(error)});
};

// GET /quizes
// GET /users/:userId/quizes
exports.index = function(req, res) {  
  var options = {};
  models.Verdura.findAll(options).then(
    function(verduras) {
      res.render('menu/verduras/index.ejs', {verduras: verduras, errors: []});
    }
  ).catch(function(error){next(error)});
};


// GET /quizes/:id/answer
exports.answer = function(req, res) {
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta) {
    resultado = 'Correcto';
  }
  res.render(
    'quizes/answer', 
    { quiz: req.quiz, 
      respuesta: resultado, 
      errors: []
    }
  );
};

// GET /quizes/new
exports.new = function(req, res) {
  var verdura = models.Verdura.build( // crea objeto quiz 
    {nombre: "Nombre"}
  );

  res.render('menu/verduras/new', {verdura: verdura, errors: []});
};

// POST /quizes/create
exports.create = function(req, res) {
  if(req.files.image){
    req.body.verdura.image = req.files.image.name;
  }
  var verdura = models.Verdura.build( req.body.verdura );

  verdura
  .validate()
  .then(
    function(err){
      if (err) {
        res.render('/menu/verduras/new', {verdura: verdura, errors: err.errors});
      } else {
        verdura // save: guarda en DB campos pregunta y respuesta de quiz
        .save({fields: ["nombre", "image"]})
        .then( function(){ res.redirect('/verduras')}) 
      }      // res.redirect: Redirección HTTP a lista de preguntas
    }
  ).catch(function(error){next(error)});
};

// GET /quizes/:id/edit
exports.edit = function(req, res) {
  var verdura = req.verdura;  
  res.render('menu/verduras/edit', {verdura: verdura, errors: []});
};

// PUT /quizes/:id
exports.update = function(req, res) {
  if(req.files.image){
    req.verdura.image = req.files.image.name;
  }
  req.verdura.nombre = req.body.verdura.nombre;
  req.verdura
  .validate()
  .then(
    function(err){
      if (err) {
        res.render('/menu/verduras/edit', {verdura: req.verdura, errors: err.errors});
      } else {
        req.verdura    // save: guarda campos pregunta y respuesta en DB
        .save( {fields: ["nombre","image"]})
        .then( function(){ res.redirect('/verduras');});
      }     // Redirección HTTP a lista de preguntas (URL relativo)
    }
  ).catch(function(error){next(error)});
};

// DELETE /quizes/:id
exports.destroy = function(req, res) {
  req.verdura.destroy().then( function() {
    res.redirect('/verduras');
  }).catch(function(error){next(error)});
};
