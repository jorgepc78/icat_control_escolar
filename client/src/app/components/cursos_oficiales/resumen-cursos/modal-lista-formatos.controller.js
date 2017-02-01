(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ModalListaFormatosController', ModalListaFormatosController);

        ModalListaFormatosController.$inject = ['$rootScope', '$timeout', '$modalInstance', 'registroEditar', 'Usuario'];

    function ModalListaFormatosController($rootScope, $timeout, $modalInstance, registroEditar, Usuario) {

            var vm = this;
            vm.generaFormato = generaFormato;

            vm.modalidad = registroEditar.modalidad;
            vm.btnhabilitado = true;

            inicia();

            function inicia() {
                if( (registroEditar.estatus == 4) && (registroEditar.diasTermine > 5) )
                    vm.btnhabilitado = false;
            };

            function generaFormato(tipo_formato) {

                    Usuario.prototype$__get__accessTokens({ 
                        id: $rootScope.currentUser.id_usuario
                    })
                    .$promise
                    .then(function(resp) {
                        var link = angular.element('<a href="api/CursosOficiales/exporta_formato/'+registroEditar.idCurso+'/'+tipo_formato+'?access_token='+resp[0].id+'" target="_blank"></a>');
                        angular.element(document.body).append(link);
                        link[0].click();
                        link.remove();
                    });
            };


    };

})();