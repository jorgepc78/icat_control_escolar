var path = require('path');

var app = require(path.resolve(__dirname, '../server/server'));
var ds = app.datasources.icat_control_escolar_ds;

var lbTables = ['User', 'AccessToken', 'ACL', 'RoleMapping', 'Role'];
ds.automigrate(lbTables, function(er) {
  if (er) throw er;
  console.log('Looback tables [' + lbTables + '] created in ', ds.adapter.name);
  ds.disconnect();
});