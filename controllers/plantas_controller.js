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
exports.load = function(req, res, next, plantaId) {
  models.Planta.find({
            include: [{
                model: models.Receta
            }]
        }).then(function(planta) {
      if (planta) {
        req.planta = planta;
        next();
      } else{next(new Error('No existe plantaId=' + plantaId))}
    }
  ).catch(function(error){next(error)});
};

// GET /quizes
// GET /users/:userId/quizes
exports.index = function(req, res) {  
  var options = {};
  models.Planta.findAll(options).then(
    function(plantas) {
      res.render('menu/plantas/index.ejs', {plantas: plantas, errors: []});
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
  var planta = models.Planta.build( // crea objeto quiz 
    {nombre: "Nombre"}
  );

  res.render('menu/plantas/new', {planta: planta, errors: []});
};

// POST /quizes/create
exports.create = function(req, res) {
  if(req.files.image){
    req.body.planta.image = req.files.image.name;
  }
  var planta = models.Planta.build( req.body.planta );

  planta
  .validate()
  .then(
    function(err){
      if (err) {
        res.render('/menu/plantas/new', {planta: planta, errors: err.errors});
      } else {
        planta // save: guarda en DB campos pregunta y respuesta de quiz
        .save({fields: ["nombre", "image"]})
        .then( function(){ res.redirect('/plantas')}) 
      }      // res.redirect: Redirección HTTP a lista de preguntas
    }
  ).catch(function(error){next(error)});
};

// GET /quizes/:id/edit
exports.edit = function(req, res) {
  var planta = req.planta;  
  res.render('menu/plantas/edit', {planta: planta, errors: []});
};

// PUT /quizes/:id
exports.update = function(req, res) {
  if(req.files.image){
    req.planta.image = req.files.image.name;
  }
  req.planta.nombre = req.body.planta.nombre;
  req.planta
  .validate()
  .then(
    function(err){
      if (err) {
        res.render('/menu/plantas/edit', {planta: req.planta, errors: err.errors});
      } else {
        req.planta    // save: guarda campos pregunta y respuesta en DB
        .save( {fields: ["nombre","image"]})
        .then( function(){ res.redirect('/plantas');});
      }     // Redirección HTTP a lista de preguntas (URL relativo)
    }
  ).catch(function(error){next(error)});
};

// DELETE /quizes/:id
exports.destroy = function(req, res) {
  console.log("Entro a eliminar");
   console.log(req.planta);
  req.planta.destroy().then( function() {
    res.redirect('/plantas');
  }).catch(function(error){next(error)});
};

//  console.log("req.quiz.id: " + req.quiz.id);