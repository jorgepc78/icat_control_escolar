(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ModalAgregaEvaluadorController', ModalAgregaEvaluadorController);

        ModalAgregaEvaluadorController.$inject = ['$scope', '$modalInstance', '$timeout', 'tablaDatosService', 'CatalogoInstructores', 'CursosOficiales'];

    function ModalAgregaEvaluadorController($scope, $modalInstance, $timeout, tablaDatosService, CatalogoInstructores, CursosOficiales) {

            var vm = this;


            vm.muestraResultadosBusqueda  = muestraResultadosBusqueda;
            vm.limpiaBusqueda             = limpiaBusqueda;
            vm.muestraDatosRegistroActual = muestraDatosRegistroActual;
            vm.cambiarPagina              = cambiarPagina;
            vm.guardar                    = guardar;

            vm.mostrarbtnLimpiar = false;
            vm.cadena_buscar = '';

            vm.listaInstructores = [];
            vm.personaSeleccionada = {};

            vm.tablaListaInstructores = {
              totalElementos     : 0,
              paginaActual       : 1,
              registrosPorPagina : 5,
              inicio             : -1,
              fin                : 0,
              condicion          : {
                and: [
                  {estatus: 3},
                  {activo: true},
                  {evaluador: false}
                ]
              },
              filtro_datos       : {},
              fila_seleccionada  : 0
            };

            vm.mostrarSpiner = false;
            vm.mostrar_msg_error = false;
            vm.mensaje = '';

            inicia();


            function inicia() {

                  vm.tablaListaInstructores.filtro_datos = {
                          filter: {
                              where: vm.tablaListaInstructores.condicion,
                              order: ['nombre_completo ASC','idInstructor ASC'],
                              limit: vm.tablaListaInstructores.registrosPorPagina,
                              skip: vm.tablaListaInstructores.paginaActual - 1,
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
                                    relation: 'evaluaciones_habilitadas',
                                    scope: {
                                        fields:['idCatalogoCurso','nombreCurso','idEspecialidad'],
                                        order: ['nombreCurso ASC','idCatalogoCurso ASC'],
                                        include:{
                                            relation: 'especialidad',
                                            scope: {
                                                fields:['nombre']
                                            }
                                        }
                                    }
                                },
                                {
                                    relation: 'estandares_habilitados',
                                    scope: {
                                        fields:['idEstandar','codigo','nombre'],
                                        order: ['nombre ASC']
                                    }
                                }
                              ]
                          }
                  };
            };



            function muestraResultadosBusqueda() {

                  vm.listaInstructores = {};
                  vm.personaSeleccionada = {};
                  vm.tablaListaInstructores.fila_seleccionada = undefined;
                  vm.tablaListaInstructores.paginaActual = 1;
                  vm.tablaListaInstructores.inicio = 0;
                  vm.tablaListaInstructores.fin = 1;
                  vm.mostrarbtnLimpiar = true;

                  vm.tablaListaInstructores.condicion = {
                    and: [
                      {estatus: 3},
                      {activo: true},
                      {evaluador: false},
                      {nombre_completo: {regexp: '/.*'+ vm.cadena_buscar +'.*/i'}}
                    ]
                  };

                  tablaDatosService.obtiene_datos_tabla(CatalogoInstructores, vm.tablaListaInstructores)
                  .then(function(respuesta) {

                        vm.tablaListaInstructores.totalElementos = respuesta.total_registros;
                        vm.tablaListaInstructores.inicio = respuesta.inicio;
                        vm.tablaListaInstructores.fin = respuesta.fin;

                        if(vm.tablaListaInstructores.totalElementos > 0)
                        {
                            vm.listaInstructores = respuesta.datos;
                            vm.personaSeleccionada = vm.listaInstructores[0];
                            vm.tablaListaInstructores.fila_seleccionada = 0;
                            muestraDatosRegistroActual(vm.personaSeleccionada);
                        }
                  });
            };


            function limpiaBusqueda() {

                  vm.mostrarbtnLimpiar = false;
                  vm.cadena_buscar = '';
                  vm.listaInstructores = {};
                  vm.personaSeleccionada = {};
                  vm.tablaListaInstructores.fila_seleccionada = undefined;
                  vm.tablaListaInstructores.paginaActual = 1;
                  vm.tablaListaInstructores.inicio = -1;
                  vm.tablaListaInstructores.fin = 0;
                  vm.tablaListaInstructores.totalElementos = 0;

                  vm.tablaListaInstructores.condicion = {
                    and: [
                      {estatus: 3},
                      {activo: true},
                      {evaluador: false}
                    ]
                  };

            };


            function muestraDatosRegistroActual(seleccion) {

                  var index = vm.listaInstructores.indexOf(seleccion);
                  vm.personaSeleccionada = seleccion;
                  vm.tablaListaInstructores.fila_seleccionada = index;
            };


            function cambiarPagina() {

                  if(vm.tablaListaInstructores.totalElementos > 0)
                  {
                        tablaDatosService.cambia_pagina(CatalogoInstructores, vm.tablaListaInstructores)
                        .then(function(respuesta) {

                            vm.tablaListaInstructores.inicio = respuesta.inicio;
                            vm.tablaListaInstructores.fin = respuesta.fin;

                            vm.listaInstructores = respuesta.datos;
                            vm.personaSeleccionada = vm.listaInstructores[0];
                            vm.tablaListaInstructores.fila_seleccionada = 0;
                            muestraDatosRegistroActual(vm.personaSeleccionada);
                        });
                  }
            }


            function guardar() {

                vm.mostrarSpiner = true;
                CatalogoInstructores.prototype$updateAttributes(
                {
                    id: vm.personaSeleccionada.idInstructor
                },{
                    evaluador: true
                }) 
                .$promise
                .then(function(resp) {
                    vm.personaSeleccionada.evaluador = true;
                    vm.mostrarSpiner = false;
                    $modalInstance.close(vm.personaSeleccionada);
                });

            };
    };

})();
