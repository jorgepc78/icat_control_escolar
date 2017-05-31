module.exports = function(CursosOficiales) {

	CursosOficiales.exporta_formato = function(idCurso, documento, res, callback) {

			var fs = require('fs');
			var Docxtemplater = require('docxtemplater');


            CursosOficiales.find({ 
        				where: {idCurso: idCurso },
        	            include: [
        	            	{
        						relation: 'unidad_pertenece',
        						scope: {
        						  fields:['idUnidadAdmtva','nombre','clavecct']
        						}
        			        },
        	            	{
        						relation: 'localidad_pertenece',
        						scope: {
        						  fields:['idLocalidad','nombre','municipio']
        						}
        			        },
        					{
        					  relation: 'instructor',
        					  scope: {
        					      include:{
        					          relation: 'localidad_pertenece',
        					          scope: {
        					              fields:['idLocalidad','nombre','municipio']
        					          }
        					      }
        					  }
        					},
        					{
        					  relation: 'inscripcionesCursos',
        					  scope: {
        					      fields:['id','pagado','idAlumno','calificacion','numDocAcreditacion'],
        					      include:{
        					          relation: 'Capacitandos',
        					          scope: {
        					              fields:['numControl','apellidoPaterno','apellidoMaterno','nombre','curp','edad','sexo','idNivelEstudios','disVisual','disAuditiva','disLenguaje','disMotriz','disMental'],
        					              order: ['apellidoPaterno ASC','apellidoMaterno ASC','nombre ASC'],
        							      include:[
        							      	{
        							          relation: 'nivel_estudios',
        							          scope: {
        							              fields:['nivelEstudios'],
        							          }
        							      	},
        							      	{
        							          relation: 'cursos_inscritos',
        							          scope: {
        							              fields:['idCurso'],
        							          }
        							      	},
        							      ]
        					          }
        					      }
        					  }
        					},
        					{
        					  relation: 'catalogo_curso_pertenece',
        					  scope: {
        					      fields:['idCatalogoCurso','idEspecialidad'],
        					      include:{
        					          relation: 'especialidad',
        					          scope: {
        					              fields:['idEspecialidad','nombre']
        					          }
        					      }
        					  }
        					}
        		        ]
                    },
                    function(err, resultado) {

        					var CUrsoEncontrado = JSON.parse( JSON.stringify( resultado[0] ) );

        					var nombre_archivo = documento + '_' + CUrsoEncontrado.unidad_pertenece.nombre + '_' + CUrsoEncontrado.nombreCurso;

        					var meses_nombre = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
        					var meses = ['01','02','03','04','05','06','07','08','09','10','11','12'];
        					//set the templateVariables
        					var fechaElaboracion = new Date();
        					var fechaInicio = new Date(CUrsoEncontrado.fechaInicio);
        					var fechaFin = new Date(CUrsoEncontrado.fechaFin);

        					var periodo = '';
        					if(fechaInicio.getMonth() >= 0 && fechaInicio.getMonth() <= 2)
        						periodo = 'ENE - MAR';
        					else if(fechaInicio.getMonth() >= 3 && fechaInicio.getMonth() <= 5)
        						periodo = 'ABR - JUN';
        					else if(fechaInicio.getMonth() >= 6 && fechaInicio.getMonth() <= 8)
        						periodo = 'JUL - SEP';
        					else if(fechaInicio.getMonth() >= 9 && fechaInicio.getMonth() <= 11)
        						periodo = 'OCT - DIC';

        					if(CUrsoEncontrado.instructor !== undefined)
                    var sexo_instructor = calculaSexo(CUrsoEncontrado.instructor.curp);
                  else
                    var sexo_instructor = '';

        					var codigo = {
                                    "nombre_unidad"        : CUrsoEncontrado.unidad_pertenece.nombre,
                                    "clavecct"             : CUrsoEncontrado.unidad_pertenece.clavecct,
                                    "fecha_elaboracion"    : fechaElaboracion.getDate() +'/'+ meses[fechaElaboracion.getMonth()] +'/'+ fechaElaboracion.getUTCFullYear(),
                                    "anio"                 : fechaElaboracion.getUTCFullYear(),
                                    "mes"                  : (meses_nombre[fechaElaboracion.getMonth()]).toUpperCase(),
                                    "dia"                  : fechaElaboracion.getDate(),
                                    "nombre_localidad"     : CUrsoEncontrado.localidad_pertenece.nombre,
                                    "nombre_municipio"     : CUrsoEncontrado.localidad_pertenece.municipio,
                                    "cfp"                  : '',
                                    "especialidad"         : CUrsoEncontrado.catalogo_curso_pertenece.especialidad.nombre,
                                    "nombre_curso"         : CUrsoEncontrado.nombreCurso,
                                    "clave_curso"          : CUrsoEncontrado.claveCurso,
                                    "modalidad"            : CUrsoEncontrado.modalidad,
                                    "mod1"                 : (CUrsoEncontrado.modalidad == 'Extension' ? '' : 'X' ),
                                    "mod2"                 : (CUrsoEncontrado.modalidad == 'Extension' ? 'X' : '' ),
                                    "fecha_inicio"         : fechaInicio.getDate() +'/'+ meses[fechaInicio.getMonth()] +'/'+ fechaInicio.getUTCFullYear(),
                                    "mes_inicio"           : meses_nombre[fechaInicio.getMonth()],
                                    "fecha_fin"            : fechaFin.getDate() +'/'+ meses[fechaFin.getMonth()] +'/'+ fechaFin.getUTCFullYear(),
                                    "aula_asignada"        : CUrsoEncontrado.aulaAsignada,
                                    "periodo"              : periodo,
                                    "total_horas"          : CUrsoEncontrado.numeroHoras,
                                    "horario"              : CUrsoEncontrado.horario,

                                    "nombre_instructor"    : CUrsoEncontrado.nombreInstructor,
                                    "curp_instructor"      : CUrsoEncontrado.curpInstructor,
                                    "sexo_instructor"      : sexo_instructor,
                                    "edo_civil_instructor" : '',
                                    "escolaridad"          : (CUrsoEncontrado.instructor == undefined ? '' : CUrsoEncontrado.instructor.escolaridad),
                                    "rfc"                  : (CUrsoEncontrado.instructor == undefined ? '' : CUrsoEncontrado.instructor.rfc),
                                    "calle"                : '',
                                    "numero"               : '',
                                    "colonia"              : '',
                                    "localidad_instructor" : (CUrsoEncontrado.instructor == undefined ? '' : CUrsoEncontrado.instructor.localidad_pertenece.nombre),
                                    "municipio_instructor" : (CUrsoEncontrado.instructor == undefined ? '' : CUrsoEncontrado.instructor.localidad_pertenece.municipio),
                                    "telefono"             : (CUrsoEncontrado.instructor == undefined ? '' : CUrsoEncontrado.instructor.telefono),
                                    "cantidad_total"       : '',

                                    "total_inscritos"      : CUrsoEncontrado.inscripcionesCursos.length,
                                    "observaciones"        : CUrsoEncontrado.observaciones,
                                    "inscritos"            : []
        					};


        					if(documento == 'rdod-10' || documento == 'rcdod-11' || documento == 'resd-05' || documento == 'lad-06' || documento == 'rae' || documento == 'riacd-02' || documento == 'ri' || documento == 'riact' || documento == 'rdoe' || documento == 'rescnr' || documento == 'lacnr' || documento == 'riacnr')
        					{
        						for(var i = 0; i < CUrsoEncontrado.inscripcionesCursos.length; i++)
        						{
        							var discapacidad = [];

        							if(CUrsoEncontrado.inscripcionesCursos[i].Capacitandos.disVisual == true)
        								discapacidad.push('Visual');
        							if(CUrsoEncontrado.inscripcionesCursos[i].Capacitandos.disAuditiva == true)
        								discapacidad.push('Auditiva');
        							if(CUrsoEncontrado.inscripcionesCursos[i].Capacitandos.disLenguaje == true)
        								discapacidad.push('Lenguaje');
        							if(CUrsoEncontrado.inscripcionesCursos[i].Capacitandos.disMotriz == true)
        								discapacidad.push('Motriz');
        							if(CUrsoEncontrado.inscripcionesCursos[i].Capacitandos.disMental == true)
        								discapacidad.push('Mental');
        							
        							if(CUrsoEncontrado.inscripcionesCursos[i].Capacitandos.cursos_inscritos.length > 1)
        								var ni = '';
        							else
        								var ni = 'X'

        							var edad = '';
        							if(CUrsoEncontrado.inscripcionesCursos[i].Capacitandos.curp == '')
        								edad = CUrsoEncontrado.inscripcionesCursos[i].Capacitandos.edad;
        							else
        								edad = calculaNacim(CUrsoEncontrado.inscripcionesCursos[i].Capacitandos.curp);

        							codigo.inscritos.push({
        								"num"            : (i+1),
        								"num_control"    : CUrsoEncontrado.inscripcionesCursos[i].Capacitandos.numControl,
        								"nombre_persona" : CUrsoEncontrado.inscripcionesCursos[i].Capacitandos.apellidoPaterno + ' ' + CUrsoEncontrado.inscripcionesCursos[i].Capacitandos.apellidoMaterno + ' ' + CUrsoEncontrado.inscripcionesCursos[i].Capacitandos.nombre,
        								"pagado"         : (CUrsoEncontrado.inscripcionesCursos[i].pagado == 1 ? 'X' : ''),
        								"becado"         : (CUrsoEncontrado.inscripcionesCursos[i].pagado == 1 ? '' : 'X'),
        								"discapacidad"   : discapacidad.toString(),
        								"sexo"           : CUrsoEncontrado.inscripcionesCursos[i].Capacitandos.sexo,
        								"edad"           : edad,
        								"escolaridad"    : (parseInt(CUrsoEncontrado.inscripcionesCursos[i].Capacitandos.idNivelEstudios) + 1),
        								"calificacion"   : CUrsoEncontrado.inscripcionesCursos[i].calificacion,
        								"acreditado"  	 : (CUrsoEncontrado.inscripcionesCursos[i].calificacion == 'ACREDITADO' ? 'X' : ''),
        								"no_acreditado"	 : (CUrsoEncontrado.inscripcionesCursos[i].calificacion == 'NO ACREDITADO' ? 'X' : ''),
        								"desertor"  	 : (CUrsoEncontrado.inscripcionesCursos[i].calificacion == 'DESERTOR' ? 'X' : ''),
        								"folio_diploma"  : CUrsoEncontrado.inscripcionesCursos[i].numDocAcreditacion,
        								"ni"             : ni
        							});

        						}
        					}

        					//Load the docx file as a binary
        					if(documento == 'contrato_regular' || documento == 'aci' || documento == 'rdod-10' || documento == 'rcdod-11' || documento == 'resd-05' || documento == 'lad-06' || documento == 'rae' || documento == 'riacd-02' || documento == 'ri' || documento == 'riact')
        						var content = fs.readFileSync(__dirname + "/../../templates/cursos_regulares/plantilla_"+documento+".docx", "binary");
        					
        					else if(documento == 'contrato_no_regular' || documento == 'rdoe' || documento == 'rescnr' || documento == 'lacnr' || documento == 'riacnr')
        						var content = fs.readFileSync(__dirname + "/../../templates/cursos_no_regulares/plantilla_"+documento+".docx", "binary");

        					var doc = new Docxtemplater(content);

        					doc.setData(codigo);

        					doc.render();

        					var buf = doc.getZip().generate({type:"nodebuffer"});

        					var datetime = new Date();
        					res.set('Expires', 'Tue, 03 Jul 2001 06:00:00 GMT');
        					res.set('Cache-Control', 'max-age=0, no-cache, must-revalidate, proxy-revalidate');
        					res.set('Last-Modified', datetime +'GMT');
        					res.set('Content-Type','application/force-download');
        					res.set('Content-Type','application/octet-stream');
        					res.set('Content-Type','application/download');
        					res.set('Content-Disposition','attachment;filename='+nombre_archivo+'.docx');
        					res.set('Content-Transfer-Encoding','binary');
        					res.send(buf);

                    });

	};



    function calculaSexo(curp)
    {

        if(curp == undefined)
            return '';

        if(curp.length >= 11)
        {
                var error_fecha = false;

                if( (curp.substr(10,1) != 'H') && (curp.substr(10,1) != 'M') )
                	return '';                
                else
                {
                    if(curp.substr(10,1) == 'H')
                    	return 'MASCULINO';
                    else
                    	return 'FEMENINO';
                }
        }
    }

    function calculaNacim(curp)
    {

        if(curp == undefined)
            return '';

        if(curp.length >= 10)
        {
                var error_fecha = false;

                if( isNaN(Number(curp.substr(4,2))))
                    error_fecha = true;
                else if( isNaN(Number(curp.substr(6,2))) )
                    error_fecha = true;
                else if(isNaN(Number(curp.substr(8,2))) )
                    error_fecha = true;

                if(error_fecha == true)
                {
                    return '';
                }
                else
                {
                    var fechaHoy = new Date();
                    var anioHoy = fechaHoy.getFullYear();

                    var anio = parseInt(curp.substr(4,2)) + 2000;
                    if( (anioHoy - anio) < 0)
                        var anio = parseInt(curp.substr(4,2)) + 1900;

                    var mes = parseInt(curp.substr(6,2));
                    var dia = parseInt(curp.substr(8,2));

                    var fechaNacimiento = new Date(anio,(mes-1),dia);
                    
                    var edad = fechaHoy.getFullYear()- fechaNacimiento.getFullYear() - 1; 
                    
                    if(fechaHoy.getMonth() + 1 - mes > 0) 
                        edad++;

                    if( (fechaHoy.getDate() - dia >= 0) && (fechaHoy.getMonth() + 1 - mes == 0) ) 
                        edad++;

                    return edad;
                }
        }
    }




	CursosOficiales.remoteMethod(
	'exporta_formato',
	{
	  accepts: [
	    {arg: 'idCurso',   type: 'string', required: true },
	    {arg: 'documento', type: 'string', required: true },
	    {arg: 'res', type: 'object', 'http': {source: 'res'}}
	  ],
	  returns: {},
	  http: {path: '/exporta_formato/:idCurso/:documento', verb: 'get'}
	});


/***********************************************************************************************************************************************/
    /*Resumen de cursos por mes*/
    CursosOficiales.cursos_mes = function(id_unidad, anio, meses, cb) {
		
		var ds = CursosOficiales.dataSource;

		var codigo = '';
		var codigo2 = '';
		
		if(meses == '0')
			codigo = '';
		else
			codigo = 'AND EXTRACT(month FROM fecha_inicio) IN ('+meses+') ';

		if(id_unidad == 0)
			codigo2 = '';
		else
			codigo2 = 'WHERE base.id_unidad_admtva = '+id_unidad+' ';

    var sql = `SELECT base.id_unidad_admtva, base.anio, base.mes,
              base.num_cursos_programados, 
              (CASE WHEN a.num_personas_inscritas is null THEN 0 ELSE a.num_personas_inscritas END) as num_personas_inscritas, 
              (CASE WHEN b.num_cursos_cerrados is null THEN 0 ELSE b.num_cursos_cerrados END) as num_cursos_cerrados,
              (CASE WHEN c.num_personas_terminan is null THEN 0 ELSE c.num_personas_terminan END) as num_personas_terminan,
              (CASE WHEN d.num_personas_acreditan is null THEN 0 ELSE d.num_personas_acreditan END) as num_personas_acreditan FROM

              (SELECT id_unidad_admtva, EXTRACT(year FROM fecha_inicio) as anio, EXTRACT(month FROM fecha_inicio) as mes, COUNT(id_curso) as num_cursos_programados
              FROM cursos_ofertados.cursos_oficiales WHERE estatus IN (2,4,5,6) ${codigo}AND EXTRACT(year FROM fecha_inicio) = ${anio} GROUP BY id_unidad_admtva, anio, mes) as base
              LEFT JOIN

              (SELECT id_unidad_admtva, EXTRACT(month FROM fecha_inicio) as mes, EXTRACT(year FROM fecha_inicio) as anio, COUNT(id_alumno) AS num_personas_inscritas
              FROM cursos_ofertados.inscripcion_curso INNER JOIN cursos_ofertados.cursos_oficiales ON (cursos_ofertados.inscripcion_curso.id_curso = cursos_ofertados.cursos_oficiales.id_curso)
              WHERE cursos_ofertados.inscripcion_curso.pagado > 0 AND cursos_ofertados.cursos_oficiales.estatus IN (2,4,5,6) ${codigo}AND EXTRACT(year FROM fecha_inicio) = ${anio} GROUP BY id_unidad_admtva, anio, mes) as a
              ON base.id_unidad_admtva = a.id_unidad_admtva AND base.anio = a.anio AND base.mes = a.mes

              LEFT JOIN
              (SELECT id_unidad_admtva, EXTRACT(year FROM fecha_inicio) as anio, EXTRACT(month FROM fecha_inicio) as mes, COUNT(id_curso) as num_cursos_cerrados
              FROM cursos_ofertados.cursos_oficiales WHERE estatus IN (5,6) ${codigo}AND EXTRACT(year FROM fecha_inicio) = ${anio} GROUP BY id_unidad_admtva, anio, mes) as b
              ON base.id_unidad_admtva = b.id_unidad_admtva AND base.anio = b.anio AND base.mes = b.mes

              LEFT JOIN
              (SELECT id_unidad_admtva, EXTRACT(month FROM fecha_inicio) as mes, EXTRACT(year FROM fecha_inicio) as anio, COUNT(id_alumno) AS num_personas_terminan
              FROM cursos_ofertados.inscripcion_curso INNER JOIN cursos_ofertados.cursos_oficiales ON (cursos_ofertados.inscripcion_curso.id_curso = cursos_ofertados.cursos_oficiales.id_curso)
              WHERE cursos_ofertados.inscripcion_curso.pagado > 0 AND cursos_ofertados.cursos_oficiales.estatus IN (5,6) ${codigo}AND EXTRACT(year FROM fecha_inicio) = ${anio} GROUP BY id_unidad_admtva, anio, mes) as c
              ON base.id_unidad_admtva = c.id_unidad_admtva AND base.anio = c.anio AND base.mes = c.mes

              LEFT JOIN
              (SELECT id_unidad_admtva, EXTRACT(month FROM fecha_inicio) as mes, EXTRACT(year FROM fecha_inicio) as anio, COUNT(id_alumno) AS num_personas_acreditan
              FROM cursos_ofertados.inscripcion_curso INNER JOIN cursos_ofertados.cursos_oficiales ON (cursos_ofertados.inscripcion_curso.id_curso = cursos_ofertados.cursos_oficiales.id_curso)
              WHERE cursos_ofertados.inscripcion_curso.pagado > 0 AND cursos_ofertados.inscripcion_curso.calificacion = 'ACREDITADO' AND cursos_ofertados.cursos_oficiales.estatus IN (5,6) ${codigo}AND EXTRACT(year FROM fecha_inicio) = ${anio} GROUP BY id_unidad_admtva, anio, mes)as d
              ON base.id_unidad_admtva = d.id_unidad_admtva AND base.anio = d.anio AND base.mes = d.mes
              ${codigo2}ORDER BY base.mes`;



		ds.connector.execute(sql, '', function(err, resultado) {
			if (err);
			cb(err, resultado);
		});

    }
     
    CursosOficiales.remoteMethod(
        'cursos_mes', 
        {
          accepts: [{arg: 'id_unidad', type: 'number', required: true},{arg: 'anio', type: 'number', required: true},{arg: 'meses', type: 'string', required: true}],
          returns: {arg: 'data', type: 'array', root: true },
          http: {path: '/cursos_mes', verb: 'get'}
        }
    );

/***********************************************************************************************************************************************/
	/* Resumen total */ 
    CursosOficiales.resumen_total = function(id_unidad, anio, cb) {
		
		var ds = CursosOficiales.dataSource;

		var codigo = '';
		
		if(id_unidad == 0)
			codigo = 'id_unidad_admtva >= 0';
		else
			codigo = 'id_unidad_admtva = '+id_unidad;

    var sql = `SELECT a.id_unidad_admtva, 
              (CASE WHEN a.total_inscritos is null THEN 0 ELSE a.total_inscritos END) as total_inscritos, 
              (CASE WHEN b.total_inscritos_anio is null THEN 0 ELSE b.total_inscritos_anio END) as total_inscritos_anio, 
              (CASE WHEN c.num_cursos_programados is null THEN 0 ELSE c.num_cursos_programados END) as num_cursos_programados, 
              (CASE WHEN d.num_personas_inscritas is null THEN 0 ELSE d.num_personas_inscritas END) as num_personas_inscritas
              FROM
              (SELECT id_unidad_admtva, COUNT(id_alumno) as total_inscritos FROM cursos_ofertados.capacitandos WHERE ${codigo} GROUP BY id_unidad_admtva) as a
              LEFT JOIN
              (SELECT id_unidad_admtva, COUNT(id_alumno) as total_inscritos_anio FROM cursos_ofertados.capacitandos WHERE ${codigo} AND EXTRACT(year FROM fecha_registro) = ${anio} GROUP BY id_unidad_admtva) as b
              ON a.id_unidad_admtva = b.id_unidad_admtva
              LEFT JOIN
              (SELECT id_unidad_admtva, COUNT(id_curso) as num_cursos_programados FROM cursos_ofertados.cursos_oficiales WHERE ${codigo} AND estatus IN (2,4,5,6) AND EXTRACT(year FROM fecha_inicio) = ${anio} GROUP BY id_unidad_admtva) as c
              ON a.id_unidad_admtva = c.id_unidad_admtva
              LEFT JOIN

              (SELECT id_unidad_admtva, COUNT(num_personas) as num_personas_inscritas FROM
               (SELECT DISTINCT id_unidad_admtva, EXTRACT(year FROM fecha_inicio) AS anio, (id_alumno) AS num_personas FROM cursos_ofertados.inscripcion_curso INNER JOIN cursos_ofertados.cursos_oficiales
              ON (cursos_ofertados.inscripcion_curso.id_curso = cursos_ofertados.cursos_oficiales.id_curso) WHERE ${codigo} AND pagado > 0 AND estatus IN (2,4,5,6) AND EXTRACT(year FROM fecha_inicio) = ${anio}) as x
              GROUP BY id_unidad_admtva) as d

              ON a.id_unidad_admtva = d.id_unidad_admtva`;


		ds.connector.execute(sql, '', function(err, resultado) {
			if (err);
			cb(err, resultado);
		});

    }
     
    CursosOficiales.remoteMethod(
        'resumen_total', 
        {
          accepts: [{arg: 'id_unidad', type: 'number', required: true},{arg: 'anio', type: 'number', required: true}],
          returns: {arg: 'data', type: 'array', root: true },
          http: {path: '/resumen_total', verb: 'get'}
        }
    );




    CursosOficiales.exporta_doc_preapertura_curso = function(idCurso, res, callback) {

            var fs = require('fs');
            var Docxtemplater = require('docxtemplater');


            CursosOficiales.find({ 
                        where: {idCurso: idCurso },
                        include: [
                            {
                                relation: 'unidad_pertenece',
                                scope: {
                                  fields:['idUnidadAdmtva','nombre','nombreDirector']
                                }
                            },
                            {
                              relation: 'catalogo_curso_pertenece',
                              scope: {
                                  fields:['idCatalogoCurso','idEspecialidad','perfilEgresado'],
                                  include:{
                                      relation: 'especialidad',
                                      scope: {
                                          fields:['idEspecialidad','nombre','campoFormacion']
                                      }
                                  }
                              }
                            },
                            {
                                relation: 'localidad_pertenece',
                                scope: {
                                  fields:['idLocalidad','nombre','municipio']
                                }
                            },
                            {
                              relation: 'instructor',
                              scope: {
                                  include:{
                                      relation: 'evaluacion_curso',
                                      scope: {
                                          fields:['id','idCatalogoCurso','calificacion']
                                      }
                                  }
                              }
                            }
                        ]
                    },
                    function(err, resultado) {

                            var CUrsoEncontrado = JSON.parse( JSON.stringify( resultado[0] ) );

                            var nombre_archivo = 'oficio_validacion_' + CUrsoEncontrado.unidad_pertenece.nombre + '_' + CUrsoEncontrado.nombreCurso;

                            var meses_nombre = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
                            var meses = ['01','02','03','04','05','06','07','08','09','10','11','12'];
                            //set the templateVariables
                            var fechaElaboracion = new Date();
                            var fechaInicio = new Date(CUrsoEncontrado.fechaInicio);
                            var fechaFin = new Date(CUrsoEncontrado.fechaFin);

                            var calificacion = '';
                            var idCatalogoCurso = CUrsoEncontrado.idCatalogoCurso;
                            for(var i=0; i < CUrsoEncontrado.instructor.evaluacion_curso.length; i++)
                            {
                                if(CUrsoEncontrado.instructor.evaluacion_curso[i].idCatalogoCurso == idCatalogoCurso)
                                {
                                    calificacion = CUrsoEncontrado.instructor.evaluacion_curso[i].calificacion;
                                    break;
                                }
                            }

                            var dirigido = '';
                            if(CUrsoEncontrado.publico == true)
                                dirigido = 'Público en general';
                            else
                                dirigido = 'Privado';

                            var codigo = {
                                "fecha_elaboracion"    : fechaElaboracion.getDate() +' de '+ meses_nombre[fechaElaboracion.getMonth()] +' de '+ fechaElaboracion.getUTCFullYear(),
                                "nombre_director"      : CUrsoEncontrado.unidad_pertenece.nombreDirector.toUpperCase(),
                                "nombre_unidad"        : CUrsoEncontrado.unidad_pertenece.nombre.toUpperCase(),
                                "nombre_curso"         : CUrsoEncontrado.nombreCurso.toUpperCase(),
                                "modalidad"            : CUrsoEncontrado.modalidad.toUpperCase(),
                                "campo_formacion"      : CUrsoEncontrado.catalogo_curso_pertenece.especialidad.campoFormacion,
                                "especialidad"         : CUrsoEncontrado.catalogo_curso_pertenece.especialidad.nombre,
                                "total_horas"          : CUrsoEncontrado.numeroHoras,
                                "fecha_inicio"         : fechaInicio.getDate() +'/'+ meses[fechaInicio.getMonth()] +'/'+ fechaInicio.getUTCFullYear(),
                                "fecha_fin"            : fechaFin.getDate() +'/'+ meses[fechaFin.getMonth()] +'/'+ fechaFin.getUTCFullYear(),
                                "horario"              : CUrsoEncontrado.horario,
                                "lugar_aplicacion"     : CUrsoEncontrado.aulaAsignada,
                                "nombre_instructor"    : CUrsoEncontrado.nombreInstructor,
                                "puntaje"              : calificacion,
                                "dirigido"             : dirigido
                            };

                            //console.log(codigo);
                            //console.log(idCatalogoCurso);
                            //console.log("**********************************************************************************************************");
                            //console.log(CUrsoEncontrado.instructor);
                            //console.log(CUrsoEncontrado.instructor.evaluacion_curso);
                            //Load the docx file as a binary
                            var content = fs.readFileSync(__dirname + "/../../templates/oficio_autorizacion_apertura_curso.docx", "binary");
                            var doc = new Docxtemplater(content);
                            doc.setData(codigo);
                            doc.render();
                            var buf = doc.getZip().generate({type:"nodebuffer"});

                            var datetime = new Date();
                            res.set('Expires', 'Tue, 03 Jul 2001 06:00:00 GMT');
                            res.set('Cache-Control', 'max-age=0, no-cache, must-revalidate, proxy-revalidate');
                            res.set('Last-Modified', datetime +'GMT');
                            res.set('Content-Type','application/force-download');
                            res.set('Content-Type','application/octet-stream');
                            res.set('Content-Type','application/download');
                            res.set('Content-Disposition','attachment;filename='+nombre_archivo+'.docx');
                            res.set('Content-Transfer-Encoding','binary');
                            res.send(buf);
                    });

    };

    CursosOficiales.remoteMethod(
    'exporta_doc_preapertura_curso',
    {
      accepts: [
        {arg: 'idCurso',   type: 'string', required: true },
        {arg: 'res', type: 'object', 'http': {source: 'res'}}
      ],
      returns: {},
      http: {path: '/exporta_doc_preapertura_curso/:idCurso', verb: 'get'}
    });



};
