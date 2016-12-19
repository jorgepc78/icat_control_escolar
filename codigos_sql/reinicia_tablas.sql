/* REINICIAR LAS TABLAS DE DATOS DEL SISTEMA */

/*TRUNCATE catalogos.catalogo_localidades RESTART IDENTITY;*/


/*
DELETE FROM cursos_ofertados.capacitandos WHERE id_alumno > 5;
ALTER SEQUENCE cursos_ofertados.capacitandos_id_alumno_seq RESTART WITH 10;
*/

/*
TRUNCATE estructura_cursos.catalogo_cursos RESTART IDENTITY;
TRUNCATE estructura_cursos.catalogo_especialidades RESTART IDENTITY;
TRUNCATE estructura_cursos.catalogo_temario_cursos RESTART IDENTITY;
TRUNCATE estructura_cursos.catalogo_temas RESTART IDENTITY;
*/


/*
TRUNCATE instructores.catalogo_instructores RESTART IDENTITY;
TRUNCATE instructores.rel_instruc_cat_curso RESTART IDENTITY;
TRUNCATE instructores.rel_instruc_unidad RESTART IDENTITY;
*/

TRUNCATE bitacora.control_procesos RESTART IDENTITY;
TRUNCATE bitacora.destinatarios_avisos RESTART IDENTITY;
UPDATE catalogos.catalogo_unidades_admitivas SET consecutivo_unidad = 0;

TRUNCATE ptc.cursos_ptc RESTART IDENTITY;
TRUNCATE ptc.horas_asignadas_unidad RESTART IDENTITY;
TRUNCATE ptc.prog_trim_cursos RESTART IDENTITY;
TRUNCATE ptc.rel_instruc_ptc RESTART IDENTITY;
TRUNCATE public.accesstoken RESTART IDENTITY;

TRUNCATE cursos_ofertados.evaluaciones RESTART IDENTITY;
TRUNCATE cursos_ofertados.inscripcion_evaluaciones RESTART IDENTITY;

/* tablas que se actualizan del otro sistema */
TRUNCATE cursos_ofertados.capacitandos RESTART IDENTITY;
TRUNCATE cursos_ofertados.cursos_oficiales RESTART IDENTITY;
TRUNCATE cursos_ofertados.inscripcion_curso RESTART IDENTITY;





/*
TRUNCATE public.rolemapping RESTART IDENTITY;
DELETE FROM public.rolemapping WHERE id > 1;
ALTER SEQUENCE public.rolemapping_id_seq RESTART WITH 2;
*/

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


/* ACTUALIZACION DE LOS OTROS DATOS DEL ALUMNO */

UPDATE cursos_ofertados.capacitandos_temp SET id_actividad = catalogos.catalogo_actividades.id_actividad
FROM
catalogos.catalogo_actividades
WHERE
cursos_ofertados.capacitandos_temp.actividad_ant = catalogos.catalogo_actividades.valor;


UPDATE cursos_ofertados.capacitandos_temp SET id_experiencia = catalogos.catalogo_experiencias.id_experiencia
FROM
catalogos.catalogo_experiencias
WHERE
cursos_ofertados.capacitandos_temp.experiencia_ant = catalogos.catalogo_experiencias.valor;


UPDATE cursos_ofertados.capacitandos_temp SET id_motivo = catalogos.catalogo_motivos.id_motivo
FROM
catalogos.catalogo_motivos
WHERE
cursos_ofertados.capacitandos_temp.motivos_ant = catalogos.catalogo_motivos.valor;



/*SELECT DISTINCT localidad_ant FROM cursos_ofertados.capacitandos ORDER BY localidad_ant;*/


/* ACTUALIZACION DE LOS OTROS DATOS DEL CAPACITADO */

UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 2 WHERE estudios_ant = 'PRIMARAI';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 2 WHERE estudios_ant = 'PRIMARI';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 2 WHERE estudios_ant = 'primaria';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 2 WHERE estudios_ant = 'Primaria';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 2 WHERE estudios_ant = 'PRIMARIA';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 2 WHERE estudios_ant = 'PRIMARIA I.';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 2 WHERE estudios_ant = 'PRIMARIA IN CONCLUSA';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 2 WHERE estudios_ant = 'PRIMARIA INCLONCLUSA';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 2 WHERE estudios_ant = 'PRIMARIA INCONCLUSA';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 2 WHERE estudios_ant = 'PRIPARIA';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 3 WHERE estudios_ant = 'SECUNDARIA TRUNCA';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 4 WHERE estudios_ant = 'SECNDARI';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 4 WHERE estudios_ant = 'SECNDARIA';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 4 WHERE estudios_ant = 'SECRETARIA';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 4 WHERE estudios_ant = 'SECRETARIA EJECUTIVA';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 4 WHERE estudios_ant = 'SECRETARIADO';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 4 WHERE estudios_ant = 'SECUANDARIA';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 4 WHERE estudios_ant = 'SECUBDARIA';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 4 WHERE estudios_ant = 'SECUDARIA';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 4 WHERE estudios_ant = 'SECUENDARIA';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 4 WHERE estudios_ant = 'SECUNADARIA';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 4 WHERE estudios_ant = 'secundaria';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 4 WHERE estudios_ant = 'SECUNDARIA';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 4 WHERE estudios_ant = 'SECUNDARÍA';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 4 WHERE estudios_ant = 'SECUNDARIA |';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 4 WHERE estudios_ant = 'SECUNDARIA.';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 4 WHERE estudios_ant = 'SECUNDARIAA';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 4 WHERE estudios_ant = 'SECUNDARIO';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 4 WHERE estudios_ant = 'SECUNDARIS';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 4 WHERE estudios_ant = 'SECUNNDARIA';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 4 WHERE estudios_ant = 'SENCUNDARIA';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 4 WHERE estudios_ant = 'SEUNDARIA';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 4 WHERE estudios_ant = 'SEVNDARIA';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 4 WHERE estudios_ant = 'TELESECUNDARIA';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 5 WHERE estudios_ant = '2 SEMESTRE PREPARATORIA';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 5 WHERE estudios_ant = '2DO SEMESTRE PREPARATORIA';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 6 WHERE estudios_ant = 'bacchillerato';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 6 WHERE estudios_ant = 'BACHIILLERATO';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 6 WHERE estudios_ant = 'BACHILERATO';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 6 WHERE estudios_ant = 'BACHILLER';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 6 WHERE estudios_ant = 'BACHILLERATA';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 6 WHERE estudios_ant = 'bachillerato';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 6 WHERE estudios_ant = 'Bachillerato';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 6 WHERE estudios_ant = 'BACHILLERATO';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 6 WHERE estudios_ant = 'bachillerato tecnologico en el area economico-administrativa';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 6 WHERE estudios_ant = 'BACHILLERES';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 6 WHERE estudios_ant = 'BACHILLRES';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 6 WHERE estudios_ant = 'BAHCILLER';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 6 WHERE estudios_ant = 'BECHILLERES';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 6 WHERE estudios_ant = 'MEDIO SUPERIOR';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 6 WHERE estudios_ant = 'PR4EPARATORIA';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 6 WHERE estudios_ant = 'PREARATORIA';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 6 WHERE estudios_ant = 'PREPA';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 6 WHERE estudios_ant = 'PREPARATOPRIA';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 6 WHERE estudios_ant = 'preparatoria';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 6 WHERE estudios_ant = 'Preparatoria';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 6 WHERE estudios_ant = 'PREPARATORIA';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 6 WHERE estudios_ant = 'PREPARATORIA INCOMPLETA';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 6 WHERE estudios_ant = 'PREPARATORIA INCONCLUSA';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 6 WHERE estudios_ant = 'PREPARATORIA TECNICA';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 6 WHERE estudios_ant = 'PREPARATORIO';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 6 WHERE estudios_ant = 'PREPARATRIA';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 6 WHERE estudios_ant = 'PREPARTAORIA';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 6 WHERE estudios_ant = 'PREPARTORIA';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 6 WHERE estudios_ant = 'PREPRARATORIA';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 6 WHERE estudios_ant = 'PREPRATORIA';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 7 WHERE estudios_ant = 'CARRERA';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 7 WHERE estudios_ant = 'CONTADOR';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 7 WHERE estudios_ant = 'CONTADOR FISCAL';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 7 WHERE estudios_ant = 'CONTADOR PRIVADO';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 7 WHERE estudios_ant = 'ENFERMERIA TECNICA';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 7 WHERE estudios_ant = 'INGENERIO AGRONOMO';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 7 WHERE estudios_ant = 'INGENIERIA';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 7 WHERE estudios_ant = 'INGENIERO AGRONOMO';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 7 WHERE estudios_ant = 'INGENIERO CIVIL';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 7 WHERE estudios_ant = 'NIVEL SUPERIOR';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 7 WHERE estudios_ant = 'UNIVERSIDAD';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 7 WHERE estudios_ant = 'UNIVERSITARIO';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 7 WHERE estudios_ant = 'UNIVERSITARIOS';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 7 WHERE estudios_ant = 'UNIVESIDAD';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 7 WHERE estudios_ant = 'UNVERSIDAD';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 8 WHERE estudios_ant = 'LIC EN EDUCACION PRIMARIA';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 8 WHERE estudios_ant = 'LIC EN SISTEMAS';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 8 WHERE estudios_ant = 'LIC EN SISTEMAS COMERCIALES';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 8 WHERE estudios_ant = 'LIC. EN DERECHO';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 8 WHERE estudios_ant = 'LIC. EN SISTEMAS COMERCIALES';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 8 WHERE estudios_ant = 'LIC. PRESCOLAR';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 8 WHERE estudios_ant = 'LIC.CONDURIA';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 8 WHERE estudios_ant = 'LICANCIATURA';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 8 WHERE estudios_ant = 'LICENCATURA';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 8 WHERE estudios_ant = 'LICENCENCIATURA';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 8 WHERE estudios_ant = 'LICENCIADA';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 8 WHERE estudios_ant = 'LICENCIADA EN EDUCACION';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 8 WHERE estudios_ant = 'LICENCIADO EN SISTEMA COMERCIALES';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 8 WHERE estudios_ant = 'LICENCIATRA';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 8 WHERE estudios_ant = 'licenciatura';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 8 WHERE estudios_ant = 'LICENCIATURA';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 8 WHERE estudios_ant = 'LICENCIATURA EN ADMINISTRACIÓN';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 8 WHERE estudios_ant = 'LICENCIATURA EN CONTADOR PUBLICO';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 8 WHERE estudios_ant = 'LICENCIATURA EN EDUCACION';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 8 WHERE estudios_ant = 'LICENCIATURA|';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 8 WHERE estudios_ant = 'LIECNCIATURA';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 8 WHERE estudios_ant = 'LUCENCIATURA';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 8 WHERE estudios_ant = 'PSICOLOGO';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 9 WHERE estudios_ant = 'DOCTORADO';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 9 WHERE estudios_ant = 'MAESTRA EN EDUCACION FISICA';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 9 WHERE estudios_ant = 'MAESTRIA';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 9 WHERE estudios_ant = 'MAESTRIA NORMALISTA';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 9 WHERE estudios_ant = 'MASTERIA';
UPDATE cursos_ofertados.capacitandos_temp SET id_nivel_estudios = 9 WHERE estudios_ant = 'MESTRIA';

UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 1 WHERE localidad_ant = 'cancun';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 1 WHERE localidad_ant = 'CANCUN';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 1 WHERE localidad_ant = 'CANCUN Q.ROO';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 1 WHERE localidad_ant = 'BENITO JUAREZ';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 1 WHERE localidad_ant = 'VILLAS DEL SOL';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 2 WHERE localidad_ant = 'PLAYA DEL CAREMEN';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 2 WHERE localidad_ant = 'PLAYA DEL CARMEN';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 2 WHERE localidad_ant = 'PLYA DEL CAREMEN';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 2 WHERE localidad_ant = 'SOLIDARIDAD';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 3 WHERE localidad_ant = 'JOSÉ MARÍA MORELOS';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 4 WHERE localidad_ant = 'tulum';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 4 WHERE localidad_ant = 'TULUM';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 5 WHERE localidad_ant = 'cozumel';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 5 WHERE localidad_ant = 'COZUMEL';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 5 WHERE localidad_ant = 'COZUMEL, QROO';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 5 WHERE localidad_ant = 'COZUMRL';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 5 WHERE localidad_ant = 'CZUMEL';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 6 WHERE localidad_ant = 'ISLA MUJERES';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 7 WHERE localidad_ant = 'KANTUNIKIN';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 7 WHERE localidad_ant = 'KANTUNILIKIN';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 7 WHERE localidad_ant = 'KANTUNILKIN';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 8 WHERE localidad_ant = 'chetumal';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 8 WHERE localidad_ant = 'Chetumal';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 8 WHERE localidad_ant = 'CHETUMAL';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 8 WHERE localidad_ant = 'OTHON P BLANO';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 9 WHERE localidad_ant = 'Bacalar';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 9 WHERE localidad_ant = 'BACALAR';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 10 WHERE localidad_ant = 'FELIPE CARRILLO PUERTO';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 11 WHERE localidad_ant = 'PUERTO  MORELOS';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 11 WHERE localidad_ant = 'puerto morelos';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 11 WHERE localidad_ant = 'PUERTO MORELOS';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 11 WHERE localidad_ant = 'PURTO MORELOS';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 12 WHERE localidad_ant = 'bonfil';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 13 WHERE localidad_ant = 'LEONA VICARIO';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 13 WHERE localidad_ant = 'LEONA VICCARIO';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 14 WHERE localidad_ant = 'PUERTO AVENTURAS';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 15 WHERE localidad_ant = 'DZIUCHE';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 16 WHERE localidad_ant = 'CHUNHUHUB';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 16 WHERE localidad_ant = 'CHUNHUHUN';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 17 WHERE localidad_ant = 'señor';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 17 WHERE localidad_ant = 'SEÑOR';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 17 WHERE localidad_ant = 'SEÑOR QUINTANA ROO';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 18 WHERE localidad_ant = 'tepich';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 18 WHERE localidad_ant = 'TEPICH';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 19 WHERE localidad_ant = 'TIHOSUCO';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 20 WHERE localidad_ant = 'CALDERITAS';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 21 WHERE localidad_ant = 'NICOLAS BRAVO';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 22 WHERE localidad_ant = 'JAVIER ROJO GOMEZ';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 22 WHERE localidad_ant = 'JAVIER ROJO GÓMEZ';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 22 WHERE localidad_ant = 'POBLADO JAVIER ROJO GÓMEZ';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 23 WHERE localidad_ant = 'ALVARO OBREGON';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 24 WHERE localidad_ant = 'LIMONES';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 27 WHERE localidad_ant = 'ANDRES Q,ROO';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 27 WHERE localidad_ant = 'ANDRES, QROO';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 31 WHERE localidad_ant = 'BUENA ESPERANZA';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 33 WHERE localidad_ant = 'CAAN LUMIL';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 33 WHERE localidad_ant = 'CAANLUMIL';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 35 WHERE localidad_ant = 'CHACCHOBEN';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 39 WHERE localidad_ant = 'DAVID GUSTAVO GUTIERREZ';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 44 WHERE localidad_ant = 'EL PARAISO';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 45 WHERE localidad_ant = 'EL PROGRESO';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 45 WHERE localidad_ant = 'ELPROGRESO';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 49 WHERE localidad_ant = 'GUADALUPE VICTORIA';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 51 WHERE localidad_ant = 'HUATUSCO';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 56 WHERE localidad_ant = 'BUENA FE';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 57 WHERE localidad_ant = 'LA CEIBA';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 59 WHERE localidad_ant = 'PANTERA';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 63 WHERE localidad_ant = 'LOS DIVORCIADOS';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 65 WHERE localidad_ant = 'MARGARITA MAZA DE JUAREZ';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 70 WHERE localidad_ant = 'NOH-BEC';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 71 WHERE localidad_ant = 'NUEVO JERUSALEN';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 78 WHERE localidad_ant = 'RIO ESCONDIDO';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 79 WHERE localidad_ant = 'RIO VERDE';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 81 WHERE localidad_ant = 'SAN FERNANDO';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 81 WHERE localidad_ant = 'SAN FERNANDOI';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 81 WHERE localidad_ant = 'SAN FRANCISCO';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 82 WHERE localidad_ant = 'SA ISIDRO LA LAGUNA';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 82 WHERE localidad_ant = 'SAN ISDRO LA LAGUNA';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 82 WHERE localidad_ant = 'SAN ISIDRO LA  LAGUNA';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 82 WHERE localidad_ant = 'SAN ISIDRO LA LAGUANA';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 82 WHERE localidad_ant = 'SAN ISIDRO LA LAGUNA';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 96 WHERE localidad_ant = 'NUEVO  JERUSALEN';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 106 WHERE localidad_ant = 'SAN LORENZO';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 109 WHERE localidad_ant = 'BETANIA';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 114 WHERE localidad_ant = 'CHAN SANTA CRUZ FELIPE CARRILO PUERTO';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 122 WHERE localidad_ant = 'CHUNHUAS';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 127 WHERE localidad_ant = 'AGUA  AZUL';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 127 WHERE localidad_ant = 'AGUA AZUL';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 127 WHERE localidad_ant = 'DZULA';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 128 WHERE localidad_ant = 'EMILIANO ZAPATA';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 130 WHERE localidad_ant = 'FILOMEMENO MATA';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 130 WHERE localidad_ant = 'FILOMENO MATA';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 147 WHERE localidad_ant = 'NUEVO ISRAEL';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 150 WHERE localidad_ant = 'POLYUC';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 151 WHERE localidad_ant = 'PRESIDENTE JUÁREZ';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 154 WHERE localidad_ant = 'REFORMA AGRARIA';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 154 WHERE localidad_ant = 'REFORMA AGRARÍA';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 156 WHERE localidad_ant = 'SAN ANTONIO NUEVO';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 178 WHERE localidad_ant = 'TIZIC';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 178 WHERE localidad_ant = 'TUZIC';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 178 WHERE localidad_ant = 'TUZIZ';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 179 WHERE localidad_ant = 'UH MAY';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 179 WHERE localidad_ant = 'UH- MAY';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 179 WHERE localidad_ant = 'UHMAY';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 179 WHERE localidad_ant = 'UH-MAY';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 182 WHERE localidad_ant = 'X- HAZIL SUR';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 182 WHERE localidad_ant = 'X-HAZIL';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 182 WHERE localidad_ant = 'X-HAZIL SUR';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 184 WHERE localidad_ant = 'XPICHIL';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 189 WHERE localidad_ant = 'YAXLEY';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 208 WHERE localidad_ant = 'DOS AGUADAS';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 208 WHERE localidad_ant = 'DOS AGUADAS, JMM';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 225 WHERE localidad_ant = 'LA PRESUMIDA';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 226 WHERE localidad_ant = 'LAZARO CARDENAS';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 258 WHERE localidad_ant = 'SANTA GERTRUDIS';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 265 WHERE localidad_ant = 'X-CABIL';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 272 WHERE localidad_ant = 'CHIQUILA';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 274 WHERE localidad_ant = 'CRISTOBAL COLON';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 275 WHERE localidad_ant = 'DELIRIOS';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 275 WHERE localidad_ant = 'DLEIRIOS';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 277 WHERE localidad_ant = 'EL IDEAL';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 283 WHERE localidad_ant = 'HEROES DE NACOZARI';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 283 WHERE localidad_ant = 'HEROES NACOZARI';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 285 WHERE localidad_ant = 'IGNACIO ZARAGOZA';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 286 WHERE localidad_ant = 'COMUNIDAD DE JUAREZ';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 286 WHERE localidad_ant = 'COMUNIDAD JUAREZ';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 288 WHERE localidad_ant = 'NUEVO DURANGO';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 289 WHERE localidad_ant = 'VALALDOLID NUEVO';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 289 WHERE localidad_ant = 'VALLADOLID';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 289 WHERE localidad_ant = 'VALLADOLID NUEVO';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 290 WHERE localidad_ant = 'NUEVO XCAN';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 294 WHERE localidad_ant = 'SAN COSME';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 297 WHERE localidad_ant = 'SAN JUAN DE DIOS';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 299 WHERE localidad_ant = 'SAN  MARTINIANO';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 299 WHERE localidad_ant = 'SAN MARTINIANO';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 302 WHERE localidad_ant = 'SOLFERINO';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 303 WHERE localidad_ant = 'TRES AMRIAS';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 303 WHERE localidad_ant = 'TRES MARIAS';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 305 WHERE localidad_ant = 'VICENTE GUERRERO';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 306 WHERE localidad_ant = 'ALLENDE';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 312 WHERE localidad_ant = 'CACAO';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 316 WHERE localidad_ant = 'CARLOS A. MADRAZO';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 322 WHERE localidad_ant = 'COCOYOL';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 327 WHERE localidad_ant = 'EL CEDRAL';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 340 WHERE localidad_ant = 'JESUS GONZALEZ ORTEGA';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 342 WHERE localidad_ant = 'ROVIROSA';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 348 WHERE localidad_ant = 'UNION';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 358 WHERE localidad_ant = 'LUIS ECHEVERRIA';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 374 WHERE localidad_ant = 'PALMAR';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 375 WHERE localidad_ant = 'PEDRO JOAQUIN COLDWELL';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 375 WHERE localidad_ant = 'PEDRO JOQUIN COLDWELL';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 377 WHERE localidad_ant = 'LAGUNA PUCTE';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 377 WHERE localidad_ant = 'PUCTE';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 377 WHERE localidad_ant = 'PUCTÉ';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 379 WHERE localidad_ant = 'RAMONAL';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 384 WHERE localidad_ant = 'SABIDOS';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 385 WHERE localidad_ant = 'SACXAN';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 389 WHERE localidad_ant = 'SANTA ROSA';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 389 WHERE localidad_ant = 'SANTA ROSA, CAMPECHE';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 391 WHERE localidad_ant = 'BUTRON';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 392 WHERE localidad_ant = 'POBLADO SUBTENIENTE LÓPEZ';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 392 WHERE localidad_ant = 'SUBTENIENTE LOPEZ';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 395 WHERE localidad_ant = 'TRES GARANTIAS';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 396 WHERE localidad_ant = 'UCUM';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 401 WHERE localidad_ant = 'VERACRUZ';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 404 WHERE localidad_ant = 'XUL- HA';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 404 WHERE localidad_ant = 'XULHA';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 422 WHERE localidad_ant = 'AKUMAL';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 426 WHERE localidad_ant = 'CHEMUYIL';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 427 WHERE localidad_ant = 'COBA';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 428 WHERE localidad_ant = 'FRANCISCO HU MAY';
UPDATE cursos_ofertados.capacitandos_temp SET id_localidad = 432 WHERE localidad_ant = 'MACARIO GOMEZ';

/* ACTUALIZAMOS LA UNIDAD ADMINISTRATIVA RESTANTE A TRAVES DE LA LOCALIDAD */

UPDATE cursos_ofertados.capacitandos_temp SET id_unidad_admtva = a.id_unidad_admtva
FROM
(
SELECT
  cursos_ofertados.capacitandos_temp.id_alumno,
  catalogos.catalogo_localidades.id_unidad_admtva
FROM
  catalogos.catalogo_localidades
  INNER JOIN cursos_ofertados.capacitandos_temp ON (catalogos.catalogo_localidades.id_localidad = cursos_ofertados.capacitandos_temp.id_localidad)
WHERE
  cursos_ofertados.capacitandos_temp.id_unidad_admtva = 0
) as a
WHERE
cursos_ofertados.capacitandos_temp.id_alumno = a.id_alumno



/* BORRAMOS LA TABLA ORIGINAL Y LA SUSTITUIMOS CON LA TEMPORAL PARA QUE SE GENERE EL NUM DE CONTROL */

TRUNCATE cursos_ofertados.capacitandos RESTART IDENTITY;
INSERT INTO cursos_ofertados.capacitandos (SELECT * FROM cursos_ofertados.capacitandos_temp ORDER BY id_alumno);

/*SELECT (max(id_alumno)+1) AS num_siguiente FROM cursos_ofertados.capacitandos;*/

ALTER SEQUENCE cursos_ofertados.capacitandos_id_alumno_seq RESTART WITH 9120;

DROP TABLE cursos_ofertados.capacitandos_temp;


/* DE ULTIMO VOLVEMOS A ACTUALIZAR LOS DATOS DE INSCRIPCION POR SI HUBO CAMBIOS EN EL ID DE ALGUN ALUMNO */

UPDATE cursos_ofertados.inscripcion_curso SET id_alumno = cursos_ofertados.capacitandos.id_alumno
FROM
cursos_ofertados.capacitandos
WHERE
cursos_ofertados.inscripcion_curso.alumno_id = cursos_ofertados.capacitandos.id_anterior;


/* ACTUALIZAR LOS DATOS DE LOS INSTRUCTORES DE LA TABLA IMPORTADA DEL EXCEL */

UPDATE instructores.instructores_temp SET curp = '' WHERE curp IS NULL;
UPDATE instructores.instructores_temp SET apellido_paterno = '' WHERE apellido_paterno IS NULL;
UPDATE instructores.instructores_temp SET apellido_materno = '' WHERE apellido_materno IS NULL;
UPDATE instructores.instructores_temp SET nombre = '' WHERE nombre IS NULL;
UPDATE instructores.instructores_temp SET rfc = '' WHERE rfc IS NULL;
UPDATE instructores.instructores_temp SET grado_academico = '' WHERE grado_academico IS NULL;
UPDATE instructores.instructores_temp SET telefono = '' WHERE telefono IS NULL;
UPDATE instructores.instructores_temp SET celular = '' WHERE celular IS NULL;
UPDATE instructores.instructores_temp SET email = '' WHERE email IS NULL;
UPDATE instructores.instructores_temp SET id_nivel_estudios = 0 WHERE id_nivel_estudios IS NULL;
UPDATE instructores.instructores_temp SET certificacion = '' WHERE certificacion IS NULL;

INSERT INTO
  instructores.catalogo_instructores
(id_unidad_admtva,curp,  apellido_paterno,  apellido_materno,  nombre,  rfc,  grado_academico,  telefono,  celular,  email,  id_nivel_estudios, certificacion)
SELECT id_unidad_admtva,  curp,  apellido_paterno,  apellido_materno,  nombre,  rfc,  grado_academico,  telefono,  celular,  email,  id_nivel_estudios, certificacion
FROM instructores.instructores_temp;


INSERT INTO instructores.rel_instruc_unidad (id_instructor, id_unidad_admtva)
SELECT id_instructor, id_unidad_admtva FROM instructores.catalogo_instructores WHERE id_unidad_admtva > 0 ORDER BY id_unidad_admtva;


UPDATE instructores.instructores_temp SET id_instructor = instructores.catalogo_instructores.id_instructor
FROM
instructores.catalogo_instructores
WHERE
instructores.catalogo_instructores.nombre = instructores.instructores_temp.nombre AND
instructores.catalogo_instructores.apellido_paterno = instructores.instructores_temp.apellido_paterno AND
instructores.catalogo_instructores.apellido_materno = instructores.instructores_temp.apellido_materno;


INSERT INTO instructores.rel_instruc_cat_curso (id_instructor, id_catalogo_curso, calificacion)
SELECT instructores.instructores_temp.id_instructor, estructura_cursos.catalogo_cursos.id_catalogo_curso, instructores.instructores_temp.calificacion
FROM estructura_cursos.catalogo_cursos INNER JOIN instructores.instructores_temp
ON (UPPER(estructura_cursos.catalogo_cursos.nombre_curso||' ') = UPPER(instructores.instructores_temp.curso));