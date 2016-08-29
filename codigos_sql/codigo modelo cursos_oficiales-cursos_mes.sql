SELECT a.id_unidad_admtva, a.anio,a.mes,
(CASE WHEN a.num_cursos is null THEN 0 ELSE a.num_cursos END) as num_cursos,
(CASE WHEN b.num_personas is null THEN 0 ELSE b.num_personas END) as num_personas,
(CASE WHEN c.num_personas_terminan is null THEN 0 ELSE c.num_personas_terminan END) as num_personas_terminan

FROM

(
SELECT
id_unidad_admtva,
EXTRACT(month FROM fecha_inicio) as mes,
EXTRACT(year FROM fecha_inicio) as anio,
COUNT(id_curso) as num_cursos
FROM cursos_ofertados.cursos_oficiales
WHERE estatus IN (2,4,5,6)
AND EXTRACT(month FROM fecha_inicio) IN(7,8)
AND EXTRACT(year FROM fecha_inicio) = 2016
GROUP BY id_unidad_admtva, anio, mes
) as a

LEFT JOIN

(
SELECT
  id_unidad_admtva,
  EXTRACT(month FROM fecha_inicio) as mes,
  EXTRACT(year FROM fecha_inicio) as anio,
  COUNT(id_alumno) AS num_personas
FROM
  cursos_ofertados.inscripcion_curso
  INNER JOIN cursos_ofertados.cursos_oficiales ON (cursos_ofertados.inscripcion_curso.id_curso = cursos_ofertados.cursos_oficiales.id_curso)
WHERE
  cursos_ofertados.inscripcion_curso.pagado > 0 AND cursos_ofertados.cursos_oficiales.estatus IN (2,4,5,6)
  AND EXTRACT(month FROM fecha_inicio) IN(7,8)
AND EXTRACT(year FROM fecha_inicio) = 2016

GROUP BY
  id_unidad_admtva, anio, mes
) as b
ON
a.id_unidad_admtva = b.id_unidad_admtva AND a.anio = b.anio AND a.mes = b.mes

LEFT JOIN

(
SELECT
  id_unidad_admtva,
  EXTRACT(month FROM fecha_inicio) as mes,
  EXTRACT(year FROM fecha_inicio) as anio,
  COUNT(id_alumno) AS num_personas_terminan
FROM
  cursos_ofertados.inscripcion_curso
  INNER JOIN cursos_ofertados.cursos_oficiales ON (cursos_ofertados.inscripcion_curso.id_curso = cursos_ofertados.cursos_oficiales.id_curso)
WHERE
  cursos_ofertados.inscripcion_curso.pagado > 0
  AND cursos_ofertados.inscripcion_curso.calificacion = 'ACREDITADO'
  AND cursos_ofertados.cursos_oficiales.estatus IN (2,4,5,6)
  AND EXTRACT(month FROM fecha_inicio) IN(7,8)
AND EXTRACT(year FROM fecha_inicio) = 2016

GROUP BY
  id_unidad_admtva, anio, mes
)as c
ON
a.id_unidad_admtva = c.id_unidad_admtva AND a.anio = c.anio AND a.mes = c.mes


WHERE a.id_unidad_admtva = 9
ORDER BY a.mes