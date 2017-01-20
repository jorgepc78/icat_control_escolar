module.exports = function(InscripcionCurso) {


		InscripcionCurso.observe('after save', function(ctx, next) {

			    var CursosOficiales = InscripcionCurso.app.models.CursosOficiales;

			    CursosOficiales.findOne({
			    		where: { idCurso: ctx.instance.idCurso},
			    		fields: ["idCurso","idUnidadAdmtva", "nombreCurso", "claveCurso", "estatus"]
			    },
			    function(err, cursoEncontrado) {

					      var Capacitandos = InscripcionCurso.app.models.Capacitandos;

					      Capacitandos.findOne({
					      		where: { idAlumno: ctx.instance.idAlumno},
					      		fields:['idAlumno','nombre','email'],
					      },
					      function(err, alumnoEncontrado) {

							      		var email_alumno  = alumnoEncontrado.email;
							      		var nombre_alumno = alumnoEncontrado.nombre;

							      		if(ctx.isNewInstance == true)
							      		{
								    					var texto_alumno = "Hola <strong>"+ alumnoEncontrado.nombre + "</strong>, tu inscripci&oacute;n al curso <strong>"+ cursoEncontrado.nombreCurso + "</strong> ha sido registrada, "+
								    					"por favor, completa el tr&aacute;mite realizando tu pago en la unidad de capacitaci&oacute;n del ICATQR donde se impartir&aacute; el curso y as&iacute; asegures tu lugar. "+
								    					"Te recordamos llevar copias de los siguientes documentos: Credencial de Elector, CURP, Acta de Nacimiento y Comprobante de Domicilio, lo anterior para los tr&aacute;mites de Control Escolar y Emisi&oacute;n de Documentos Oficiales. "+
								    					"¡Muchas gracias por tu preferencia con nosotros!";

								    					var titulo = "Aviso de inscripción al curso "+cursoEncontrado.nombreCurso;

															InscripcionCurso.app.models.Email.send({
																to: alumnoEncontrado.email,
																from: 'control-escolar@icatqr.edu.mx',
																subject: titulo,
																html: texto_alumno
															}, function(err) {
																if (err) console.log(err);
																//console.log('> Correo enviado a ' + alumnoEncontrado.email);
															});
							      		}
							      		else if(ctx.instance.pagado > 0 && (cursoEncontrado.estatus == 2 || cursoEncontrado.estatus == 4))
							      		{
								    					var texto_alumno = "Hola <strong>"+ alumnoEncontrado.nombre + "</strong>, el pago del curso <strong>"+ cursoEncontrado.nombreCurso + "</strong> que realizaste ha sido registrado con el n&uacute;mero de pago <strong>"+ctx.instance.numFactura+"</strong>, "+
								    					"Solamente queda que est&eacute;s pendiente del inicio del curso. ¡Muchas gracias por participar con nosotros!";
								    					var titulo = "Aviso de pago del curso "+cursoEncontrado.nombreCurso;

															InscripcionCurso.app.models.Email.send({
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
