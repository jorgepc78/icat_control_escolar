module.exports = function(ControlProcesos) {

    ControlProcesos.observe('after save', function(ctx, next) {
        //El mensaje se le va a enviar a dos tipos de destinatarios, el que envia como un aviso de que ya se envió, y la persona o personas que de acuerdo a su perfil
        //deben recibir el mensaje.

        var array_envia  = [];
        var array_recibe = [];
        var condicion    = {};
        var mensajes     = {
          titulo : '',
          envia  : '',
          recibe: ''
        };

        var Usuario = ControlProcesos.app.models.Usuario;

        //Buscamos al usuario que disapara el evento para enviarle el aviso
        Usuario.find({
          where:  {idUsuario: ctx.instance.idUsuario}, 
          fields: ['idUsuario','nombre', 'email']
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

                          console.log("usuario_pertenece:" +usuario_pertenece);
                          if( (ctx.instance.accion == 'PTC RECHAZADO') || (ctx.instance.accion == 'PTC APROBADO - ACEPTADO DIR GRAL') || (ctx.instance.accion == 'RECHAZO PRE-APERTURA') )
                          {
                                array_recibe.push({
                                  idUsuario : usuario_pertenece.idUsuario,
                                  nombre    : usuario_pertenece.nombre,
                                  email     : usuario_pertenece.email
                                });
                          }

                          if(ctx.instance.accion == 'ENVIO REVISION')
                            var tipo_aviso = {avisoEnvioPTC: true}
                          else if(ctx.instance.accion == 'PTC RECHAZADO')
                            var tipo_aviso = {avisoRechazoPTC: true}
                          else if(ctx.instance.accion == 'PTC REVISADO PROGRAMAS')
                            var tipo_aviso = {avisoRevisonPTCProgr: true}
                          else if(ctx.instance.accion == 'PTC APROBADO ACADEMICA')
                            var tipo_aviso = {avisoRevisonPTCAcad: true}
                          else if(ctx.instance.accion == 'PTC APROBADO PLANEACION')
                            var tipo_aviso = {avisoRevisonPTCPlan: true}
                          else if(ctx.instance.accion == 'PTC APROBADO - ACEPTADO DIR GRAL')
                            var tipo_aviso = {avisoAceptacionPTC: true}
                          else if(ctx.instance.accion == 'RECHAZO PRE-APERTURA')
                            var tipo_aviso = {avisoRechazoPreapCurso: true}

                          condicion = {
                              and: [
                                {idUsuario: {neq: array_envia[0].idUsuario}},
                                {idUnidadAdmtva: 1},
                                tipo_aviso
                              ]
                          };

                          Usuario.find({
                            where:  condicion, 
                            fields: ['idUsuario', 'nombre', 'email']
                          },
                          function(err, usuarioEncontrado) {
                            
                                var usuarioRecord = JSON.parse( JSON.stringify( usuarioEncontrado ) );

                                for (var i = 0; i < usuarioRecord.length; i++) {
                                    array_recibe.push({
                                      idUsuario : usuarioRecord[i].idUsuario,
                                      nombre    : usuarioRecord[i].nombre,
                                      email     : usuarioRecord[i].email
                                    });
                                };

                                console.log(array_recibe);
                                console.log("*************************************************************");
                                PreparaMensajes(ctx.instance.accion, array_envia, array_recibe);
                          });


                    });
              });

        });







        function PreparaMensajes(accion, array_envia, array_recibe) {

              //Obtenemos los datos para armar el mensaje
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
                  
                  if(ctx.instance.accion == 'ENVIO REVISION')
                  {
                      mensajes.titulo = 'Aviso de envío de revisión del PTC';
                      mensajes.envia  = 'Has enviado El PTC del Trimestre <strong>'+ trimestres[(registro.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.anio +'</strong> para su revisi&oacute;n.';
                      mensajes.recibe = 'La <strong>'+ registro.unidad_pertenece.nombre +'</strong> ha enviado el PTC del Trimestre <strong>'+ trimestres[(registro.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.anio +'</strong> para su revisi&oacute;n.';
                  }
                  else if(ctx.instance.accion == 'PTC RECHAZADO')
                  {         
                      mensajes.titulo = 'Aviso de PTC rechazado';
                      mensajes.envia  = 'Has marcado El PTC del Trimestre <strong>'+ trimestres[(registro.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.anio +'</strong> de la <strong>'+ registro.unidad_pertenece.nombre +'</strong> como rechazado y se ha regresado a la unidad para su revisi&oacute;n.';
                      mensajes.recibe = 'El PTC del Trimestre <strong>'+ trimestres[(registro.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.anio +'</strong>, ha sido rechazado y regresado para su revisi&oacute;n.';
                  }
                  else if(ctx.instance.accion == 'PTC REVISADO PROGRAMAS')
                  {         
                      mensajes.titulo = 'Aviso Aprobación del PTC Depto. programas';
                      mensajes.envia  = 'Has marcado El PTC del Trimestre <strong>'+ trimestres[(registro.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.anio +'</strong> de la <strong>'+ registro.unidad_pertenece.nombre +'</strong> como revisado y se envi&oacute; a la Direcci&oacute;n T&eacute;cnica Acad&eacute;mica para su aprobaci&oacute;n.';
                      mensajes.recibe = 'El PTC del Trimestre <strong>'+ trimestres[(registro.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.anio +'</strong> de la <strong>'+ registro.unidad_pertenece.nombre +'</strong>, ha sido revisado por el Depto. de Programas de Capacitaci&oacute;n y se encuentra en espera de revisi&oacute;n por parte de la Direcci&oacute;n T&eacute;cnica Acad&eacute;mica.';
                  }
                  else if(ctx.instance.accion == 'PTC APROBADO ACADEMICA')
                  {         
                      mensajes.titulo = 'Aviso Aprobación del PTC Área Académica';
                      mensajes.envia  = 'Has marcado El PTC del Trimestre <strong>'+ trimestres[(registro.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.anio +'</strong> de la <strong>'+ registro.unidad_pertenece.nombre +'</strong> como aprobado y se envi&oacute; a la Direcci&oacute;n de Planeaci&oacute;n para su aprobaci&oacute;n.';
                      mensajes.recibe = 'El PTC del Trimestre <strong>'+ trimestres[(registro.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.anio +'</strong> de la <strong>'+ registro.unidad_pertenece.nombre +'</strong>, ha sido aprobado por el &aacute;rea acad&eacute;mica y marcado como en espera de revisi&oacute;n por parte de la Direcci&oacute;n de Planeaci&oacute;n.';
                  }
                  else if(ctx.instance.accion == 'PTC APROBADO PLANEACION')
                  {         
                      mensajes.titulo = 'Aviso Aprobación del PTC Área Planeación';
                      mensajes.envia  = 'Has marcado El PTC del Trimestre <strong>'+ trimestres[(registro.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.anio +'</strong> de la <strong>'+ registro.unidad_pertenece.nombre +'</strong> como aprobado y se envi&oacute; a la Direcci&oacute;n General para su revisi&oacute;n final.';
                      mensajes.recibe = 'El PTC del Trimestre <strong>'+ trimestres[(registro.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.anio +'</strong> de la <strong>'+ registro.unidad_pertenece.nombre +'</strong>, ha sido aprobado por el &aacute;rea de planeaci&oacute;n y marcado como en espera de revisi&oacute;n final por parte de la Direcci&oacute;n General.';
                  }
                  else if(ctx.instance.accion == 'PTC APROBADO - ACEPTADO DIR GRAL')
                  {         
                      mensajes.titulo = 'Aviso Aprobación y Aceptación del PTC';
                      mensajes.envia  = 'Has marcado El PTC del Trimestre <strong>'+ trimestres[(registro.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.anio +'</strong> de la <strong>'+ registro.unidad_pertenece.nombre +'</strong> como aceptado y autorizado para su difusi&oacute;n.';
                      mensajes.recibe = 'El PTC del Trimestre <strong>'+ trimestres[(registro.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ registro.anio +'</strong> de la <strong>'+ registro.unidad_pertenece.nombre +'</strong>, ha sido aceptado y autorizado para su difusi&oacute;n.';
                  }
                  enviaCorreos(ctx.instance.id, mensajes, array_envia, array_recibe);

              });

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
                  if (err) throw err;
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
                      if (err) throw err;
                      //console.log('> envio del correo de aviso a central');
                    });

                    ControlProcesos.app.models.DestinatariosAvisos.create({
                      idControlProcesos : idControlProcesos,
                      idUsuario         : array_recibe[j].idUsuario
                    }, function(err, respuesta) {
                      if (err) throw err;
                    });

                };          
            }

        };


        next();
    });


};
