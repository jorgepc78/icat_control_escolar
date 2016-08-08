module.exports = function(ControlProcesos) {
	
	ControlProcesos.observe('after save', function(ctx, next) {
      	
		// El mensaje se le debe enviar a tres personas o entidades, la primera es la persona que realiza el proceso la segunda es la encargada de la unidad y la tercera es la responsable de oficinas centrales
		//cada una tiene un mensaje diferente en cuanto a su redacción.
		var array_envia    = [];
		var array_unidad   = [];
		var array_central  = [];
		var condicion      = {};
		var mensajes	   = {
			titulo : '',
			envia  : '',
			unidad : '',
			central: ''
		};

		if(ctx.instance.proceso == 'PTC')
			condicion = {avisosPTC: true};
		else if( (ctx.instance.proceso == 'Pre-Apertura Curso PTC') || (ctx.instance.proceso == 'Pre-Apertura Curso Extra') )
			condicion = {avisosPreaperturaCursos: true};
		else if(ctx.instance.proceso == 'Inscripcion a curso')
			condicion = {avisosInscripcion: true};
		else if(ctx.instance.proceso == 'Cursos vigentes')
			condicion = {avisosCierreCursos: true};

		var Usuario = ControlProcesos.app.models.Usuario;

		Usuario.find({
			where:  {idUsuario: ctx.instance.idUsuario}, 
			fields: {idUsuario: true, nombre: true, email: true}
		},
		function(err, usuarioEncontrado) {
			
				var usuarioRecord = JSON.parse( JSON.stringify( usuarioEncontrado[0] ) );
				array_envia.push({
					idUsuario : usuarioRecord.idUsuario,
					nombre    : usuarioRecord.nombre,
					email     : usuarioRecord.email
				});

				
				Usuario.find({
					where: {
						and: [{
								or: [
									{idUnidadAdmtva: ctx.instance.idUnidadAdmtva },
									{idUnidadAdmtva: 1 }
								]
							},
							condicion
						]
					},
					fields: {idUsuario: true, idUnidadAdmtva:true, nombre: true, email: true}
				},
				function(err, usuarioEncontrado2) {
					
						for (var i = 0; i < usuarioEncontrado2.length; i++) {

							var usuarioRecord2 = JSON.parse( JSON.stringify( usuarioEncontrado2[i] ) );
							if(usuarioRecord2.idUnidadAdmtva == 1)
							{
								array_central.push({
									idUsuario : usuarioRecord2.idUsuario,
									nombre    : usuarioRecord2.nombre,
									email     : usuarioRecord2.email
								});								
							}
							else
							{
								array_unidad.push({
									idUsuario : usuarioRecord2.idUsuario,
									nombre    : usuarioRecord2.nombre,
									email     : usuarioRecord2.email
								});								
							}

						};

						if(ctx.instance.proceso == 'PTC')
						{
								//Obtenemos los datos para armar el mensaje
								var ProgTrimCursos = ControlProcesos.app.models.ProgTrimCursos;

								ProgTrimCursos.find({
									where: {idPtc: ctx.instance.idDocumento },
									fields: {idPtc: true, trimestre: true, anio: true, idUnidadAdmtva: true},
						            include: [{
										relation: 'unidad_pertenece',
										scope: {
										  fields:['idUnidadAdmtva','nombre']
										}
							        }]
								},
								function(err, PTCencontrado) {

										var registro = JSON.parse( JSON.stringify( PTCencontrado[0] ) );

										var trimestres = ['PRIMERO','SEGUNDO','TERCERO','CUARTO'];
										
										if(ctx.instance.accion == 'ENVIO REVISION')
										{
												mensajes.titulo  = 'Aviso de envío de revisión del PTC';
												mensajes.envia   = 'El PTC del Trimestre <strong>'+ trimestres[(registro.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.anio +'</strong> ha sido enviado para revisi&oacute;n';
												mensajes.unidad  = 'El PTC del Trimestre <strong>'+ trimestres[(registro.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.anio +'</strong> ha sido enviado para revisi&oacute;n';
												mensajes.central = 'El PTC del Trimestre <strong>'+ trimestres[(registro.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.anio +'</strong> de la <strong>'+ registro.unidad_pertenece.nombre +'</strong> ha sido enviado para revisi&oacute;n';
										}
										else if(ctx.instance.accion == 'PTC RECHAZADO')
										{					
												mensajes.titulo  = 'Aviso de PTC rechazado';
												mensajes.envia   = 'El PTC del Trimestre <strong>'+ trimestres[(registro.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.anio +'</strong> de la <strong>'+ registro.unidad_pertenece.nombre +'</strong>, ha sido rechazado y regresado a la unidad para su revisi&oacute;n';
												mensajes.central = 'El PTC del Trimestre <strong>'+ trimestres[(registro.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.anio +'</strong> de la <strong>'+ registro.unidad_pertenece.nombre +'</strong>, ha sido rechazado y regresado a la unidad para su revisi&oacute;n';
												mensajes.unidad  = 'El PTC del Trimestre <strong>'+ trimestres[(registro.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.anio +'</strong>, ha sido rechazado y regresado para su revisi&oacute;n';
										}
										else if(ctx.instance.accion == 'PTC ACEPTADO')
										{					
												mensajes.titulo  = 'Aviso de PTC rechazado';
												mensajes.envia   = 'El PTC del Trimestre <strong>'+ trimestres[(registro.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.anio +'</strong> de la <strong>'+ registro.unidad_pertenece.nombre +'</strong>, ha sido aceptado y autorizado para su difusi&oacute;n';
												mensajes.central = 'El PTC del Trimestre <strong>'+ trimestres[(registro.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.anio +'</strong> de la <strong>'+ registro.unidad_pertenece.nombre +'</strong>, ha sido aceptado y autorizado para su difusi&oacute;n';
												mensajes.unidad  = 'El PTC del Trimestre <strong>'+ trimestres[(registro.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.anio +'</strong>, ha sido aceptado y autorizado para su difusi&oacute;n';
										}
										enviaCorreos(ctx.instance.id, mensajes, array_envia, array_unidad, array_central);

								});

						}
					
				});

		});




		function enviaCorreos(idControlProcesos, mensajes, array_envia, array_unidad, array_central) {

				ControlProcesos.app.models.Email.send({
					to      : array_envia[0].email,
					from    : 'control-escolar@icatqr.edu.mx',
					subject : mensajes.titulo,
					html    : mensajes.envia
				}, function(err) {
					if (err) throw err;
					console.log('> envio del correo de aviso al remitente');
				});

				ControlProcesos.app.models.DestinatariosAvisos.create({
					idControlProcesos : idControlProcesos,
					idUsuario         : array_envia[0].idUsuario
				}, function(err, respuesta) {
					if (err) throw err;
				});

				for (var i = 0; i < array_unidad.length; i++) {
					
						ControlProcesos.app.models.Email.send({
							to      : array_unidad[i].email,
							from    : 'control-escolar@icatqr.edu.mx',
							subject : mensajes.titulo,
							html    : mensajes.unidad
						}, function(err) {
							if (err) throw err;
							console.log('> envio del correo de aviso a la unidad');
						});

						ControlProcesos.app.models.DestinatariosAvisos.create({
							idControlProcesos : idControlProcesos,
							idUsuario         : array_unidad[i].idUsuario
						}, function(err, respuesta) {
							if (err) throw err;
						});
				};

				for (var j = 0; j < array_central.length; j++) {
					
						ControlProcesos.app.models.Email.send({
							to      : array_central[j].email,
							from    : 'control-escolar@icatqr.edu.mx',
							subject : mensajes.titulo,
							html    : mensajes.central
						}, function(err) {
							if (err) throw err;
							console.log('> envio del correo de aviso a central');
						});

						ControlProcesos.app.models.DestinatariosAvisos.create({
							idControlProcesos : idControlProcesos,
							idUsuario         : array_central[j].idUsuario
						}, function(err, respuesta) {
							if (err) throw err;
						});

				};

		};

    	
    	next();
	});

};
