(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ConsultaInstructoresController', ConsultaInstructoresController);

    ConsultaInstructoresController.$inject = ['$scope', '$modal', 'tablaDatosService', 'VistaCatalogoInstructores', 'AlmacenDocumentos', 'Usuario'];

    function ConsultaInstructoresController($scope, $modal, tablaDatosService, VistaCatalogoInstructores, AlmacenDocumentos, Usuario  ) {

            var vm = this;

            vm.muestraDatosRegistroActual = muestraDatosRegistroActual;
            vm.muestraResultadosBusqueda  = muestraResultadosBusqueda;
            vm.limpiaBusqueda             = limpiaBusqueda;
            vm.cambiarPagina              = cambiarPagina;
            vm.abreDocumento              = abreDocumento;

            vm.ordenaArrayJson            = ordenaArrayJson;


            vm.listaUnidades = [];
            vm.unidadSeleccionada = undefined;

            vm.tablaListaRegistros = {
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

                  vm.tablaListaRegistros.condicion = {idUnidadAdmtva: $scope.currentUser.unidad_pertenece_id};

                  vm.tablaListaRegistros.filtro_datos = {
                          filter: {
                              where: vm.tablaListaRegistros.condicion,
                              order: ['apellidoPaterno ASC','apellidoMaterno ASC','nombre ASC','idInstructor ASC'],
                              limit: vm.tablaListaRegistros.registrosPorPagina,
                              skip: vm.tablaListaRegistros.paginaActual - 1,
                              include: [
                                'localidad_pertenece',
                                'nivel_estudios',
                                {
                                    relation: 'unidad_pertenece',
                                    scope: {
                                        fields:['idUnidadAdmtva','nombre']
                                    }
                                },
                                {
                                    relation: 'otras_unidades',
                                    scope: {
                                        fields:['idUnidadAdmtva','nombre']
                                    }
                                },
                                {
                                    relation: 'documentos',
                                    scope: {
                                        fields:['idDocumento','documento','nombreArchivo','tipoArchivo']
                                    }
                                },
                                {
                                    relation: 'calif_evaluacion_curso',
                                    scope: {
                                        fields:['id','idInstructor','idCatalogoCurso','calificacion'],
                                        include:{
                                            relation: 'CatalogoCursos',
                                            scope: {
                                                fields:['idCatalogoCurso','nombreCurso','numeroHoras','idEspecialidad','activo'],
                                                order: ['nombreCurso ASC','idCatalogoCurso ASC'],
                                                include:{
                                                    relation: 'especialidad',
                                                    scope: {
                                                        fields:['nombre']
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                              ]
                          }
                  };


                  vm.registros = {};
                  vm.RegistroSeleccionado = {};
                  vm.tablaListaRegistros.fila_seleccionada = undefined;
                  vm.client = 1;

                  tablaDatosService.obtiene_datos_tabla(VistaCatalogoInstructores, vm.tablaListaRegistros)
                  .then(function(respuesta) {

                        vm.tablaListaRegistros.totalElementos = respuesta.total_registros;
                        vm.tablaListaRegistros.inicio = respuesta.inicio;
                        vm.tablaListaRegistros.fin = respuesta.fin;

                        if(vm.tablaListaRegistros.totalElementos > 0)
                        {
                            vm.registros = respuesta.datos;
                            vm.registros.sort(ordenaArrayJson(['apellidoPaterno', 'apellidoMaterno', 'nombre']));
                            vm.RegistroSeleccionado = vm.registros[0];
                            vm.client = 2;
                            vm.tablaListaRegistros.fila_seleccionada = 0;
                            muestraDatosRegistroActual(vm.RegistroSeleccionado);
                        }
                  });

            }



            function muestraResultadosBusqueda() {

                  vm.registros = {};
                  vm.RegistroSeleccionado = {};
                  vm.tablaListaRegistros.fila_seleccionada = undefined;
                  vm.client = 1;
                  vm.tablaListaRegistros.paginaActual = 1;
                  vm.tablaListaRegistros.inicio = 0;
                  vm.tablaListaRegistros.fin = 1;

                  vm.tablaListaRegistros.condicion = {
                      and: [
                        {idUnidadAdmtva: $scope.currentUser.unidad_pertenece_id},
                        {nombre_completo: {regexp: '/.*'+ vm.cadena_buscar +'.*/i'}},
                      ]
                  };

                  tablaDatosService.obtiene_datos_tabla(VistaCatalogoInstructores, vm.tablaListaRegistros)
                  .then(function(respuesta) {

                        vm.tablaListaRegistros.totalElementos = respuesta.total_registros;
                        vm.tablaListaRegistros.inicio = respuesta.inicio;
                        vm.tablaListaRegistros.fin = respuesta.fin;

                        if(vm.tablaListaRegistros.totalElementos > 0)
                        {
                            vm.registros = respuesta.datos;
                            vm.registros.sort(ordenaArrayJson(['apellidoPaterno', 'apellidoMaterno', 'nombre']));
                            vm.RegistroSeleccionado = vm.registros[0];
                            vm.client = 2;
                            vm.tablaListaRegistros.fila_seleccionada = 0;
                            muestraDatosRegistroActual(vm.RegistroSeleccionado);
                        }

                        vm.mostrarbtnLimpiar = true;
                  });
            };


            function limpiaBusqueda() {

                  vm.registros = {};
                  vm.RegistroSeleccionado = {};
                  vm.tablaListaRegistros.fila_seleccionada = undefined;
                  vm.client = 1;
                  vm.tablaListaRegistros.paginaActual = 1;
                  vm.tablaListaRegistros.inicio = 0;
                  vm.tablaListaRegistros.fin = 1;

                  vm.tablaListaRegistros.condicion = {idUnidadAdmtva: $scope.currentUser.unidad_pertenece_id};

                  tablaDatosService.obtiene_datos_tabla(VistaCatalogoInstructores, vm.tablaListaRegistros)
                  .then(function(respuesta) {

                        vm.tablaListaRegistros.totalElementos = respuesta.total_registros;
                        vm.tablaListaRegistros.inicio = respuesta.inicio;
                        vm.tablaListaRegistros.fin = respuesta.fin;

                        if(vm.tablaListaRegistros.totalElementos > 0)
                        {
                            vm.registros = respuesta.datos;
                            vm.registros.sort(ordenaArrayJson(['apellidoPaterno', 'apellidoMaterno', 'nombre']));
                            vm.RegistroSeleccionado = vm.registros[0];
                            vm.client = 2;
                            vm.tablaListaRegistros.fila_seleccionada = 0;
                            muestraDatosRegistroActual(vm.RegistroSeleccionado);
                        }

                        vm.mostrarbtnLimpiar = false;
                        vm.cadena_buscar = '';
                  });

            };


            function cambiarPagina() {

                  if(vm.tablaListaRegistros.totalElementos > 0)
                  {
                        tablaDatosService.cambia_pagina(VistaCatalogoInstructores, vm.tablaListaRegistros)
                        .then(function(respuesta) {

                            vm.tablaListaRegistros.inicio = respuesta.inicio;
                            vm.tablaListaRegistros.fin = respuesta.fin;

                            vm.registros = respuesta.datos;
                            vm.registros.sort(ordenaArrayJson(['apellidoPaterno', 'apellidoMaterno', 'nombre']));
                            vm.RegistroSeleccionado = vm.registros[0];
                            vm.client = 2;
                            vm.tablaListaRegistros.fila_seleccionada = 0;
                            muestraDatosRegistroActual(vm.RegistroSeleccionado);
                        });
                  }
            }


            function abreDocumento(seleccion) {

                    Usuario.prototype$__get__accessTokens({ 
                        id: $scope.currentUser.id_usuario
                    })
                    .$promise
                    .then(function(resp) {
                      var link = angular.element('<a href="api/AlmacenDocumentos/instructores/download/'+seleccion.nombreArchivo+'?access_token='+resp[0].id+'" target="_blank"></a>');
                        angular.element(document.body).append(link);
                        link[0].click();
                        link.remove();
                    });
            }

            function muestraDatosRegistroActual(seleccion) {

                  var index = vm.registros.indexOf(seleccion);
                  vm.RegistroSeleccionado = seleccion;
                  vm.client = 2;
                  vm.tablaListaRegistros.fila_seleccionada = index;
            };


            function ordenaArrayJson(fields) {
                return function (a, b) {
                    return fields
                        .map(function (o) {
                            var dir = 1;
                            if (o[0] === '-') {
                               dir = -1;
                               o=o.substring(1);
                            }
                            if (a[o] > b[o]) return dir;
                            if (a[o] < b[o]) return -(dir);
                            return 0;
                        })
                        .reduce(function firstNonZeroValue (p,n) {
                            return p ? p : n;
                        }, 0);
                };
            };


    };

})();