(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ModalCapturaNumFacturaEvalController', ModalCapturaNumFacturaEvalController);

        ModalCapturaNumFacturaEvalController.$inject = ['$scope', '$modalInstance', 'registroEditar', 'InscripcionEvaluaciones'];

    function ModalCapturaNumFacturaEvalController($scope, $modalInstance, registroEditar, InscripcionEvaluaciones) {

            var vm = this;

            vm.guardar = guardar;

            vm.pagadotemp = registroEditar.seleccion.pagado;

            vm.registroEdicion = {
              id             : registroEditar.seleccion.id,
              idAlumno       : registroEditar.seleccion.idAlumno,
              nombreCompleto : registroEditar.seleccion.Capacitandos.nombreCompleto,
              idEvaluacion   : registroEditar.seleccion.idEvaluacion,
              nombreCurso    : registroEditar.nombreCurso,
              numFactura     : registroEditar.seleccion.numFactura,
              pagado         : registroEditar.seleccion.pagado
            };

            vm.titulo = '';

            inicia();


            function inicia() {

              if(vm.registroEdicion.pagado == 0)
                vm.titulo = 'Registro del pago';
              else
                vm.titulo = 'Registro del número de factura';

            };



            function guardar() {

                vm.mostrarSpiner = true;

                InscripcionEvaluaciones.prototype$updateAttributes(
                {
                    id: vm.registroEdicion.id
                },{
                    pagado     : true,
                    numFactura : vm.registroEdicion.numFactura,
                    fechaPago  : Date()
                })
                .$promise
                .then(function(respuesta) {

                    $modalInstance.close(respuesta);

                })
                .catch(function(error) {
                });

            };
    };

})();
