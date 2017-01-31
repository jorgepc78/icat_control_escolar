/**
 * https://github.com/strongloop/loopback-gateway/blob/master/server/private/ssl_cert.js
 **/

var crypto = require('crypto'),
  fs = require("fs"),
  path = require('path');
var tls = require('tls');  

//exports.privateKey = fs.readFileSync(path.join(__dirname, 'privatekey.pem')).toString();
//exports.certificate = fs.readFileSync(path.join(__dirname, 'certificate.pem')).toString();

exports.privateKey = fs.readFileSync(path.join('/etc/letsencrypt/live/control-escolar.icatqr.edu.mx/privkey.pem')).toString();
exports.certificate = fs.readFileSync(path.join('/etc/letsencrypt/live/control-escolar.icatqr.edu.mx/fullchain.pem')).toString();

exports.credentials = tls.createSecureContext({
  key: exports.privateKey,
  cert: exports.certificate
});
