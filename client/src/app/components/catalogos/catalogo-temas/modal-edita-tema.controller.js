(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ModalEditaTemaController', ModalEditaTemaController);

        ModalEditaTemaController.$inject = ['$scope', '$modalInstance', 'registroEditar', 'CatalogoEspecialidades', 'CatalogoTemas'];

    function ModalEditaTemaController($scope, $modalInstance, registroEditar, CatalogoEspecialidades, CatalogoTemas) {

            var vm = this;

            vm.registroEdicion = {};
            vm.imagenTemp;

            vm.borraFoto = borraFoto;
            vm.cargaImagen = cargaImagen;
            vm.guardar = guardar;

            inicia();

            function inicia() {

                CatalogoTemas.findById({
                    id: registroEditar.idTema
                })
                .$promise
                .then(function(resp) {
                    vm.registroEdicion = resp;

                    if(vm.registroEdicion.fotoInicio === '' || vm.registroEdicion.fotoInicio === undefined){
                      vm.registroEdicion.fotoInicio = 'assets/img/placeholder.png';
                    }
                });
        
            };

            function cargaImagen(e, reader, file, fileList, fileOjects, fileObj) {
                 if((fileObj.filesize / 1024) < 200)
                     vm.registroEdicion.fotoInicio = 'data:' + fileObj.filetype + ';base64,' + fileObj.base64;
                 else
                     reader.abort();
            };

            function borraFoto() {
                vm.registroEdicion.fotoInicio = 'assets/img/placeholder.png';
                vm.imagenTemp = undefined;
            };

            function guardar() {
                
                if(vm.registroEdicion.fotoInicio === 'assets/img/placeholder.png'){
                  vm.registroEdicion.fotoInicio = '';
                }

                var datos = {
                        fotoInicio : vm.registroEdicion.fotoInicio,
                        nombre     : vm.registroEdicion.nombre,
                };

                CatalogoTemas.prototype$updateAttributes(
                {
                    id: registroEditar.idTema
                },
                    datos
                )
                .$promise
                .then(function(respuesta) {
                      vm.registroEdicion.fotoInicio = '';
                      $modalInstance.close(vm.registroEdicion);
                });
            };

    };

})();