(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('logoutController' , logoutController)

    logoutController.$inject = ['$rootScope', 'localStorageService', 'Usuario', '$state'];

    function logoutController($rootScope, localStorageService, Usuario, $state) {

        Usuario
        .logout()
        .$promise
        .then(function() {
           $rootScope.currentUser = null;
           localStorageService.remove('usuario');
           $state.go('login');
        });

    };

})();