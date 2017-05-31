(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ModalEditaMetasController', ModalEditaMetasController);

        ModalEditaMetasController.$inject = ['$scope', '$modalInstance', 'registroEditar', 'CatalogoUnidadesAdmtvas', 'MetasCapacUnidad'];

    function ModalEditaMetasController($scope, $modalInstance, registroEditar, CatalogoUnidadesAdmtvas, MetasCapacUnidad) {

            var vm = this;

            vm.guardar = guardar;

            vm.habilitar = true;
            
            vm.nombre_unidad = registroEditar.nombre;
            
            vm.registroEdicion = {
                id             : registroEditar.metas_asignadas[0].id,
                anio           : registroEditar.metas_asignadas[0].anio.toString(),

                reg1Trim       : registroEditar.metas_asignadas[0].reg1Trim,
                ext1Trim       : registroEditar.metas_asignadas[0].ext1Trim,
                roco1Trim      : registroEditar.metas_asignadas[0].roco1Trim,
                ecl1Trim       : registroEditar.metas_asignadas[0].ecl1Trim,
                cae1Trim       : registroEditar.metas_asignadas[0].cae1Trim,

                reg2Trim       : registroEditar.metas_asignadas[0].reg2Trim,
                ext2Trim       : registroEditar.metas_asignadas[0].ext2Trim,
                roco2Trim      : registroEditar.metas_asignadas[0].roco2Trim,
                ecl2Trim       : registroEditar.metas_asignadas[0].ecl2Trim,
                cae2Trim       : registroEditar.metas_asignadas[0].cae2Trim,

                reg3Trim       : registroEditar.metas_asignadas[0].reg3Trim,
                ext3Trim       : registroEditar.metas_asignadas[0].ext3Trim,
                roco3Trim      : registroEditar.metas_asignadas[0].roco3Trim,
                ecl3Trim       : registroEditar.metas_asignadas[0].ecl3Trim,
                cae3Trim       : registroEditar.metas_asignadas[0].cae3Trim,

                reg4Trim       : registroEditar.metas_asignadas[0].reg4Trim,
                ext4Trim       : registroEditar.metas_asignadas[0].ext4Trim,
                roco4Trim      : registroEditar.metas_asignadas[0].roco4Trim,
                ecl4Trim       : registroEditar.metas_asignadas[0].ecl4Trim,
                cae4Trim       : registroEditar.metas_asignadas[0].cae4Trim
            };

            inicia();


            function inicia() {
            };



            function guardar() {

                vm.mostrarSpiner = true;

                MetasCapacUnidad.prototype$updateAttributes(
                {
                    id: vm.registroEdicion.id
                },{
                    reg1Trim       : vm.registroEdicion.reg1Trim,
                    ext1Trim       : vm.registroEdicion.ext1Trim,
                    roco1Trim      : vm.registroEdicion.roco1Trim,
                    ecl1Trim       : vm.registroEdicion.ecl1Trim,
                    cae1Trim       : vm.registroEdicion.cae1Trim,

                    reg2Trim       : vm.registroEdicion.reg2Trim,
                    ext2Trim       : vm.registroEdicion.ext2Trim,
                    roco2Trim      : vm.registroEdicion.roco2Trim,
                    ecl2Trim       : vm.registroEdicion.ecl2Trim,
                    cae2Trim       : vm.registroEdicion.cae2Trim,

                    reg3Trim       : vm.registroEdicion.reg3Trim,
                    ext3Trim       : vm.registroEdicion.ext3Trim,
                    roco3Trim      : vm.registroEdicion.roco3Trim,
                    ecl3Trim       : vm.registroEdicion.ecl3Trim,
                    cae3Trim       : vm.registroEdicion.cae3Trim,

                    reg4Trim       : vm.registroEdicion.reg4Trim,
                    ext4Trim       : vm.registroEdicion.ext4Trim,
                    roco4Trim      : vm.registroEdicion.roco4Trim,
                    ecl4Trim       : vm.registroEdicion.ecl4Trim,
                    cae4Trim       : vm.registroEdicion.cae4Trim
                })
                .$promise
                .then(function(respuesta) {

                    vm.registroEdicion.id = respuesta.id;
                    vm.registroEdicion.anio = respuesta.anio;

                    $modalInstance.close(vm.registroEdicion);

                })
                .catch(function(error) {
                });

            };
    };

})();
