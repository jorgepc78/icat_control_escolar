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
            .state('ptc.asigna_horas', {
                url: '/asigna_horas',
                templateUrl: 'app/components/ptc/asignacion-horas/principal-horas-unidad.html',
                controller: 'PrincipalHorasUnidadController',
                controllerAs: 'vm',
                authenticate: true
            })
            .state('ptc.planeacion_ptc', {
                url: '/planeacion_ptc',
                templateUrl: 'app/components/ptc/ptc-unidad/principal-ptc-unidad.html',
                controller: 'PrincipalPTCUnidadController',
                controllerAs: 'vm',
                authenticate: true
            })
            .state('ptc.revision_ptc', {
                url: '/revision_ptc',
                templateUrl: 'app/components/ptc/revision-ptc/principal-revision-ptc.html',
                controller: 'PrincipalRevisionPTCController',
                controllerAs: 'vm',
                authenticate: true
            })
            .state('ptc.pct_autorizados', {
                url: '/pct_autorizados',
                templateUrl: 'app/components/ptc/autorizados/ptc-autorizados.html',
                controller: 'PTCAutorizadosController',
                controllerAs: 'vm',
                authenticate: true
            })

            /*** seccion de instructores ***/
            .state('instructores', {
                abstract: true,
                url: '/instructores',
                templateUrl: 'app/shared/layout/content-top-navigation.html',
            })
            .state('ptc.cat_instructores', {
                url: '/cat_instructores',
                templateUrl: 'app/components/instructores/admin-instructores.html',
                controller: 'AdminInstructoresController',
                controllerAs: 'vm',
                authenticate: true
            })

            /*** seccion de pre apertura de cursos ***/
            .state('pre_apertura', {
                abstract: true,
                url: '/pre_apertura',
                templateUrl: 'app/shared/layout/content-top-navigation.html',
            })
            .state('pre_apertura.cursos_ptc', {
                url: '/cursos_ptc',
                templateUrl: 'app/components/preapertura-cursos/cursos-ptc/pre-apertura-curso.html',
                controller: 'PreAperturaCursoPTCController',
                controllerAs: 'vm',
                authenticate: true
            })
            .state('pre_apertura.cursos_ptc_extra', {
                url: '/cursos_ptc_extra',
                templateUrl: 'app/components/preapertura-cursos/cursos-fuera-ptc/pre-apertura-curso-extra.html',
                controller: 'PreAperturaCursoExtraController',
                controllerAs: 'vm',
                authenticate: true
            })
            .state('pre_apertura.valida_apertura_cursos', {
                url: '/valida_apertura_cursos',
                templateUrl: 'app/components/preapertura-cursos/validacion/valida-apertura-cursos.html',
                controller: 'ValidaAperturaCursosController',
                controllerAs: 'vm',
                authenticate: true
            })

            /*** seccion del manejo de los cursos (resumen, inscripcion y cierre) ***/
            .state('cursos_autorizados', {
                abstract: true,
                url: '/cursos_autorizados',
                templateUrl: 'app/shared/layout/content-top-navigation.html',
            })
            .state('cursos_autorizados.resumen_cursos', {
                url: '/resumen_cursos:tipo',
                templateUrl: 'app/components/cursos_oficiales/resumen-cursos/principal-resumen-cursos.html',
                controller: 'ResumenCursosController',
                controllerAs: 'vm',
                authenticate: true
            })

            /*** seccion del manejo de los cursos (resumen, inscripcion y cierre) ***/
            .state('capacitandos', {
                abstract: true,
                url: '/capacitandos',
                templateUrl: 'app/shared/layout/content-top-navigation.html',
            })
            .state('capacitandos.principal_capacitandos', {
                url: '/principal_capacitandos',
                templateUrl: 'app/components/capacitandos/principal-capacitandos.html',
                controller: 'PrincipalCapacitandosController',
                controllerAs: 'vm',
                authenticate: true
            })

            /*** seccion de la inscripcion a un curso y registro del pago ***/
            .state('inscripcion', {
                abstract: true,
                url: '/inscripcion',
                templateUrl: 'app/shared/layout/content-top-navigation.html',
            })
            .state('inscripcion.registro_inscripcion_pagos', {
                url: '/registro_inscripcion_pagos',
                templateUrl: 'app/components/cursos_oficiales/inscripciones-pagos/registra-inscrip-pago-curso.html',
                controller: 'RegistroInscripPagoCursoController',
                controllerAs: 'vm',
                authenticate: true
            })
    }

})();