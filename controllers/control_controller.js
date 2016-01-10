var models = require('../models/models.js');


// Autoload :id
exports.load = function(req, res, next, ontrolId) {
  models.Control.find({
            where: {
                id: Number(controlId)
            }
        }).then(function(control) {
      if (control) {
        req.control = control;
        next();
      } else{next(new Error('No existe quizId=' + controlId))}
    }
  ).catch(function(error){next(error)});
};

// POST /quizes/create
exports.save = function(req, res) {
  var control = models.Control.build( req.body.control);
  control
  .validate()
  .then(
    function(err){
      if (err) {
        res.render('/perfil', {fruta: fruta, errors: err.errors});
      } else {
        control // save: guarda en DB campos pregunta y respuesta de quiz
        .save({fields: ["fecha", "peso","UserId"]})
        .then( function(){ res.redirect('/perfil')}) 
      }      // res.redirect: Redirección HTTP a lista de preguntas
    }
  ).catch(function(error){next(error)});
};