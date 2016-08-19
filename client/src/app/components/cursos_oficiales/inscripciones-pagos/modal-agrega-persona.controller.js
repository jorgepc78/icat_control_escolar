(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ModalAgregaPersonaController', ModalAgregaPersonaController);

        ModalAgregaPersonaController.$inject = ['$scope', '$modalInstance', '$timeout', 'tablaDatosService', 'registroEditar', 'Capacitandos', 'CursosOficiales'];

    function ModalAgregaPersonaController($scope, $modalInstance, $timeout, tablaDatosService, registroEditar, Capacitandos, CursosOficiales) {

            var vm = this;


            vm.muestraResultadosBusqueda  = muestraResultadosBusqueda;
            vm.limpiaBusqueda             = limpiaBusqueda;
            vm.muestraDatosRegistroActual = muestraDatosRegistroActual;
            vm.cambiarPagina              = cambiarPagina;
            vm.guardar                    = guardar;

            vm.mostrarbtnLimpiar = false;
            vm.cadena_buscar = '';

            vm.listaCapacitandos = [];
            vm.personaSeleccionada = {};

            vm.tablalListaCapacitados = {
              totalElementos     : 0,
              paginaActual       : 1,
              registrosPorPagina : 5,
              inicio             : -1,
              fin                : 0,
              condicion          : {},
              filtro_datos       : {},
              fila_seleccionada  : 0
            };

            vm.mostrarSpiner = false;
            vm.mostrar_msg_error = false;
            vm.mensaje = '';

            inicia();


            function inicia() {

                  vm.tablalListaCapacitados.filtro_datos = {
                          filter: {
                              where: vm.tablalListaCapacitados.condicion,
                              order: ['numControl','apellidoPaterno ASC','apellidoMaterno ASC','nombre ASC','curp ASC'],
                              limit: vm.tablalListaCapacitados.registrosPorPagina,
                              skip: vm.tablalListaCapacitados.paginaActual - 1,
                              include: [
                                  {
                                      relation: 'unidad_pertenece',
                                      scope: {
                                        fields: ['nombre']
                                      }
                                  },
                                  {
                                      relation: 'inscripcionesCursos',
                                      scope: {
                                          fields:['id','idCurso']
                                      }
                                  }
                              ]
                          }
                  };

                  /*tablaDatosService.obtiene_datos_tabla(Capacitandos, vm.tablalListaCapacitados)
                  .then(function(respuesta) {

                        vm.tablalListaCapacitados.totalElementos = respuesta.total_registros;
                        vm.tablalListaCapacitados.inicio = respuesta.inicio;
                        vm.tablalListaCapacitados.fin = respuesta.fin;

                        if(vm.tablalListaCapacitados.totalElementos > 0)
                        {
                            vm.listaCapacitandos = respuesta.datos;
                            vm.personaSeleccionada = vm.listaCapacitandos[0];
                            vm.tablalListaCapacitados.fila_seleccionada = 0;
                            muestraDatosRegistroActual(vm.personaSeleccionada);
                        }
                  });*/

            };



            function muestraResultadosBusqueda() {

                  vm.listaCapacitandos = {};
                  vm.personaSeleccionada = {};
                  vm.tablalListaCapacitados.fila_seleccionada = undefined;
                  vm.tablalListaCapacitados.paginaActual = 1;
                  vm.tablalListaCapacitados.inicio = 0;
                  vm.tablalListaCapacitados.fin = 1;
                  vm.mostrarbtnLimpiar = true;

                  vm.tablalListaCapacitados.condicion = {
                                    or: [
                                      {apellidoPaterno: {regexp: '/.*'+ vm.cadena_buscar +'.*/i'}},
                                      {apellidoMaterno: {regexp: '/.*'+ vm.cadena_buscar +'.*/i'}},
                                      {nombre: {regexp: '/.*'+ vm.cadena_buscar +'.*/i'}},

                                    ]
                                };

                  tablaDatosService.obtiene_datos_tabla(Capacitandos, vm.tablalListaCapacitados)
                  .then(function(respuesta) {

                        vm.tablalListaCapacitados.totalElementos = respuesta.total_registros;
                        vm.tablalListaCapacitados.inicio = respuesta.inicio;
                        vm.tablalListaCapacitados.fin = respuesta.fin;

                        if(vm.tablalListaCapacitados.totalElementos > 0)
                        {
                            vm.listaCapacitandos = respuesta.datos;
                            vm.personaSeleccionada = vm.listaCapacitandos[0];
                            vm.tablalListaCapacitados.fila_seleccionada = 0;
                            muestraDatosRegistroActual(vm.personaSeleccionada);
                        }
                  });

            };


            function limpiaBusqueda() {

                  vm.mostrarbtnLimpiar = false;
                  vm.cadena_buscar = '';
                  vm.listaCapacitandos = {};
                  vm.personaSeleccionada = {};
                  vm.tablalListaCapacitados.fila_seleccionada = undefined;
                  vm.tablalListaCapacitados.paginaActual = 1;
                  vm.tablalListaCapacitados.inicio = 0;
                  vm.tablalListaCapacitados.fin = 1;

                  vm.tablalListaCapacitados.condicion = {};

                  tablaDatosService.obtiene_datos_tabla(Capacitandos, vm.tablalListaCapacitados)
                  .then(function(respuesta) {

                        vm.tablalListaCapacitados.totalElementos = respuesta.total_registros;
                        vm.tablalListaCapacitados.inicio = respuesta.inicio;
                        vm.tablalListaCapacitados.fin = respuesta.fin;

                        if(vm.tablalListaCapacitados.totalElementos > 0)
                        {
                            vm.listaCapacitandos = respuesta.datos;
                            vm.personaSeleccionada = vm.listaCapacitandos[0];
                            vm.tablalListaCapacitados.fila_seleccionada = 0;
                            muestraDatosRegistroActual(vm.personaSeleccionada);
                        }
                  });

            };


            function muestraDatosRegistroActual(seleccion) {

                  var index = vm.listaCapacitandos.indexOf(seleccion);
                  vm.personaSeleccionada = seleccion;
                  vm.tablalListaCapacitados.fila_seleccionada = index;
            };


            function cambiarPagina() {

                  if(vm.tablalListaCapacitados.totalElementos > 0)
                  {
                        tablaDatosService.cambia_pagina(Capacitandos, vm.tablalListaCapacitados)
                        .then(function(respuesta) {

                            vm.tablalListaCapacitados.inicio = respuesta.inicio;
                            vm.tablalListaCapacitados.fin = respuesta.fin;

                            vm.listaCapacitandos = respuesta.datos;
                            vm.personaSeleccionada = vm.listaCapacitandos[0];
                            vm.tablalListaCapacitados.fila_seleccionada = 0;
                            muestraDatosRegistroActual(vm.personaSeleccionada);
                        });
                  }
            }


            function guardar() {

                vm.mostrarSpiner = true;
                var inscripEncontrada = false;
                
                angular.forEach(vm.personaSeleccionada.inscripcionesCursos, function(record) {
                    if(registroEditar.idCurso == record.idCurso)
                        inscripEncontrada = true;
                });

                if(inscripEncontrada == true)
                {
                        vm.mostrarSpiner = false;
                        vm.mostrar_msg_error = true;
                        vm.mensaje = 'Esta persona ya esta inscrita en este curso';
                        $timeout(function(){
                             vm.mostrar_msg_error = false;
                             vm.mensaje = '';
                        }, 2000);
                        return;
                }

                CursosOficiales.inscripcionesCursos.create(
                {
                    id: registroEditar.idCurso
                },{
                    idAlumno:           vm.personaSeleccionada.idAlumno,
                    fechaInscripcion:   Date()
                }) 
                .$promise
                .then(function(resp) {

                    var nuevoElemento = {
                        id               : resp.id,
                        idAlumno         : resp.idAlumno,
                        idCurso          : resp.idCurso,
                        fechaInscripcion : resp.fechaInscripcion,
                        fechaPago        : '',
                        numFactura       : '',
                        pagado           : 0,
                        Capacitandos     : {
                            idAlumno         : vm.personaSeleccionada.idAlumno,
                            numControl       : vm.personaSeleccionada.numControl,
                            apellidoPaterno  : vm.personaSeleccionada.apellidoPaterno,
                            apellidoMaterno  : vm.personaSeleccionada.apellidoMaterno,
                            nombre           : vm.personaSeleccionada.nombre,
                            curp             : vm.personaSeleccionada.curp
                        }
                    };

                    $modalInstance.close(nuevoElemento);
                });

            };
    };

})();
