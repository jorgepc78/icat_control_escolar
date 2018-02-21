module.exports = function(ControlProcesos) {

    ControlProcesos.observe('after save', function(ctx, next) {
 
        var temp = '';
        if(ctx.instance.proceso === 'Pre-Apertura Curso PTC' || ctx.instance.proceso === 'Pre-Apertura Curso Extra')
          temp = 'Pre-Apertura Curso PTC/Extra';

        var acciones = [
            {
              accion         : 'ENVIO REVISION INSTRUCTOR',
              proceso        : 'INSTRUCTORES',
              tipo_aviso     : 'avisoEnvioInstructor',
              avisoEnvia     : 1,
              avisoRecibe    : 1,
              origen         : 'U',
              mensaje_titulo : 'Aviso de envío de evaluación del instructor propuesto',
              mensaje_envia  : 'Has enviado los datos de la persona <strong>#nombre_completo#</strong> para su evaluaci&oacute;n como instructor.',
              mensaje_recibe : 'La <strong>#unidad_pertenece#</strong> ha enviado los datos de la persona <strong>#nombre_completo#</strong> para su evaluaci&oacute;n como instructor.'
            },{
              accion         : 'INSTRUCTOR APROBADO',
              proceso        : 'INSTRUCTORES',
              tipo_aviso     : 'avisoRevisonInstructor',
              avisoEnvia     : 0,
              avisoRecibe    : 1,
              origen         : 'C',
              mensaje_titulo : 'Aviso de Aprobación del instructor',
              mensaje_envia  : 'Se ha evaluado a la persona <strong>#nombre_completo#</strong> como instructor y ha sido autorizado. A partir de ahora el instructor aparecer&aacute; en su cat&aacute;logo de instructores de la unidad.',
              mensaje_recibe : 'La persona <strong>#nombre_completo#</strong> de la <strong>#unidad_pertenece#</strong>, ha sido evaluada y aceptada como instructor.'
            },{
              accion         : 'INSTRUCTOR RECHAZADO',
              proceso        : 'INSTRUCTORES',
              tipo_aviso     : 'avisoRechazoInstructor',
              avisoEnvia     : 0,
              avisoRecibe    : 1,
              origen         : 'C',
              mensaje_titulo : 'Aviso de rechazado de la persona como instructor',
              mensaje_envia  : 'Has marcado la propuesta como instructor de la persona <strong>#nombre_completo#</strong> de la <strong>#unidad_pertenece#</strong> como rechazada y se ha regresado a la unidad para su revisi&oacute;n.',
              mensaje_recibe : 'La propuesta como instructor de la persona <strong>#nombre_completo#</strong> ha sido rechazado y regresada para su revisi&oacute;n.'
            },{
              accion         : 'ENVIO REVISION PTC',
              proceso        : 'PTC',
              tipo_aviso     : 'avisoEnvioPTC',
              avisoEnvia     : 1,
              avisoRecibe    : 1,
              origen         : 'U',
              mensaje_titulo : 'Aviso de envío de revisión del PTC #unidad_pertenece#',
              mensaje_envia  : 'Has enviado El PTC del Trimestre <strong>#trimestre#</strong> del a&ntilde;o <strong>#anio#</strong> para su revisi&oacute;n.',
              mensaje_recibe : 'La <strong>#unidad_pertenece#</strong> ha enviado el PTC del Trimestre <strong>#trimestre#</strong> del a&ntilde;o <strong>#anio#</strong> para su revisi&oacute;n.'
            },{
              accion         : 'PTC REVISADO PROGRAMAS',
              proceso        : 'PTC',
              tipo_aviso     : 'avisoRevisonPTCProgr',
              avisoEnvia     : 0,
              avisoRecibe    : 0,
              origen         : 'C',
              mensaje_titulo : 'Aviso Aprobación del PTC #unidad_pertenece# Depto. programas',
              mensaje_envia  : 'Has marcado El PTC del Trimestre <strong>#trimestre#</strong> del a&ntilde;o <strong>#anio#</strong> de la <strong>#unidad_pertenece#</strong> como revisado y se envi&oacute; a la Direcci&oacute;n T&eacute;cnica Acad&eacute;mica para su aprobaci&oacute;n.',
              mensaje_recibe : 'El PTC del Trimestre <strong>#trimestre#</strong> del a&ntilde;o <strong>#anio#</strong> de la <strong>#unidad_pertenece#</strong>, ha sido revisado por el Depto. de Programas de Capacitaci&oacute;n y se encuentra en espera de revisi&oacute;n por parte de la Direcci&oacute;n T&eacute;cnica Acad&eacute;mica.'
            },{
              accion         : 'PTC RECHAZADO PROGRAMAS',
              proceso        : 'PTC',
              tipo_aviso     : 'avisoRechazoPTCProgr',
              avisoEnvia     : 0,
              avisoRecibe    : 1,
              origen         : 'C',
              mensaje_titulo : 'Aviso de PTC #unidad_pertenece# rechazado',
              mensaje_envia  : 'Has marcado El PTC del Trimestre <strong>#trimestre#</strong> del a&ntilde;o <strong>#anio#</strong> de la <strong>#unidad_pertenece#</strong> como rechazado y se ha regresado a la unidad para su revisi&oacute;n.',
              mensaje_recibe : 'El PTC del Trimestre <strong>#trimestre#</strong> del a&ntilde;o <strong>#anio#</strong>, ha sido rechazado y regresado para su revisi&oacute;n.'
            },{
              accion         : 'PTC APROBADO ACADEMICA',
              proceso        : 'PTC',
              tipo_aviso     : 'avisoRevisonPTCAcad',
              avisoEnvia     : 0,
              avisoRecibe    : 0,
              origen         : 'C',
              mensaje_titulo : 'Aviso Aprobación del PTC #unidad_pertenece# Dirección Académica',
              mensaje_envia  : 'Has marcado El PTC del Trimestre <strong>#trimestre#</strong> del a&ntilde;o <strong>#anio#</strong> de la <strong>#unidad_pertenece#</strong> como aprobado y se envi&oacute; a la Direcci&oacute;n de Planeaci&oacute;n para su aprobaci&oacute;n.',
              mensaje_recibe : 'El PTC del Trimestre <strong>#trimestre#</strong> del a&ntilde;o <strong>#anio#</strong> de la <strong>#unidad_pertenece#</strong>, ha sido aprobado por el &aacute;rea acad&eacute;mica y marcado como en espera de revisi&oacute;n por parte de la Direcci&oacute;n de Planeaci&oacute;n.'
            },{
              accion         : 'PTC APROBADO DIR GRAL',
              proceso        : 'PTC',
              tipo_aviso     : 'avisoRevisionPTCGral',
              avisoEnvia     : 0,
              avisoRecibe    : 1,
              origen         : 'C',
              mensaje_titulo : 'Aviso Aprobación y Aceptación del PTC #unidad_pertenece#',
              mensaje_envia  : 'Has marcado El PTC del Trimestre <strong>#trimestre#</strong> del a&ntilde;o <strong>#anio#</strong> de la <strong>#unidad_pertenece#</strong> como aceptado y autorizado para su difusi&oacute;n.',
              mensaje_recibe : 'El PTC del Trimestre <strong>#trimestre#</strong> del a&ntilde;o <strong>#anio#</strong> de la <strong>#unidad_pertenece#</strong>, ha sido aceptado y autorizado para su difusi&oacute;n.'
            },{
              accion         : 'ENVIO VALIDACION CURSO' ,
              proceso        : temp,
              tipo_aviso     : 'avisoEnvioPreapCurso' ,
              avisoEnvia     : 1 ,
              avisoRecibe    : 1,
              origen         : 'U',
              mensaje_titulo : 'Aviso de envío del curso #nombre_curso# para validación de pre-apertura',
              mensaje_envia  : 'Has enviado un curso para su validaci&oacute;n de pre-apertura con los siguientes datos:<br><br>#anexo#',
              mensaje_recibe : 'Se ha enviado un curso para su validaci&oacute;n de pre-apertura con los siguientes datos:<br><br>#anexo#'
            },{
              accion         : 'CURSO REVISADO PROGRAMAS',
              proceso        : temp,
              tipo_aviso     : 'avisoRevisionPreapCursoProgr',
              avisoEnvia     : 0,
              avisoRecibe    : 0,
              origen         : 'C',
              mensaje_titulo : 'Aviso Aprobación Preapertura Curso #nombre_curso# Área de programas',
              mensaje_envia  : 'Has marcado el siguiente curso Como revisado y se envi&oacute; a la Direcci&oacute;n T&eacute;cnica Acad&eacute;mica para su aprobaci&oacute;n.<br><br>#anexo#',
              mensaje_recibe : 'El siguiente curso ha sido revisado por el Depto. de Programas de Capacitaci&oacute;n y se encuentra en espera de revisi&oacute;n por parte de la Direcci&oacute;n T&eacute;cnica Acad&eacute;mica.<br><br>#anexo#'
            },{
              accion         : 'CURSO RECHAZADO PROGRAMAS',
              proceso        : temp,
              tipo_aviso     : 'avisoRechazoPreapCursoProgr',
              avisoEnvia     : 0,
              avisoRecibe    : 1,
              origen         : 'C',
              mensaje_titulo : 'Aviso de rechazo del curso #nombre_curso# para pre-apertura',
              mensaje_envia  : 'Has marcado el siguiente curso como rechazado y se ha regresado a la unidad para su revisi&oacute;n.<br><br>#anexo#',
              mensaje_recibe : 'El siguiente curso ha sido rechazado y regresado para su revisi&oacute;n.<br><br>#anexo#'
            },{
              accion         : 'CURSO APROBADO ACADEMICA',
              proceso        : temp,
              tipo_aviso     : 'avisoRevisionPreapCursoAcad',
              avisoEnvia     : 0,
              avisoRecibe    : 0,
              origen         : 'C',
              mensaje_titulo :'Aviso Aprobación Preapertura Curso #nombre_curso# Dirección Académica',
              mensaje_envia  : 'Has marcado el siguiente curso Como aprobado y se envi&oacute; a la Direcci&oacute;n de Planeaci&oacute;n para su aprobaci&oacute;n.<br><br>#anexo#',
              mensaje_recibe : 'El siguiente curso ha sido aprobado por el &aacute;rea acad&eacute;mica y marcado como en espera de revisi&oacute;n por parte de la Direcci&oacute;n de Planeaci&oacute;n.<br><br>#anexo#'
            },{
              accion         : 'CURSO APROBADO DIR GRAL',
              proceso        : temp,
              tipo_aviso     : 'avisoRevisionPreapCursoGral',
              avisoEnvia     : 0,
              avisoRecibe    : 1,
              origen         : 'C',
              mensaje_titulo : 'Aviso Aprobación y Aceptación Preapertura Curso #nombre_curso#',
              mensaje_envia  : 'Has marcado el siguiente curso como aceptado y autorizado para su difusi&oacute;n.<br><br>#anexo#',
              mensaje_recibe : 'El siguiente curso ha sido aceptado y autorizado para su difusi&oacute;n.<br><br>#anexo#'
            },{
              accion         : 'REPROGRAMACION DE CURSO',
              proceso        : 'Cursos vigentes',
              tipo_aviso     : 'avisoReprogCurso',
              avisoEnvia     : 1,
              avisoRecibe    : 1,
              origen         : 'U',
              mensaje_titulo : 'Aviso de reprogramación del curso #nombre_curso#',
              mensaje_envia  : 'Has reprogramado el curso <strong>#nombre_curso#</strong> con la modalidad <strong>#modalidad#</strong> del Trimestre <strong>#trimestre#</strong> del a&ntilde;o <strong>#anio#</strong>, quedando de la siguiente manera:<br><br>',
              mensaje_recibe : 'La <strong>#unidad_pertenece#</strong> ha reprogramado el curso <strong>#nombre_curso#</strong> con la modalidad <strong>#modalidad#</strong> del Trimestre <strong>#trimestre#</strong> del a&ntilde;o <strong>#anio#</strong>, quedando de la siguiente manera:<br><br>'
            },{
              accion         : 'CANCELACION DE CURSO',
              proceso        : 'Cursos vigentes',
              tipo_aviso     : 'avisoCancelacionCurso',
              avisoEnvia     : 1,
              avisoRecibe    : 1,
              origen         : 'U',
              mensaje_titulo : 'Aviso cancelación del curso #nombre_curso#',
              mensaje_envia  : 'Has cancelado el curso <strong>#nombre_curso#</strong> con la modalidad <strong>#modalidad#</strong> del Trimestre <strong>#trimestre#</strong> del a&ntilde;o <strong>#anio#</strong>, Este pasar&aacute; a la secci&oacute;n de hist&oacute;ricos.',
              mensaje_recibe : 'La <strong>#unidad_pertenece#</strong> ha cancelado el curso <strong>#nombre_curso#</strong> con la modalidad <strong>#modalidad#</strong> del Trimestre <strong>#trimestre#</strong> del a&ntilde;o <strong>#anio#</strong>, Este pasar&acute; a la secci&oacute;n de hist&oacute;ricos.'
            },{
              accion         : 'CONCLUSION DE CURSO',
              proceso        : 'Cursos vigentes',
              tipo_aviso     : 'avisoTerminacionCurso',
              avisoEnvia     : 0,
              avisoRecibe    : 0,
              origen         : 'U',
              mensaje_titulo : 'Aviso de conclusión del curso #nombre_curso#',
              mensaje_envia  : 'El Curso <strong>#nombre_curso#</strong> con la modalidad <strong>#modalidad#</strong> del Trimestre <strong>#trimestre#</strong> del a&ntilde;o <strong>#anio#</strong> ha <strong>CONCLUIDO</strong>, el siguiente paso es el asiento de calificaciones de los capacitandos',
              mensaje_recibe : 'El Curso <strong>#nombre_curso#</strong> con la modalidad <strong>#modalidad#</strong> del Trimestre <strong>#trimestre#</strong> del a&ntilde;o <strong>#anio#</strong> de la <strong>#unidad_pertenece#</strong> ha <strong>CONCLUIDO</strong>, el siguiente paso es el asiento de calificaciones de los capacitandos'
            },{
              accion         : 'CIERRE DE CURSO',
              proceso        : 'Cursos vigentes',
              tipo_aviso     : 'avisoCierreCurso',
              avisoEnvia     : 1,
              avisoRecibe    : 1,
              origen         : 'U',
              mensaje_titulo : 'Aviso de cierre del curso #nombre_curso#',
              mensaje_envia  : 'El Curso <strong>#nombre_curso#</strong> con la modalidad <strong>#modalidad#</strong> del Trimestre <strong>#trimestre#</strong> del a&ntilde;o <strong>#anio#</strong> ha sido <strong>CERRADO</strong> y almacenado como hist&oacute;rico. A continuaci&oacute;n se presenta la lista de capacitandos y sus calificaciones:<br><br>',
              mensaje_recibe : 'El Curso <strong>#nombre_curso#</strong> con la modalidad <strong>#modalidad#</strong> del Trimestre <strong>#trimestre#</strong> del a&ntilde;o <strong>#anio#</strong> de la <strong>#unidad_pertenece#</strong> ha sido <strong>CERRADO</strong> y almacenado como hist&oacute;rico. A continuaci&oacute;n se presenta la lista de capacitandos y sus calificaciones:<br><br>'
            },{
              accion         : 'ALCANCE MINIMO INSCRITOS',
              proceso        : 'Inscripcion a curso',
              tipo_aviso     : 'avisoMinimoInscritosCurso',
              avisoEnvia     : 0,
              avisoRecibe    : 0,
              origen         : 'U',
              mensaje_titulo : 'Aviso alcance de mínimo de inscripción curso #nombre_curso#',
              mensaje_envia  : 'El Curso <strong>#nombre_curso#</strong> con la modalidad <strong>#modalidad#</strong> del Trimestre <strong>#trimestre#</strong> del a&ntilde;o <strong>#anio#</strong>, ha alcanzado el m&iacute;nimo de personas inscritas',
              mensaje_recibe : 'El Curso <strong>#nombre_curso#</strong> con la modalidad <strong>#modalidad#</strong> del Trimestre <strong>#trimestre#</strong> del a&ntilde;o <strong>#anio#</strong> de la <strong>#unidad_pertenece#</strong>, ha alcanzado el m&iacute;nimo de personas inscritas'
            },{
              accion         : 'ALCANCE MINIMO PAGADOS',
              proceso        : 'Inscripcion a curso',
              tipo_aviso     : 'avisoMinimoPagadosCurso',
              avisoEnvia     : 1,
              avisoRecibe    : 1,
              origen         : 'U',
              mensaje_titulo : 'Aviso alcance de mínimo de inscritos pagados curso #nombre_curso#',
              mensaje_envia  : 'El Curso <strong>#nombre_curso#</strong> con la modalidad <strong>#modalidad#</strong> del Trimestre <strong>#trimestre#</strong> del a&ntilde;o <strong>#anio#</strong>, ha alcanzado el m&iacute;nimo de personas inscritas y se ha marcado el curso como <strong>ACTIVO</strong>',
              mensaje_recibe : 'El Curso <strong>#nombre_curso#</strong> con la modalidad <strong>#modalidad#</strong> del Trimestre <strong>#trimestre#</strong> del a&ntilde;o <strong>#anio#</strong> de la <strong>#unidad_pertenece#</strong>, ha alcanzado el m&iacute;nimo de personas inscritas y se ha marcado el curso como <strong>ACTIVO</strong>'
            },{
              accion         : 'REVERSION MINIMO PAGADOS',
              proceso        : 'Inscripcion a curso',
              tipo_aviso     : 'avisoReversionPagadosCurso',
              avisoEnvia     : 0,
              avisoRecibe    : 0,
              origen         : 'U',
              mensaje_titulo : 'Aviso del cambio de inscritos pagados curso #nombre_curso#',
              mensaje_envia  : 'La inscripci&oacute;n del Curso <strong>#nombre_curso#</strong> con la modalidad <strong>#modalidad#</strong> del Trimestre <strong>#trimestre#</strong> del a&ntilde;o <strong>#anio#</strong> ha variado y ha quedado abajo del m&iacute;nimo de inscritos pagados y se ha marcado el curso como <strong>EN ESPERA</strong>',
              mensaje_recibe : 'La inscripci&oacute;n del Curso <strong>#nombre_curso#</strong> con la modalidad <strong>#modalidad#</strong> del Trimestre <strong>#trimestre#</strong> del a&ntilde;o <strong>#anio#</strong> de la <strong>#unidad_pertenece#</strong> ha variado y ha quedado abajo del m&iacute;nimo de inscritos pagados y se ha marcado el curso como <strong>EN ESPERA</strong>'
            },{
              accion         : 'ENVIO VALIDACION EVALUACION',
              proceso        : 'Pre-Apertura Evaluacion',
              tipo_aviso     : 'avisoEnvioEvaluacion',
              avisoEnvia     : 1,
              avisoRecibe    : 1,
              origen         : 'U',
              mensaje_titulo : 'Aviso de envío de la evaluación #nombre_curso# para validación',
              mensaje_envia  : 'Has enviado una evaluaci&oacute;n para su validaci&oacute;n con los siguientes datos:<br><br>#anexo#',
              mensaje_recibe : 'Se ha enviado una evaluaci&oacute;n para su validaci&oacute;n con los siguientes datos:<br><br>#anexo#'
            },{
              accion         : 'EVALUACION REVISADA CERTIFICACION',
              proceso        : 'Pre-Apertura Evaluacion',
              tipo_aviso     : 'avisoRevisionEvaluacionProgr',
              avisoEnvia     : 0,
              avisoRecibe    : 0,
              origen         : 'C',
              mensaje_titulo : 'Aviso Aprobación evaluación #nombre_curso# Área de certificación',
              mensaje_envia  : 'Has marcado la siguiente evaluaci&oacute;n como revisada y se envi&oacute; a la Direcci&oacute;n T&eacute;cnica Acad&eacute;mica para su aprobaci&oacute;n.<br><br>#anexo#',
              mensaje_recibe : 'La siguiente evaluaci&oacute;n ha sido revisada por el Depto. de Programas de Capacitaci&oacute;n y se encuentra en espera de revisi&oacute;n por parte de la Direcci&oacute;n T&eacute;cnica Acad&eacute;mica.<br><br>#anexo#'
            },{
              accion         : 'EVALUACION RECHAZADA CERTIFICACION',
              proceso        : 'Pre-Apertura Evaluacion',
              tipo_aviso     : 'avisoRechazoEvaluacionProgr',
              avisoEnvia     : 0,
              avisoRecibe    : 1,
              origen         : 'C',
              mensaje_titulo : 'Aviso de rechazo de la evaluación #nombre_curso#',
              mensaje_envia  : 'Has marcado la siguiente evaluaci&oacute;n como rechazada y se ha regresado a la unidad para su revisi&oacute;n.<br><br>#anexo#',
              mensaje_recibe : 'La siguiente evaluaci&oacute;n ha sido rechazada y regresada para su revisi&oacute;n.<br><br>#anexo#'
            },{
              accion         : 'EVALUACION APROBADA ACADEMICA',
              proceso        : 'Pre-Apertura Evaluacion',
              tipo_aviso     : 'avisoRevisionEvaluacionAcad',
              avisoEnvia     : 0,
              avisoRecibe    : 0,
              origen         : 'C',
              mensaje_titulo : 'Aviso Aprobación evaluación #nombre_curso# Dirección Académica',
              mensaje_envia  : 'Has marcado la siguiente evaluaci&oacute;n como revisada y se envi&oacute; a la Direcci&oacute;n de gral. para su aprobaci&oacute;n.<br><br>#anexo#',
              mensaje_recibe : 'La siguiente evaluaci&oacute;n ha sido aprobada por el &aacute;rea acad&eacute;mica y marcado como en espera de revisi&oacute;n por parte de la Direcci&oacute;n gral.<br><br>#anexo#'
            },{
              accion         : 'EVALUACION APROBADA DIR GRAL',
              proceso        : 'Pre-Apertura Evaluacion',
              tipo_aviso     : 'avisoRevisionEvaluacionGral',
              avisoEnvia     : 0,
              avisoRecibe    : 1,
              origen         : 'C',
              mensaje_titulo : 'Aviso Aprobación y Aceptación evaluación #nombre_curso#',
              mensaje_envia  : 'Has marcado la siguiente evaluaci&oacute;n como aceptada y autorizada.<br><br>#anexo#',
              mensaje_recibe : 'La siguiente evaluaci&oacute;n ha sido aceptada y autorizada.<br><br>#anexo#'
            },{
              accion         : 'CANCELACION DE EVALUACION',
              proceso        : 'Evaluaciones vigentes',
              tipo_aviso     : 'avisoCancelacionEvaluacion',
              avisoEnvia     : 1,
              avisoRecibe    : 1,
              origen         : 'U',
              mensaje_titulo : 'Aviso cancelación de la evaluación #nombre_curso#',
              mensaje_envia  : 'Has cancelado la evaluaci&oacute;n descrita a continuaci&oacute;n, Este pasar&aacute; a la secci&oacute;n de hist&oacute;ricos y se le dar&aacute; aviso a la persona inscrita.<br><br>#anexo#',
              mensaje_recibe : 'Has sido cancelada la evaluaci&oacute;n descrita a continuaci&oacute;n, Este pasar&aacute; a la secci&oacute;n de hist&oacute;ricos y se le dar&aacute; aviso a la persona inscrita.<br><br>#anexo#'
            },{
              accion         : 'CIERRE DE EVALUACION',
              proceso        : 'Evaluaciones vigentes',
              tipo_aviso     : 'avisoCierreEvaluacion',
              avisoEnvia     : 1,
              avisoRecibe    : 1,
              origen         : 'U',
              mensaje_titulo : 'Aviso cierre evaluación #nombre_curso#',
              mensaje_envia  : 'Has marcado como <strong>CERRADA Y CONCLUIDA</strong> la evaluaci&oacute;n descrita a continuaci&oacute;n; esta pasar&aacute; a la secci&oacute;n de hist&oacute;ricos.<br><br>#anexo#',
              mensaje_recibe : 'La siguiente evaluaci&oacute;n ha sido marcada como <strong>CERRADA Y CONCLUIDA</strong>; esta pasar&aacute; a la secci&oacute;n de hist&oacute;ricos.<br><br>#anexo#'
            }
        ];


        var posAccion = acciones.findIndex(i => i.accion === ctx.instance.accion);

        if(posAccion == -1)
        {
              console.log("La accion "+ctx.instance.accion+" No esta registrada");
              next();
        }
        else if(acciones[posAccion].avisoEnvia == 0 && acciones[posAccion].avisoRecibe == 0)
        {
              console.log("La accion "+ctx.instance.accion+" No genera ningun evento");
              next();
        }
        else
        {
              function getUsuarioEnvia(ControlProcesos, ctx, accionSeleccionada) {
                  return new Promise(function(resolve, reject) {

                        var array_envia = [];

                        if( (accionSeleccionada.origen == 'U' && accionSeleccionada.avisoEnvia == 1) || (accionSeleccionada.origen == 'C' && accionSeleccionada.avisoEnvia == 1) )
                        {
                              var Usuario = ControlProcesos.app.models.Usuario;

                              //Buscamos al usuario que disapara el evento para enviarle el aviso
                              Usuario.findById(
                                ctx.instance.idUsuario, 
                              {
                                fields: ['idUsuario','nombre', 'email']
                              },
                              function(err, usuarioEncontrado) {
                                
                                    array_envia.push({
                                      idUsuario : usuarioEncontrado.idUsuario,
                                      nombre    : usuarioEncontrado.nombre,
                                      email     : usuarioEncontrado.email
                                    });                              
                                    console.log("Promise 1");
                                    resolve(array_envia);

                              });
                        }
                        else
                        {
                              console.log("Promise 1");
                              resolve(array_envia);
                        }
                  });
              }
              var getUsuarioEnviaPromise = getUsuarioEnvia(ControlProcesos, ctx, acciones[posAccion]);


              function getUsuariosRecibe(ControlProcesos, ctx, accionSeleccionada) {
                  return new Promise(function(resolve, reject) {

                      //Ahora buscamos a los usuarios que de acuerdo a su perfil van a recibir el mensaje, no tomando en cuenta al usuario que dispara el proceso.
                      //Buscamos al dueño del documento para informarle del rechazo
                      
                      //console.log("idProcesoPadre: " + JSON.stringify(ctx.instance));
                      var array_recibe = [];

                      if( (accionSeleccionada.origen == 'U' && accionSeleccionada.avisoRecibe == 1) || (accionSeleccionada.origen == 'C' && accionSeleccionada.avisoRecibe == 1) )
                      {
                          var Usuario = ControlProcesos.app.models.Usuario;

                          if(accionSeleccionada.origen == 'U')
                          {
                                var tipo_aviso = JSON.parse('{"' + accionSeleccionada.tipo_aviso + '": true}');
                                Usuario.find({
                                  where:  {
                                      and: [
                                        {activo: true},
                                        tipo_aviso
                                      ]
                                  }, 
                                  fields: ['idUsuario', 'nombre', 'email'],
                                  include: [
                                    {
                                        relation: 'perfil',
                                        scope: {
                                            fields:['name','description']
                                        }
                                    },
                                    {
                                        relation: 'unidad_revisa',
                                        scope: {
                                            fields:['idUnidadAdmtva','nombre']
                                        }
                                    }
                                  ]
                                },
                                function(err, usuarioEncontrado) {
                                  
                                      var usuarioRecord = JSON.parse( JSON.stringify( usuarioEncontrado ) );
                                      var index = 0;

                                      for (var i = 0; i < usuarioRecord.length; i++)
                                      {
                                          var unidad_revisa_usuario = JSON.parse( JSON.stringify( usuarioRecord[i].unidad_revisa ) );
                                          var perfil_usuario = JSON.parse( JSON.stringify( usuarioRecord[i].perfil ) );

                                          //console.log(perfil_usuario[0].name);
                                          //console.log("****************************************************************");

                                          if(perfil_usuario[0].name == 'programas' || perfil_usuario[0].name == 'certificacion')
                                          {
                                                index = unidad_revisa_usuario.map(function(record) {
                                                                                return record.idUnidadAdmtva;
                                                                              }).indexOf(ctx.instance.idUnidadAdmtva);

                                                if(index >= 0)
                                                {
                                                    array_recibe.push({
                                                      idUsuario : usuarioRecord[i].idUsuario,
                                                      nombre    : usuarioRecord[i].nombre,
                                                      email     : usuarioRecord[i].email
                                                    });
                                                }
                                          }
                                          else
                                          {
                                                array_recibe.push({
                                                  idUsuario : usuarioRecord[i].idUsuario,
                                                  nombre    : usuarioRecord[i].nombre,
                                                  email     : usuarioRecord[i].email
                                                });
                                          }
                                      };
                                      console.log("Promise 2");
                                      resolve(array_recibe);
                                });
                          }
                          else
                          {
                                ControlProcesos.findById(
                                  ctx.instance.id, 
                                {
                                  fields: ['idProcesoPadre']
                                },
                                function(err, respuesta) {

                                      //console.log("idProcesoPadre: " + respuesta.idProcesoPadre);

                                      var idPadre = respuesta.idProcesoPadre;
                                      if(respuesta.idProcesoPadre == 0)
                                          idPadre = ctx.instance.id;
                                        
                                      ControlProcesos.findById(
                                        idPadre, 
                                      {
                                        fields: ['idUsuario'],
                                        include: {
                                          relation: 'usuario_pertenece',
                                          scope: {
                                            fields: ['idUsuario','nombre','email']
                                          }
                                        }
                                      },
                                      function(err, usuarioEncontrado) {

                                            
                                            var usuarioEn = JSON.parse(JSON.stringify(usuarioEncontrado));

                                            array_recibe.push({
                                              idUsuario : usuarioEn.usuario_pertenece.idUsuario,
                                              nombre    : usuarioEn.usuario_pertenece.nombre,
                                              email     : usuarioEn.usuario_pertenece.email
                                            });
                                            console.log("Promise 2");
                                            resolve(array_recibe);
                                      });
                                });
                          }
                      }
                      else
                      {
                          console.log("Promise 2");
                          resolve(array_recibe);
                      }

                  });
              };
              var getUsuariosRecibePromise = getUsuariosRecibe(ControlProcesos, ctx, acciones[posAccion]);


              function PreparaMensajes(ControlProcesos, ctx, accionSeleccionada) {
                  return new Promise(function(resolve, reject) {

                      var mensajes = {
                        titulo: '',
                        envia: '',
                        recibe: ''
                      };

                      var trimestres = ['PRIMERO','SEGUNDO','TERCERO','CUARTO'];

                      if(accionSeleccionada.proceso === 'INSTRUCTORES')
                      {
                            var CatalogoInstructores = ControlProcesos.app.models.CatalogoInstructores;
                            CatalogoInstructores.find({
                              where: {idInstructor: ctx.instance.idDocumento},
                              fields: ['idInstructor', 'nombre_completo', 'idUnidadAdmtva'],
                              include: [{
                                relation: 'unidad_pertenece',
                                scope: {
                                  fields:['idUnidadAdmtva','nombre']
                                }
                              }]
                            },
                            function(err, registroEncontrado) {

                                var registro = JSON.parse( JSON.stringify( registroEncontrado[0] ) );

                                accionSeleccionada.mensaje_envia = accionSeleccionada.mensaje_envia.replace('#nombre_completo#', registro.nombre_completo);
                                accionSeleccionada.mensaje_envia = accionSeleccionada.mensaje_envia.replace('#unidad_pertenece#', registro.unidad_pertenece.nombre);
                                
                                accionSeleccionada.mensaje_recibe = accionSeleccionada.mensaje_recibe.replace('#nombre_completo#', registro.nombre_completo);
                                accionSeleccionada.mensaje_recibe = accionSeleccionada.mensaje_recibe.replace('#unidad_pertenece#', registro.unidad_pertenece.nombre);

                                mensajes.titulo = accionSeleccionada.mensaje_titulo;
                                mensajes.envia  = accionSeleccionada.mensaje_envia;
                                mensajes.recibe = accionSeleccionada.mensaje_recibe;

                                console.log("Promise 3");
                                resolve(mensajes);
                                
                            });
                      }
                      else if(accionSeleccionada.proceso === 'PTC')
                      {
                            var ProgTrimCursos = ControlProcesos.app.models.ProgTrimCursos;
                            ProgTrimCursos.find({
                              where: {idPtc: ctx.instance.idDocumento},
                              fields: ['idPtc', 'trimestre', 'anio', 'idUnidadAdmtva'],
                              include: [{
                                relation: 'unidad_pertenece',
                                scope: {
                                  fields:['idUnidadAdmtva','nombre']
                                }
                              }]
                            },
                            function(err, registroEncontrado) {

                                var registro = JSON.parse( JSON.stringify( registroEncontrado[0] ) );

                                accionSeleccionada.mensaje_titulo = accionSeleccionada.mensaje_titulo.replace('#unidad_pertenece#', registro.unidad_pertenece.nombre);

                                accionSeleccionada.mensaje_envia = accionSeleccionada.mensaje_envia.replace('#trimestre#', trimestres[(registro.trimestre-1)]);
                                accionSeleccionada.mensaje_envia = accionSeleccionada.mensaje_envia.replace('#anio#', registro.anio);
                                accionSeleccionada.mensaje_envia = accionSeleccionada.mensaje_envia.replace('#unidad_pertenece#', registro.unidad_pertenece.nombre);
                                
                                accionSeleccionada.mensaje_recibe = accionSeleccionada.mensaje_recibe.replace('#trimestre#', trimestres[(registro.trimestre-1)]);
                                accionSeleccionada.mensaje_recibe = accionSeleccionada.mensaje_recibe.replace('#anio#', registro.anio);
                                accionSeleccionada.mensaje_recibe = accionSeleccionada.mensaje_recibe.replace('#unidad_pertenece#', registro.unidad_pertenece.nombre);

                                mensajes.titulo = accionSeleccionada.mensaje_titulo;
                                mensajes.envia  = accionSeleccionada.mensaje_envia;
                                mensajes.recibe = accionSeleccionada.mensaje_recibe;

                                console.log("Promise 3");
                                resolve(mensajes);
                                
                            });
                      }

                  });

              }
              var PreparaMensajesPromise = PreparaMensajes(ControlProcesos, ctx, acciones[posAccion]);


              Promise.all([getUsuarioEnviaPromise, getUsuariosRecibePromise, PreparaMensajesPromise]).then(values => { 
                var array_envia  = values[0];
                var array_recibe = values[1];
                var mensajes     = values[2];

                for (var i = 0; i < array_envia.length; i++) {
                  console.log("correos envia: " + array_envia[i].nombre);
                }
                console.log("*******************************************");
                for (var i = 0; i < array_recibe.length; i++) {
                  console.log("correos recibe: " + array_recibe[i].nombre);
                }
                console.log("*******************************************");
                console.log("mensajes titulo: " + mensajes.titulo);
                console.log("mensajes envia: " + mensajes.envia);
                console.log("mensajes recibe: " + mensajes.recibe);
                console.log("-----------------------------------------------");

                //PreparaMensajes2(ctx.instance.accion, array_envia, array_recibe);
                next();
              });
        }



              function PreparaMensajes2(accion, array_envia, array_recibe)
              {
                    //Obtenemos los datos para armar el mensaje
                    if(ctx.instance.proceso === 'INSTRUCTORES')
                    {
                            var CatalogoInstructores = ControlProcesos.app.models.CatalogoInstructores;

                            CatalogoInstructores.find({
                              where: {idInstructor: ctx.instance.idDocumento },
                              fields: {idInstructor: true, nombre_completo: true, idUnidadAdmtva: true},
                              include: [{
                                relation: 'unidad_pertenece',
                                scope: {
                                  fields:['idUnidadAdmtva','nombre']
                                }
                              }]
                            },
                            function(err, InstructorEncontrado) {

                                var registro = JSON.parse( JSON.stringify( InstructorEncontrado[0] ) );
                                
                                if(ctx.instance.accion == 'ENVIO REVISION INSTRUCTOR')
                                {
                                    mensajes.titulo = 'Aviso de envío de evaluación del instructor propuesto';
                                    mensajes.envia  = 'Has enviado los datos de la persona <strong>'+ registro.nombre_completo +'</strong> para su evaluaci&oacute;n como instructor.';
                                    mensajes.recibe = 'La <strong>'+ registro.unidad_pertenece.nombre +'</strong> ha enviado los datos de la persona <strong>'+ registro.nombre_completo +'</strong> para su evaluaci&oacute;n como instructor.';
                                }
                                else if(ctx.instance.accion == 'INSTRUCTOR APROBADO')
                                {         
                                    mensajes.titulo = 'Aviso de Aprobación del instructor';
                                    mensajes.envia  = 'Se ha evaluado a la persona <strong> ' + registro.nombre_completo + ' </strong> como instructor y ha sido autorizado. A partir de ahora el instructor aparecer&aacute; en su cat&aacute;logo de instructores de la unidad.';
                                    mensajes.recibe = 'La persona <strong>'+ registro.nombre_completo +'</strong> de la <strong>'+ registro.unidad_pertenece.nombre +'</strong>, ha sido evaluada y aceptada como instructor.';
                                }
                                else if(ctx.instance.accion == 'INSTRUCTOR RECHAZADO')
                                {         
                                    mensajes.titulo = 'Aviso de rechazado de la persona como instructor';
                                    mensajes.envia  = 'Has marcado la propuesta como instructor de la persona <strong>'+ registro.nombre_completo +'</strong> de la <strong>'+ registro.unidad_pertenece.nombre +'</strong> como rechazada y se ha regresado a la unidad para su revisi&oacute;n.';
                                    mensajes.recibe = 'La propuesta como instructor de la persona <strong>'+ registro.nombre_completo +'</strong> ha sido rechazado y regresada para su revisi&oacute;n.';
                                }

                                enviaCorreos(ctx.instance.id, mensajes, array_envia, array_recibe);
                            });
                    }
                    if(ctx.instance.proceso === 'PTC')
                    {
                            var ProgTrimCursos = ControlProcesos.app.models.ProgTrimCursos;

                            ProgTrimCursos.find({
                              where: {idPtc: ctx.instance.idDocumento },
                              fields: {idPtc: true, trimestre: true, anio: true, idUnidadAdmtva: true},
                              include: [{
                                relation: 'unidad_pertenece',
                                scope: {
                                  fields:['idUnidadAdmtva','nombre']
                                }
                              }]
                            },
                            function(err, PTCencontrado) {

                                var registro = JSON.parse( JSON.stringify( PTCencontrado[0] ) );

                                var trimestres = ['PRIMERO','SEGUNDO','TERCERO','CUARTO'];
                                
                                if(ctx.instance.accion == 'ENVIO REVISION PTC')
                                {
                                    mensajes.titulo = 'Aviso de envío de revisión del PTC '+ registro.unidad_pertenece.nombre;
                                    mensajes.envia  = 'Has enviado El PTC del Trimestre <strong>'+ trimestres[(registro.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.anio +'</strong> para su revisi&oacute;n.';
                                    mensajes.recibe = 'La <strong>'+ registro.unidad_pertenece.nombre +'</strong> ha enviado el PTC del Trimestre <strong>'+ trimestres[(registro.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.anio +'</strong> para su revisi&oacute;n.';
                                }

                                else if(ctx.instance.accion == 'PTC REVISADO PROGRAMAS')
                                {         
                                    mensajes.titulo = 'Aviso Aprobación del PTC '+ registro.unidad_pertenece.nombre + ' Depto. programas';
                                    mensajes.envia  = 'Has marcado El PTC del Trimestre <strong>'+ trimestres[(registro.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.anio +'</strong> de la <strong>'+ registro.unidad_pertenece.nombre +'</strong> como revisado y se envi&oacute; a la Direcci&oacute;n T&eacute;cnica Acad&eacute;mica para su aprobaci&oacute;n.';
                                    mensajes.recibe = 'El PTC del Trimestre <strong>'+ trimestres[(registro.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.anio +'</strong> de la <strong>'+ registro.unidad_pertenece.nombre +'</strong>, ha sido revisado por el Depto. de Programas de Capacitaci&oacute;n y se encuentra en espera de revisi&oacute;n por parte de la Direcci&oacute;n T&eacute;cnica Acad&eacute;mica.';
                                }
                                else if(ctx.instance.accion == 'PTC RECHAZADO PROGRAMAS')
                                {         
                                    mensajes.titulo = 'Aviso de PTC '+ registro.unidad_pertenece.nombre + ' rechazado';
                                    mensajes.envia  = 'Has marcado El PTC del Trimestre <strong>'+ trimestres[(registro.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.anio +'</strong> de la <strong>'+ registro.unidad_pertenece.nombre +'</strong> como rechazado y se ha regresado a la unidad para su revisi&oacute;n.';
                                    mensajes.recibe = 'El PTC del Trimestre <strong>'+ trimestres[(registro.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.anio +'</strong>, ha sido rechazado y regresado para su revisi&oacute;n.';
                                }

                                else if(ctx.instance.accion == 'PTC APROBADO ACADEMICA')
                                {         
                                    mensajes.titulo = 'Aviso Aprobación del PTC '+ registro.unidad_pertenece.nombre + ' Dirección Académica';
                                    mensajes.envia  = 'Has marcado El PTC del Trimestre <strong>'+ trimestres[(registro.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.anio +'</strong> de la <strong>'+ registro.unidad_pertenece.nombre +'</strong> como aprobado y se envi&oacute; a la Direcci&oacute;n de Planeaci&oacute;n para su aprobaci&oacute;n.';
                                    mensajes.recibe = 'El PTC del Trimestre <strong>'+ trimestres[(registro.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.anio +'</strong> de la <strong>'+ registro.unidad_pertenece.nombre +'</strong>, ha sido aprobado por el &aacute;rea acad&eacute;mica y marcado como en espera de revisi&oacute;n por parte de la Direcci&oacute;n de Planeaci&oacute;n.';
                                }
                                else if(ctx.instance.accion == 'PTC RECHAZADO ACADEMICA')
                                {         
                                    mensajes.titulo = 'Aviso de rechazado del PTC '+ registro.unidad_pertenece.nombre + ' Dirección Académica';
                                    mensajes.envia  = 'Has marcado El PTC del Trimestre <strong>'+ trimestres[(registro.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.anio +'</strong> de la <strong>'+ registro.unidad_pertenece.nombre +'</strong> como rechazado y se ha regresado a programas para su revisi&oacute;n.';
                                    mensajes.recibe = 'El PTC del Trimestre <strong>'+ trimestres[(registro.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.anio +'</strong> de la <strong>'+ registro.unidad_pertenece.nombre +'</strong>, ha sido rechazado por la dir. acad&eacute;mica.';
                                }
                                else if(ctx.instance.accion == 'PTC APROBADO PLANEACION')
                                {         
                                    mensajes.titulo = 'Aviso Aprobación del PTC '+ registro.unidad_pertenece.nombre + ' Área Planeación';
                                    mensajes.envia  = 'Has marcado El PTC del Trimestre <strong>'+ trimestres[(registro.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.anio +'</strong> de la <strong>'+ registro.unidad_pertenece.nombre +'</strong> como aprobado y se envi&oacute; a la Direcci&oacute;n General para su revisi&oacute;n final.';
                                    mensajes.recibe = 'El PTC del Trimestre <strong>'+ trimestres[(registro.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.anio +'</strong> de la <strong>'+ registro.unidad_pertenece.nombre +'</strong>, ha sido aprobado por el &aacute;rea de planeaci&oacute;n y marcado como en espera de revisi&oacute;n final por parte de la Direcci&oacute;n General.';
                                }
                                else if(ctx.instance.accion == 'PTC RECHAZADO PLANEACION')
                                {         
                                    mensajes.titulo = 'Aviso de rechazado del PTC '+ registro.unidad_pertenece.nombre + ' Área Planeación';
                                    mensajes.envia  = 'Has marcado El PTC del Trimestre <strong>'+ trimestres[(registro.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.anio +'</strong> de la <strong>'+ registro.unidad_pertenece.nombre +'</strong> como rechazado y se ha regresado a la dir. acad&eacute;mica para su revisi&oacute;n.';
                                    mensajes.recibe = 'El PTC del Trimestre <strong>'+ trimestres[(registro.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.anio +'</strong> de la <strong>'+ registro.unidad_pertenece.nombre +'</strong>, ha sido rechazado por la dir. de planeaci&oacute;n.';
                                }
                                else if(ctx.instance.accion == 'PTC APROBADO DIR GRAL')
                                {         
                                    mensajes.titulo = 'Aviso Aprobación y Aceptación del PTC '+ registro.unidad_pertenece.nombre;
                                    mensajes.envia  = 'Has marcado El PTC del Trimestre <strong>'+ trimestres[(registro.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.anio +'</strong> de la <strong>'+ registro.unidad_pertenece.nombre +'</strong> como aceptado y autorizado para su difusi&oacute;n.';
                                    mensajes.recibe = 'El PTC del Trimestre <strong>'+ trimestres[(registro.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.anio +'</strong> de la <strong>'+ registro.unidad_pertenece.nombre +'</strong>, ha sido aceptado y autorizado para su difusi&oacute;n.';
                                }
                                else if(ctx.instance.accion == 'PTC RECHAZADO DIR GRAL')
                                {         
                                    mensajes.titulo = 'Aviso de rechazo del PTC '+ registro.unidad_pertenece.nombre + ' Dir. General';
                                    mensajes.envia  = 'Has marcado El PTC del Trimestre <strong>'+ trimestres[(registro.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.anio +'</strong> de la <strong>'+ registro.unidad_pertenece.nombre +'</strong> como rechazado y se ha regresado a la Direcci&oacute;n de Planeaci&oacute;n para su revisi&oacute;n.';
                                    mensajes.recibe = 'El PTC del Trimestre <strong>'+ trimestres[(registro.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.anio +'</strong> de la <strong>'+ registro.unidad_pertenece.nombre +'</strong>, ha sido rechazado por la dir. general.';
                                }
                                enviaCorreos(ctx.instance.id, mensajes, array_envia, array_recibe);
                            });
                    }
                    else if(ctx.instance.proceso === 'Pre-Apertura Curso PTC' || ctx.instance.proceso === 'Pre-Apertura Curso Extra')
                    {
                            var CursosOficiales = ControlProcesos.app.models.CursosOficiales;

                            CursosOficiales.find({
                                where: {idCurso: ctx.instance.idDocumento },
                                //fields: ['idCurso','nombreCurso','claveCurso','modalidad','numeroHoras','fechaInicio','nombreInstructor','idPtc','idUnidadAdmtva','idLocalidad'],
                                include: [
                                {
                                  relation: 'ptc_pertenece',
                                  scope: {
                                    fields:['idPtc','trimestre','anio']
                                  }
                                },{
                                  relation: 'unidad_pertenece',
                                  scope: {
                                    fields:['idUnidadAdmtva','nombre']
                                  }
                                },{
                                  relation: 'localidad_pertenece',
                                  scope: {
                                    fields:['idLocalidad','nombre']
                                  }
                                }]
                            },
                            function(err, Cursoencontrado) {

                                var registro = JSON.parse( JSON.stringify( Cursoencontrado[0] ) );

                                var trimestres = ['PRIMERO','SEGUNDO','TERCERO','CUARTO'];
                                var meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

                                var fechaInicio = new Date(registro.fechaInicio);
                                var fechaFin = new Date(registro.fechaFin);

                                var anexo = '<table cellspacing="0" cellpadding="2" border="1" align="left">'+
                                           '<tr><td>Unidad</<td><td>'+ registro.unidad_pertenece.nombre +'</<td></tr>'+
                                           '<tr><td>Nombre del curso</<td><td>'+ registro.nombreCurso +'</<td></tr>'+
                                           '<tr><td>Modalidad</<td><td>'+ registro.modalidad +'</<td></tr>'+
                                           '<tr><td>Trimestre</<td><td>'+ trimestres[(registro.ptc_pertenece.trimestre-1)] +'</<td></tr>'+
                                           '<tr><td>A&ntilde;o</<td><td>'+ registro.ptc_pertenece.anio +'</<td></tr>'+
                                           '<tr><td>Localidad</<td><td>'+ registro.localidad_pertenece.nombre +'</<td></tr>'+
                                           '<tr><td>¿Programado en el PTC?</<td><td>'+ (registro.programadoPTC == true ? 'S&iacute;' : 'No') +'</<td></tr>'+
                                           '<tr><td>Horario</<td><td>'+ registro.horario +'</<td></tr>'+
                                           '<tr><td>Aula asignada</<td><td>'+ registro.aulaAsignada +'</<td></tr>'+
                                           '<tr><td>Horas a la semana</<td><td>'+ registro.horasSemana +'</<td></tr>'+
                                           '<tr><td>Total horas</<td><td>'+ registro.numeroHoras +'</<td></tr>'+
                                           '<tr><td>Costo</<td><td>'+ registro.costo +'</<td></tr>'+
                                           '<tr><td>Cupo m&aacute;ximo</<td><td>'+ registro.cupoMaximo +'</<td></tr>'+
                                           '<tr><td>M&iacute;nimo de inscritos requeridos</<td><td>'+ registro.minRequeridoInscritos +'</<td></tr>'+
                                           '<tr><td>M&iacute;nimo de inscritos pagados requeridos</<td><td>'+ registro.minRequeridoPago +'</<td></tr>'+
                                           '<tr><td>Fecha inicio</<td><td>'+ fechaInicio.getDate() +'/'+ meses[fechaInicio.getMonth()] +'/'+ fechaInicio.getUTCFullYear() + '</<td></tr>'+
                                           '<tr><td>Fecha terminaci&oacute;n</<td><td>'+ fechaFin.getDate() +'/'+ meses[fechaFin.getMonth()] +'/'+ fechaFin.getUTCFullYear() + '</<td></tr>'+
                                           '<tr><td>Instructor</<td><td>'+ registro.nombreInstructor +'</<td></tr>'+
                                           '<tr><td>Curso p&uacute;blico</<td><td>'+ (registro.publico == true ? 'S&iacute;' : 'No') +'</<td></tr>'+
                                           '</table>';

                                
                                if(ctx.instance.accion == 'ENVIO VALIDACION CURSO')
                                {
                                    mensajes.titulo  = 'Aviso de envío del curso '+ registro.nombreCurso +' para validación de pre-apertura';
                                    mensajes.envia  = 'Has enviado un curso para su validaci&oacute;n de pre-apertura con los siguientes datos:<br><br>'+anexo;
                                    mensajes.recibe   = 'Se ha enviado un curso para su validaci&oacute;n de pre-apertura con los siguientes datos:<br><br>'+anexo;
                                }

                                else if(ctx.instance.accion == 'CURSO REVISADO PROGRAMAS')
                                {         
                                    mensajes.titulo = 'Aviso Aprobación Preapertura Curso '+ registro.nombreCurso +' Área de programas';
                                    mensajes.envia  = 'Has marcado el siguiente curso Como revisado y se envi&oacute; a la Direcci&oacute;n T&eacute;cnica Acad&eacute;mica para su aprobaci&oacute;n.<br><br>'+anexo;
                                    mensajes.recibe = 'El siguiente curso ha sido revisado por el Depto. de Programas de Capacitaci&oacute;n y se encuentra en espera de revisi&oacute;n por parte de la Direcci&oacute;n T&eacute;cnica Acad&eacute;mica.<br><br>'+anexo;
                                }
                                else if(ctx.instance.accion == 'CURSO RECHAZADO PROGRAMAS')
                                {         
                                    mensajes.titulo = 'Aviso de rechazo del curso '+ registro.nombreCurso +' para pre-apertura';
                                    mensajes.envia  = 'Has marcado el siguiente curso como rechazado y se ha regresado a la unidad para su revisi&oacute;n.<br><br>'+anexo;
                                    mensajes.recibe = 'El siguiente curso ha sido rechazado y regresado para su revisi&oacute;n.<br><br>'+anexo;
                                }

                                else if(ctx.instance.accion == 'CURSO APROBADO ACADEMICA')
                                {         
                                    mensajes.titulo = 'Aviso Aprobación Preapertura Curso '+ registro.nombreCurso +' Dirección Académica';
                                    mensajes.envia  = 'Has marcado el siguiente curso Como aprobado y se envi&oacute; a la Direcci&oacute;n de Planeaci&oacute;n para su aprobaci&oacute;n.<br><br>'+anexo;
                                    mensajes.recibe = 'El siguiente curso ha sido aprobado por el &aacute;rea acad&eacute;mica y marcado como en espera de revisi&oacute;n por parte de la Direcci&oacute;n de Planeaci&oacute;n.<br><br>'+anexo;
                                }
                                else if(ctx.instance.accion == 'CURSO RECHAZADO ACADEMICA')
                                {         
                                    mensajes.titulo = 'Aviso rechazo Preapertura Curso '+ registro.nombreCurso +' Dirección Académica';
                                    mensajes.envia  = 'Has marcado el siguiente curso como rechazado y se ha regresado al &aacute;rea de programas para su revisi&oacute;n.<br><br>'+anexo;
                                    mensajes.recibe = 'El siguiente curso ha sido rechazado y regresado para su revisi&oacute;n.<br><br>'+anexo;
                                }
                                else if(ctx.instance.accion == 'CURSO APROBADO PLANEACION')
                                {         
                                    mensajes.titulo = 'Aviso Aprobación Preapertura Curso '+ registro.nombreCurso +' Dirección Planeación';
                                    mensajes.envia  = 'Has marcado el siguiente curso Como aprobado y se envi&oacute; a la Direcci&oacute;n de General para su revisi&oacute;n final.<br><br>'+anexo;
                                    mensajes.recibe = 'El siguiente curso ha sido aprobado por el &aacute;rea de planeaci&oacute;n y marcado como en espera de revisi&oacute;n final por parte de la Direcci&oacute;n General.<br><br>'+anexo;
                                }
                                else if(ctx.instance.accion == 'CURSO RECHAZADO PLANEACION')
                                {         
                                    mensajes.titulo = 'Aviso rechazo Preapertura Curso '+ registro.nombreCurso +' Dirección Planeación';
                                    mensajes.envia  = 'Has marcado el siguiente curso como rechazado y se ha regresado a la dir. acad&eacute;mica para su revisi&oacute;n.<br><br>'+anexo;
                                    mensajes.recibe = 'El siguiente curso ha sido rechazado por la dir. de planeaci&oacute;n.<br><br>'+anexo;
                                }
                                else if(ctx.instance.accion == 'CURSO APROBADO DIR GRAL')
                                {         
                                    mensajes.titulo = 'Aviso Aprobación y Aceptación Preapertura Curso '+ registro.nombreCurso;
                                    mensajes.envia  = 'Has marcado el siguiente curso como aceptado y autorizado para su difusi&oacute;n.<br><br>'+anexo;
                                    mensajes.recibe = 'El siguiente curso ha sido aceptado y autorizado para su difusi&oacute;n.<br><br>'+anexo;
                                }
                                else if(ctx.instance.accion == 'CURSO RECHAZADO DIR GRAL')
                                {         
                                    mensajes.titulo = 'Aviso rechazo Preapertura Curso '+ registro.nombreCurso +' Dirección Gral.';
                                    mensajes.envia  = 'Has marcado el siguiente curso como rechazado y se ha regresado a la Direcci&oacute;n de Planeaci&oacute;n para su revisi&oacute;n.<br><br>'+anexo;
                                    mensajes.recibe = 'El siguiente curso ha sido rechazado por la dir. general.<br><br>'+anexo;
                                }

                                enviaCorreos(ctx.instance.id, mensajes, array_envia, array_recibe);

                            });
                    }
                    else if(ctx.instance.proceso == 'Cursos vigentes')
                    {
                            var CursosOficiales = ControlProcesos.app.models.CursosOficiales;

                            CursosOficiales.find({
                              where: {idCurso: ctx.instance.idDocumento },
                              include: [{
                                    relation: 'ptc_pertenece',
                                    scope: {
                                      fields:['idPtc','anio','trimestre'],
                                    }
                                  },{
                                    relation: 'unidad_pertenece',
                                    scope: {
                                      fields:['idUnidadAdmtva','nombre']
                                    }
                                  },{
                                    relation: 'localidad_pertenece',
                                    scope: {
                                      fields:['idLocalidad','nombre']
                                    }
                                  },{
                                    relation: 'inscripcionesCursos',
                                    scope: {
                                      fields:['id','pagado','idAlumno','calificacion','numDocAcreditacion'],
                                      include: {
                                        relation: 'Capacitandos',
                                        scope: {
                                          fields:['apellidoPaterno','apellidoMaterno','nombre','email'],
                                          order: ['apellidoPaterno ASC','apellidoMaterno ASC','nombre ASC']
                                        }
                                      }
                                    }
                              }]
                            },
                            function(err, registrosEncontrados) {

                                var registro = JSON.parse( JSON.stringify( registrosEncontrados[0] ) );

                                var trimestres = ['PRIMERO','SEGUNDO','TERCERO','CUARTO'];
                                var meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

                                var fechaInicio = new Date(registro.fechaInicio);
                                var fechaFin = new Date(registro.fechaFin);
                                
                                if(ctx.instance.accion == 'REPROGRAMACION DE CURSO')
                                {
                                    mensajes.titulo = 'Aviso de reprogramación del curso '+ registro.nombreCurso;
                                    mensajes.envia  = 'Has reprogramado el curso <strong>'+ registro.nombreCurso +'</strong> con la modalidad <strong>'+ registro.modalidad +'</strong> del Trimestre <strong>'+ trimestres[(registro.ptc_pertenece.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.ptc_pertenece.anio +'</strong>, quedando de la siguiente manera:<br><br>';
                                    mensajes.recibe = 'La <strong>'+ registro.unidad_pertenece.nombre +'</strong> ha reprogramado el curso <strong>'+ registro.nombreCurso +'</strong> con la modalidad <strong>'+ registro.modalidad +'</strong> del Trimestre <strong>'+ trimestres[(registro.ptc_pertenece.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.ptc_pertenece.anio +'</strong>, quedando de la siguiente manera:<br><br>';

                                    var anexo = '<table cellspacing="0" cellpadding="2" border="1" align="left">'+                                  
                                                 '<tr><td>Horario</<td><td>'+ registro.horario +'</<td></tr>'+
                                                 '<tr><td>Aula asignada</<td><td>'+ registro.aulaAsignada +'</<td></tr>'+
                                                 '<tr><td>Fecha inicio</<td><td>'+ fechaInicio.getDate() +'/'+ (fechaInicio.getMonth() + 1) +'/'+ fechaInicio.getUTCFullYear() + '</<td></tr>'+
                                                 '<tr><td>Fecha terminaci&oacute;n</<td><td>'+ fechaFin.getDate() +'/'+ (fechaFin.getMonth() + 1) +'/'+ fechaFin.getUTCFullYear() + '</<td></tr>'+
                                                '</table>';

                                    mensajes.envia  += anexo;
                                    mensajes.recibe += anexo;

                                    //ENVIAR CORREO A LOS INSCRITOS
                                    var texto_fecha = fechaInicio.getDate() + ' de ' + meses[fechaInicio.getMonth()] + ' de ' + fechaInicio.getFullYear();
                                    
                                    for (var j = 0; j < registro.inscripcionesCursos.length; j++) {
                                      
                                        var mensaje = `Hola <strong> ${registro.inscripcionesCursos[j].Capacitandos.nombre}</strong>, este correo es para avisarte que el curso <strong>${ registro.nombreCurso }</strong> ha cambiado de fecha para el d&iacute;a 
                                                       <strong>${texto_fecha}</strong>, por favor mantente pendiente de estos cambios para que no pierdas el primer d&iacute;a del curso. ¡Muchas gracias por estudiar y superarte con nosotros!`;


                                        ControlProcesos.app.models.Email.send({
                                          to      : registro.inscripcionesCursos[j].Capacitandos.email,
                                          from    : 'Sistema de Control Escolar del ICATQR <avisos@control-escolar.icatqr.edu.mx>',
                                          subject : 'Aviso de reprogramación del curso ICAT',
                                          html    : mensaje
                                        }, function(err) {
                                          if (err) console.log(err);
                                          //console.log('correo enviado');
                                        });
                                    };

                                }
                                else if(ctx.instance.accion == 'CANCELACION DE CURSO')
                                {
                                    mensajes.titulo = 'Aviso cancelación del curso '+ registro.nombreCurso;
                                    mensajes.envia  = 'Has cancelado el curso <strong>'+ registro.nombreCurso +'</strong> con la modalidad <strong>'+ registro.modalidad +'</strong> del Trimestre <strong>'+ trimestres[(registro.ptc_pertenece.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.ptc_pertenece.anio +'</strong>, Este pasar&aacute; a la secci&oacute;n de hist&oacute;ricos.';
                                    mensajes.recibe = 'La <strong>'+ registro.unidad_pertenece.nombre +'</strong> ha cancelado el curso <strong>'+ registro.nombreCurso +'</strong> con la modalidad <strong>'+ registro.modalidad +'</strong> del Trimestre <strong>'+ trimestres[(registro.ptc_pertenece.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.ptc_pertenece.anio +'</strong>, Este pasar&acute; a la secci&oacute;n de hist&oacute;ricos.';

                                    //ENVIAR CORREO A LOS INSCRITOS
                                    for (var j = 0; j < registro.inscripcionesCursos.length; j++) {
                                      
                                        var mensaje = `Hola <strong> ${registro.inscripcionesCursos[j].Capacitandos.nombre}</strong>, este correo es para avisarte que el curso <strong>${ registro.nombreCurso }</strong> ha sido cancelado,
                                                       por favor si ya habias realizado tu pago puedes pasar a al unidad de capacitaci&oacute;n donde se iba a impartir el curso a buscar el reembolso de tu pago, Sentimos las molestias que esto te ocasiona.`;

                                        ControlProcesos.app.models.Email.send({
                                          to      : registro.inscripcionesCursos[j].Capacitandos.email,
                                          from    : 'Sistema de Control Escolar del ICATQR <avisos@control-escolar.icatqr.edu.mx>',
                                          subject : 'Aviso de cancelación de curso ICAT',
                                          html    : mensaje
                                        }, function(err) {
                                          if (err) console.log(err);
                                          //console.log('correo enviado');
                                        });
                                    };
                                }
                                else if(ctx.instance.accion == 'CONCLUSION DE CURSO')
                                {
                                    mensajes.titulo  = 'Aviso de conclusión del curso '+ registro.nombreCurso;
                                    mensajes.envia   = 'El Curso <strong>'+ registro.nombreCurso +'</strong> con la modalidad <strong>'+ registro.modalidad +'</strong> del Trimestre <strong>'+ trimestres[(registro.ptc_pertenece.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.ptc_pertenece.anio +'</strong> ha <strong>CONCLUIDO</strong>, el siguiente paso es el asiento de calificaciones de los capacitandos';
                                    mensajes.recibe = 'El Curso <strong>'+ registro.nombreCurso +'</strong> con la modalidad <strong>'+ registro.modalidad +'</strong> del Trimestre <strong>'+ trimestres[(registro.ptc_pertenece.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.ptc_pertenece.anio +'</strong> de la <strong>'+ registro.unidad_pertenece.nombre +'</strong> ha <strong>CONCLUIDO</strong>, el siguiente paso es el asiento de calificaciones de los capacitandos';
                                }
                                else if(ctx.instance.accion == 'CIERRE DE CURSO')
                                {         
                                    mensajes.titulo  = 'Aviso de cierre del curso '+ registro.nombreCurso;
                                    mensajes.envia   = 'El Curso <strong>'+ registro.nombreCurso +'</strong> con la modalidad <strong>'+ registro.modalidad +'</strong> del Trimestre <strong>'+ trimestres[(registro.ptc_pertenece.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.ptc_pertenece.anio +'</strong> ha sido <strong>CERRADO</strong> y almacenado como hist&oacute;rico. A continuaci&oacute;n se presenta la lista de capacitandos y sus calificaciones:<br><br>';
                                    mensajes.recibe = 'El Curso <strong>'+ registro.nombreCurso +'</strong> con la modalidad <strong>'+ registro.modalidad +'</strong> del Trimestre <strong>'+ trimestres[(registro.ptc_pertenece.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.ptc_pertenece.anio +'</strong> de la <strong>'+ registro.unidad_pertenece.nombre +'</strong> ha sido <strong>CERRADO</strong> y almacenado como hist&oacute;rico. A continuaci&oacute;n se presenta la lista de capacitandos y sus calificaciones:<br><br>';

                                    var anexo = '';
                                    for(var i = 0; i < registro.inscripcionesCursos.length; i++)
                                      anexo += '<tr><td>'+ (i+1) +'</<td><td>'+ registro.inscripcionesCursos[i].Capacitandos.apellidoPaterno + ' ' + registro.inscripcionesCursos[i].Capacitandos.apellidoMaterno + ' ' + registro.inscripcionesCursos[i].Capacitandos.nombre +'</<td><td>'+ registro.inscripcionesCursos[i].calificacion +'&nbsp;</<td><td>'+ registro.inscripcionesCursos[i].numDocAcreditacion +'&nbsp;</<td></tr>';
                                
                                    var anexo = '<table cellspacing="0" cellpadding="2" border="1" align="left">'+                                   
                                           '<thead>'+
                                           '<th>N&uacute;m.</th>'+
                                           '<th>Nombre</th>'+
                                           '<th>Calificaci&oacute;n</th>'+
                                           '<th>N&uacute;m. documento</th>'+
                                           '</thead>'+
                                           '<tbody>'+
                                           anexo+
                                           '</tbody>'+
                                           '</table>';

                                    mensajes.envia  += anexo;
                                    mensajes.recibe += anexo;
                                }

                                enviaCorreos(ctx.instance.id, mensajes, array_envia, array_recibe);
                            });
                    }
                    else if(ctx.instance.proceso == 'Inscripcion a curso')
                    {
                            //Obtenemos los datos para armar el mensaje
                            var CursosOficiales = ControlProcesos.app.models.CursosOficiales;

                            CursosOficiales.find({
                              where: {idCurso: ctx.instance.idDocumento },
                                    include: [{
                                relation: 'ptc_pertenece',
                                scope: {
                                  fields:['idPtc','anio','trimestre'],
                                }
                                  },{
                                relation: 'unidad_pertenece',
                                scope: {
                                  fields:['idUnidadAdmtva','nombre']
                                }
                                  },{
                                relation: 'localidad_pertenece',
                                scope: {
                                  fields:['idLocalidad','nombre']
                                }
                                  },{
                                relation: 'inscripcionesCursos',
                                scope: {
                                  fields:['id','pagado','idAlumno','calificacion','numFactura'],
                                  include: {
                                    relation: 'Capacitandos',
                                    scope: {
                                      fields:['apellidoPaterno','apellidoMaterno','nombre','curp'],
                                      order: ['apellidoPaterno ASC','apellidoMaterno ASC','nombre ASC']
                                    }
                                  }
                                }
                              }]
                            },
                            function(err, registrosEncontrados) {

                                var registro = JSON.parse( JSON.stringify( registrosEncontrados[0] ) );

                                var trimestres = ['PRIMERO','SEGUNDO','TERCERO','CUARTO'];
                                var estatus = ['No pagado','Pagado','Exento al 100%','Exento con porcentaje'];
                                
                                if(ctx.instance.accion == 'ALCANCE MINIMO INSCRITOS')
                                {
                                    mensajes.titulo  = 'Aviso alcance de mínimo de inscripción curso '+ registro.nombreCurso;
                                    mensajes.envia   = 'El Curso <strong>'+ registro.nombreCurso +'</strong> con la modalidad <strong>'+ registro.modalidad +'</strong> del Trimestre <strong>'+ trimestres[(registro.ptc_pertenece.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.ptc_pertenece.anio +'</strong>, ha alcanzado el m&iacute;nimo de personas inscritas';
                                    mensajes.recibe = 'El Curso <strong>'+ registro.nombreCurso +'</strong> con la modalidad <strong>'+ registro.modalidad +'</strong> del Trimestre <strong>'+ trimestres[(registro.ptc_pertenece.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.ptc_pertenece.anio +'</strong> de la <strong>'+ registro.unidad_pertenece.nombre +'</strong>, ha alcanzado el m&iacute;nimo de personas inscritas';
                                }
                                else if(ctx.instance.accion == 'ALCANCE MINIMO PAGADOS')
                                {         
                                    mensajes.titulo  = 'Aviso alcance de mínimo de inscritos pagados curso '+ registro.nombreCurso;
                                    mensajes.envia   = 'El Curso <strong>'+ registro.nombreCurso +'</strong> con la modalidad <strong>'+ registro.modalidad +'</strong> del Trimestre <strong>'+ trimestres[(registro.ptc_pertenece.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.ptc_pertenece.anio +'</strong>, ha alcanzado el m&iacute;nimo de personas inscritas y se ha marcado el curso como <strong>ACTIVO</strong>';
                                    mensajes.recibe = 'El Curso <strong>'+ registro.nombreCurso +'</strong> con la modalidad <strong>'+ registro.modalidad +'</strong> del Trimestre <strong>'+ trimestres[(registro.ptc_pertenece.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.ptc_pertenece.anio +'</strong> de la <strong>'+ registro.unidad_pertenece.nombre +'</strong>, ha alcanzado el m&iacute;nimo de personas inscritas y se ha marcado el curso como <strong>ACTIVO</strong>';

                                    var anexo = '';
                                    for(var i = 0; i < registro.inscripcionesCursos.length; i++)
                                      anexo += '<tr><td>'+ (i+1) +'</<td><td>'+ registro.inscripcionesCursos[i].Capacitandos.apellidoPaterno + ' ' + registro.inscripcionesCursos[i].Capacitandos.apellidoMaterno + ' ' + registro.inscripcionesCursos[i].Capacitandos.nombre +'</<td><td>'+ estatus[registro.inscripcionesCursos[i].pagado] +'</<td><td>'+ registro.inscripcionesCursos[i].numFactura +'&nbsp;</<td></tr>';
                                
                                    var anexo = '<br><br>Esta es la lista de personas inscritas:<br><br>'+
                                               '<table cellspacing="0" cellpadding="2" border="1" align="left">'+                                  
                                               '<thead>'+
                                               '<th>N&uacute;m.</th>'+
                                               '<th>Nombre</th>'+
                                               '<th>Estatus pago</th>'+
                                               '<th>N&uacute;m. Factura</th>'+
                                               '</thead>'+
                                               '<tbody>'+
                                               anexo+
                                               '</tbody>'+
                                               '</table>';

                                    mensajes.envia   += anexo;
                                    mensajes.recibe  += anexo;
                                }
                                else if(ctx.instance.accion == 'REVERSION MINIMO PAGADOS')
                                {         
                                    mensajes.titulo  = 'Aviso del cambio de inscritos pagados curso '+ registro.nombreCurso;
                                    mensajes.envia   = 'La inscripci&oacute;n del Curso <strong>'+ registro.nombreCurso +'</strong> con la modalidad <strong>'+ registro.modalidad +'</strong> del Trimestre <strong>'+ trimestres[(registro.ptc_pertenece.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.ptc_pertenece.anio +'</strong> ha variado y ha quedado abajo del m&iacute;nimo de inscritos pagados y se ha marcado el curso como <strong>EN ESPERA</strong>';
                                    mensajes.recibe = 'La inscripci&oacute;n del Curso <strong>'+ registro.nombreCurso +'</strong> con la modalidad <strong>'+ registro.modalidad +'</strong> del Trimestre <strong>'+ trimestres[(registro.ptc_pertenece.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.ptc_pertenece.anio +'</strong> de la <strong>'+ registro.unidad_pertenece.nombre +'</strong> ha variado y ha quedado abajo del m&iacute;nimo de inscritos pagados y se ha marcado el curso como <strong>EN ESPERA</strong>';

                                    var anexo = '';
                                    for(var i = 0; i < registro.inscripcionesCursos.length; i++)
                                      anexo += '<tr><td>'+ (i+1) +'</<td><td>'+ registro.inscripcionesCursos[i].Capacitandos.apellidoPaterno + ' ' + registro.inscripcionesCursos[i].Capacitandos.apellidoMaterno + ' ' + registro.inscripcionesCursos[i].Capacitandos.nombre +'</<td><td>'+ estatus[registro.inscripcionesCursos[i].pagado] +'</<td><td>'+ registro.inscripcionesCursos[i].numFactura +'&nbsp;</<td></tr>';
                                
                                    var anexo = '<br><br>Esta es la lista de personas inscritas:<br><br>'+
                                               '<table cellspacing="0" cellpadding="2" border="1" align="left">'+                                  
                                               '<thead>'+
                                               '<th>N&uacute;m.</th>'+
                                               '<th>Nombre</th>'+
                                               '<th>Estatus pago</th>'+
                                               '<th>N&uacute;m. Factura</th>'+
                                               '</thead>'+
                                               '<tbody>'+
                                               anexo+
                                               '</tbody>'+
                                               '</table>';

                                    mensajes.envia   += anexo;
                                    mensajes.recibe  += anexo;
                                }

                                enviaCorreos(ctx.instance.id, mensajes, array_envia, array_recibe);
                            });
                    }
                    else if(ctx.instance.proceso === 'Pre-Apertura Evaluacion')
                    {
                            var Evaluacion = ControlProcesos.app.models.Evaluacion;

                            Evaluacion.find({
                                where: {idEvaluacion: ctx.instance.idEvaluacion},
                                include: [
                                {
                                  relation: 'ptc_pertenece',
                                  scope: {
                                    fields:['idPtc','trimestre','anio']
                                  }
                                },{
                                  relation: 'unidad_pertenece',
                                  scope: {
                                    fields:['idUnidadAdmtva','nombre']
                                  }
                                },{
                                  relation: 'localidad_pertenece',
                                  scope: {
                                    fields:['idLocalidad','nombre']
                                  }
                                },{
                                  relation: 'inscripcionesEvaluaciones',
                                  scope: {
                                    fields:['id','pagado','idAlumno','numFactura'],
                                    include: {
                                      relation: 'Capacitandos',
                                      scope: {
                                        fields:['nombreCompleto','email'],
                                        order: ['nombreCompleto ASC']
                                      }
                                    }
                                  }
                                }]
                            },
                            function(err, EvaluacionEncontrada) {

                                var registro = JSON.parse( JSON.stringify( EvaluacionEncontrada[0] ) );
                                var trimestres = ['PRIMERO','SEGUNDO','TERCERO','CUARTO'];
                                var meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

                                var fechaEvaluacion = new Date(registro.fechaEvaluacion);

                                if(registro.tipoEvaluacion == 1)
                                    var nombreEvaluacion = registro.nombreCurso;
                                else
                                    var nombreEvaluacion = registro.nombreEstandar;

                                if(registro.tipoEvaluacion == 1)
                                    var tipo = 'ROCO';
                                else
                                    var tipo = 'Estándar de competencia';


                                var anexo = '<table cellspacing="0" cellpadding="2" border="1" align="left">'+
                                           '<tr><td>Unidad</<td><td>'+ registro.unidad_pertenece.nombre +'</<td></tr>'+
                                           '<tr><td>Evaluaci&oacute;n</<td><td>'+ nombreEvaluacion +'</<td></tr>'+
                                           '<tr><td>Tipo</<td><td>'+ tipo +'</<td></tr>'+
                                           '<tr><td>Persona a evaluar</<td><td>'+ registro.inscripcionesEvaluaciones[0].Capacitandos.nombreCompleto +'</<td></tr>'+
                                           '<tr><td>Lugar evauaci&oacute;n</<td><td>'+ registro.aulaAsignada +'</<td></tr>'+
                                           '<tr><td>Fecha plan evaluaci&oacute;n</<td><td>'+ fechaEvaluacion.getDate() +'/'+  meses[fechaEvaluacion.getMonth()] +'/'+ fechaEvaluacion.getUTCFullYear() + '</<td></tr>'+
                                           '<tr><td>Hora</<td><td>'+ registro.horaEvaluacion +'</<td></tr>'+
                                           '<tr><td>Costo</<td><td>$'+ registro.costo +'</<td></tr>'+
                                           '<tr><td>Estatus pago</<td><td>$'+ registro.inscripcionesEvaluaciones[0].pagado +'</<td></tr>'+
                                           
                                           '<tr><td>Trimestre</<td><td>'+ trimestres[(registro.ptc_pertenece.trimestre-1)] +'</<td></tr>'+
                                           '<tr><td>A&ntilde;o</<td><td>'+ registro.ptc_pertenece.anio +'</<td></tr>'+
                                           '<tr><td>Evaluador</<td><td>'+ registro.nombreInstructor +'</<td></tr>'+
                                           '</table>';

                                
                                if(ctx.instance.accion == 'ENVIO VALIDACION EVALUACION')
                                {
                                    mensajes.titulo  = 'Aviso de envío de la evaluación '+ registro.nombreCurso +' para validación';
                                    mensajes.envia  = 'Has enviado una evaluaci&oacute;n para su validaci&oacute;n con los siguientes datos:<br><br>'+anexo;
                                    mensajes.recibe   = 'Se ha enviado una evaluaci&oacute;n para su validaci&oacute;n con los siguientes datos:<br><br>'+anexo;
                                }

                                else if(ctx.instance.accion == 'EVALUACION REVISADA PROGRAMAS')
                                {         
                                    mensajes.titulo = 'Aviso Aprobación evaluación '+ registro.nombreCurso +' Área de programas';
                                    mensajes.envia  = 'Has marcado la siguiente evaluaci&oacute;n como revisada y se envi&oacute; a la Direcci&oacute;n T&eacute;cnica Acad&eacute;mica para su aprobaci&oacute;n.<br><br>'+anexo;
                                    mensajes.recibe = 'La siguiente evaluaci&oacute;n ha sido revisada por el Depto. de Programas de Capacitaci&oacute;n y se encuentra en espera de revisi&oacute;n por parte de la Direcci&oacute;n T&eacute;cnica Acad&eacute;mica.<br><br>'+anexo;
                                }
                                else if(ctx.instance.accion == 'EVALUACION RECHAZADA PROGRAMAS')
                                {         
                                    mensajes.titulo = 'Aviso de rechazo de la evaluación '+ registro.nombreCurso;
                                    mensajes.envia  = 'Has marcado la siguiente evaluaci&oacute;n como rechazada y se ha regresado a la unidad para su revisi&oacute;n.<br><br>'+anexo;
                                    mensajes.recibe = 'La siguiente evaluaci&oacute;n ha sido rechazada y regresada para su revisi&oacute;n.<br><br>'+anexo;
                                }
                                else if(ctx.instance.accion == 'EVALUACION APROBADA ACADEMICA')
                                {         
                                    mensajes.titulo = 'Aviso Aprobación evaluación '+ registro.nombreCurso +' Dirección Académica';
                                    mensajes.envia  = 'Has marcado la siguiente evaluaci&oacute;n como revisada y se envi&oacute; a la Direcci&oacute;n de Planeaci&oacute;n para su aprobaci&oacute;n.<br><br>'+anexo;
                                    mensajes.recibe = 'La siguiente evaluaci&oacute;n ha sido aprobada por el &aacute;rea acad&eacute;mica y marcado como en espera de revisi&oacute;n por parte de la Direcci&oacute;n de Planeaci&oacute;n.<br><br>'+anexo;
                                }
                                else if(ctx.instance.accion == 'EVALUACION RECHAZADA ACADEMICA')
                                {         
                                    mensajes.titulo = 'Aviso rechazo evaluación '+ registro.nombreCurso +' Dirección Académica';
                                    mensajes.envia  = 'Has marcado la siguiente evaluaci&oacute;n como rechazada y se ha regresado al &aacute;rea de programas para su revisi&oacute;n.<br><br>'+anexo;
                                    mensajes.recibe = 'La siguiente evaluaci&oacute;n curso ha sido rechazada y regresada para su revisi&oacute;n.<br><br>'+anexo;
                                }
                                else if(ctx.instance.accion == 'EVALUACION APROBADA PLANEACION')
                                {         
                                    mensajes.titulo = 'Aviso Aprobación evaluación '+ registro.nombreCurso +' Dirección Planeación';
                                    mensajes.envia  = 'Has marcado la siguiente evaluaci&oacute;n como revisada y se envi&oacute; a la Direcci&oacute;n de General para su revisi&oacute;n final.<br><br>'+anexo;
                                    mensajes.recibe = 'La siguiente evaluaci&oacute;n curso ha sido aprobada por el &aacute;rea de planeaci&oacute;n y marcado como en espera de revisi&oacute;n final por parte de la Direcci&oacute;n General.<br><br>'+anexo;
                                }
                                else if(ctx.instance.accion == 'EVALUACION RECHAZADA PLANEACION')
                                {         
                                    mensajes.titulo = 'Aviso rechazo evaluación '+ registro.nombreCurso +' Dirección Planeación';
                                    mensajes.envia  = 'Has marcado la siguiente evaluaci&oacute;n como rechazada y se ha regresado a la dir. acad&eacute;mica para su revisi&oacute;n.<br><br>'+anexo;
                                    mensajes.recibe = 'La siguiente evaluaci&oacute;n ha sido rechazada por la dir. de planeaci&oacute;n.<br><br>'+anexo;
                                }
                                else if(ctx.instance.accion == 'EVALUACION APROBADA DIR GRAL')
                                {         
                                    mensajes.titulo = 'Aviso Aprobación y Aceptación evaluación '+ registro.nombreCurso;
                                    mensajes.envia  = 'Has marcado la siguiente evaluaci&oacute;n como aceptada y autorizada.<br><br>'+anexo;
                                    mensajes.recibe = 'La siguiente evaluaci&oacute;n ha sido aceptada y autorizada.<br><br>'+anexo;
                                }
                                else if(ctx.instance.accion == 'EVALUACION RECHAZADA DIR GRAL')
                                {         
                                    mensajes.titulo = 'Aviso rechazo evaluación '+ registro.nombreCurso +' Dirección Gral.';
                                    mensajes.envia  = 'Has marcado la siguiente evaluaci&oacute;n como rechazada y se ha regresado a la Direcci&oacute;n de Planeaci&oacute;n para su revisi&oacute;n.<br><br>'+anexo;
                                    mensajes.recibe = 'La siguiente evaluaci&oacute;n ha sido rechazada por la dir. general.<br><br>'+anexo;
                                }

                                enviaCorreos(ctx.instance.id, mensajes, array_envia, array_recibe);

                            });
                    }
                    else if(ctx.instance.proceso === 'Evaluaciones vigentes')
                    {
                            var Evaluacion = ControlProcesos.app.models.Evaluacion;

                            Evaluacion.find({
                                where: {idEvaluacion: ctx.instance.idEvaluacion},
                                include: [
                                {
                                  relation: 'ptc_pertenece',
                                  scope: {
                                    fields:['idPtc','trimestre','anio']
                                  }
                                },{
                                  relation: 'unidad_pertenece',
                                  scope: {
                                    fields:['idUnidadAdmtva','nombre']
                                  }
                                },{
                                  relation: 'localidad_pertenece',
                                  scope: {
                                    fields:['idLocalidad','nombre']
                                  }
                                },{
                                  relation: 'inscripcionesEvaluaciones',
                                  scope: {
                                    fields:['id','pagado','idAlumno','numFactura'],
                                    include: {
                                      relation: 'Capacitandos',
                                      scope: {
                                        fields:['nombreCompleto','nombre','email'],
                                        order: ['nombreCompleto ASC']
                                      }
                                    }
                                  }
                                }]
                            },
                            function(err, EvaluacionEncontrada) {

                                var registro = JSON.parse( JSON.stringify( EvaluacionEncontrada[0] ) );

                                var trimestres = ['PRIMERO','SEGUNDO','TERCERO','CUARTO'];
                                var meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

                                var fechaEvaluacion = new Date(registro.fechaEvaluacion);

                                var anexo = '<table cellspacing="0" cellpadding="2" border="1" align="left">'+
                                           '<tr><td>Unidad</<td><td>'+ registro.unidad_pertenece.nombre +'</<td></tr>'+
                                           '<tr><td>Persona a evaluar</<td><td>'+ registro.inscripcionesEvaluaciones[0].Capacitandos.nombreCompleto +'</<td></tr>'+
                                           '<tr><td>Evaluaci&oacute;n</<td><td>'+ registro.nombreCurso +'</<td></tr>'+
                                           '<tr><td>Modalidad</<td><td>'+ registro.modalidad +'</<td></tr>'+
                                           '<tr><td>Trimestre</<td><td>'+ trimestres[(registro.ptc_pertenece.trimestre-1)] +'</<td></tr>'+
                                           '<tr><td>A&ntilde;o</<td><td>'+ registro.ptc_pertenece.anio +'</<td></tr>'+
                                           //'<tr><td>Localidad</<td><td>'+ registro.localidad_pertenece.nombre +'</<td></tr>'+
                                           '<tr><td>Hora</<td><td>'+ registro.horaEvaluacion +'</<td></tr>'+
                                           '<tr><td>Aula asignada</<td><td>'+ registro.aulaAsignada +'</<td></tr>'+
                                           '<tr><td>Costo</<td><td>'+ registro.costo +'</<td></tr>'+
                                           '<tr><td>Fecha aplicaci&oacute;n</<td><td>'+ fechaEvaluacion.getDate() +'/'+  meses[fechaEvaluacion.getMonth()] +'/'+ fechaEvaluacion.getUTCFullYear() + '</<td></tr>'+
                                           '<tr><td>Evaluador</<td><td>'+ registro.nombreInstructor +'</<td></tr>'+
                                           '</table>';

                                
                                if(ctx.instance.accion == 'CANCELACION DE EVALUACION')
                                {
                                    mensajes.titulo = 'Aviso cancelación de la evaluación '+ registro.nombreCurso;
                                    mensajes.envia  = 'Has cancelado la evaluaci&oacute;n descrita a continuaci&oacute;n, Este pasar&aacute; a la secci&oacute;n de hist&oacute;ricos y se le dar&aacute; aviso a la persona inscrita.<br><br>'+anexo;
                                    mensajes.recibe  = 'Has sido cancelada la evaluaci&oacute;n descrita a continuaci&oacute;n, Este pasar&aacute; a la secci&oacute;n de hist&oacute;ricos y se le dar&aacute; aviso a la persona inscrita.<br><br>'+anexo;

                                    //ENVIAR CORREO A LOS INSCRITOS
                                    for (var j = 0; j < registro.inscripcionesEvaluaciones.length; j++) {
                                      
                                        var mensaje = `Hola <strong> ${registro.inscripcionesEvaluaciones[j].Capacitandos.nombre}</strong>, este correo es para avisarte que la evaluaci&oacute;n <strong>${ registro.nombreCurso }</strong> a la cual te inscribiste ha sido cancelada,
                                                       por favor pasa a al unidad de capacitaci&oacute;n a arreglar esta situaci&oacute;n, Sentimos las molestias que esto te ocasiona.`;

                                        ControlProcesos.app.models.Email.send({
                                          to      : registro.inscripcionesEvaluaciones[j].Capacitandos.email,
                                          from    : 'Sistema de Control Escolar del ICATQR <avisos@control-escolar.icatqr.edu.mx>',
                                          subject : 'Aviso de cancelación de evaluación ICAT',
                                          html    : mensaje
                                        }, function(err) {
                                          if (err) console.log(err);
                                          //console.log('correo enviado');
                                        });
                                    };
                                }
                                else if(ctx.instance.accion == 'CIERRE DE EVALUACION')
                                {         
                                    mensajes.titulo = 'Aviso cierre evaluación '+ registro.nombreCurso;
                                    mensajes.envia  = 'Has marcado como <strong>CERRADA Y CONCLUIDA</strong> la evaluaci&oacute;n descrita a continuaci&oacute;n; esta pasar&aacute; a la secci&oacute;n de hist&oacute;ricos.<br><br>'+anexo;
                                    mensajes.recibe  = 'La siguiente evaluaci&oacute;n ha sido marcada como <strong>CERRADA Y CONCLUIDA</strong>; esta pasar&aacute; a la secci&oacute;n de hist&oacute;ricos.<br><br>'+anexo;
                                }

                                enviaCorreos(ctx.instance.id, mensajes, array_envia, array_recibe);

                            });
                    }
              }



              function enviaCorreos(idControlProcesos, mensajes, array_envia, array_recibe) {

                  if(mensajes.envia != '')
                  {
                        if(array_envia.length > 0)
                        {
                              ControlProcesos.app.models.Email.send({
                                to      : array_envia[0].email,
                                from    : 'Sistema de Control Escolar del ICATQR <avisos@control-escolar.icatqr.edu.mx>',
                                subject : mensajes.titulo,
                                html    : mensajes.envia + '<br><br><br>* Este correo es generado autom&aacute;ticamente, favor de no contestar.'
                              }, function(err) {
                                if (err) console.log(err);
                                //console.log('> envio del correo de aviso al remitente');
                              });         

                              ControlProcesos.app.models.DestinatariosAvisos.create({
                                idControlProcesos : idControlProcesos,
                                idUsuario         : array_envia[0].idUsuario
                              }, function(err, respuesta) {
                                if (err) throw err;
                              });
                        }
                  }

                  if(mensajes.recibe != '')
                  {
                      for (var j = 0; j < array_recibe.length; j++) {
                        
                          ControlProcesos.app.models.Email.send({
                            to      : array_recibe[j].email,
                            from    : 'Sistema de Control Escolar del ICATQR <avisos@control-escolar.icatqr.edu.mx>',
                            subject : mensajes.titulo,
                            html    : mensajes.recibe + '<br><br><br>* Este correo es generado autom&aacute;ticamente, favor de no contestar.'
                          }, function(err) {
                            if (err) console.log(err);
                            //console.log('> envio del correo de aviso a central');
                          });

                          ControlProcesos.app.models.DestinatariosAvisos.create({
                            idControlProcesos : idControlProcesos,
                            idUsuario         : array_recibe[j].idUsuario
                          }, function(err, respuesta) {
                            if (err) console.log(err);
                          });

                      };
                  }
              };

        //next();
    });
};
