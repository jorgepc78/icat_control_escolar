module.exports = function(Usuario) {

    Usuario.beforeRemote('**', function(ctx, unused, next) {
      //console.log(ctx.methodString, 'was invoked remotely');
      if( (ctx.methodString == 'Usuario.prototype.updateAttributes') || (ctx.methodString == 'Usuario.create') )
      {
          if(ctx.args.data.password !== undefined) 
          {
            var b = new Buffer(ctx.args.data.password);
            var pass = b.toString('base64');
            ctx.req.body.passw = pass;
          }
      }
      next();
    });

    Usuario.manda_correo_usuario = function(idUsuario, res, callback) {

        Usuario.find({
            where: {
              idUsuario: idUsuario
            }
        },
        function(err, resultado) {

            var b = new Buffer(resultado[0].passw, 'base64')
            var pass = b.toString();


            var mensaje = `Hola <strong> ${resultado[0].nombre}</strong>, este es tu usuario para iniciar sesi&oacute;n en el sistema de Control Escolar:<br><br> 
                           <strong>Usuario: </strong>${resultado[0].username}<br>
                           <strong>Password: </strong>${pass}<br><br>
                           Guarda estos datos en un lugar seguro y que recuerdes, ya que es tu usuario para iniciar sesi&oacute;n en el sistema.`;

            Usuario.app.models.Email.send({
              to: resultado[0].email,
              from: 'Sistema de Control Escolar del ICATQR <avisos@control-escolar.icatqr.edu.mx>',
              subject: 'Datos de inicio en el sistema de Control Escolar',
              html: mensaje
            }, function(err) {
              if (err) console.log('Error al enviar los datos del usuario: '+err);
              console.log('Datos de usuario enviado a: ' + resultado[0].nombre);
              callback(null, 'ok');
            });

        });
    }

    Usuario.remoteMethod('manda_correo_usuario', {
        accepts: [
          {arg: 'idUsuario',   type: 'number', required: true },
          {arg: 'res', type: 'object', 'http': {source: 'res'}}
        ],
        returns: {arg: 'resultado',type: 'Object'},
        http: {path: '/manda_correo_usuario/:idUsuario', verb: 'get'}
    });


};
