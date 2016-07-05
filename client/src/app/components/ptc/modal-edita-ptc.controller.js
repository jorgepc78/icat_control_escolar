(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ModalEditaPTCController', ModalEditaPTCController);

        ModalEditaPTCController.$inject = ['$modalInstance', 'registroEditar', 'ProgTrimCursos'];

    function ModalEditaPTCController($modalInstance, registroEditar, ProgTrimCursos) {

            var vm = this;

            vm.registroEdicion = {
                anio              : registroEditar.anio,
                trimestre         : registroEditar.trimestre.toString(),
                fechaModificacion : ''
            };

            vm.guardar = guardar;

            inicia();

            function inicia() {
   
            };

            function guardar() {

                var datos = {
                    anio              : vm.registroEdicion.anio,
                    trimestre         : parseInt(vm.registroEdicion.trimestre),
                    estatus           : 0,
                    fechaModificacion : Date()
                };

                ProgTrimCursos.prototype$updateAttributes(
                {
                    id: registroEditar.idPtc
                },
                    datos
                )
                .$promise
                .then(function(respuesta) {
                      vm.registroEdicion.fechaModificacion = respuesta.fechaModificacion;
                      vm.registroEdicion.estatus = respuesta.estatus;
                      $modalInstance.close(vm.registroEdicion);
                });

            };
    };

})();