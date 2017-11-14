(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ModalCapturaObservacionRechazoController', ModalCapturaObservacionRechazoController);

        ModalCapturaObservacionRechazoController.$inject = ['$scope', '$modalInstance', 'registroEditar', 'CatalogoInstructores'];

    function ModalCapturaObservacionRechazoController($scope, $modalInstance, registroEditar, CatalogoInstructores) {

            var vm = this;

            vm.guardar = guardar;

            vm.registroEdicion = {
              idInstructor          : registroEditar.seleccion.idInstructor,
              observacionesRevision : registroEditar.observacionesRevision
            };

            inicia();

            function inicia() {
            };

            function guardar() {
                $modalInstance.close(vm.registroEdicion);
            };
    };

})();
