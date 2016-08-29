module.exports = function(InscripcionCurso) {

		InscripcionCurso.exporta_hoja_inscrip = function(id_inscripcion, res, callback) {

				var iconvlite = require('iconv-lite');
				var fs = require('fs');
				var pdf = require('html-pdf');

				function readFileSync_encoding(filename, encoding) {
				    var content = fs.readFileSync(filename);
				    return iconvlite.decode(content, encoding);
				}				

				//var html = readFileSync_encoding(__dirname + "/../../templates/plantilla_inscripcion_persona.htm", 'iso-8859-1');
				var html = fs.readFileSync(__dirname + "/../../templates/plantilla_inscripcion_persona.htm", 'utf8');

				
				var options = { format: 'Letter' };

				pdf.create(html).toBuffer(function(err, buffer){
				  console.log('This is a buffer:', Buffer.isBuffer(buffer));

					var datetime = new Date();
					res.set('Expires', 'Tue, 03 Jul 2001 06:00:00 GMT');
					res.set('Cache-Control', 'max-age=0, no-cache, must-revalidate, proxy-revalidate');
					res.set('Last-Modified', datetime +'GMT');
					res.set('Content-Type','application/force-download');
					res.set('Content-Type','application/octet-stream');
					res.set('Content-Type','application/download');
					res.set('Content-Disposition','attachment;filename=prueba.pdf');
					res.set('Content-Transfer-Encoding','binary');
					res.send(buffer); //@todo: insert your CSV data here.

				});



/*				var fs = require('fs');
				var Docxtemplater = require('docxtemplater');

				//Load the docx file as a binary
				var content = fs
				    .readFileSync(__dirname + "/../../templates/plantilla_ptc.docx", "binary");

				var doc = new Docxtemplater(content);


                InscripcionCurso.find({ 
					where: {idPtc: id_inscripcion },
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
								      relation: 'instructores_propuestos',
								      scope: {
								        fields: ['apellidoPaterno','apellidoMaterno','nombre'],
								        order: ['apellidoPaterno ASC','apellidoMaterno ASC','nombre ASC']
								      }
								  }
								]
	                        }
	                    },
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

							var listaInstructores = JSON.parse( JSON.stringify( PTCencontrado.cursos_programados[i].instructores_propuestos ) );
							//console.log("****************************************");
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
								"modalidad"     : PTCencontrado.cursos_programados[i].detalle_curso.modalidad,
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
*/
		};



		InscripcionCurso.remoteMethod(
		'exporta_hoja_inscrip',
		{
		  accepts: [
		    {arg: 'id_inscripcion', type: 'string', required: true },
		    {arg: 'res', type: 'object', 'http': {source: 'res'}}
		  ],
		  returns: {},
		  http: {path: '/exporta_hoja_inscrip/:id_inscripcion', verb: 'get'}
		});

};
