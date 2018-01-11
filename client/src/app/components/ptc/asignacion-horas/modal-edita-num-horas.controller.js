(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ModalEditaHorasController', ModalEditaHorasController);

        ModalEditaHorasController.$inject = ['$scope', '$modalInstance', 'registroEditar', 'CatalogoUnidadesAdmtvas', 'HorasAsignadasUnidad'];

    function ModalEditaHorasController($scope, $modalInstance, registroEditar, CatalogoUnidadesAdmtvas, HorasAsignadasUnidad) {

            var vm = this;

            vm.guardar = guardar;

            vm.habilitar = true;
            vm.unidad = registroEditar.nombre;
            
            vm.registroEdicion = {
              id             : registroEditar.horas_asignadas[0].id,
              anio           : registroEditar.horas_asignadas[0].anio.toString(),
              horasAsignadas : registroEditar.horas_asignadas[0].horasAsignadas
            };

            inicia();


            function inicia() {
            };



            function guardar() {

                vm.mostrarSpiner = true;

                HorasAsignadasUnidad.prototype$updateAttributes(
                {
                    id: vm.registroEdicion.id
                },{
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
