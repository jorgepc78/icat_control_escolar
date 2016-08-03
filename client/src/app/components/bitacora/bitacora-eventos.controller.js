(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('BitacoraController', BitacoraController);

    BitacoraController.$inject = ['$scope', '$stateParams', '$modal', 'tablaDatosService', 'VistaControlProcesos'];

    function BitacoraController($scope, $stateParams, $modal, tablaDatosService, VistaControlProcesos) {

            var vm = this;
            vm.openCalendar1 = openCalendar1;
            vm.muestraResultadosBusqueda = muestraResultadosBusqueda;
            vm.limpiaBusqueda            = limpiaBusqueda;
            vm.cambiarPagina             = cambiarPagina;
            
            vm.listaRegistros            = [];
            vm.fechaBuscar = '';

            vm.tablaBitacora = {
              totalElementos     : 0,
              paginaActual       : 1,
              registrosPorPagina : 10,
              inicio             : 0,
              fin                : 1,
              condicion          : {},
              filtro_datos       : {},
              fila_seleccionada  : 0
            };

            inicia();

            function inicia() {

                  vm.tablaBitacora.condicion = {idUsuario: $scope.currentUser.id_usuario};

                  vm.tablaBitacora.filtro_datos = {
                          filter: {
                              where: vm.tablaBitacora.condicion,
                              order: ['fechaGeneracion DESC'],
                              limit: vm.tablaBitacora.registrosPorPagina,
                              skip: vm.tablaBitacora.paginaActual - 1
                          }
                  };

                  vm.listaRegistros = {};
                  tablaDatosService.obtiene_datos_tabla(VistaControlProcesos, vm.tablaBitacora)
                  .then(function(respuesta) {

                        vm.tablaBitacora.totalElementos = respuesta.total_registros;
                        vm.tablaBitacora.inicio = respuesta.inicio;
                        vm.tablaBitacora.fin = respuesta.fin;

                        if(vm.tablaBitacora.totalElementos > 0)
                        {
                            vm.listaRegistros = respuesta.datos;
                        }
                  });

            }


            $scope.$watch('vm.fechaBuscar',function(){
                  if(vm.fechaBuscar != '')
                  {
                      var fecha_inicio = new Date(vm.fechaBuscar);
                      fecha_inicio.setHours(0);
                      fecha_inicio.setMinutes(0);
                      fecha_inicio.setSeconds(0);
                      fecha_inicio.setMilliseconds(0);

                      var fecha_fin = new Date(vm.fechaBuscar);
                      fecha_fin.setHours(23);
                      fecha_fin.setMinutes(59);
                      fecha_fin.setSeconds(59);
                      fecha_fin.setMilliseconds(999);

                      vm.listaRegistros = {};
                      vm.tablaBitacora.paginaActual = 1;
                      vm.tablaBitacora.inicio = 0;
                      vm.tablaBitacora.fin = 1;
                      vm.tablaBitacora.condicion = {
                                and:[
                                  {fechaGeneracion: {between: [fecha_inicio,fecha_fin]} },
                                  {idUsuario: $scope.currentUser.id_usuario}
                                ]
                      };

                      tablaDatosService.obtiene_datos_tabla(VistaControlProcesos, vm.tablaBitacora)
                      .then(function(respuesta) {

                            vm.tablaBitacora.totalElementos = respuesta.total_registros;
                            vm.tablaBitacora.inicio = respuesta.inicio;
                            vm.tablaBitacora.fin = respuesta.fin;

                            if(vm.tablaBitacora.totalElementos > 0)
                            {
                                vm.listaRegistros = respuesta.datos;
                            }
                      });
                  }
            });


            function muestraResultadosBusqueda() {

                  vm.listaRegistros = {};
                  vm.tablaBitacora.paginaActual = 1;
                  vm.tablaBitacora.inicio = 0;
                  vm.tablaBitacora.fin = 1;
                  vm.tablaBitacora.condicion = {
                            and:[
                              {documento: {regexp: '/.*'+ vm.cadena_buscar +'.*/i'}},
                              {idUsuario: $scope.currentUser.id_usuario}
                            ]
                  };

                  tablaDatosService.obtiene_datos_tabla(VistaControlProcesos, vm.tablaBitacora)
                  .then(function(respuesta) {

                        vm.tablaBitacora.totalElementos = respuesta.total_registros;
                        vm.tablaBitacora.inicio = respuesta.inicio;
                        vm.tablaBitacora.fin = respuesta.fin;

                        if(vm.tablaBitacora.totalElementos > 0)
                        {
                            vm.listaRegistros = respuesta.datos;
                        }

                        vm.mostrarbtnLimpiar = true;
                  });
            };


            function limpiaBusqueda() {

                  vm.listaRegistros = {};
                  vm.tablaBitacora.paginaActual = 1;
                  vm.tablaBitacora.inicio = 0;
                  vm.tablaBitacora.fin = 1;
                  vm.tablaBitacora.condicion = {idUsuario: $scope.currentUser.id_usuario};

                  tablaDatosService.obtiene_datos_tabla(VistaControlProcesos, vm.tablaBitacora)
                  .then(function(respuesta) {

                        vm.tablaBitacora.totalElementos = respuesta.total_registros;
                        vm.tablaBitacora.inicio = respuesta.inicio;
                        vm.tablaBitacora.fin = respuesta.fin;

                        if(vm.tablaBitacora.totalElementos > 0)
                        {
                            vm.listaRegistros = respuesta.datos;
                        }

                        vm.mostrarbtnLimpiar = false;
                        vm.cadena_buscar = '';
                        vm.fechaBuscar = '';
                  });

            };


            function cambiarPagina() {

                  if(vm.tablaBitacora.totalElementos > 0)
                  {
                        tablaDatosService.cambia_pagina(VistaControlProcesos, vm.tablaBitacora)
                        .then(function(respuesta) {

                            vm.tablaBitacora.inicio = respuesta.inicio;
                            vm.tablaBitacora.fin = respuesta.fin;
                            vm.listaRegistros = {};
                            vm.listaRegistros = respuesta.datos;

                        });
                  }
            }

            function openCalendar1($event) {
                $event.preventDefault();
                $event.stopPropagation();
                vm.opened1 = true;
            };


    };

})();