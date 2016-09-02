module.exports = function(ControlProcesos) {
	
	/*ControlProcesos.observe('after save', function(ctx, next) {
      	
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
		{
			if(ctx.instance.accion == 'ENVIO REVISION')
			{
				condicion = {
					and: [{
							or: [
								{idUnidadAdmtva: ctx.instance.idUnidadAdmtva },
								{idUnidadAdmtva: 1 }
							]
						},
						{PTCEnvioRevision: true}
					]
				};
			}
		}
		else if( (ctx.instance.proceso == 'Pre-Apertura Curso PTC') || (ctx.instance.proceso == 'Pre-Apertura Curso Extra') )
		{
				condicion = {
					and: [{
							or: [
								{idUnidadAdmtva: ctx.instance.idUnidadAdmtva },
								{idUnidadAdmtva: 1 }
							]
						},
						{avisosPreaperturaCursos: true}
					]
				};
		}
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
					where: condicion,
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
										else if(ctx.instance.accion == 'PTC APROBADO ACADEMICA')
										{					
												mensajes.titulo  = 'Aviso Aprobación del PTC Área Académica';
												mensajes.envia   = 'El PTC del Trimestre <strong>'+ trimestres[(registro.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.anio +'</strong> de la <strong>'+ registro.unidad_pertenece.nombre +'</strong>, ha sido aprobado por el &aacute;rea acad&eacute;mica y marcado como en espera de revisi&oacute;n por parte del &aacute;rea de planeaci&oacute;n';
												mensajes.central = mensajes.envia;
												mensajes.unidad  = '';
										}
										else if(ctx.instance.accion == 'PTC APROBADO PLANEACION')
										{					
												mensajes.titulo  = 'Aviso Aprobación del PTC Área Planeación';
												mensajes.envia   = 'El PTC del Trimestre <strong>'+ trimestres[(registro.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.anio +'</strong> de la <strong>'+ registro.unidad_pertenece.nombre +'</strong>, ha sido aprobado por el &aacute;rea de planeaci&oacute;n y marcado como en espera de revisi&oacute;n por parte de la direcci&oacute;n general';
												mensajes.central = mensajes.envia;
												mensajes.unidad  = '';
										}
										else if(ctx.instance.accion == 'PTC APROBADO - ACEPTADO DIR GRAL')
										{					
												mensajes.titulo  = 'Aviso Aprobación y Aceptación del PTC';
												mensajes.envia   = 'El PTC del Trimestre <strong>'+ trimestres[(registro.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.anio +'</strong> de la <strong>'+ registro.unidad_pertenece.nombre +'</strong>, ha sido aceptado y autorizado para su difusi&oacute;n';
												mensajes.central = 'El PTC del Trimestre <strong>'+ trimestres[(registro.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.anio +'</strong> de la <strong>'+ registro.unidad_pertenece.nombre +'</strong>, ha sido aceptado y autorizado para su difusi&oacute;n';
												mensajes.unidad  = 'El PTC del Trimestre <strong>'+ trimestres[(registro.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.anio +'</strong>, ha sido aceptado y autorizado para su difusi&oacute;n';
										}
										enviaCorreos(ctx.instance.id, mensajes, array_envia, array_unidad, array_central);

								});

						}
						else if( (ctx.instance.proceso == 'Pre-Apertura Curso PTC')||(ctx.instance.proceso == 'Pre-Apertura Curso Extra') )
						{
								//Obtenemos los datos para armar el mensaje
								var CursosOficiales = ControlProcesos.app.models.CursosOficiales;

								CursosOficiales.find({
									where: {idCurso: ctx.instance.idDocumento },
						            include: [{
										relation: 'ptc_pertenece',
										scope: {
										  fields:['idPtc','anio','trimestre'],
										}
							        },{
										relation: 'unidad_pertenece',
										scope: {
										  fields:['idUnidadAdmtva','nombre']
										}
							        },{
										relation: 'localidad_pertenece',
										scope: {
										  fields:['idLocalidad','nombre']
										}
							        }]
								},
								function(err, registrosEncontrados) {

										var registro = JSON.parse( JSON.stringify( registrosEncontrados[0] ) );

										var trimestres = ['PRIMERO','SEGUNDO','TERCERO','CUARTO'];
										
										var fechaInicio = new Date(registro.fechaInicio);
										var fechaFin = new Date(registro.fechaFin);

										var anexo = 	   '<table cellspacing="0" cellpadding="2" border="1" align="left">'+
														   '<tr><td>Unidad</<td><td>'+ registro.unidad_pertenece.nombre +'</<td></tr>'+
														   '<tr><td>Nombre del curso</<td><td>'+ registro.nombreCurso +'</<td></tr>'+
														   '<tr><td>Modalidad</<td><td>'+ registro.modalidad +'</<td></tr>'+
														   '<tr><td>Timestre</<td><td>'+ trimestres[(registro.ptc_pertenece.trimestre-1)] +'</<td></tr>'+
														   '<tr><td>A&ntilde;o</<td><td>'+ registro.ptc_pertenece.anio +'</<td></tr>'+
														   '<tr><td>Localidad</<td><td>'+ registro.localidad_pertenece.nombre +'</<td></tr>'+
														   '<tr><td>Horario</<td><td>'+ registro.horario +'</<td></tr>'+
														   '<tr><td>Aula asignada</<td><td>'+ registro.aulaAsignada +'</<td></tr>'+
														   '<tr><td>Horas a la semana</<td><td>'+ registro.horasSemana +'</<td></tr>'+
														   '<tr><td>Total horas</<td><td>'+ registro.numeroHoras +'</<td></tr>'+
														   '<tr><td>Costo</<td><td>'+ registro.costo +'</<td></tr>'+
														   '<tr><td>Cupo m&aacute;ximo</<td><td>'+ registro.cupoMaximo +'</<td></tr>'+
														   '<tr><td>M&iacute;nimo de inscritos requeridos</<td><td>'+ registro.minRequeridoInscritos +'</<td></tr>'+
														   '<tr><td>mM&iacute;nimo de inscritos pagados requeridos</<td><td>'+ registro.minRequeridoPago +'</<td></tr>'+
														   '<tr><td>Fecha inicio</<td><td>'+ fechaInicio.getDate() +'/'+ (fechaInicio.getMonth() + 1) +'/'+ fechaInicio.getUTCFullYear() + '</<td></tr>'+
														   '<tr><td>Fecha terminaci&oacute;n</<td><td>'+ fechaFin.getDate() +'/'+ (fechaFin.getMonth() + 1) +'/'+ fechaFin.getUTCFullYear() + '</<td></tr>'+
														   '<tr><td>Instructor</<td><td>'+ registro.nombreInstructor +'</<td></tr>'+
														   '<tr><td>Curso p&uacute;blico</<td><td>'+ (registro.publico == true ? 'S&iacute;' : 'No') +'</<td></tr>'+
														   '</table>';

										if(ctx.instance.accion == 'ENVIO VALIDACION')
										{
												mensajes.titulo  = 'Aviso de envío de curso para validación de pre-apertura';
												mensajes.envia   = 'Se ha enviado un curso para su validaci&oacute;n de pre-apertura con los siguientes datos:<br><br>'+anexo;											
												mensajes.unidad  = mensajes.envia;
												mensajes.central = mensajes.envia;

										}
										else if(ctx.instance.accion == 'RECHAZO PRE-APERTURA')
										{					
												mensajes.titulo  = 'Aviso de rechazo de curso para pre-apertura';
												mensajes.envia   = 'El Curso <strong>'+ registro.nombreCurso +'</strong> con la modalidad <strong>'+ registro.modalidad +'</strong> del Trimestre <strong>'+ trimestres[(registro.ptc_pertenece.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.ptc_pertenece.anio +'</strong> de la <strong>'+ registro.unidad_pertenece.nombre +'</strong>, ha sido rechazado';
												mensajes.central = 'El Curso <strong>'+ registro.nombreCurso +'</strong> con la modalidad <strong>'+ registro.modalidad +'</strong> del Trimestre <strong>'+ trimestres[(registro.ptc_pertenece.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.ptc_pertenece.anio +'</strong> de la <strong>'+ registro.unidad_pertenece.nombre +'</strong>, ha sido rechazado';
												mensajes.unidad  = 'El Curso <strong>'+ registro.nombreCurso +'</strong> con la modalidad <strong>'+ registro.modalidad +'</strong> del Trimestre <strong>'+ trimestres[(registro.ptc_pertenece.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.ptc_pertenece.anio +'</strong> ha sido rechazado, favor de revisar para su correci&oacute;n';
										}
										if(ctx.instance.accion == 'CURSO APROBADO ACADEMICA')
										{
												mensajes.titulo  = 'Aviso Aprobación de curso Área Académica';
												mensajes.envia   = 'El curso <strong>'+ registro.nombreCurso +'</strong> de la <strong>'+ registro.unidad_pertenece.nombre +'</strong> ha sido aprobado por el &aacute;rea acad&eacute;mica y marcado como en espera de revisi&oacute;n por parte del &aacute;rea de planeaci&oacute;n. Los datos del curso son los siguientes:<br><br>'+anexo;											
												mensajes.central = mensajes.envia;
												mensajes.unidad  = '';
										}
										if(ctx.instance.accion == 'CURSO APROBADO PLANEACION')
										{
												mensajes.titulo  = 'Aviso Aprobación de curso Área Planeación';
												mensajes.envia   = 'El curso <strong>'+ registro.nombreCurso +'</strong> de la <strong>'+ registro.unidad_pertenece.nombre +'</strong> ha sido aprobado por el &aacute;rea de planeaci&oacute;n y marcado como en espera de revisi&oacute;n por parte de la direcci&oacute;n general. Los datos del curso son los siguientes:<br><br>'+anexo;											
												mensajes.central = mensajes.envia;
												mensajes.unidad  = '';
										}
										else if(ctx.instance.accion == 'CURSO APROBADO - ACEPTADO DIR GRAL')
										{					
												mensajes.titulo  = 'Aviso de aprobación y aceptación de curso para pre-apertura';
												mensajes.envia   = 'El Curso <strong>'+ registro.nombreCurso +'</strong> con la modalidad <strong>'+ registro.modalidad +'</strong> del Trimestre <strong>'+ trimestres[(registro.ptc_pertenece.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.ptc_pertenece.anio +'</strong> de la <strong>'+ registro.unidad_pertenece.nombre +'</strong>, ha sido aceptado para ser publicado y recibir inscripci&oacute;n';
												mensajes.central = 'El Curso <strong>'+ registro.nombreCurso +'</strong> con la modalidad <strong>'+ registro.modalidad +'</strong> del Trimestre <strong>'+ trimestres[(registro.ptc_pertenece.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.ptc_pertenece.anio +'</strong> de la <strong>'+ registro.unidad_pertenece.nombre +'</strong>, ha sido aceptado para ser publicado y recibir inscripci&oacute;n';
												mensajes.unidad  = 'El Curso <strong>'+ registro.nombreCurso +'</strong> con la modalidad <strong>'+ registro.modalidad +'</strong> del Trimestre <strong>'+ trimestres[(registro.ptc_pertenece.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.ptc_pertenece.anio +'</strong> ha sido aceptado, a partir de ahora podr&aacute; ser publicado y recibir inscripci&oacute;n';
										}
										enviaCorreos(ctx.instance.id, mensajes, array_envia, array_unidad, array_central);

								});
						}
						else if(ctx.instance.proceso == 'Inscripcion a curso')
						{
								//Obtenemos los datos para armar el mensaje
								var CursosOficiales = ControlProcesos.app.models.CursosOficiales;

								CursosOficiales.find({
									where: {idCurso: ctx.instance.idDocumento },
						            include: [{
										relation: 'ptc_pertenece',
										scope: {
										  fields:['idPtc','anio','trimestre'],
										}
							        },{
										relation: 'unidad_pertenece',
										scope: {
										  fields:['idUnidadAdmtva','nombre']
										}
							        },{
										relation: 'localidad_pertenece',
										scope: {
										  fields:['idLocalidad','nombre']
										}
							        },{
										relation: 'inscripcionesCursos',
										scope: {
											fields:['id','pagado','idAlumno','calificacion','numFactura'],
											include: {
												relation: 'Capacitandos',
												scope: {
													fields:['apellidoPaterno','apellidoMaterno','nombre','curp'],
													order: ['apellidoPaterno ASC','apellidoMaterno ASC','nombre ASC']
												}
											}
										}
									}]
								},
								function(err, registrosEncontrados) {

										var registro = JSON.parse( JSON.stringify( registrosEncontrados[0] ) );

										var trimestres = ['PRIMERO','SEGUNDO','TERCERO','CUARTO'];
										var estatus = ['Pendiente','Pagado','Condonado','Becado'];
										
										if(ctx.instance.accion == 'ALCANCE MINIMO INSCRITOS')
										{
												mensajes.titulo  = 'Aviso alcance de mínimo de inscripción';
												mensajes.envia   = 'El Curso <strong>'+ registro.nombreCurso +'</strong> con la modalidad <strong>'+ registro.modalidad +'</strong> del Trimestre <strong>'+ trimestres[(registro.ptc_pertenece.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.ptc_pertenece.anio +'</strong>, ha alcanzado el m&iacute;nimo de personas inscritas';
												mensajes.unidad  = 'El Curso <strong>'+ registro.nombreCurso +'</strong> con la modalidad <strong>'+ registro.modalidad +'</strong> del Trimestre <strong>'+ trimestres[(registro.ptc_pertenece.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.ptc_pertenece.anio +'</strong>, ha alcanzado el m&iacute;nimo de personas inscritas';
												mensajes.central = 'El Curso <strong>'+ registro.nombreCurso +'</strong> con la modalidad <strong>'+ registro.modalidad +'</strong> del Trimestre <strong>'+ trimestres[(registro.ptc_pertenece.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.ptc_pertenece.anio +'</strong> de la <strong>'+ registro.unidad_pertenece.nombre +'</strong>, ha alcanzado el m&iacute;nimo de personas inscritas';
										}
										else if(ctx.instance.accion == 'ALCANCE MINIMO PAGADOS')
										{					
												mensajes.titulo  = 'Aviso alcance de mínimo de inscritos pagados';
												mensajes.envia   = 'El Curso <strong>'+ registro.nombreCurso +'</strong> con la modalidad <strong>'+ registro.modalidad +'</strong> del Trimestre <strong>'+ trimestres[(registro.ptc_pertenece.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.ptc_pertenece.anio +'</strong>, ha alcanzado el m&iacute;nimo de personas inscritas y se ha marcado el curso como <strong>ACTIVO</strong>';
												mensajes.unidad  = 'El Curso <strong>'+ registro.nombreCurso +'</strong> con la modalidad <strong>'+ registro.modalidad +'</strong> del Trimestre <strong>'+ trimestres[(registro.ptc_pertenece.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.ptc_pertenece.anio +'</strong>, ha alcanzado el m&iacute;nimo de personas inscritas y se ha marcado el curso como <strong>ACTIVO</strong>';
												mensajes.central = 'El Curso <strong>'+ registro.nombreCurso +'</strong> con la modalidad <strong>'+ registro.modalidad +'</strong> del Trimestre <strong>'+ trimestres[(registro.ptc_pertenece.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.ptc_pertenece.anio +'</strong> de la <strong>'+ registro.unidad_pertenece.nombre +'</strong>, ha alcanzado el m&iacute;nimo de personas inscritas y se ha marcado el curso como <strong>ACTIVO</strong>';

												var anexo = '';
												for(var i = 0; i < registro.inscripcionesCursos.length; i++)
													anexo += '<tr><td>'+ (i+1) +'</<td><td>'+ registro.inscripcionesCursos[i].Capacitandos.apellidoPaterno + ' ' + registro.inscripcionesCursos[i].Capacitandos.apellidoMaterno + ' ' + registro.inscripcionesCursos[i].Capacitandos.nombre +'</<td><td>'+ estatus[registro.inscripcionesCursos[i].pagado] +'</<td><td>'+ registro.inscripcionesCursos[i].numFactura +'&nbsp;</<td></tr>';
										
												var anexo = '<br><br>Esta es la lista de personas inscritas:<br><br>'+
																   '<table cellspacing="0" cellpadding="2" border="1" align="left">'+																   
																   '<thead>'+
																   '<th>N&uacute;m.</th>'+
																   '<th>Nombre</th>'+
																   '<th>Estatus pago</th>'+
																   '<th>N&uacute;m. Factura</th>'+
																   '</thead>'+
																   '<tbody>'+
																   anexo+
																   '</tbody>'+
																   '</table>';

												mensajes.envia   += anexo;
												mensajes.unidad  += anexo;
												mensajes.central += anexo;
										}
										else if(ctx.instance.accion == 'REVERSION MINIMO PAGADOS')
										{					
												mensajes.titulo  = 'Aviso del cambio de inscritos pagados';
												mensajes.envia   = 'La inscripci&oacute;n del Curso <strong>'+ registro.nombreCurso +'</strong> con la modalidad <strong>'+ registro.modalidad +'</strong> del Trimestre <strong>'+ trimestres[(registro.ptc_pertenece.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.ptc_pertenece.anio +'</strong> ha variado y ha quedado abajo del m&iacute;nimo de inscritos pagados y se ha marcado el curso como <strong>EN ESPERA</strong>';
												mensajes.unidad  = 'La inscripci&oacute;n del Curso <strong>'+ registro.nombreCurso +'</strong> con la modalidad <strong>'+ registro.modalidad +'</strong> del Trimestre <strong>'+ trimestres[(registro.ptc_pertenece.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.ptc_pertenece.anio +'</strong> ha variado y ha quedado abajo del m&iacute;nimo de inscritos pagados y se ha marcado el curso como <strong>EN ESPERA</strong>';
												mensajes.central = 'La inscripci&oacute;n del Curso <strong>'+ registro.nombreCurso +'</strong> con la modalidad <strong>'+ registro.modalidad +'</strong> del Trimestre <strong>'+ trimestres[(registro.ptc_pertenece.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.ptc_pertenece.anio +'</strong> de la <strong>'+ registro.unidad_pertenece.nombre +'</strong> ha variado y ha quedado abajo del m&iacute;nimo de inscritos pagados y se ha marcado el curso como <strong>EN ESPERA</strong>';

												var anexo = '';
												for(var i = 0; i < registro.inscripcionesCursos.length; i++)
													anexo += '<tr><td>'+ (i+1) +'</<td><td>'+ registro.inscripcionesCursos[i].Capacitandos.apellidoPaterno + ' ' + registro.inscripcionesCursos[i].Capacitandos.apellidoMaterno + ' ' + registro.inscripcionesCursos[i].Capacitandos.nombre +'</<td><td>'+ estatus[registro.inscripcionesCursos[i].pagado] +'</<td><td>'+ registro.inscripcionesCursos[i].numFactura +'&nbsp;</<td></tr>';
										
												var anexo = '<br><br>Esta es la lista de personas inscritas:<br><br>'+
																   '<table cellspacing="0" cellpadding="2" border="1" align="left">'+																   
																   '<thead>'+
																   '<th>N&uacute;m.</th>'+
																   '<th>Nombre</th>'+
																   '<th>Estatus pago</th>'+
																   '<th>N&uacute;m. Factura</th>'+
																   '</thead>'+
																   '<tbody>'+
																   anexo+
																   '</tbody>'+
																   '</table>';

												mensajes.envia   += anexo;
												mensajes.unidad  += anexo;
												mensajes.central += anexo;
										}

										enviaCorreos(ctx.instance.id, mensajes, array_envia, array_unidad, array_central);
								});

						}
						else if(ctx.instance.proceso == 'Cursos vigentes')
						{
								var CursosOficiales = ControlProcesos.app.models.CursosOficiales;

								CursosOficiales.find({
									where: {idCurso: ctx.instance.idDocumento },
						            include: [{
										relation: 'ptc_pertenece',
										scope: {
										  fields:['idPtc','anio','trimestre'],
										}
							        },{
										relation: 'unidad_pertenece',
										scope: {
										  fields:['idUnidadAdmtva','nombre']
										}
							        },{
										relation: 'localidad_pertenece',
										scope: {
										  fields:['idLocalidad','nombre']
										}
							        },{
										relation: 'inscripcionesCursos',
										scope: {
											fields:['id','pagado','idAlumno','calificacion','numDocAcreditacion'],
											include: {
												relation: 'Capacitandos',
												scope: {
													fields:['apellidoPaterno','apellidoMaterno','nombre','curp'],
													order: ['apellidoPaterno ASC','apellidoMaterno ASC','nombre ASC']
												}
											}
										}
									}]
								},
								function(err, registrosEncontrados) {

										var registro = JSON.parse( JSON.stringify( registrosEncontrados[0] ) );

										var trimestres = ['PRIMERO','SEGUNDO','TERCERO','CUARTO'];
										var estatus = ['Pendiente','Pagado','Condonado','Becado'];

										var fechaInicio = new Date(registro.fechaInicio);
										var fechaFin = new Date(registro.fechaFin);
										
										if(ctx.instance.accion == 'REPROGRAMACION DE CURSO')
										{
												mensajes.titulo  = 'Aviso de reprogramación de curso';
												mensajes.envia   = 'El Curso <strong>'+ registro.nombreCurso +'</strong> con la modalidad <strong>'+ registro.modalidad +'</strong> del Trimestre <strong>'+ trimestres[(registro.ptc_pertenece.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.ptc_pertenece.anio +'</strong>, ha sido reprogramado, quedando de la siguiente manera:<br><br>';
												mensajes.unidad  = 'El Curso <strong>'+ registro.nombreCurso +'</strong> con la modalidad <strong>'+ registro.modalidad +'</strong> del Trimestre <strong>'+ trimestres[(registro.ptc_pertenece.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.ptc_pertenece.anio +'</strong>, ha sido reprogramado, quedando de la siguiente manera:<br><br>';
												mensajes.central = 'El Curso <strong>'+ registro.nombreCurso +'</strong> con la modalidad <strong>'+ registro.modalidad +'</strong> del Trimestre <strong>'+ trimestres[(registro.ptc_pertenece.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.ptc_pertenece.anio +'</strong> de la <strong>'+ registro.unidad_pertenece.nombre +'</strong>, ha sido reprogramado, quedando de la siguiente manera:<br><br>';

												var anexo =    '<table cellspacing="0" cellpadding="2" border="1" align="left">'+																   
															   '<tr><td>Horario</<td><td>'+ registro.horario +'</<td></tr>'+
															   '<tr><td>Aula asignada</<td><td>'+ registro.aulaAsignada +'</<td></tr>'+
															   '<tr><td>Fecha inicio</<td><td>'+ fechaInicio.getDate() +'/'+ (fechaInicio.getMonth() + 1) +'/'+ fechaInicio.getUTCFullYear() + '</<td></tr>'+
															   '<tr><td>Fecha terminaci&oacute;n</<td><td>'+ fechaFin.getDate() +'/'+ (fechaFin.getMonth() + 1) +'/'+ fechaFin.getUTCFullYear() + '</<td></tr>'+
															   '</table>';

												mensajes.envia   += anexo;
												mensajes.unidad  += anexo;
												mensajes.central += anexo;

												//ENVIAR CORREO A LOS INSCRITOS
										}
										else if(ctx.instance.accion == 'CANCELACION DE CURSO')
										{
												mensajes.titulo  = 'Aviso cancelación de curso';
												mensajes.envia   = 'El Curso <strong>'+ registro.nombreCurso +'</strong> con la modalidad <strong>'+ registro.modalidad +'</strong> del Trimestre <strong>'+ trimestres[(registro.ptc_pertenece.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.ptc_pertenece.anio +'</strong> ha sido CANCELADO';
												mensajes.unidad  = 'El Curso <strong>'+ registro.nombreCurso +'</strong> con la modalidad <strong>'+ registro.modalidad +'</strong> del Trimestre <strong>'+ trimestres[(registro.ptc_pertenece.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.ptc_pertenece.anio +'</strong> ha sido CANCELADO';
												mensajes.central = 'El Curso <strong>'+ registro.nombreCurso +'</strong> con la modalidad <strong>'+ registro.modalidad +'</strong> del Trimestre <strong>'+ trimestres[(registro.ptc_pertenece.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.ptc_pertenece.anio +'</strong> de la <strong>'+ registro.unidad_pertenece.nombre +'</strong> ha sido CANCELADO';

												//ENVIAR CORREO A LOS INSCRITOS
										}
										else if(ctx.instance.accion == 'CONCLUSION DE CURSO')
										{
												mensajes.titulo  = 'Aviso de conclusión de curso';
												mensajes.envia   = 'El Curso <strong>'+ registro.nombreCurso +'</strong> con la modalidad <strong>'+ registro.modalidad +'</strong> del Trimestre <strong>'+ trimestres[(registro.ptc_pertenece.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.ptc_pertenece.anio +'</strong> ha CONCLUIDO, el siguiente paso es el asiento de calificaciones de los capacitandos';
												mensajes.unidad  = 'El Curso <strong>'+ registro.nombreCurso +'</strong> con la modalidad <strong>'+ registro.modalidad +'</strong> del Trimestre <strong>'+ trimestres[(registro.ptc_pertenece.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.ptc_pertenece.anio +'</strong> ha CONCLUIDO, el siguiente paso es el asiento de calificaciones de los capacitandos';
												mensajes.central = 'El Curso <strong>'+ registro.nombreCurso +'</strong> con la modalidad <strong>'+ registro.modalidad +'</strong> del Trimestre <strong>'+ trimestres[(registro.ptc_pertenece.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.ptc_pertenece.anio +'</strong> de la <strong>'+ registro.unidad_pertenece.nombre +'</strong> ha CONCLUIDO, el siguiente paso es el asiento de calificaciones de los capacitandos';
										}
										else if(ctx.instance.accion == 'CIERRE DE CURSO')
										{					
												mensajes.titulo  = 'Aviso de cierre de curso';
												mensajes.envia   = 'El Curso <strong>'+ registro.nombreCurso +'</strong> con la modalidad <strong>'+ registro.modalidad +'</strong> del Trimestre <strong>'+ trimestres[(registro.ptc_pertenece.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.ptc_pertenece.anio +'</strong> ha sido CERRADO y almacenado como hist&oacute;rico. A continuaci&oacute;n se presenta la lista de capacitandos y sus calificaciones:<br><br>';
												mensajes.unidad  = 'El Curso <strong>'+ registro.nombreCurso +'</strong> con la modalidad <strong>'+ registro.modalidad +'</strong> del Trimestre <strong>'+ trimestres[(registro.ptc_pertenece.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.ptc_pertenece.anio +'</strong> ha sido CERRADO y almacenado como hist&oacute;rico. A continuaci&oacute;n se presenta la lista de capacitandos y sus calificaciones:<br><br>';
												mensajes.central = 'El Curso <strong>'+ registro.nombreCurso +'</strong> con la modalidad <strong>'+ registro.modalidad +'</strong> del Trimestre <strong>'+ trimestres[(registro.ptc_pertenece.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.ptc_pertenece.anio +'</strong> de la <strong>'+ registro.unidad_pertenece.nombre +'</strong> ha sido CERRADO y almacenado como hist&oacute;rico. A continuaci&oacute;n se presenta la lista de capacitandos y sus calificaciones:<br><br>';

												var anexo = '';
												for(var i = 0; i < registro.inscripcionesCursos.length; i++)
													anexo += '<tr><td>'+ (i+1) +'</<td><td>'+ registro.inscripcionesCursos[i].Capacitandos.apellidoPaterno + ' ' + registro.inscripcionesCursos[i].Capacitandos.apellidoMaterno + ' ' + registro.inscripcionesCursos[i].Capacitandos.nombre +'</<td><td>'+ registro.inscripcionesCursos[i].calificacion +'</<td><td>'+ registro.inscripcionesCursos[i].numDocAcreditacion +'</<td></tr>';
										
												var anexo = '<table cellspacing="0" cellpadding="2" border="1" align="left">'+																   
														   '<thead>'+
														   '<th>N&uacute;m.</th>'+
														   '<th>Nombre</th>'+
														   '<th>Calificaci&oacute;n</th>'+
														   '<th>N&uacute;m. documento</th>'+
														   '</thead>'+
														   '<tbody>'+
														   anexo+
														   '</tbody>'+
														   '</table>';

												mensajes.envia   += anexo;
												mensajes.unidad  += anexo;
												mensajes.central += anexo;
										}

										enviaCorreos(ctx.instance.id, mensajes, array_envia, array_unidad, array_central);
								});

						}

				});

		});




		function enviaCorreos(idControlProcesos, mensajes, array_envia, array_unidad, array_central) {

				if(mensajes.envia != '')
				{
						ControlProcesos.app.models.Email.send({
							to      : array_envia[0].email,
							from    : 'control-escolar@icatqr.edu.mx',
							subject : mensajes.titulo,
							html    : mensajes.envia
						}, function(err) {
							if (err) throw err;
							//console.log('> envio del correo de aviso al remitente');
						});					

						ControlProcesos.app.models.DestinatariosAvisos.create({
							idControlProcesos : idControlProcesos,
							idUsuario         : array_envia[0].idUsuario
						}, function(err, respuesta) {
							if (err) throw err;
						});
				}

				if(mensajes.unidad != '')
				{
						for (var i = 0; i < array_unidad.length; i++) {
							
								ControlProcesos.app.models.Email.send({
									to      : array_unidad[i].email,
									from    : 'control-escolar@icatqr.edu.mx',
									subject : mensajes.titulo,
									html    : mensajes.unidad
								}, function(err) {
									if (err) throw err;
									//console.log('> envio del correo de aviso a la unidad');
								});

								ControlProcesos.app.models.DestinatariosAvisos.create({
									idControlProcesos : idControlProcesos,
									idUsuario         : array_unidad[i].idUsuario
								}, function(err, respuesta) {
									if (err) throw err;
								});
						};					
				}

				if(mensajes.central != '')
				{
						for (var j = 0; j < array_central.length; j++) {
							
								ControlProcesos.app.models.Email.send({
									to      : array_central[j].email,
									from    : 'control-escolar@icatqr.edu.mx',
									subject : mensajes.titulo,
									html    : mensajes.central
								}, function(err) {
									if (err) throw err;
									//console.log('> envio del correo de aviso a central');
								});

								ControlProcesos.app.models.DestinatariosAvisos.create({
									idControlProcesos : idControlProcesos,
									idUsuario         : array_central[j].idUsuario
								}, function(err, respuesta) {
									if (err) throw err;
								});

						};					
				}

		};

    	
    	next();
	});*/

};
