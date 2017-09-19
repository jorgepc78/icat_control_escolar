'use strict';

module.exports = function(Validaciones) {
    Validaciones.disableRemoteMethod('create', true);        // Removes (POST) /products
    Validaciones.disableRemoteMethod('upsert', true);        // Removes (PUT) /products
    Validaciones.disableRemoteMethod('deleteById', true);      // Removes (DELETE) /products/:id
    Validaciones.disableRemoteMethod("updateAll", true);       // Removes (POST) /products/update
    Validaciones.disableRemoteMethod("updateAttributes", true);   // Removes (PUT) /products/:id
    Validaciones.disableRemoteMethod('createChangeStream', true);  // removes (GET|POST) /products/change-stream
};
