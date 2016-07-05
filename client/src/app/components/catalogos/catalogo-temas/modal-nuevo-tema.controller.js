(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ModalNuevoTemaController', ModalNuevoTemaController);

        ModalNuevoTemaController.$inject = ['$scope', '$modalInstance', 'CatalogoEspecialidades', 'CatalogoTemas'];

    function ModalNuevoTemaController($scope, $modalInstance, CatalogoEspecialidades, CatalogoTemas) {

            var vm = this;

            vm.registroEdicion = {
                nombre     : '',
                fotoInicio : 'assets/img/placeholder.png'
            };

            vm.imagenTemp;

            vm.borraFoto = borraFoto;
            vm.cargaImagen = cargaImagen;
            vm.guardar = guardar;

            inicia();

            function inicia() {        
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

                CatalogoTemas
                .create({
                    fotoInicio : vm.registroEdicion.fotoInicio,
                    nombre     : vm.registroEdicion.nombre,
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