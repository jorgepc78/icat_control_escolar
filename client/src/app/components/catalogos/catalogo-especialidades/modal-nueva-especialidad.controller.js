(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ModalNuevaEspecialidadController', ModalNuevaEspecialidadController);

        ModalNuevaEspecialidadController.$inject = ['$modalInstance', 'registroEditar', 'CatalogoEspecialidades', 'CatalogoTemas'];

    function ModalNuevaEspecialidadController($modalInstance, registroEditar, CatalogoEspecialidades, CatalogoTemas) {

            var vm = this;

            vm.registroEditar = {
                idTema         : 0,
                tema           : '',
                clave          : '',
                nombre         : ''
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
                });
        
            };

            function guardar() {

                CatalogoEspecialidades
                .create({
                        nombre : vm.registroEditar.nombre,
                        clave  : vm.registroEditar.clave,
                        idTema : vm.temaSeleccionado.idTema
                })
                .$promise
                .then(function(respuesta) {
                        $modalInstance.close();
                });

            };

    };

})();