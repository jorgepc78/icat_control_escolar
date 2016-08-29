SELECT a.id_unidad_admtva,
(CASE WHEN a.total_inscritos is null THEN 0 ELSE a.total_inscritos END) as total_inscritos,
(CASE WHEN b.num_cursos is null THEN 0 ELSE b.num_cursos END) as num_cursos,
(CASE WHEN c.num_personas_inscritas is null THEN 0 ELSE c.num_personas_inscritas END) as num_personas_inscritas

FROM

(
SELECT id_unidad_admtva, COUNT(id_alumno) as total_inscritos FROM cursos_ofertados.capacitandos
WHERE id_unidad_admtva >= 0
AND EXTRACT(year FROM fecha_registro) = 2016
GROUP BY id_unidad_admtva
) as a

LEFT JOIN

(
SELECT id_unidad_admtva, COUNT(id_curso) as num_cursos FROM cursos_ofertados.cursos_oficiales
WHERE estatus IN (2,4,5,6)
AND id_unidad_admtva >= 0
AND EXTRACT(year FROM fecha_inicio) = 2016
GROUP BY id_unidad_admtva
) as b
ON a.id_unidad_admtva = b.id_unidad_admtva

LEFT JOIN
(SELECT id_unidad_admtva, COUNT(num_personas) as num_personas_inscritas
FROM
(
SELECT DISTINCT
  id_unidad_admtva,
  EXTRACT(year FROM fecha_inicio) AS anio,
  (id_alumno) AS num_personas
FROM
  cursos_ofertados.inscripcion_curso
  INNER JOIN cursos_ofertados.cursos_oficiales ON (cursos_ofertados.inscripcion_curso.id_curso = cursos_ofertados.cursos_oficiales.id_curso)
WHERE
  pagado > 0
  AND EXTRACT(year FROM fecha_inicio) = 2016
  AND id_unidad_admtva >= 0
)as x
GROUP BY id_unidad_admtva
) as c
ON a.id_unidad_admtva = c.id_unidad_admtva