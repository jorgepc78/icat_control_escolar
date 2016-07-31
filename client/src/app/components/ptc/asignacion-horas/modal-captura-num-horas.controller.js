(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ModalCapturaHorasController', ModalCapturaHorasController);

        ModalCapturaHorasController.$inject = ['$scope', '$modalInstance', 'registroEditar', 'CatalogoUnidadesAdmtvas'];

    function ModalCapturaHorasController($scope, $modalInstance, registroEditar, CatalogoUnidadesAdmtvas) {

            var vm = this;

            vm.guardar = guardar;

            vm.habilitar = false;
            var ultimo_anio = registroEditar.horas_asignadas[0].anio;
            
            vm.registroEdicion = {
              id             : 0,
              anio           : (ultimo_anio + 1).toString(),
              horasAsignadas : 0
            };

            inicia();


            function inicia() {
            };



            function guardar() {

                vm.mostrarSpiner = true;

                CatalogoUnidadesAdmtvas.horas_asignadas.create(
                {
                    id: registroEditar.idUnidadAdmtva
                },{
                    anio            : vm.registroEdicion.anio,
                    horasAsignadas  : vm.registroEdicion.horasAsignadas
                })
                .$promise
                .then(function(respuesta) {

                    vm.registroEdicion.id = respuesta.id;
                    vm.registroEdicion.anio = respuesta.anio;
                    vm.registroEdicion.horasAsignadas = respuesta.horasAsignadas;
                    
                    $modalInstance.close(vm.registroEdicion);

                })
                .catch(function(error) {
                });

            };
    };

})();
