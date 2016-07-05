(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];


    function config($stateProvider, $urlRouterProvider) {
        
        $urlRouterProvider.otherwise('login');

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
            .state('index.catalogo_temas', {
                url: '/catalogo_temas',
                templateUrl: 'app/components/catalogos/catalogo-temas/principal-catalogo-temas.html',
                controller: 'PrincipalCatalogoTemasController',
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
            
            /*** seccion del PTC ***/
            .state('ptc', {
                abstract: true,
                url: '/ptc',
                templateUrl: 'app/shared/layout/content-top-navigation.html',
            })
            .state('ptc.lista_ptcs', {
                url: '/lista_ptcs',
                templateUrl: 'app/components/ptc/principal-ptc.html',
                controller: 'PrincipalPTCController',
                controllerAs: 'vm',
                authenticate: true
            })


    }

})();