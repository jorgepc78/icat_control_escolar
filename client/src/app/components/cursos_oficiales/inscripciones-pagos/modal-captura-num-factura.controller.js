(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ModalCapturaNumFacturaController', ModalCapturaNumFacturaController);

        ModalCapturaNumFacturaController.$inject = ['$scope', '$modalInstance', 'registroEditar', 'InscripcionCurso'];

    function ModalCapturaNumFacturaController($scope, $modalInstance, registroEditar, InscripcionCurso) {

            var vm = this;

            vm.guardar = guardar;

            vm.pagadotemp = registroEditar.seleccion.pagado;

            vm.registroEdicion = {
              id             : registroEditar.seleccion.id,
              idAlumno       : registroEditar.seleccion.idAlumno,
              nombreCompleto : registroEditar.seleccion.Capacitandos.nombreCompleto,
              idCurso        : registroEditar.seleccion.idCurso,
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

                InscripcionCurso.prototype$updateAttributes(
                {
                    id: vm.registroEdicion.id
                },{
                    pagado     : vm.registroEdicion.pagado,
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
