'use strict';

module.exports = function(Vistaofertacursos) {
    Vistaofertacursos.disableRemoteMethod('create', true);        // Removes (POST) /products
    Vistaofertacursos.disableRemoteMethod('upsert', true);        // Removes (PUT) /products
    Vistaofertacursos.disableRemoteMethod('deleteById', true);      // Removes (DELETE) /products/:id
    Vistaofertacursos.disableRemoteMethod("updateAll", true);       // Removes (POST) /products/update
    Vistaofertacursos.disableRemoteMethod("updateAttributes", true);   // Removes (PUT) /products/:id
    Vistaofertacursos.disableRemoteMethod('createChangeStream', true);  // removes (GET|POST) /products/change-stream
};