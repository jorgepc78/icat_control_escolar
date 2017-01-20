module.exports = function(Inscripcionevaluaciones) {

    Inscripcionevaluaciones.observe('after save', function(ctx, next) {

          var Evaluacion = Inscripcionevaluaciones.app.models.Evaluacion;

          Evaluacion.findOne({
              where: { idEvaluacion: ctx.instance.idEvaluacion},
              fields: ["idEvaluacion","idUnidadAdmtva", "nombreCurso", "claveCurso", "estatus"]
          },
          function(err, evaluacionEncontrada) {

                var Capacitandos = Inscripcionevaluaciones.app.models.Capacitandos;

                Capacitandos.findOne({
                    where: { idAlumno: ctx.instance.idAlumno},
                    fields:['idAlumno','nombre','email'],
                },
                function(err, alumnoEncontrado) {

                        var email_alumno  = alumnoEncontrado.email;
                        var nombre_alumno = alumnoEncontrado.nombre;

                        if(ctx.isNewInstance == true)
                        {
                              var texto_alumno = "Hola <strong>"+ alumnoEncontrado.nombre + "</strong>, tu inscripci&oacute;n a la evaluaci&oacute;n <strong>"+ evaluacionEncontrada.nombreCurso + "</strong> ha sido registrada, "+
                              "por favor, completa el tr&aacute;mite realizando tu pago en la unidad de capacitaci&oacute;n del ICATQR donde se realizar&aacute; la evaluaci&oacute;n. "+
                              "¡Muchas gracias por tu preferencia con nosotros!";

                              var titulo = "Aviso de inscripción a la evaluación "+evaluacionEncontrada.nombreCurso;

                              Inscripcionevaluaciones.app.models.Email.send({
                                to: alumnoEncontrado.email,
                                from: 'control-escolar@icatqr.edu.mx',
                                subject: titulo,
                                html: texto_alumno
                              }, function(err) {
                                if (err) console.log(err);
                                //console.log('> Correo enviado a ' + alumnoEncontrado.email);
                              });
                        }
                        else if(ctx.instance.pagado > 0 && (evaluacionEncontrada.estatus == 0))
                        {
                              var texto_alumno = "Hola <strong>"+ alumnoEncontrado.nombre + "</strong>, el pago a la evaluaci&oacute;n <strong>"+ evaluacionEncontrada.nombreCurso + "</strong> que realizaste ha sido registrado con el n&uacute;mero de pago <strong>"+ctx.instance.numFactura+"</strong>, "+
                              "Solamente queda que est&eacute;s pendiente del d&iacute;a que presentar&aacute;s la evaluaci&oacute;n. ¡Muchas gracias por participar con nosotros!";
                              
                              var titulo = "Aviso de pago de la evaluación "+evaluacionEncontrada.nombreCurso;

                              Inscripcionevaluaciones.app.models.Email.send({
                                to: alumnoEncontrado.email,
                                from: 'control-escolar@icatqr.edu.mx',
                                subject: titulo,
                                html: texto_alumno
                              }, function(err) {
                                if (err) console.log(err);
                                //console.log('> Correo enviado a ' + alumnoEncontrado.email);
                              });
                        }

                });

          });

          next();
    });

};
