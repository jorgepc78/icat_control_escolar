(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ModalNuevoPTCController', ModalNuevoPTCController);

        ModalNuevoPTCController.$inject = ['$scope', '$modalInstance', 'ProgTrimCursos'];

    function ModalNuevoPTCController($scope, $modalInstance, ProgTrimCursos) {

            var vm = this;

            var trimestre = 0;

            vm.registroEdicion = {
                anio             : 0,
                trimestre        : ''
            };

            vm.guardar = guardar;

            inicia();

            function inicia() {

                var fechaHoy = new Date();
                
                vm.registroEdicion.anio = fechaHoy.getFullYear();

                if( fechaHoy.getMonth() <= 2 )
                    vm.registroEdicion.trimestre = '1';
                else if( (fechaHoy.getMonth() >= 3) && (fechaHoy.getMonth() <= 5) )
                    vm.registroEdicion.trimestre = '2';
                else if( (fechaHoy.getMonth() >= 6) && (fechaHoy.getMonth() <= 8) )
                    vm.registroEdicion.trimestre = '3';
                else if( fechaHoy.getMonth() >= 9 )
                    vm.registroEdicion.trimestre = '4'; 

            };

            function guardar() {

                ProgTrimCursos
                .create({
                    idUnidadAdmtva   : $scope.currentUser.unidad_pertenece_id,
                    anio             : vm.registroEdicion.anio,
                    trimestre        : parseInt(vm.registroEdicion.trimestre),
                    fechaElaboracion : Date()
                })
                .$promise
                .then(function(respuesta) {
                    $modalInstance.close();
                })
                .catch(function(error) {
                });

            };
    };

})();