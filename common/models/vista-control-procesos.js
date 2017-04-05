module.exports = function(VistaControlProcesos) {
    VistaControlProcesos.disableRemoteMethod('create', true);        // Removes (POST) /products
    VistaControlProcesos.disableRemoteMethod('upsert', true);        // Removes (PUT) /products
    VistaControlProcesos.disableRemoteMethod('deleteById', true);      // Removes (DELETE) /products/:id
    VistaControlProcesos.disableRemoteMethod("updateAll", true);       // Removes (POST) /products/update
    VistaControlProcesos.disableRemoteMethod("updateAttributes", true);   // Removes (PUT) /products/:id
    VistaControlProcesos.disableRemoteMethod('createChangeStream', true);  // removes (GET|POST) /products/change-stream
};
