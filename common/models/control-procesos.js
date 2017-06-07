module.exports = function(ControlProcesos) {

    ControlProcesos.observe('after save', function(ctx, next) {
              //El mensaje se le va a enviar a dos tipos de destinatarios, el que envia como un aviso de que ya se envió, y la persona o personas que de acuerdo a su perfil
              //deben recibir el mensaje.

              var array_envia   = [];
              var array_recibe  = [];
              var condicion     = {};
              var mensajes      = {
                titulo : '',
                envia  : '',
                recibe : ''
              };

              var Usuario = ControlProcesos.app.models.Usuario;

              //Buscamos al usuario que disapara el evento para enviarle el aviso
              Usuario.find({
                where:  {idUsuario: ctx.instance.idUsuario}, 
                fields: ['idUsuario','nombre', 'email'],
                include: [
                  {
                      relation: 'unidad_revisa',
                      scope: {
                          fields:['idUnidadAdmtva','nombre']
                      }
                  }
                ]
              },
              function(err, usuarioEncontrado) {
                
                    var usuarioRecord = JSON.parse( JSON.stringify( usuarioEncontrado[0] ) );
                    array_envia.push({
                      idUsuario : usuarioRecord.idUsuario,
                      nombre    : usuarioRecord.nombre,
                      email     : usuarioRecord.email
                    });

                    //Ahora buscamos a los usuarios que de acuerdo a su perfil van a recibir el mensaje, no tomando en cuenta al usuario que dispara el proceso.
                    //Buscamos al dueño del documento para informarle del rechazo
                    
                    //console.log("idProcesoPadre: " + JSON.stringify(ctx.instance));

                    ControlProcesos.findById(ctx.instance.id, 
                    {
                      fields: ['idProcesoPadre']
                    },
                    function(err, respuesta) {

                          //console.log("idProcesoPadre: " + respuesta.idProcesoPadre);

                          var idPadre = respuesta.idProcesoPadre;
                          if(respuesta.idProcesoPadre == 0)
                              idPadre = ctx.instance.id;
                            
                          ControlProcesos.findById(idPadre, 
                          {
                            fields: ['idUsuario'],
                            include: {
                              relation: 'usuario_pertenece',
                              scope: {
                                fields: ['idUsuario','nombre','email']
                              }
                            }
                          },
                          function(err, userEn) {

                                var usuarioEn = JSON.parse(JSON.stringify(userEn));
                                var usuario_pertenece = JSON.parse(JSON.stringify(usuarioEn.usuario_pertenece));

                                //console.log("usuario_pertenece:" +usuario_pertenece.nombre);
                                if( (ctx.instance.accion == 'PTC RECHAZADO PROGRAMAS') || (ctx.instance.accion == 'PTC APROBADO DIR GRAL') || (ctx.instance.accion == 'CURSO RECHAZADO PROGRAMAS')  || (ctx.instance.accion == 'CURSO APROBADO DIR GRAL') || (ctx.instance.accion == 'EVALUACION RECHAZADA PROGRAMAS') || (ctx.instance.accion == 'EVALUACION APROBADA DIR GRAL') )
                                {
                                      array_recibe.push({
                                        idUsuario : usuario_pertenece.idUsuario,
                                        nombre    : usuario_pertenece.nombre,
                                        email     : usuario_pertenece.email
                                      });
                                }

                                if(ctx.instance.accion == 'ENVIO REVISION PTC')
                                  var tipo_aviso = {avisoEnvioPTC: true}
                                else if(ctx.instance.accion == 'PTC REVISADO PROGRAMAS')
                                  var tipo_aviso = {avisoRevisonPTCProgr: true}
                                else if(ctx.instance.accion == 'PTC RECHAZADO PROGRAMAS')
                                  var tipo_aviso = {avisoRechazoPTCProgr: true}
                                else if(ctx.instance.accion == 'PTC APROBADO ACADEMICA')
                                  var tipo_aviso = {avisoRevisonPTCAcad: true}
                                else if(ctx.instance.accion == 'PTC RECHAZADO ACADEMICA')
                                  var tipo_aviso = {avisoRechazoPTCAcad: true}
                                else if(ctx.instance.accion == 'PTC APROBADO PLANEACION')
                                  var tipo_aviso = {avisoRevisonPTCPlan: true}
                                else if(ctx.instance.accion == 'PTC RECHAZADO PLANEACION')
                                  var tipo_aviso = {avisoRechazoPTCPlan: true}
                                else if(ctx.instance.accion == 'PTC APROBADO DIR GRAL')
                                  var tipo_aviso = {avisoRevisionPTCGral: true}
                                else if(ctx.instance.accion == 'PTC RECHAZADO DIR GRAL')
                                  var tipo_aviso = {avisoRechazoPTCGral: true}


                                else if(ctx.instance.accion == 'ENVIO VALIDACION CURSO')
                                  var tipo_aviso = {avisoEnvioPreapCurso: true}
                                else if(ctx.instance.accion == 'CURSO REVISADO PROGRAMAS')
                                  var tipo_aviso = {avisoRevisionPreapCursoProgr: true}
                                else if(ctx.instance.accion == 'CURSO RECHAZADO PROGRAMAS')
                                  var tipo_aviso = {avisoRechazoPreapCursoProgr: true}

                                else if(ctx.instance.accion == 'CURSO APROBADO ACADEMICA')
                                  var tipo_aviso = {avisoRevisionPreapCursoAcad: true}
                                else if(ctx.instance.accion == 'CURSO RECHAZADO ACADEMICA')
                                  var tipo_aviso = {avisoRechazoPreapCursoAcad: true}

                                else if(ctx.instance.accion == 'CURSO APROBADO PLANEACION')
                                  var tipo_aviso = {avisoRevisionPreapCursoPlan: true}
                                else if(ctx.instance.accion == 'CURSO RECHAZADO PLANEACION')
                                  var tipo_aviso = {avisoRechazoPreapCursoPlan: true}

                                else if(ctx.instance.accion == 'CURSO APROBADO DIR GRAL')
                                  var tipo_aviso = {avisoRevisionPreapCursoGral: true}
                                else if(ctx.instance.accion == 'CURSO RECHAZADO DIR GRAL')
                                  var tipo_aviso = {avisoRechazoPreapCursoGral: true}

                                else if(ctx.instance.accion == 'REPROGRAMACION DE CURSO')
                                  var tipo_aviso = {avisoReprogCurso: true}
                                else if(ctx.instance.accion == 'CANCELACION DE CURSO')
                                  var tipo_aviso = {avisoCancelacionCurso: true}
                                else if(ctx.instance.accion == 'CONCLUSION DE CURSO')
                                  var tipo_aviso = {avisoTerminacionCurso: true}
                                else if(ctx.instance.accion == 'CIERRE DE CURSO')
                                  var tipo_aviso = {avisoCierreCurso: true}

                                else if(ctx.instance.accion == 'ALCANCE MINIMO INSCRITOS')
                                  var tipo_aviso = {avisoMinimoInscritosCurso: true}
                                else if(ctx.instance.accion == 'ALCANCE MINIMO PAGADOS')
                                  var tipo_aviso = {avisoMinimoPagadosCurso: true}
                                else if(ctx.instance.accion == 'REVERSION MINIMO PAGADOS')
                                  var tipo_aviso = {avisoReversionPagadosCurso: true}

                                else if(ctx.instance.accion == 'ENVIO VALIDACION')
                                  var tipo_aviso = {avisoEnvioEvaluacion: true}

                                else if(ctx.instance.accion == 'EVALUACION REVISADA PROGRAMAS')
                                  var tipo_aviso = {avisoRevisionEvaluacionProgr: true}
                                else if(ctx.instance.accion == 'EVALUACION RECHAZADA PROGRAMAS')
                                  var tipo_aviso = {avisoRechazoEvaluacionProgr: true}

                                else if(ctx.instance.accion == 'EVALUACION APROBADA ACADEMICA')
                                  var tipo_aviso = {avisoRevisionEvaluacionAcad: true}
                                else if(ctx.instance.accion == 'EVALUACION RECHAZADA ACADEMICA')
                                  var tipo_aviso = {avisoRechazoEvaluacionAcad: true}

                                else if(ctx.instance.accion == 'EVALUACION APROBADA PLANEACION')
                                  var tipo_aviso = {avisoRevisionEvaluacionPlan: true}
                                else if(ctx.instance.accion == 'EVALUACION RECHAZADA PLANEACION')
                                  var tipo_aviso = {avisoRechazoEvaluacionPlan: true}

                                else if(ctx.instance.accion == 'EVALUACION APROBADA DIR GRAL')
                                  var tipo_aviso = {avisoRevisionEvaluacionGral: true}
                                else if(ctx.instance.accion == 'EVALUACION RECHAZADA DIR GRAL')
                                  var tipo_aviso = {avisoRechazoEvaluacionGral: true}

                                else if(ctx.instance.accion == 'CANCELACION DE EVALUACION')
                                  var tipo_aviso = {avisoCancelacionEvaluacion: true}
                                else if(ctx.instance.accion == 'CIERRE DE EVALUACION')
                                  var tipo_aviso = {avisoCierreEvaluacion: true}

                                condicion = {
                                    and: [
                                      {idUsuario: {neq: array_envia[0].idUsuario}},
                                      {idUnidadAdmtva: 1},
                                      {activo: true},
                                      tipo_aviso
                                    ]
                                };

                                Usuario.find({
                                  where:  condicion, 
                                  fields: ['idUsuario', 'nombre', 'email'],
                                  include: [
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

                                      for (var i = 0; i < usuarioRecord.length; i++) {
                                          var unidad_revisa_usuario = JSON.parse( JSON.stringify( usuarioRecord[i].unidad_revisa ) );

                                          //console.log(unidad_revisa_usuario);
                                          //console.log("****************************************************************");

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
                                      };

                                      //console.log("array_recibe: " + JSON.stringify(array_recibe));
                                      //console.log("*************************************************************");
                                      PreparaMensajes(ctx.instance.accion, array_envia, array_recibe);
                                });


                          });
                    });

              });



              function PreparaMensajes(accion, array_envia, array_recibe) {

                    //Obtenemos los datos para armar el mensaje
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
                                          from    : 'control-escolar@icatqr.edu.mx',
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
                                          from    : 'control-escolar@icatqr.edu.mx',
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

                                
                                if(ctx.instance.accion == 'ENVIO VALIDACION')
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
                                          from    : 'control-escolar@icatqr.edu.mx',
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
                      ControlProcesos.app.models.Email.send({
                        to      : array_envia[0].email,
                        from    : 'control-escolar@icatqr.edu.mx',
                        subject : mensajes.titulo,
                        html    : mensajes.envia
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

                  if(mensajes.recibe != '')
                  {
                      for (var j = 0; j < array_recibe.length; j++) {
                        
                          ControlProcesos.app.models.Email.send({
                            to      : array_recibe[j].email,
                            from    : 'control-escolar@icatqr.edu.mx',
                            subject : mensajes.titulo,
                            html    : mensajes.recibe
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

        next();
    });
};
