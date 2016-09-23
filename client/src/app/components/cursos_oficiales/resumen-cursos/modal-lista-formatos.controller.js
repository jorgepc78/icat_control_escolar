(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ModalListaFormatosController', ModalListaFormatosController);

        ModalListaFormatosController.$inject = ['$scope', '$timeout', '$modalInstance', 'registroEditar'];

    function ModalListaFormatosController($scope, $timeout, $modalInstance, registroEditar) {

            var vm = this;
            vm.generaFormato = generaFormato;

            vm.modalidad = registroEditar.modalidad;

            inicia();

            function inicia() {
   
            };

            function generaFormato(tipo_formato) {

                    var link = angular.element('<a href="api/CursosOficiales/exporta_formato/'+registroEditar.idCurso+'/'+tipo_formato+'" target="_blank"></a>');

                    angular.element(document.body).append(link);

                    link[0].click();
                    link.remove();

            };


    };

})();