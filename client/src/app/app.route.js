(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider'];


    function config($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {
        
        $urlRouterProvider.otherwise('login');

        $ocLazyLoadProvider.config({
            // Set to true if you want to see what and when is dynamically loaded
            debug: false
        });

        $stateProvider

            .state('login', {
                url: '/login',
                templateUrl: 'app/components/autorizacion/login.html',
                controller: 'loginController',
                controllerAs: 'vm'
            })
            .state('logout', {
                url: '/logout',
                controller: 'logoutController',
                controllerAs: 'vm'
            })


            .state('index', {
                abstract: true,
                url: '/index',
                templateUrl: 'app/shared/layout/content-top-navigation.html',
            })
            .state('index.inicio', {
                url: '/inicio',
                templateUrl: 'app/components/inicio/inicio.html',
                controller: 'inicioController',
                controllerAs: 'vm',
                authenticate: true
            })
            .state('index.catalogo_especialidades', {
                url: '/catalogo_especialidades',
                templateUrl: 'app/components/catalogos/catalogo-especialidades/principal-catalogo-especialidades.html',
                controller: 'PrincipalCatalogoEspecialidadesController',
                controllerAs: 'vm',
                authenticate: true
            })
            .state('index.catalogo_cursos', {
                url: '/catalogo_cursos',
                templateUrl: 'app/components/catalogos/catalogo-cursos/principal-catalogo-cursos.html',
                controller: 'PrincipalCatalogoCursosController',
                controllerAs: 'vm',
                authenticate: true
            })


            /*** seccion de usuarios ***/
            .state('admin', {
                abstract: true,
                url: '/admin',
                templateUrl: 'app/shared/layout/content-top-navigation.html',
            })
            .state('admin.usuarios', {
                url: '/usuarios',
                templateUrl: 'app/components/admin-sistema/usuarios/admin-usuarios-principal.html',
                controller: 'AdminUsuariosPrincipalController',
                controllerAs: 'vm',
                authenticate: true
            })

    }

})();