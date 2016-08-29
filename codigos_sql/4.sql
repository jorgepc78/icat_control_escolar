/* REINICIAR LAS TABLAS DE DATOS DEL SISTEMA */
TRUNCATE bitacora.control_procesos RESTART IDENTITY;
TRUNCATE bitacora.destinatarios_avisos RESTART IDENTITY;

TRUNCATE catalogos.catalogo_localidades RESTART IDENTITY;
UPDATE catalogos.catalogo_unidades_admitivas SET consecutivo_unidad = 0;


TRUNCATE cursos_ofertados.capacitandos RESTART IDENTITY;
/*
DELETE FROM cursos_ofertados.capacitandos WHERE id_alumno > 5;
ALTER SEQUENCE cursos_ofertados.capacitandos_id_alumno_seq RESTART WITH 10;
*/
TRUNCATE cursos_ofertados.cursos_oficiales RESTART IDENTITY;
TRUNCATE cursos_ofertados.inscripcion_curso RESTART IDENTITY;

TRUNCATE estructura_cursos.catalogo_cursos RESTART IDENTITY;
TRUNCATE estructura_cursos.catalogo_especialidades RESTART IDENTITY;
TRUNCATE estructura_cursos.catalogo_temario_cursos RESTART IDENTITY;
TRUNCATE estructura_cursos.catalogo_temas RESTART IDENTITY;

TRUNCATE instructores.catalogo_instructores RESTART IDENTITY;
TRUNCATE instructores.rel_instruc_cat_curso RESTART IDENTITY;

TRUNCATE ptc.cursos_ptc RESTART IDENTITY;
TRUNCATE ptc.horas_asignadas_unidad RESTART IDENTITY;
TRUNCATE ptc.prog_trim_cursos RESTART IDENTITY;
TRUNCATE ptc.rel_instruc_ptc RESTART IDENTITY;

TRUNCATE public.accesstoken RESTART IDENTITY;
TRUNCATE public.rolemapping RESTART IDENTITY;
DELETE FROM public.rolemapping WHERE id > 1;
ALTER SEQUENCE public.rolemapping_id_seq RESTART WITH 2;


/* ACTUALIZAR LOS IDs Y LAS RELACIONES ENTRE TABLAS A PARTIR DE LOS IDs ANTERIORES */

/*ACTUALIZAR TEMA EN EL CATALOGO DE ESPECIALIDADES*/
UPDATE estructura_cursos.catalogo_especialidades SET id_tema = catalogo_temas.id_tema
FROM
estructura_cursos.catalogo_temas
WHERE
catalogo_especialidades.tema_anterior_id = catalogo_temas.id_anterior;

/*ACTUALIZAR ESPECIALIDAD EN EL CATALOGO DE CURSOS*/
UPDATE estructura_cursos.catalogo_cursos SET id_especialidad = catalogo_especialidades.id_especialidad
FROM
estructura_cursos.catalogo_especialidades
WHERE
catalogo_cursos.especialidad_id = catalogo_especialidades.id_anterior;

/* ACTUALIZAR EL ID DEL CATALOGO DE CURSOS EN LA TABLA DE CURSOS OFICIALES*/

UPDATE cursos_ofertados.cursos_oficiales SET
id_catalogo_curso = estructura_cursos.catalogo_cursos.id_catalogo_curso,
modalidad = estructura_cursos.catalogo_cursos.modalidad
FROM
estructura_cursos.catalogo_cursos
WHERE
cursos_ofertados.cursos_oficiales.catalogo_curso_id = estructura_cursos.catalogo_cursos.id_anterior;

UPDATE cursos_ofertados.cursos_oficiales SET
id_unidad_admtva = catalogos.catalogo_unidades_admitivas.id_unidad_admtva
FROM
catalogos.catalogo_unidades_admitivas
WHERE
cursos_ofertados.cursos_oficiales.unidad_pertenece_id = catalogos.catalogo_unidades_admitivas.id_anterior;

UPDATE cursos_ofertados.cursos_oficiales SET
id_localidad = catalogos.catalogo_localidades.id_localidad
FROM
catalogos.catalogo_localidades
WHERE
cursos_ofertados.cursos_oficiales.ciudad_pertenece_id = catalogos.catalogo_localidades.id_anterior;


UPDATE cursos_ofertados.inscripcion_curso SET id_curso = cursos_ofertados.cursos_oficiales.id_curso
FROM
cursos_ofertados.cursos_oficiales
WHERE
cursos_ofertados.inscripcion_curso.curso_id = cursos_ofertados.cursos_oficiales.id_anterior;

/* ACTUALIZACION DE LOS DATOS DEL ALUMNO */

/* PRIMERO ACTUALIZAMOS LA INSCRIPCION PARA OBTENER EL DATO DE LA UNIDAD */

UPDATE cursos_ofertados.inscripcion_curso SET id_alumno = cursos_ofertados.capacitandos.id_alumno
FROM
cursos_ofertados.capacitandos
WHERE
cursos_ofertados.inscripcion_curso.alumno_id = cursos_ofertados.capacitandos.id_anterior;

/* CREAMOS UNA TABLA TEMPORAL DE CAPACITANDOS */
CREATE TABLE cursos_ofertados.capacitandos_temp as SELECT * FROM cursos_ofertados.capacitandos ORDER BY id_alumno;

/* ACTUALIZAMOS LOS DATOS EN LA TABLA TEMPORAL */
UPDATE cursos_ofertados.capacitandos_temp SET id_unidad_admtva = a.id_unidad_admtva
FROM
(
SELECT
  MIN(cursos_ofertados.inscripcion_curso.id) AS min_id,
  cursos_ofertados.inscripcion_curso.id_alumno,
  cursos_ofertados.cursos_oficiales.id_unidad_admtva
FROM
  cursos_ofertados.cursos_oficiales
  INNER JOIN cursos_ofertados.inscripcion_curso ON (cursos_ofertados.cursos_oficiales.id_curso = cursos_ofertados.inscripcion_curso.id_curso)
GROUP BY
  cursos_ofertados.inscripcion_curso.id_alumno,
  cursos_ofertados.cursos_oficiales.id_unidad_admtva
ORDER BY
  cursos_ofertados.inscripcion_curso.id_alumno,
  min_id
) as a
WHERE cursos_ofertados.capacitandos_temp.id_alumno = a.id_alumno;

/* BORRAMOS LA TABLA ORIGINAL Y LA SUSTITUIMOS CON LA TEMPORAL PARA QUE SE GENERE L NUM DE CONTROL */

TRUNCATE cursos_ofertados.capacitandos RESTART IDENTITY;
INSERT INTO cursos_ofertados.capacitandos (SELECT * FROM cursos_ofertados.capacitandos_temp ORDER BY id_alumno);

SELECT (max(id_alumno)+1) AS num_siguiente FROM cursos_ofertados.capacitandos;

ALTER SEQUENCE cursos_ofertados.capacitandos_id_alumno_seq RESTART WITH 7950;

DROP TABLE cursos_ofertados.capacitandos_temp;

/* ACTUALIZACION DE LOS OTROS DATOS DEL ALUMNO */

UPDATE cursos_ofertados.capacitandos SET id_actividad = catalogos.catalogo_actividades.id_actividad
FROM
catalogos.catalogo_actividades
WHERE
cursos_ofertados.capacitandos.actividad_ant = catalogos.catalogo_actividades.valor;


UPDATE cursos_ofertados.capacitandos SET id_experiencia = catalogos.catalogo_experiencias.id_experiencia
FROM
catalogos.catalogo_experiencias
WHERE
cursos_ofertados.capacitandos.experiencia_ant = catalogos.catalogo_experiencias.valor;


UPDATE cursos_ofertados.capacitandos SET id_motivo = catalogos.catalogo_motivos.id_motivo
FROM
catalogos.catalogo_motivos
WHERE
cursos_ofertados.capacitandos.motivos_ant = catalogos.catalogo_motivos.valor;


/* ACTUALIZACION DE LOS DATOS DE INSCRIPCION */

UPDATE cursos_ofertados.inscripcion_curso SET id_alumno = cursos_ofertados.capacitandos.id_alumno
FROM
cursos_ofertados.capacitandos
WHERE
cursos_ofertados.inscripcion_curso.alumno_id = cursos_ofertados.capacitandos.id_anterior;