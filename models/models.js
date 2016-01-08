var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd, 
  { dialect:  protocol,
    protocol: protocol,
    port:     port,
    host:     host,
    storage:  storage,  // solo SQLite (.env)
    omitNull: true      // solo Postgres
  }      
);

// Importar definicion de la tabla Quiz
var fruta_path = path.join(__dirname,'fruta');
var Fruta = sequelize.import(fruta_path);

var verdura_path = path.join(__dirname,'verdura');
var Verdura = sequelize.import(verdura_path);

var planta_path = path.join(__dirname,'planta');
var Planta = sequelize.import(planta_path);

var cereal_path = path.join(__dirname,'cereal');
var Cereal = sequelize.import(cereal_path);

var receta_path = path.join(__dirname,'receta');
var Receta = sequelize.import(receta_path);
var control_path = path.join(__dirname,'control');
var Control = sequelize.import(control_path);


// Importar definicion de la tabla Comment
var user_path = path.join(__dirname,'user');
var User = sequelize.import(user_path);

// los quizes pertenecen a un usuario registrado
User.hasMany(Fruta);
User.hasMany(Verdura);
User.hasMany(Planta);
User.hasMany(Cereal);

Fruta.hasMany(Receta);
Verdura.hasMany(Receta);
Cereal.hasMany(Receta);
Planta.hasMany(Receta);
Control.belongsTo(User);
User.hasMany(Control);

// exportar tablas
exports.Fruta = Fruta;
exports.Verdura = Verdura;
exports.Cereal = Cereal;
exports.Planta = Planta;

exports.Receta = Receta; 
exports.Control = Control;
exports.User = User;


// sequelize.sync() inicializa tabla de preguntas en DB
sequelize.sync().then(function() {
  // then(..) ejecuta el manejador una vez creada la tabla
  User.count().then(function (count){
    if(count === 0) {   // la tabla se inicializa solo si está vacía
      User.bulkCreate( 
        [ {username: 'admin',   password: '1234', image:'usuario.jpeg', isAdmin: true},
          {username: 'pepe',   password: '5678', image:'usuario.jpeg'} // el valor por defecto de isAdmin es 'false'
        ]
      ).then(function(){
        Verdura.count().then(function (count){
          if(count === 0) {   // la tabla se inicializa solo si está vacía
            Verdura.bulkCreate( 
              [ {nombre: 'Chayote', FrutaId: 2},{nombre: 'Zanahoria', FrutaId: 3}
              ]
            ).then(function(){console.log('Base de datos (tabla Verdura) inicializada');});
          };
        });
      }).then(function(){
        Planta.count().then(function (count){
          if(count === 0) {   // la tabla se inicializa solo si está vacía
            Planta.bulkCreate( 
              [ {nombre: 'Cilantro', FrutaId: 2},{nombre: 'Perejil', FrutaId: 3}
              ]
            ).then(function(){console.log('Base de datos (tabla Planta) inicializada');});
          };
        });
      }).then(function(){
        Cereal.count().then(function (count){
          if(count === 0) {   // la tabla se inicializa solo si está vacía
            Cereal.bulkCreate( 
              [ {nombre: 'Trigo', FrutaId: 2}, {nombre: 'Linaza', FrutaId: 2},
              ]
            ).then(function(){console.log('Base de datos (tabla Cereal) inicializada');});
          };
        });
      }).then(function(){
        console.log('Base de datos (tabla fruta) inicializada');
        Fruta.count().then(function (count){
          if(count === 0) {   // la tabla se inicializa solo si está vacía
            Fruta.bulkCreate( 
              [ {nombre: 'Plátano', FrutaId: 2},{nombre: 'Coco', FrutaId: 2}
              ]
            ).then(function(){console.log('Base de datos (tabla Fruta) inicializada');});
          };
        });
      }).then(function(){
        console.log('Base de datos (tabla Receta) inicializada');
        Receta.count().then(function (count){
          if(count === 0) {   // la tabla se inicializa solo si está vacía
            Receta.bulkCreate( 
              [ {nombre: 'Bowl de cereales y semillas', FrutaId: 2,intro:'Esta receta práctica para desayunar puedes llevarla contigo o dejarla preparada una noche antes. Disfruta los beneficios de los cereales y llénate de energía al comenzar el día. ', ingredientes:'Plátano 1/4 taza de quinoa enjuagada 1/2 taza de leche de almendras, 1 pizca de canela en polvo', preparacion:'Cocina la quinoa en una olla chica con la leche de almendras; deja a fuego medio hasta que absorba todo el liquido e infle. Una vez listo, apaga el fuego y agrega el resto de los ingredientes a la olla. Revuelve bien para integrar todos los sabores y sirve de inmediato. Decora con ralladura de naranja y limón. Comparte y disfruta.'},
            {nombre: 'Bowl de cereales y semillas', FrutaId: 3,intro:'Esta receta práctica para desayunar puedes llevarla contigo o dejarla preparada una noche antes. Disfruta los beneficios de los cereales y llénate de energía al comenzar el día. ', ingredientes:'Plátano 1/4 taza de quinoa enjuagada 1/2 taza de leche de almendras, 1 pizca de canela en polvo', preparacion:'Cocina la quinoa en una olla chica con la leche de almendras; deja a fuego medio hasta que absorba todo el liquido e infle. Una vez listo, apaga el fuego y agrega el resto de los ingredientes a la olla. Revuelve bien para integrar todos los sabores y sirve de inmediato. Decora con ralladura de naranja y limón. Comparte y disfruta.'}]
            ).then(function(){
              console.log('Base de datos (tabla Receta) inicializada');
              Control.count().then(function (count){
          if(count === 0) {   // la tabla se inicializa solo si está vacía
            Control.bulkCreate( 
              [ {fecha: '15-09-2015', controlId: 2, peso: 0},
              ]
            ).then(function(){console.log('Base de datos (tabla Control) inicializada');});
          };
        });
            });
          };
        });
      });
    };
  });
});