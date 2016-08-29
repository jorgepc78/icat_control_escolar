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
            if(registroEditar.horas_asignadas.length == 0)
            {
                var fechaHoy = new Date();
                var ultimo_anio = fechaHoy.getFullYear() - 1;
            }
            else
                var ultimo_anio = registroEditar.horas_asignadas[0].anio;
            
            vm.registroEdicion = {
              id             : 0,
              anio           : (ultimo_anio + 1).toString(),
              horasAsignadas : 0,
              horasSeparadas : 0,
              horasAplicadas : 0
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
                    vm.registroEdicion.horasSeparadas = 0;
                    vm.registroEdicion.horasAplicadas = 0;
                    
                    $modalInstance.close(vm.registroEdicion);

                })
                .catch(function(error) {
                });

            };
    };

})();
