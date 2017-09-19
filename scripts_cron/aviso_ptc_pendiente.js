//Ejecutar este script cada dia a las 8 de la manana
//este script revisa los ptc pendientes de enviar por parte de las unidades
// y si tiene alguno todavia pendiente les manda un correo de aviso
//al perfil del jefe de capacitación

var models = require('C:/proyectosweb/icat/icat_control_escolar/server/server.js').models;

//Obtenemos el modelo de roles
var Roles = models.Role;
var Usuario = models.Usuario;
var Email = models.Email;

Roles.find({
  where: {name: 'unidad_capacit'}, 
  include: [
      {
          relation: 'principals',
          scope: {
              fields: ['id','principalId'],
              include: [
                  {
                      relation: 'Usuarios',
                      scope: {
                        fields: ['idUsuario','nombre','email']
                      }                
                  }
              ]
          }
      }
  ]
},
function(err, resultado) {

      var registro = JSON.parse( JSON.stringify( resultado[0] ) );

      var arrayIdUsuarios = [];
      for (var i = 0; i < registro.principals.length; i++) {
          arrayIdUsuarios.push(registro.principals[i].principalId);
      }

      Usuario.find({
        where:  {inq: [arrayIdUsuarios.toString()]}, 
        fields: ['idUsuario','nombre', 'email']
      },
      function(err, usuarioEncontrado) {

            var array_recibe = [];
            for (var i = 0; i < usuarioEncontrado.length; i++)
            {
                  var usuarioRecord = JSON.parse( JSON.stringify( usuarioEncontrado[0] ) );
                  array_recibe.push({
                    idUsuario : usuarioRecord.idUsuario,
                    nombre    : usuarioRecord.nombre,
                    email     : usuarioRecord.email,
                    titulo    : "PTC pendiente de enviar",
                    mensaje   : ''
                  });                              
            }
            console.log(array_recibe);

            /*for (var j = 0; j < array_recibe.length; j++) {
{"fields":["idPtc","idUnidadAdmtva","anio","trimestre","estatus"]}              
                Email.send({
                  to      : array_recibe[j].email,
                  from    : 'control-escolar@icatqr.edu.mx',
                  subject : mensajes.titulo,
                  html    : mensajes.recibe
                }, function(err) {
                  if (err) console.log(err);
                  //console.log('> envio del correo de aviso a central');
                });
            };*/

            process.exit();
      });


});
