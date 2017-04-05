module.exports = function(VistaCatalogoInstructores) {
    VistaCatalogoInstructores.disableRemoteMethod('create', true);        // Removes (POST) /products
    VistaCatalogoInstructores.disableRemoteMethod('upsert', true);        // Removes (PUT) /products
    VistaCatalogoInstructores.disableRemoteMethod('deleteById', true);      // Removes (DELETE) /products/:id
    VistaCatalogoInstructores.disableRemoteMethod("updateAll", true);       // Removes (POST) /products/update
    VistaCatalogoInstructores.disableRemoteMethod("updateAttributes", true);   // Removes (PUT) /products/:id
    VistaCatalogoInstructores.disableRemoteMethod('createChangeStream', true);  // removes (GET|POST) /products/change-stream
};
