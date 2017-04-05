'use strict';

module.exports = function(Matriculaxunidadtipo) {
    Matriculaxunidadtipo.disableRemoteMethod('create', true);        // Removes (POST) /products
    Matriculaxunidadtipo.disableRemoteMethod('upsert', true);        // Removes (PUT) /products
    Matriculaxunidadtipo.disableRemoteMethod('deleteById', true);      // Removes (DELETE) /products/:id
    Matriculaxunidadtipo.disableRemoteMethod("updateAll", true);       // Removes (POST) /products/update
    Matriculaxunidadtipo.disableRemoteMethod("updateAttributes", true);   // Removes (PUT) /products/:id
    Matriculaxunidadtipo.disableRemoteMethod('createChangeStream', true);  // removes (GET|POST) /products/change-stream
};
