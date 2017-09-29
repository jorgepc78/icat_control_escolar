module.exports = function(CatalogoInstructores) {

    CatalogoInstructores.ef_ter_anio = function(id_instructor, cb) {
		
		var ds = CatalogoInstructores.dataSource;

		var sql = 'SELECT a.id_instructor, a.anio, a.total_alumnos, b.total_aprobados, round(((b.total_aprobados:: double PRECISION / a.total_alumnos:: double PRECISION) * 100)::numeric,2) as eficiencia_terminal '+
				  'FROM '+
				  '(SELECT cursos_ofertados.cursos_oficiales.id_instructor, EXTRACT(year FROM fecha_inicio) AS anio, count(cursos_ofertados.inscripcion_curso.id_alumno) as total_alumnos '+
				  'FROM cursos_ofertados.inscripcion_curso INNER JOIN cursos_ofertados.cursos_oficiales ON (cursos_ofertados.inscripcion_curso.id_curso = cursos_ofertados.cursos_oficiales.id_curso) '+
				  'WHERE EXTRACT(year FROM fecha_inicio) = EXTRACT(year FROM now()) AND cursos_ofertados.cursos_oficiales.id_instructor = '+id_instructor+' GROUP BY id_instructor, anio) as a, '+

				  '(SELECT EXTRACT(year FROM fecha_inicio) AS anio, count(cursos_ofertados.inscripcion_curso.id_alumno) as total_aprobados '+
				  'FROM cursos_ofertados.inscripcion_curso INNER JOIN cursos_ofertados.cursos_oficiales ON (cursos_ofertados.inscripcion_curso.id_curso = cursos_ofertados.cursos_oficiales.id_curso) '+
				  'WHERE EXTRACT(year FROM fecha_inicio) = EXTRACT(year FROM now()) AND cursos_ofertados.inscripcion_curso.calificacion = \'ACREDITADO\' AND cursos_ofertados.cursos_oficiales.id_instructor = '+id_instructor+' GROUP BY anio) as b';

		ds.connector.execute(sql, '', function(err, resultado) {
			if (err);
			cb(err, resultado);
		});

    }
     
    CatalogoInstructores.remoteMethod(
        'ef_ter_anio', 
        {
          accepts: {arg: 'id_instructor', type: 'number', required: true},
          returns: {arg: 'data', type: 'array', root: true },
          http: {path: '/ef_ter_anio', verb: 'get'}
        }
    );
};