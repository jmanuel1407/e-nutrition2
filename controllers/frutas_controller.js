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
exports.load = function(req, res, next, frutaId) {
  models.Fruta.find({
            include: [{
                model: models.Receta
            }]
        }).then(function(fruta) {
      if (fruta) {
        req.fruta = fruta;
        next();
      } else{next(new Error('No existe frutaId=' + frutaId))}
    }
  ).catch(function(error){next(error)});
};

// GET /quizes
// GET /users/:userId/quizes
exports.index = function(req, res) {  
  var options = {};
  models.Fruta.findAll(options).then(
    function(frutas) {
      res.render('menu/frutas/index.ejs', {frutas: frutas, errors: []});
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
  var fruta = models.Fruta.build( // crea objeto quiz 
    {nombre: "Nombre"}
  );

  res.render('menu/frutas/new', {fruta: fruta, errors: []});
};

// POST /quizes/create
exports.create = function(req, res) {
  if(req.files.image){
    req.body.fruta.image = req.files.image.name;
  }
  var fruta = models.Fruta.build( req.body.fruta );

  fruta
  .validate()
  .then(
    function(err){
      if (err) {
        res.render('/menu/frutas/new', {fruta: fruta, errors: err.errors});
      } else {
        fruta // save: guarda en DB campos pregunta y respuesta de quiz
        .save({fields: ["nombre", "image"]})
        .then( function(){ res.redirect('/frutas')}) 
      }      // res.redirect: Redirección HTTP a lista de preguntas
    }
  ).catch(function(error){next(error)});
};

// GET /quizes/:id/edit
exports.edit = function(req, res) {
  var fruta = req.fruta;  
  res.render('menu/frutas/edit', {fruta: fruta, errors: []});
};

// PUT /quizes/:id
exports.update = function(req, res) {
  if(req.files.image){
    req.fruta.image = req.files.image.name;
  }
  req.fruta.nombre = req.body.fruta.nombre;
  req.fruta
  .validate()
  .then(
    function(err){
      if (err) {
        res.render('/menu/frutas/edit', {fruta: req.fruta, errors: err.errors});
      } else {
        req.fruta    // save: guarda campos pregunta y respuesta en DB
        .save( {fields: ["nombre","image"]})
        .then( function(){ res.redirect('/frutas');});
      }     // Redirección HTTP a lista de preguntas (URL relativo)
    }
  ).catch(function(error){next(error)});
};

// DELETE /quizes/:id
exports.destroy = function(req, res) {
  console.log("Entro a eliminar");
   console.log(req.fruta);
  req.fruta.destroy().then( function() {
    res.redirect('/frutas');
  }).catch(function(error){next(error)});
};

//  console.log("req.quiz.id: " + req.quiz.id);