module.exports = function(CursosOficiales) {

    CursosOficiales.cursos_mes = function(anio, meses, cb) {
		
		var ds = CursosOficiales.dataSource;
		var sql = 'SELECT a.anio, a.mes, a.num_cursos, b.num_personas FROM '+
				  '(SELECT EXTRACT(year FROM fecha_inicio) as anio, EXTRACT(month FROM fecha_inicio) as mes, COUNT(id_curso) as num_cursos '+
				  'FROM cursos_ofertados.cursos_oficiales WHERE estatus IN (2,4,5,6) AND EXTRACT(month FROM fecha_inicio) IN ('+meses+') AND EXTRACT(year FROM fecha_inicio) = '+anio+' GROUP BY anio, mes) as a '+
				  ' LEFT JOIN '+
				  '(SELECT EXTRACT(month FROM fecha_inicio) as mes, EXTRACT(year FROM fecha_inicio) as anio, COUNT(id_alumno) AS num_personas '+
				  'FROM cursos_ofertados.inscripcion_curso INNER JOIN cursos_ofertados.cursos_oficiales ON (cursos_ofertados.inscripcion_curso.id_curso = cursos_ofertados.cursos_oficiales.id_curso) '+
				  'WHERE cursos_ofertados.inscripcion_curso.pagado > 0 AND cursos_ofertados.cursos_oficiales.estatus IN (2,4,5,6) AND EXTRACT(month FROM fecha_inicio) IN ('+meses+') AND EXTRACT(year FROM fecha_inicio) = '+anio+' GROUP BY anio, mes) as b '+
				  'ON a.anio = b.anio AND a.mes = b.mes ORDER BY a.mes';

		ds.connector.execute(sql, '', function(err, resultado) {
			if (err);
			cb(err, resultado);
		});

    }
     
    CursosOficiales.remoteMethod(
        'cursos_mes', 
        {
          accepts: [{arg: 'anio', type: 'number', required: true},{arg: 'meses', type: 'string', required: true}],
          returns: {arg: 'data', type: 'array', root: true },
          http: {path: '/cursos_mes', verb: 'get'}
        }
    );

};
