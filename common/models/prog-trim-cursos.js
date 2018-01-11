module.exports = function(ProgTrimCursos) {

		ProgTrimCursos.exporta_doc_ptc = function(id_ptc, res, callback) {

				var fs = require('fs');
				var Docxtemplater = require('docxtemplater');

				//Load the docx file as a binary
				var content = fs
				    .readFileSync(__dirname + "/../../templates/plantilla_ptc.docx", "binary");

				var doc = new Docxtemplater(content);


        ProgTrimCursos.find({ 
					where: {idPtc: id_ptc },
		      include: [
		            	{
											relation: 'unidad_pertenece',
											scope: {
											  fields:['idUnidadAdmtva','nombre']
											}
				        	},
                  {
                      relation: 'cursos_programados',
                      scope: {
													include: [
													  {
													      relation: 'detalle_curso',
													      scope: {
													        fields: ['nombreCurso','modalidad']
													      }
													  },
                            {
                                relation: 'modalidad_pertenece',
                                scope: {
                                  fields: ['idModalidad','modalidad']
                                }
                            },
													  {
													      relation: 'instructores_propuestos',
													      scope: {
													        fields: ['apellidoPaterno','apellidoMaterno','nombre'],
													        order: ['apellidoPaterno ASC','apellidoMaterno ASC','nombre ASC']
													      }
													  }
													]
                      }
                  }
		      ]
        },
        function(err, resultado) {

						var PTCencontrado = JSON.parse( JSON.stringify( resultado[0] ) );
						//console.log(PTCencontrado.cursos_programados);
						//console.log("****************************************");
						//console.log(PTCencontrado.cursos_programados[0].horario);
						//console.log("****************************************");

						var nombre_archivo = '';
						var trimestres = ['PRIMERO','SEGUNDO','TERCERO','CUARTO'];
						var meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
						//set the templateVariables
						var fechaElaboracion = new Date(PTCencontrado.fechaElaboracion);
						var codigo = {
							"nombre_unidad"      : PTCencontrado.unidad_pertenece.nombre,
							"anio"               : PTCencontrado.anio,
							"trimestre"          : trimestres[PTCencontrado.trimestre-1],
							"fecha_elaboracion"  : fechaElaboracion.getDate() +'/'+ meses[fechaElaboracion.getMonth()] +'/'+ fechaElaboracion.getUTCFullYear(),
							"total_capacitandos" : 0,
							"total_semanas"      : 0,
							"total_total"        : 0,
							"curso_programado"   : []
						};

						nombre_archivo = 'PTC_' + PTCencontrado.unidad_pertenece.nombre + '_' +trimestres[PTCencontrado.trimestre-1] + '_TRIMESTRE_' + PTCencontrado.anio;

						var suma_capacitandos = 0;
						var suma_semanas = 0;
						var suma_total = 0;
						for(var i = 0; i < PTCencontrado.cursos_programados.length; i++)
						{
							//console.log("****************************************");
							if(PTCencontrado.cursos_programados[i].instructores_propuestos === undefined)
								var listaInstructores = [{ idInstructor: 0, apellidoPaterno: 'SIN', apellidoMaterno: 'INSTRUCTOR', nombre: 'ASIGNADO' }];
							else
								var listaInstructores = JSON.parse( JSON.stringify( PTCencontrado.cursos_programados[i].instructores_propuestos ) );
							//console.log(listaInstructores);

							var array_instructores = [];
							for(var j = 0; j < listaInstructores.length; j++)
								array_instructores.push({
									"nombre_instructor": listaInstructores[j].apellidoPaterno + ' ' + listaInstructores[j].apellidoMaterno + ' ' + listaInstructores[j].nombre
								});


							var fechaInicio = new Date(PTCencontrado.cursos_programados[i].fechaInicio);
							var fechaFin = new Date(PTCencontrado.cursos_programados[i].fechaFin);

							suma_capacitandos += parseInt(PTCencontrado.cursos_programados[i].capacitandos);
							suma_semanas += parseInt(PTCencontrado.cursos_programados[i].semanas);
							suma_total += parseInt(PTCencontrado.cursos_programados[i].total);

							codigo.curso_programado.push({
								"num": (i+1),
								"instructores_propuestos": array_instructores,
								"nombre_curso"  : PTCencontrado.cursos_programados[i].detalle_curso.nombreCurso,
								"modalidad"     : PTCencontrado.cursos_programados[i].modalidad_pertenece.modalidad,
								"horario"       : PTCencontrado.cursos_programados[i].horario,
								"aula_asignada" : PTCencontrado.cursos_programados[i].aulaAsignada,
								"capacitandos"  : PTCencontrado.cursos_programados[i].capacitandos,
								"semanas"       : PTCencontrado.cursos_programados[i].semanas,
								"total"         : PTCencontrado.cursos_programados[i].total,
								"fecha_inicio"  : fechaInicio.getDate() +'/'+ meses[fechaInicio.getMonth()] +'/'+ fechaInicio.getUTCFullYear(),
								"fecha_fin"     : fechaFin.getDate() +'/'+ meses[fechaFin.getMonth()] +'/'+ fechaFin.getUTCFullYear(),
								"observaciones" : PTCencontrado.cursos_programados[i].observaciones
							});

						}

						codigo.total_capacitandos = suma_capacitandos;
						codigo.total_semanas      = suma_semanas;
						codigo.total_total        = suma_total;

						doc.setData(codigo);

						doc.render();

						var buf = doc.getZip()
						             .generate({type:"nodebuffer"});

						//fs.writeFileSync(__dirname+"/output.docx",buf);

						//@todo: get your data from database etc...
						var datetime = new Date();
						res.set('Expires', 'Tue, 03 Jul 2001 06:00:00 GMT');
						res.set('Cache-Control', 'max-age=0, no-cache, must-revalidate, proxy-revalidate');
						res.set('Last-Modified', datetime +'GMT');
						res.set('Content-Type','application/force-download');
						res.set('Content-Type','application/octet-stream');
						res.set('Content-Type','application/download');
						res.set('Content-Disposition','attachment;filename='+nombre_archivo+'.docx');
						res.set('Content-Transfer-Encoding','binary');
						res.send(buf); //@todo: insert your CSV data here.

      	});

		};



		ProgTrimCursos.remoteMethod(
		'exporta_doc_ptc',
		{
		  accepts: [
		    {arg: 'id_ptc', type: 'number', required: true },
		    {arg: 'res', type: 'object', 'http': {source: 'res'}}
		  ],
		  returns: {},
		  http: {path: '/exporta_doc_ptc/:id_ptc', verb: 'get'}
		});



		/* generacion del documento de autorizacion del ptc*/
		ProgTrimCursos.exporta_doc_autorizacion_ptc = function(id_ptc, res, callback) {

						var fs = require('fs');
						var Docxtemplater = require('docxtemplater');

						//Load the docx file as a binary
						var content = fs
						    .readFileSync(__dirname + "/../../templates/oficio_autorizacion_ptc.docx", "binary");

						var doc = new Docxtemplater(content);

		        ProgTrimCursos.find({ 
							where: {idPtc: id_ptc },
				      include: [
		            	{
											relation: 'unidad_pertenece',
											scope: {
											  fields:['idUnidadAdmtva','nombre','nombreDirector']
											}
				        	}
				      ]
		        },
		        function(err, resultado) {

								var PTCencontrado = JSON.parse( JSON.stringify( resultado[0] ) );

								var nombre_archivo = '';
								var trimestres = ['PRIMERO','SEGUNDO','TERCERO','CUARTO'];
								var periodo = ['Enero-Marzo','Abril-Junio','Julio-Septiembre','Octubre-Diciembre'];
								var meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
								//set the templateVariables
								var fechaElaboracion = new Date();
								var codigo = {
									"nombre_director"    : PTCencontrado.unidad_pertenece.nombreDirector.toUpperCase(),
									"nombre_unidad"      : PTCencontrado.unidad_pertenece.nombre.toUpperCase(),
									"nombre_unidad2"      : PTCencontrado.unidad_pertenece.nombre,
									"anio"               : PTCencontrado.anio,
									"trimestre"          : periodo[PTCencontrado.trimestre-1],
									"anio"  						 : fechaElaboracion.getUTCFullYear(),
									"fecha_elaboracion"  : fechaElaboracion.getDate() +' de '+ meses[fechaElaboracion.getMonth()] +' de '+ fechaElaboracion.getUTCFullYear()

								};

								nombre_archivo = 'Oficio_autorizacion_ptc_' + PTCencontrado.unidad_pertenece.nombre + '_' +trimestres[PTCencontrado.trimestre-1] + '_TRIMESTRE_' + PTCencontrado.anio;

								doc.setData(codigo);

								doc.render();

								var buf = doc.getZip()
								             .generate({type:"nodebuffer"});

								//@todo: get your data from database etc...
								var datetime = new Date();
								res.set('Expires', 'Tue, 03 Jul 2001 06:00:00 GMT');
								res.set('Cache-Control', 'max-age=0, no-cache, must-revalidate, proxy-revalidate');
								res.set('Last-Modified', datetime +'GMT');
								res.set('Content-Type','application/force-download');
								res.set('Content-Type','application/octet-stream');
								res.set('Content-Type','application/download');
								res.set('Content-Disposition','attachment;filename='+nombre_archivo+'.docx');
								res.set('Content-Transfer-Encoding','binary');
								res.send(buf); //@todo: insert your CSV data here.

		      	});

		};

		ProgTrimCursos.remoteMethod(
		'exporta_doc_autorizacion_ptc',
		{
		  accepts: [
		    {arg: 'id_ptc', type: 'number', required: true },
		    {arg: 'res', type: 'object', 'http': {source: 'res'}}
		  ],
		  returns: {},
		  http: {path: '/exporta_doc_autorizacion_ptc/:id_ptc', verb: 'get'}
		});

/************************************************************************************************************/

    ProgTrimCursos.resumen_ptc_unidades = function(anio, cb) {
		
		var ds = ProgTrimCursos.dataSource;

		var sql = 'SELECT * FROM estadisticas.resumen_ptc_unidades WHERE anio = ' + anio;

		ds.connector.execute(sql, '', function(err, resultado) {
			if (err);
			cb(err, resultado);
		});

    }
     
    ProgTrimCursos.remoteMethod(
        'resumen_ptc_unidades', 
        {
          accepts: {arg: 'anio', type: 'number', required: true},
          returns: {arg: 'data', type: 'array', root: true },
          http: {path: '/resumen_ptc_unidades', verb: 'get'}
        }
    );

/************************************************************************************************************/

    ProgTrimCursos.anios_ptc = function(cb) {
		
		var ds = ProgTrimCursos.dataSource;

		var sql = 'SELECT DISTINCT anio FROM ptc.prog_trim_cursos ORDER BY anio';

		ds.connector.execute(sql, '', function(err, resultado) {
			if (err);
			cb(err, resultado);
		});

    }
     
    ProgTrimCursos.remoteMethod(
        'anios_ptc', 
        {
          returns: {arg: 'data', type: 'array', root: true },
          http: {path: '/anios_ptc', verb: 'get'}
        }
    );


};
