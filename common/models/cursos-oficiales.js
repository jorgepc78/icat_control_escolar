module.exports = function(CursosOficiales) {

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
			codigo2 = 'WHERE a.id_unidad_admtva = '+id_unidad+' ';

		var sql = 'SELECT a.id_unidad_admtva, a.anio, a.mes, (CASE WHEN a.num_cursos is null THEN 0 ELSE a.num_cursos END) as num_cursos, (CASE WHEN b.num_personas is null THEN 0 ELSE b.num_personas END) as num_personas, (CASE WHEN c.num_personas_terminan is null THEN 0 ELSE c.num_personas_terminan END) as num_personas_terminan FROM '+
				  '(SELECT id_unidad_admtva, EXTRACT(year FROM fecha_inicio) as anio, EXTRACT(month FROM fecha_inicio) as mes, COUNT(id_curso) as num_cursos '+
				  'FROM cursos_ofertados.cursos_oficiales WHERE estatus IN (2,4,5,6) '+codigo+'AND EXTRACT(year FROM fecha_inicio) = '+anio+' GROUP BY id_unidad_admtva, anio, mes) as a '+
				  ' LEFT JOIN '+
				  '(SELECT id_unidad_admtva, EXTRACT(month FROM fecha_inicio) as mes, EXTRACT(year FROM fecha_inicio) as anio, COUNT(id_alumno) AS num_personas '+
				  'FROM cursos_ofertados.inscripcion_curso INNER JOIN cursos_ofertados.cursos_oficiales ON (cursos_ofertados.inscripcion_curso.id_curso = cursos_ofertados.cursos_oficiales.id_curso) '+
				  'WHERE cursos_ofertados.inscripcion_curso.pagado > 0 AND cursos_ofertados.cursos_oficiales.estatus IN (2,4,5,6) '+codigo+'AND EXTRACT(year FROM fecha_inicio) = '+anio+' GROUP BY id_unidad_admtva, anio, mes) as b '+
				  'ON a.id_unidad_admtva = b.id_unidad_admtva AND a.anio = b.anio AND a.mes = b.mes '+
				  'LEFT JOIN '+
				  '(SELECT id_unidad_admtva, EXTRACT(month FROM fecha_inicio) as mes, EXTRACT(year FROM fecha_inicio) as anio, COUNT(id_alumno) AS num_personas_terminan '+
				  'FROM cursos_ofertados.inscripcion_curso INNER JOIN cursos_ofertados.cursos_oficiales ON (cursos_ofertados.inscripcion_curso.id_curso = cursos_ofertados.cursos_oficiales.id_curso) '+
				  'WHERE cursos_ofertados.inscripcion_curso.pagado > 0 AND cursos_ofertados.inscripcion_curso.calificacion = \'ACREDITADO\' AND cursos_ofertados.cursos_oficiales.estatus IN (2,4,5,6) '+codigo+
				  'AND EXTRACT(year FROM fecha_inicio) = '+anio+' GROUP BY id_unidad_admtva, anio, mes)as c	ON a.id_unidad_admtva = c.id_unidad_admtva AND a.anio = c.anio AND a.mes = c.mes '+
				  codigo2+'ORDER BY a.mes';

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


    CursosOficiales.resumen_total = function(id_unidad, anio, cb) {
		
		var ds = CursosOficiales.dataSource;

		var codigo = '';
		
		if(id_unidad == 0)
			codigo = 'id_unidad_admtva >= 0';
		else
			codigo = 'id_unidad_admtva = '+id_unidad+' ';

		var sql = 'SELECT a.id_unidad_admtva, (CASE WHEN a.total_inscritos is null THEN 0 ELSE a.total_inscritos END) as total_inscritos, (CASE WHEN b.num_cursos is null THEN 0 ELSE b.num_cursos END) as num_cursos, (CASE WHEN c.num_personas_inscritas is null THEN 0 ELSE c.num_personas_inscritas END) as num_personas_inscritas FROM '+
					'(SELECT id_unidad_admtva, COUNT(id_alumno) as total_inscritos FROM cursos_ofertados.capacitandos WHERE '+codigo+' AND EXTRACT(year FROM fecha_registro) = '+anio+' GROUP BY id_unidad_admtva) as a '+
					'LEFT JOIN '+
					'(SELECT id_unidad_admtva, COUNT(id_curso) as num_cursos FROM cursos_ofertados.cursos_oficiales WHERE '+codigo+' AND estatus IN (2,4,5,6) AND EXTRACT(year FROM fecha_inicio) = '+anio+' GROUP BY id_unidad_admtva) as b ON a.id_unidad_admtva = b.id_unidad_admtva '+
					'LEFT JOIN '+
					'(SELECT id_unidad_admtva, COUNT(num_personas) as num_personas_inscritas FROM '+
					'(SELECT DISTINCT id_unidad_admtva, EXTRACT(year FROM fecha_inicio) AS anio, (id_alumno) AS num_personas FROM cursos_ofertados.inscripcion_curso INNER JOIN cursos_ofertados.cursos_oficiales '+
					'ON (cursos_ofertados.inscripcion_curso.id_curso = cursos_ofertados.cursos_oficiales.id_curso) WHERE '+codigo+' AND pagado > 0 AND EXTRACT(year FROM fecha_inicio) = '+anio+')as x '+
					'GROUP BY id_unidad_admtva) as c '+
					'ON a.id_unidad_admtva = c.id_unidad_admtva';

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

};
