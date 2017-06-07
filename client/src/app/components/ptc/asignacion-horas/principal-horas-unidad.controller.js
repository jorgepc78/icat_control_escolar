(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('PrincipalHorasUnidadController', PrincipalHorasUnidadController);

    PrincipalHorasUnidadController.$inject = ['$modal', 'tablaDatosService', 'CatalogoUnidadesAdmtvas', 'HorasAsignadasUnidad', 'ProgTrimCursos'];

    function PrincipalHorasUnidadController($modal, tablaDatosService, CatalogoUnidadesAdmtvas, HorasAsignadasUnidad, ProgTrimCursos ) {

            var vm = this;
            vm.muestraDatosRegistroActual = muestraDatosRegistroActual;
            vm.cambiarPagina              = cambiarPagina;
            vm.nuevo_registro             = nuevo_registro;
            vm.edita_datos_registro       = edita_datos_registro;
            vm.elimina_registro           = elimina_registro;

            vm.indexUltimo = 0;
            vm.registros = [];
            vm.RegistroSeleccionado = [];
            vm.historial = [];

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

                  vm.tablaListaRegistros.condicion = {
                      idUnidadAdmtva: {gt: 1}
                  };

                  vm.tablaListaRegistros.filtro_datos = {
                          filter: {
                              where: vm.tablaListaRegistros.condicion,
                              order: ['nombre ASC','idUnidadAdmtva ASC'],
                              limit: vm.tablaListaRegistros.registrosPorPagina,
                              skip: vm.tablaListaRegistros.paginaActual - 1,
                              include: [
                                {
                                    relation: 'horas_asignadas',
                                    scope: {
                                      order: ['anio DESC']
                                    }
                                }
                              ]
                          }
                  };

                  vm.registros = {};
                  vm.RegistroSeleccionado = {};
                  vm.tablaListaRegistros.fila_seleccionada = undefined;
                  vm.client = 1;

                  tablaDatosService.obtiene_datos_tabla(CatalogoUnidadesAdmtvas, vm.tablaListaRegistros)
                  .then(function(respuesta) {

                        vm.tablaListaRegistros.totalElementos = respuesta.total_registros;
                        vm.tablaListaRegistros.inicio = respuesta.inicio;
                        vm.tablaListaRegistros.fin = respuesta.fin;

                        if(vm.tablaListaRegistros.totalElementos > 0)
                        {
                            vm.registros = respuesta.datos;
                            vm.RegistroSeleccionado = vm.registros[0];
                            vm.client = 2;
                            vm.tablaListaRegistros.fila_seleccionada = 0;
                            muestraDatosRegistroActual(vm.RegistroSeleccionado);
                        }
                  });

            }


            function cambiarPagina() {

                  if(vm.tablaListaRegistros.totalElementos > 0)
                  {
                        tablaDatosService.cambia_pagina(CatalogoUnidadesAdmtvas, vm.tablaListaRegistros)
                        .then(function(respuesta) {

                            vm.tablaListaRegistros.inicio = respuesta.inicio;
                            vm.tablaListaRegistros.fin = respuesta.fin;

                            vm.registros = respuesta.datos;
                            vm.RegistroSeleccionado = vm.registros[0];
                            vm.client = 2;
                            vm.tablaListaRegistros.fila_seleccionada = 0;
                            muestraDatosRegistroActual(vm.RegistroSeleccionado);
                        });
                  }
            }


            function muestraDatosRegistroActual(seleccion) {

                  var index = vm.registros.indexOf(seleccion);
                  vm.RegistroSeleccionado = seleccion;
                  
                  vm.historial = [];
                  for(var i=1; i < vm.RegistroSeleccionado.horas_asignadas.length; i++ )
                  {
                        vm.historial.push({
                            id             : vm.RegistroSeleccionado.horas_asignadas[i].id,
                            idUnidadAdmtva : vm.RegistroSeleccionado.idUnidadAdmtva,
                            anio           : vm.RegistroSeleccionado.horas_asignadas[i].anio,
                            horasAsignadas : vm.RegistroSeleccionado.horas_asignadas[i].horasAsignadas,
                            horasSeparadas : vm.RegistroSeleccionado.horas_asignadas[i].horasSeparadas,
                            horasAplicadas : vm.RegistroSeleccionado.horas_asignadas[i].horasAplicadas
                        });                    
                  }

                  vm.client = 2;
                  vm.tablaListaRegistros.fila_seleccionada = index;
            };


            function nuevo_registro(seleccion) {

                    var modalInstance = $modal.open({
                        templateUrl: 'app/components/ptc/asignacion-horas/modal-captura-num-horas.html',
                        windowClass: "animated fadeIn",
                        controller: 'ModalCapturaHorasController as vm',
                        resolve: {
                          registroEditar: function () { return seleccion }
                        }
                    });

                    modalInstance.result.then(function (respuesta) {
                        
                          vm.RegistroSeleccionado.horas_asignadas.unshift({
                              id             : respuesta.id,
                              idUnidadAdmtva : vm.RegistroSeleccionado.idUnidadAdmtva,
                              anio           : respuesta.anio,
                              horasAsignadas : respuesta.horasAsignadas,
                              horasSeparadas : 0,
                              horasAplicadas : 0
                          });
                          vm.historial = [];
                          for(var i=1; i < vm.RegistroSeleccionado.horas_asignadas.length; i++ )
                          {
                                vm.historial.push({
                                    id             : vm.RegistroSeleccionado.horas_asignadas[i].id,
                                    idUnidadAdmtva : vm.RegistroSeleccionado.idUnidadAdmtva,
                                    anio           : vm.RegistroSeleccionado.horas_asignadas[i].anio,
                                    horasAsignadas : vm.RegistroSeleccionado.horas_asignadas[i].horasAsignadas,
                                    horasSeparadas : vm.RegistroSeleccionado.horas_asignadas[i].horasSeparadas,
                                    horasAplicadas : vm.RegistroSeleccionado.horas_asignadas[i].horasAplicadas
                                });                    
                          }

                    }, function () {
                    });
            };


            function edita_datos_registro(seleccion) {

                    var modalInstance = $modal.open({
                        templateUrl: 'app/components/ptc/asignacion-horas/modal-captura-num-horas.html',
                        windowClass: "animated fadeIn",
                        controller: 'ModalEditaHorasController as vm',
                        resolve: {
                          registroEditar: function () { return seleccion }
                        }
                    });

                    modalInstance.result.then(function (respuesta) {
                        
                          vm.RegistroSeleccionado.horas_asignadas[0].horasAsignadas = respuesta.horasAsignadas;

                    }, function () {
                    });
            };



            function elimina_registro(seleccion) {

                  ProgTrimCursos.find({
                    filter: {
                        where: {
                            and: [
                              {anio: seleccion.horas_asignadas[0].anio},
                              {idUnidadAdmtva: seleccion.idUnidadAdmtva}
                            ]
                        },
                        fields: ['idPtc']
                    }
                  })
                  .$promise
                  .then(function(resultado) {
                      if(resultado.length > 0)
                      {
                            swal({
                              title: 'Error',
                              html: 'No se puede eliminar a&ntilde;o seleccionado ya que se ha usado para generar un PTC en la unidad',
                              type: 'error',
                              showCancelButton: false,
                              confirmButtonColor: "#9a0000",
                              confirmButtonText: "Aceptar"
                            });
                      }
                      else
                      {
                            swal({
                              title: "Confirmar",
                              html: 'Se eliminar&aacute; el a&ntilde;o <strong>'+ seleccion.horas_asignadas[0].anio +'</strong> con sus horas asignadas, ¿Continuar?',
                              type: "warning",
                              showCancelButton: true,
                              confirmButtonColor: "#3085d6",
                              confirmButtonText: "Aceptar",
                              cancelButtonText: "Cancelar",
                              closeOnConfirm: false,
                              closeOnCancel: true
                            }, function(){
                                    swal.disableButtons();

                                    HorasAsignadasUnidad.deleteById({ id: seleccion.horas_asignadas[0].id })
                                    .$promise
                                    .then(function() { 

                                          vm.RegistroSeleccionado.horas_asignadas.splice(0,1);
                                          vm.historial.splice(0,1);
                                          swal('Registro eliminado', '', 'success');
                                    });

                            });
                      }
                  });


            };

    };

})();