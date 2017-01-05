module.exports = function(Capacitandos) {

		Capacitandos.exporta_doc_inscrip = function(id_curso, id_alumno, res, callback) {

				var fs = require('fs');
				var Docxtemplater = require('docxtemplater');

				//Load the docx file as a binary
				var content = fs
				    .readFileSync(__dirname + "/../../templates/plantilla_inscripcion.docx", "binary");

				var doc = new Docxtemplater(content);


        Capacitandos.find({
						where: {
							idAlumno: id_alumno
						},
            include: [
							'localidad_pertenece',
							'unidad_pertenece',
							'nivel_estudios',
							'actividades_desempena',
							'experiencia_laboral',
							'medio_comunicacion',
							'motivos_capacitarse',
							'cursos_inscritos'
			      ]
            },
            function(err, resultado) {

								var CursoEncontrado = JSON.parse( JSON.stringify( resultado[0] ) );

								var nombre_archivo = '';
								var trimestres = ['PRIMERO','SEGUNDO','TERCERO','CUARTO'];
								var meses_nombre = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
								var meses = ['01','02','03','04','05','06','07','08','09','10','11','12'];
								//set the templateVariables
								var fechaElaboracion = new Date();
								var codigo = {
									"fecha_elaboracion" : fechaElaboracion.getDate() +'/'+ meses[fechaElaboracion.getMonth()] +'/'+ fechaElaboracion.getUTCFullYear(),
									"nombre_unidad"     : CursoEncontrado.unidad_pertenece.nombre,
									"clavecct"  		: '',
									"apellido_paterno"  : CursoEncontrado.apellidoPaterno,
									"apellido_materno"  : CursoEncontrado.apellidoMaterno,
									"nombre"            : CursoEncontrado.nombre,
									"email"             : CursoEncontrado.email,
									"edad"              : CursoEncontrado.edad,
									"telefono"          : CursoEncontrado.telefono,
									"celular"           : CursoEncontrado.celular,
									"domicilio"         : CursoEncontrado.domicilio,
									"colonia"           : CursoEncontrado.colonia
								};

								nombre_archivo = 'SID_01_' + CursoEncontrado.apellidoPaterno + ' ' + CursoEncontrado.apellidoMaterno + ' ' + CursoEncontrado.nombre;

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



		Capacitandos.remoteMethod(
		'exporta_doc_inscrip',
		{
		  accepts: [
		    {arg: 'id_curso', type: 'string', required: true },
		    {arg: 'id_alumno', type: 'string', required: true },
		    {arg: 'res', type: 'object', 'http': {source: 'res'}}
		  ],
		  returns: {},
		  http: {path: '/exporta_doc_inscrip/:id_curso/:id_alumno', verb: 'get'}
		});

};
