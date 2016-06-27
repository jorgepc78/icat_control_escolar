(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ModalEditaEspecialidadController', ModalEditaEspecialidadController);

        ModalEditaEspecialidadController.$inject = ['$modalInstance', 'registroEditar', 'CatalogoEspecialidades', 'CatalogoTemas'];

    function ModalEditaEspecialidadController($modalInstance, registroEditar, CatalogoEspecialidades, CatalogoTemas) {

            var vm = this;

            vm.registroEditar = {
                idEspecialidad : registroEditar.idEspecialidad,
                idTema         : registroEditar.idTema,
                tema           : '',
                clave          : registroEditar.clave,
                nombre         : registroEditar.nombre
            };

            vm.temaSeleccionado = 0;

            vm.guardar = guardar;

            inicia();

            function inicia() {

                CatalogoTemas.find({
                    filter: {
                        fields : ['idTema', 'nombre'],
                        order  : 'nombre ASC'
                    }
                })
                .$promise
                .then(function(resp) {
                    vm.listaTemas = resp;

                    var temaSeleccionadoIndex = vm.listaTemas.map(function(rol) {
                                                        return rol.idTema;
                                                      }).indexOf(vm.registroEditar.idTema);

                    vm.temaSeleccionado = vm.listaTemas[temaSeleccionadoIndex];
                });
        
            };

            function guardar() {

                var datos = {
                        clave  : vm.registroEditar.clave,
                        nombre : vm.registroEditar.nombre,
                        idTema : vm.temaSeleccionado.idTema
                };

                vm.registroEditar.idTema = vm.temaSeleccionado.idTema;
                vm.registroEditar.tema = vm.temaSeleccionado.nombre;

                CatalogoEspecialidades.prototype$updateAttributes(
                {
                    id: vm.registroEditar.idEspecialidad
                },
                    datos
                )
                .$promise
                .then(function(respuesta) {
                      $modalInstance.close(vm.registroEditar);
                });
            };

    };

})();