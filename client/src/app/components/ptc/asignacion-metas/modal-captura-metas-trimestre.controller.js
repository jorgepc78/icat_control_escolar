(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ModalCapturaMetasController', ModalCapturaMetasController);

        ModalCapturaMetasController.$inject = ['$scope', '$modalInstance', 'registroEditar', 'CatalogoUnidadesAdmtvas'];

    function ModalCapturaMetasController($scope, $modalInstance, registroEditar, CatalogoUnidadesAdmtvas) {

            var vm = this;

            vm.guardar = guardar;

            vm.habilitar = false;

            vm.nombre_unidad = registroEditar.nombre;

            if(registroEditar.metas_asignadas.length == 0)
            {
                var fechaHoy = new Date();
                var ultimo_anio = fechaHoy.getFullYear() - 1;
            }
            else
                var ultimo_anio = registroEditar.metas_asignadas[0].anio;
            
            vm.registroEdicion = {
                id        : 0,
                anio      : (ultimo_anio + 1).toString(),
                reg1Trim  : 0,
                ext1Trim  : 0,
                roco1Trim : 0,
                ecl1Trim  : 0,
                cae1Trim  : 0,

                reg2Trim  : 0,
                ext2Trim  : 0,
                roco2Trim : 0,
                ecl2Trim  : 0,
                cae2Trim  : 0,

                reg3Trim  : 0,
                ext3Trim  : 0,
                roco3Trim : 0,
                ecl3Trim  : 0,
                cae3Trim  : 0,

                reg4Trim  : 0,
                ext4Trim  : 0,
                roco4Trim : 0,
                ecl4Trim  : 0,
                cae4Trim  : 0
            };

            inicia();


            function inicia() {
            };



            function guardar() {

                vm.mostrarSpiner = true;

                CatalogoUnidadesAdmtvas.metas_asignadas.create(
                {
                    id: registroEditar.idUnidadAdmtva
                },{
                    anio      : vm.registroEdicion.anio,
                    reg1Trim  : vm.registroEdicion.reg1Trim,
                    ext1Trim  : vm.registroEdicion.ext1Trim,
                    roco1Trim : vm.registroEdicion.roco1Trim,
                    ecl1Trim  : vm.registroEdicion.ecl1Trim,
                    cae1Trim  : vm.registroEdicion.cae1Trim,

                    reg2Trim  : vm.registroEdicion.reg2Trim,
                    ext2Trim  : vm.registroEdicion.ext2Trim,
                    roco2Trim : vm.registroEdicion.roco2Trim,
                    ecl2Trim  : vm.registroEdicion.ecl2Trim,
                    cae2Trim  : vm.registroEdicion.cae2Trim,

                    reg3Trim  : vm.registroEdicion.reg3Trim,
                    ext3Trim  : vm.registroEdicion.ext3Trim,
                    roco3Trim : vm.registroEdicion.roco3Trim,
                    ecl3Trim  : vm.registroEdicion.ecl3Trim,
                    cae3Trim  : vm.registroEdicion.cae3Trim,

                    reg4Trim  : vm.registroEdicion.reg4Trim,
                    ext4Trim  : vm.registroEdicion.ext4Trim,
                    roco4Trim : vm.registroEdicion.roco4Trim,
                    ecl4Trim  : vm.registroEdicion.ecl4Trim,
                    cae4Trim  : vm.registroEdicion.cae4Trim
                })
                .$promise
                .then(function(respuesta) {

                    vm.registroEdicion.id = respuesta.id;
                    $modalInstance.close(vm.registroEdicion);

                })
                .catch(function(error) {
                });

            };
    };

})();
