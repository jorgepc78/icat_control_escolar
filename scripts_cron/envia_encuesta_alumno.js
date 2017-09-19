//Ejecutar este script todos los dias
//Instalacion:
//programar el cron para ejecutar todos los dias
// configuración crontab -e
//Minuto  Hora  DiaDelMes  Mes  DiaDeLaSemana  Usuario  Comando
//00 18 * * * /usr/bin/node /icat_control_escolar/scripts_cron/envia_encuesta_alumno.js > /icat_control_escolar/scripts_cron/envia_encuesta_alumno.log

//este script envia un correo con el link de la encuesta de satisfaccion para el alumno

//https://capacitate.icatqr.edu.mx/encuesta_participante/#/inicio/163
var url = "http://localhost:4200/#/inicio/";
var ruta = 'C:/proyectosweb/icat/icat_control_escolar/server/server.js';

//var url = "https://capacitate.icatqr.edu.mx/encuesta_participante/#/inicio/";
//var ruta = '/icat_control_escolar/server/server';

var fecha1 = new Date();
//var fecha1 = new Date("2017-06-06 00:00:00-05");
fecha1.setDate(fecha1.getDate() - 1); 

fecha1.setHours(00);
fecha1.setMinutes(00);
fecha1.setSeconds(01);
fecha1.setMilliseconds(00);

//console.log(fecha1.toDateString());
//console.log(fecha2);

var fecha2 = new Date();
fecha2.setHours(00);
fecha2.setMinutes(00);
fecha2.setSeconds(01);
fecha2.setMilliseconds(00);



var app = require(ruta);
var CursosOficiales = app.models.CursosOficiales;

var fechaHoy = new Date();
console.log("iniciando proceso de envío de encuesta para el alumno, fecha: " + fechaHoy.toLocaleString());


CursosOficiales.find({
  where: {
    fechaFin: {
      between:[fecha1.toISOString(), fecha2.toISOString()]
    }
  },
  //where: {fechaFin: fecha1.toDateString()},
  fields: ["idCurso","nombreCurso","estatus"],
  include:[
    {
      relation: 'inscripcionesCursos',
      scope: {
        where: {
          calificacion: {
            neq: "DESERTOR"
          }
        },
        fields: ["id","idAlumno","idCurso","calificacion"],
        include: {
            relation: 'Capacitandos',
            scope: {
              fields: ["nombre","nombreCompleto","email"]
            }
        }
      }
    }
  ]
},
function(err, resultado) {

      if(resultado.length > 0)
      {
            var array_recibe = [];
            for (var i = 0; i < resultado.length; i++) {

                console.log("Curso encontrado: " + resultado[i].nombreCurso);
                var cursoRecord = JSON.parse( JSON.stringify( resultado[i] ) );

                for (var j = 0; j < cursoRecord.inscripcionesCursos.length; j++) {
                    array_recibe.push({
                      id        : cursoRecord.inscripcionesCursos[j].id,
                      idAlumno  : cursoRecord.inscripcionesCursos[j].idAlumno,
                      nombre    : cursoRecord.inscripcionesCursos[j].Capacitandos.nombre,
                      email     : cursoRecord.inscripcionesCursos[j].Capacitandos.email,
                      titulo    : "Encuesta de satisfacción del ICATQR",
                      mensaje   : 'Hola <strong>'+cursoRecord.inscripcionesCursos[j].Capacitandos.nombre+'</strong>, gracias por haber tomado el curso <strong>'+ cursoRecord.nombreCurso + '</strong>; como &uacute;ltimo paso, te pedimos que llenes el siguiente cuestionario que nos permitir&aacute; mejorar el servicio que te ofrecemos. Muchas gracias por estudiar con nosotros! <br><br> <a href="' + url + cursoRecord.inscripcionesCursos[j].id + '">Encuesta de satisfacci&oacute;n para el participante</a> <br><br><br><br> * Este es un correo generado autom&aacute;ticamente, favor de no contestar.'
                    });
                }
            }

            if(array_recibe.length > 0)
            {

                  let primermensaje = array_recibe[0].mensaje;
                  array_recibe.push({
                    id : 0,
                    idAlumno : 0,
                    nombre    : 'jorge',
                    email     : 'jorgepc78@gmail.com',
                    titulo    : "Encuesta de satisfacción del ICATQR",
                    mensaje   : 'primer link enviado: <br><br> ' + primermensaje
                  });

                  var Email = app.models.Email;
                  var Capacitandos = app.models.Capacitandos;
                  for (let j = 0; j < array_recibe.length; j++) {

                      let d = new Date();
                      console.log('Enviando encuesta al usuario ' + array_recibe[j].email + ' id: '+ array_recibe[j].id +', fecha: ' + d.toLocaleString());
                      Email.send({
                        to      : array_recibe[j].email,
                        from    : 'Sistema de Control Escolar del ICATQR <control-escolar@icatqr.edu.mx>',
                        subject : array_recibe[j].titulo,
                        html    : array_recibe[j].mensaje
                      }, function(err) {
                        if (err) {
                          console.log("ERROR: " + err);
                          Capacitandos.findById(array_recibe[j].idAlumno, function(err, alumno) {
                              alumno.updateAttribute('correoValido', false, function(err, result) {
                              });
                          });
                        }

                        if(j == (array_recibe.length-1)) 
                          {
                            process.exit();
                          }
                      });
                  };              
            }
            else
            {
                let d = new Date();
                console.log('Ninguna encuesta enviada, fecha: ' + d.toLocaleString());
                process.exit();
            }            
      }
      else
      {
          let d = new Date();
          console.log('Ninguna encuesta enviada, fecha: ' + d.toLocaleString());
          process.exit();
      }
});