'use strict';

module.exports = function(Vistaespecialidadesactivas) {
    Vistaespecialidadesactivas.disableRemoteMethod('create', true);        // Removes (POST) /products
    Vistaespecialidadesactivas.disableRemoteMethod('upsert', true);        // Removes (PUT) /products
    Vistaespecialidadesactivas.disableRemoteMethod('deleteById', true);      // Removes (DELETE) /products/:id
    Vistaespecialidadesactivas.disableRemoteMethod("updateAll", true);       // Removes (POST) /products/update
    Vistaespecialidadesactivas.disableRemoteMethod("updateAttributes", true);   // Removes (PUT) /products/:id
    Vistaespecialidadesactivas.disableRemoteMethod('createChangeStream', true);  // removes (GET|POST) /products/change-stream
};
