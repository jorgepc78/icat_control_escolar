//Ejecutar este script los primeros 10 dias de cadad tercer mes 
//Instalacion:
//chmod 0755 aviso_creacion_ptc_proximo.sh
//programar el cron para ejecutar los dias 1-10 y 20-30 de cada mes
// configuración crontab -e
//Minuto  Hora  DiaDelMes  Mes  DiaDeLaSemana  Usuario  Comando
//00 9 1-10,20-28 * * /usr/bin/node /icat_control_escolar/scripts_cron/aviso_creacion_ptc_proximo.js > /icat_control_escolar/scripts_cron/aviso_creacion_ptc_proximo.log

//este script envia un aviso a las unidades para que generen el ptc del siguiente trimestre

//var ruta = 'C:/proyectosweb/icat/icat_control_escolar/server/server.js';
var ruta = '/icat_control_escolar/server/server';
var app = require(ruta);
//var models = app.models;

var ProgTrimCursos = app.models.ProgTrimCursos;
var CatalogoUnidadesAdmtvas = app.models.CatalogoUnidadesAdmtvas;

var fechaHoy = new Date();
var mes = fechaHoy.getMonth() + 1;
var trimestreProximo = 0;
var anio = fechaHoy.getFullYear();

if(mes == 3)
  trimestreProximo = 2;
else if(mes == 6)
  trimestreProximo = 3;
else if(mes == 9)
  trimestreProximo = 4;
else if(mes == 12)
{
  trimestreProximo = 1;
  anio++;
}
else
{
  console.log("Saliendo del script");
  process.exit(); //salir del script
}

var trimestres = ["1er trimestre", "2o trimestre", "3er trimestre","4o trimestre"];

var arrayUnidadesPendientes = [];
console.log("iniciando proceso de chequeo de ptc proximo, fecha: " + fechaHoy.toLocaleString());

/********************************************************************************************************/
ProgTrimCursos.find({
  where: {
    and: [
      {trimestre: trimestreProximo},
      {anio: anio}
    ]
  },
  fields: ["idPtc","idUnidadAdmtva"]
},
function(err, resultado) {

      var arrayUnidades = [1];
      for (var i = 0; i < resultado.length; i++) {
          arrayUnidades.push(resultado[i].idUnidadAdmtva);
      }

      CatalogoUnidadesAdmtvas.find({
        where: {
          idUnidadAdmtva:{
            nin: arrayUnidades
          }
        },
        fields: ["idUnidadAdmtva","nombre"]
      },
      function(err, resultado2) {

          for (var i = 0; i < resultado2.length; i++) {
              arrayUnidadesPendientes.push(resultado2[i].idUnidadAdmtva);
          }
          
          //console.log(arrayUnidadesPendientes);

          var Roles = app.models.Role;
          var Usuario = app.models.Usuario;
          var Email = app.models.Email;

          Roles.find({
            where: {name: 'unidad_capacit'}, 
            include: [
                {
                    relation: 'principals',
                    scope: {
                        fields: ['id','principalId']
                    }
                }
            ]
          },
          function(err, resultado) {

                var registro = JSON.parse( JSON.stringify( resultado[0] ) );

                var arrayIdUsuarios = [];
                for (var i = 0; i < registro.principals.length; i++) {
                    arrayIdUsuarios.push(parseInt(registro.principals[i].principalId));
                }

                Usuario.find({
                  where: {
                      idUsuario: {inq: arrayIdUsuarios}
                  },
                  fields: ['idUsuario','nombre', 'email', 'idUnidadAdmtva']
                },
                function(err, usuarioEncontrado) {

                      var array_recibe = [];

                      for (var i = 0; i < usuarioEncontrado.length; i++)
                      {
                            var usuarioRecord = JSON.parse( JSON.stringify( usuarioEncontrado[i] ) );
                            
                            var index = arrayUnidadesPendientes.indexOf(usuarioRecord.idUnidadAdmtva);

                            if(index >= 0)
                            {
                                array_recibe.push({
                                  idUsuario : usuarioRecord.idUsuario,
                                  nombre    : usuarioRecord.nombre,
                                  email     : usuarioRecord.email,
                                  titulo    : "Inicio de la planeación del próximo PTC",
                                  mensaje   : 'Hola <strong>'+usuarioRecord.nombre+'</strong>, este aviso es para recordarte que en este mes se debe de iniciar la planeaci&oacute;n de cursos en el PTC del <strong>'+ trimestres[(trimestreProximo-1)] + ' del '+anio+'</strong> en el sistema de control escolar de tal manera que se presente en tiempo y en forma para evitar contratiempos. Muchas gracias por la atenci&oacute;n. <br><br><br> * Este es un correo generado autom&aacute;ticamente, favor de no contestar.'
                                });
                            }
                      }

                      array_recibe.push({
                        idUsuario : 0,
                        nombre    : 'jorge',
                        email     : 'jorgepc78@gmail.com',
                        titulo    : "Inicio de la planeación del próximo PTC",
                        mensaje   : 'Hola checando que llegue el correo'
                      });

                      //console.log(array_recibe);
                      for (let j = 0; j < array_recibe.length; j++) {
          
                          Email.send({
                            to      : array_recibe[j].email,
                            from    : 'Sistema de Control Escolar del ICATQR <control-escolar@icatqr.edu.mx>',
                            subject : array_recibe[j].titulo,
                            html    : array_recibe[j].mensaje
                          }, function(err) {
                            if (err) console.log("ERROR: " + err);
                            
                            let d = new Date();
                            console.log('Correo de aviso de creacion del ptc del '+ trimestres[(trimestreProximo-1)] + ' del '+anio+' enviado al usuario ' + array_recibe[j].email + ', fecha de envio: ' + d.toLocaleString());
                            
                            if(j == (array_recibe.length-1)) 
                              {
                                process.exit();
                              }
                          });
                      };

                });

          });

      });

});