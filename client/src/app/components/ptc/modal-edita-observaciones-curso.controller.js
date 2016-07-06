(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ModalEditaObserCursoController', ModalEditaObserCursoController);

        ModalEditaObserCursoController.$inject = ['$scope', '$modalInstance', 'registroEditar', 'CursosPtc'];

    function ModalEditaObserCursoController($scope, $modalInstance, registroEditar, CursosPtc) {

            var vm = this;

            vm.registroEdicion = {
                    idCurso               : registroEditar.idCurso,
                    observacionesRevision : registroEditar.observacionesRevision
            };

            vm.guardar = guardar;

            inicia();

            function inicia() {    
            };


            function guardar() {

                CursosPtc.prototype$updateAttributes(
                {
                    id: vm.registroEdicion.idCurso
                },{
                    observacionesRevision : vm.registroEdicion.observacionesRevision
                })
                .$promise
                .then(function(respuesta) {
                    $modalInstance.close(vm.registroEdicion);
                })
                .catch(function(error) {
                });
            };
    };

})();