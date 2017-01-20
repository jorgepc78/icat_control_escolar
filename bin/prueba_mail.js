var models = require('../server/server.js').models;
var email = models.Email;

email.send({
  to: 'jorgepc78@gmail.com',
  from: 'control-escolar@icatqr.edu.mx',
  subject: 'Prueba de envio de correo desde stronloop',
  html: '<strong>HTML</strong> tags are not converted'
}, function(err) {
  if (err)
    console.log(err);
  else
    console.log('> Correo enviado');
  process.exit(0);
});
