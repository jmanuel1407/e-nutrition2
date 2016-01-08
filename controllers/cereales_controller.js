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
exports.load = function(req, res, next, cerealId) {
  models.Cereal.find({
            include: [{
                model: models.Receta
            }]
        }).then(function(cereal) {
      if (cereal) {
        req.cereal = cereal;
        next();
      } else{next(new Error('No existe cerealId=' + cerealId))}
    }
  ).catch(function(error){next(error)});
};

// GET /quizes
// GET /users/:userId/quizes
exports.index = function(req, res) {  
  var options = {};
  models.Cereal.findAll(options).then(
    function(cereales) {
      res.render('menu/cereales/index.ejs', {cereales: cereales, errors: []});
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
  var cereal = models.Cereal.build( // crea objeto quiz 
    {nombre: "Nombre"}
  );

  res.render('menu/cereales/new', {cereal: cereal, errors: []});
};

// POST /quizes/create
exports.create = function(req, res) {
  if(req.files.image){
    req.body.cereal.image = req.files.image.name;
  }
  var cereal = models.Cereal.build( req.body.cereal );

  cereal
  .validate()
  .then(
    function(err){
      if (err) {
        res.render('/menu/cereales/new', {cereal: cereal, errors: err.errors});
      } else {
        cereal // save: guarda en DB campos pregunta y respuesta de quiz
        .save({fields: ["nombre", "image"]})
        .then( function(){ res.redirect('/cereales')}) 
      }      // res.redirect: Redirección HTTP a lista de preguntas
    }
  ).catch(function(error){next(error)});
};

// GET /quizes/:id/edit
exports.edit = function(req, res) {
  var cereal = req.cereal;  
  res.render('menu/cereales/edit', {cereal: cereal, errors: []});
};

// PUT /quizes/:id
exports.update = function(req, res) {
  if(req.files.image){
    req.cereal.image = req.files.image.name;
  }
  req.cereal.nombre = req.body.cereal.nombre;
  req.cereal
  .validate()
  .then(
    function(err){
      if (err) {
        res.render('/menu/cereales/edit', {cereal: req.cereal, errors: err.errors});
      } else {
        req.cereal    // save: guarda campos pregunta y respuesta en DB
        .save( {fields: ["nombre","image"]})
        .then( function(){ res.redirect('/cereales');});
      }     // Redirección HTTP a lista de preguntas (URL relativo)
    }
  ).catch(function(error){next(error)});
};

// DELETE /quizes/:id
exports.destroy = function(req, res) {
  console.log("Entro a eliminar");
   console.log(req.cereal);
  req.cereal.destroy().then( function() {
    res.redirect('/cereales');
  }).catch(function(error){next(error)});
};

//  console.log("req.quiz.id: " + req.quiz.id);