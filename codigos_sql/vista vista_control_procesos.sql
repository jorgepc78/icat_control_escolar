CREATE VIEW bitacora.vista_control_procesos AS

SELECT
  bitacora.control_procesos.id,
  bitacora.control_procesos.identificador,
  bitacora.control_procesos.proceso,
  bitacora.control_procesos.accion,
  bitacora.control_procesos.id_documento,
  (CASE
  	WHEN ptc.prog_trim_cursos.trimestre = 1 THEN 'PRIMER TRIMESTRE'
    WHEN ptc.prog_trim_cursos.trimestre = 2 THEN 'SEGUNDO TRIMESTRE'
    WHEN ptc.prog_trim_cursos.trimestre = 3 THEN 'TERCER TRIMESTRE'
    WHEN ptc.prog_trim_cursos.trimestre = 4 THEN 'CUARTO TRIMESTRE' END
  ) || ' DEL '||ptc.prog_trim_cursos.anio AS documento,
  bitacora.control_procesos.fecha_generacion,
  bitacora.control_procesos.id_usuario,
  bitacora.control_procesos.id_unidad_admtva
FROM
  ptc.prog_trim_cursos
  INNER JOIN bitacora.control_procesos ON (ptc.prog_trim_cursos.id_ptc = bitacora.control_procesos.id_documento)
WHERE
  bitacora.control_procesos.proceso = 'PTC'

UNION

  SELECT
  bitacora.control_procesos.id,
  bitacora.control_procesos.identificador,
  bitacora.control_procesos.proceso,
  bitacora.control_procesos.accion,
  bitacora.control_procesos.id_documento,
  'CURSO: '|| cursos_ofertados.cursos_oficiales.nombre_curso ||' ('||cursos_ofertados.cursos_oficiales.clave_curso||'), DEL '||
  ((CASE
  	WHEN ptc.prog_trim_cursos.trimestre = 1 THEN 'PRIMER TRIMESTRE'
    WHEN ptc.prog_trim_cursos.trimestre = 2 THEN 'SEGUNDO TRIMESTRE'
    WHEN ptc.prog_trim_cursos.trimestre = 3 THEN 'TERCER TRIMESTRE'
    WHEN ptc.prog_trim_cursos.trimestre = 4 THEN 'CUARTO TRIMESTRE' END
  ) || ' DEL '||ptc.prog_trim_cursos.anio) as documento,
  bitacora.control_procesos.fecha_generacion,
  bitacora.control_procesos.id_usuario,
  bitacora.control_procesos.id_unidad_admtva

FROM
  cursos_ofertados.cursos_oficiales
  INNER JOIN bitacora.control_procesos ON (cursos_ofertados.cursos_oficiales.id_curso = bitacora.control_procesos.id_documento)
  INNER JOIN ptc.prog_trim_cursos ON (cursos_ofertados.cursos_oficiales.id_ptc = ptc.prog_trim_cursos.id_ptc)
WHERE
  bitacora.control_procesos.proceso <> 'PTC'

ORDER BY fecha_generacion DESC, id_usuario ASC;