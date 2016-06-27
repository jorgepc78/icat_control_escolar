(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('inicioController', inicioController)

    inicioController.$inject = ['$rootScope','$timeout', '$state', 'localStorageService', 'Usuario'];

    function inicioController($rootScope, $timeout, $state, localStorageService, Usuario) {

        var vm = this;

        inicia();

        function inicia() {
        }

    };

})();