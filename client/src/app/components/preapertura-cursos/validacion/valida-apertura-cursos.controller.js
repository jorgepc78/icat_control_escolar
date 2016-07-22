(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ValidaAperturaCursosController', ValidaAperturaCursosController);

    ValidaAperturaCursosController.$inject = ['$scope', '$modal', 'tablaDatosService', 'CatalogoUnidadesAdmtvas', 'CursosOficiales', 'ControlProcesos'];

    function ValidaAperturaCursosController($scope, $modal, tablaDatosService, CatalogoUnidadesAdmtvas, CursosOficiales, ControlProcesos ) {

            var vm = this;

            vm.trimestres = ['PRIMER TRIMESTRE','SEGUNDO TRIMESTRE','TERCER TRIMESTRE','CUARTO TRIMESTRE'];

            vm.tabs = [{active: true}, {active: false}];

            vm.listaUnidades = [];
            vm.unidadSeleccionada = undefined;

            vm.listaCursosValidar = [];
            vm.cursoSeleccionado = {};

            vm.tablaListaCursos = {
              totalElementos     : 0,
              paginaActual       : 1,
              registrosPorPagina : 5,
              inicio             : 0,
              fin                : 1,
              condicion          : {},
              filtro_datos       : {},
              fila_seleccionada  : 0
            };

            vm.muestra_cursos_unidad     = muestra_cursos_unidad;
            vm.muestraDatosRegistroActual   = muestraDatosRegistroActual;
            vm.cambiarPagina                = cambiarPagina;

            vm.apruebaCurso = apruebaCurso;
            vm.rechazaCurso = rechazaCurso;

            inicia();

            function inicia() {

                  CatalogoUnidadesAdmtvas.find({
                      filter: {
                          where: {idUnidadAdmtva: {gt: 1}},
                          order: 'nombre ASC'
                      }
                  })
                  .$promise
                  .then(function(resp) {

                      vm.listaUnidades.push({
                          idUnidadAdmtva  : -1,
                          nombre          : 'Todas'
                      });

                      angular.forEach(resp, function(unidad) {
                            vm.listaUnidades.push({
                                idUnidadAdmtva  : unidad.idUnidadAdmtva,
                                nombre          : unidad.nombre
                            });
                      });

                      vm.unidadSeleccionada = vm.listaUnidades[0];
                  });

                  vm.tablaListaCursos.condicion = {
                    or:[
                      {estatus: 1},
                      {estatus: 3}
                    ]
                  };

                  vm.tablaListaCursos.filtro_datos = {
                          filter: {
                              where: vm.tablaListaCursos.condicion,
                              order: ['nombreCurso ASC'],
                              limit: vm.tablaListaCursos.registrosPorPagina,
                              skip: vm.tablaListaCursos.paginaActual - 1,
                              include: [
                                  {
                                      relation: 'localidad_pertenece',
                                      scope: {
                                        fields: ['nombre']
                                      }
                                  },
                                  {
                                      relation: 'unidad_pertenece',
                                      scope: {
                                        fields: ['nombre']
                                      }
                                  },
                                  {
                                      relation: 'ptc_pertenece',
                                      scope: {
                                        fields: ['anio','trimestre']
                                      }
                                  },
                                  {
                                      relation: 'curso_ptc_pertenece',
                                      scope: {
                                        include: [
                                            {
                                                relation: 'detalle_curso',
                                                scope: {
                                                  fields: ['nombreCurso','modalidad','claveCurso','descripcion']
                                                }
                                            },
                                            {
                                                relation: 'instructores_propuestos',
                                                scope: {
                                                  fields: ['apellidoPaterno','apellidoMaterno','nombre','curp'],
                                                  order: ['apellidoPaterno ASC','apellidoMaterno ASC','nombre ASC']
                                                }
                                            }
                                        ]
                                      }
                                  }
                              ]
                          }
                  };

                  vm.client = 1;
                  vm.tablaListaCursos.paginaActual = 1;
                  vm.tablaListaCursos.inicio = 0;
                  vm.tablaListaCursos.fin = 1;

                  vm.listaCursosValidar = {};
                  tablaDatosService.obtiene_datos_tabla(CursosOficiales, vm.tablaListaCursos)
                  .then(function(respuesta) {

                        vm.tablaListaCursos.totalElementos = respuesta.total_registros;
                        vm.tablaListaCursos.inicio = respuesta.inicio;
                        vm.tablaListaCursos.fin = respuesta.fin;

                        if(vm.tablaListaCursos.totalElementos > 0)
                        {
                            vm.listaCursosValidar = respuesta.datos;
                            vm.cursoSeleccionado = vm.listaCursosValidar[0];
                            vm.client = 2;
                            vm.tablaListaCursos.fila_seleccionada = 0;
                            muestraDatosRegistroActual(vm.cursoSeleccionado);
                        }
                  });

            }


            function muestra_cursos_unidad() {

                  vm.client = 1;
                  vm.listaCursosValidar = {};
                  vm.cursoSeleccionado = {};
                  vm.tablaListaCursos.fila_seleccionada = undefined;
                  vm.tablaListaCursos.paginaActual = 1;
                  vm.tablaListaCursos.inicio = 0;
                  vm.tablaListaCursos.fin = 1;

                  if(vm.unidadSeleccionada.idUnidadAdmtva == -1)
                  {
                        vm.tablaListaCursos.condicion = {
                            or: [
                              {estatus: 1},
                              {estatus: 3}
                            ]
                        };
                  }
                  else
                  {
                        vm.tablaListaCursos.condicion = {
                            and: [
                              {idUnidadAdmtva: vm.unidadSeleccionada.idUnidadAdmtva},
                              {
                                  or: [
                                    {estatus: 1},
                                    {estatus: 3}
                                  ]
                              },
                            ]
                        };
                  }

                  tablaDatosService.obtiene_datos_tabla(CursosOficiales, vm.tablaListaCursos)
                  .then(function(respuesta) {

                        vm.tablaListaCursos.totalElementos = respuesta.total_registros;
                        vm.tablaListaCursos.inicio = respuesta.inicio;
                        vm.tablaListaCursos.fin = respuesta.fin;

                        if(vm.tablaListaCursos.totalElementos > 0)
                        {
                            vm.listaCursosValidar = respuesta.datos;
                            vm.cursoSeleccionado = vm.listaCursosValidar[0];
                            vm.client = 2;
                            vm.tablaListaCursos.fila_seleccionada = 0;
                            muestraDatosRegistroActual(vm.cursoSeleccionado);
                        }
                  });
            };


            function muestraDatosRegistroActual(seleccion) {

                  var index = vm.listaCursosValidar.indexOf(seleccion);
                  vm.cursoSeleccionado = seleccion;
                  vm.client = 2;
                  vm.tablaListaCursos.fila_seleccionada = index;

                  vm.tabs = [{active: true}, {active: false}]; 
            };



            function cambiarPagina() {

                  if(vm.tablaListaCursos.totalElementos > 0)
                  {
                        tablaDatosService.cambia_pagina(CursosOficiales, vm.tablaListaCursos)
                        .then(function(respuesta) {

                            vm.tablaListaCursos.inicio = respuesta.inicio;
                            vm.tablaListaCursos.fin = respuesta.fin;

                            vm.listaCursosValidar = respuesta.datos;
                            vm.cursoSeleccionado = vm.listaCursosValidar[0];
                            vm.client = 2;
                            vm.tablaListaCursos.fila_seleccionada = 0;
                            muestraDatosRegistroActual(vm.cursoSeleccionado);
                        });
                  }
            }



            function apruebaCurso(seleccion) {

                  swal({
                    title: "Confirmar",
                    html: 'La propuesta del curso <strong>'+ seleccion.nombreCurso +'</strong> ser&aacute; registrada como aprobada para su pre-apertura y promoci&oacute;n, ¿Continuar?',
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#9a0000",
                    confirmButtonText: "Aceptar",
                    cancelButtonText: "Cancelar",
                    closeOnConfirm: false,
                    closeOnCancel: true
                  }, function(){
                          swal.disableButtons();

                            CursosOficiales.prototype$updateAttributes(
                            {
                                id: seleccion.idCurso
                            },{
                                estatus: 2
                            })
                            .$promise
                            .then(function(respuesta) {

                                  vm.cursoSeleccionado.estatus = respuesta.estatus;

                                  if(seleccion.programadoPTC == true)
                                    var txt = 'Pre-Apertura Curso PTC';
                                  else
                                    var txt = 'Pre-Apertura Curso Extra';

                                  ControlProcesos
                                  .create({
                                      proceso         : txt,
                                      accion          : 'ACEPTACION PRE-APERTURA',
                                      idDocumento     : seleccion.idCurso,
                                      idUsuario       : $scope.currentUser.id_usuario,
                                      idUnidadAdmtva  : $scope.currentUser.unidad_pertenece_id
                                  })
                                  .$promise
                                  .then(function(resp) {

                                        ControlProcesos.findById({ 
                                            id: resp.id,
                                            filter: {
                                              fields : ['identificador']
                                            }
                                        })
                                        .$promise
                                        .then(function(resp_control) {

                                              swal({
                                                title: 'Aprobación enviada',
                                                html: 'se registr&oacute; el curso como autorizado para su pre-apertura y promoci&oacute;n y se gener&oacute; el identificador de proceso <br><strong style="font-size: 13px;">' + resp_control.identificador + '</strong>',
                                                type: 'success',
                                                showCancelButton: false,
                                                confirmButtonColor: "#9a0000",
                                                confirmButtonText: "Aceptar"
                                              });
                                              
                                              inicia();
                                        });
                                  });

                            });

                  });

            }



            function rechazaCurso(seleccion) {

                  swal({
                    title: "Confirmar",
                    html: 'La propuesta del curso <strong>'+ seleccion.nombreCurso +'</strong> ser&aacute; registrada como rechazada, ¿Continuar?',
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#9a0000",
                    confirmButtonText: "Aceptar",
                    cancelButtonText: "Cancelar",
                    closeOnConfirm: false,
                    closeOnCancel: true
                  }, function(){
                          swal.disableButtons();

                            CursosOficiales.prototype$updateAttributes(
                            {
                                id: seleccion.idCurso
                            },{
                                estatus: 3
                            })
                            .$promise
                            .then(function(respuesta) {

                                  vm.cursoSeleccionado.estatus = respuesta.estatus;

                                  if(seleccion.programadoPTC == true)
                                    var txt = 'Pre-Apertura Curso PTC';
                                  else
                                    var txt = 'Pre-Apertura Curso Extra';

                                  ControlProcesos
                                  .create({
                                      proceso         : txt,
                                      accion          : 'RECHAZO PRE-APERTURA',
                                      idDocumento     : seleccion.idCurso,
                                      idUsuario       : $scope.currentUser.id_usuario,
                                      idUnidadAdmtva  : $scope.currentUser.unidad_pertenece_id
                                  })
                                  .$promise
                                  .then(function(resp) {

                                        ControlProcesos.findById({ 
                                            id: resp.id,
                                            filter: {
                                              fields : ['identificador']
                                            }
                                        })
                                        .$promise
                                        .then(function(resp_control) {

                                              swal({
                                                title: 'No autorización de pre-apertura',
                                                html: 'se registr&oacute; el curso como NO AUTORIZADO para su pre-apertura y promoci&oacute;n y se gener&oacute; el identificador de proceso <br><strong style="font-size: 13px;">' + resp_control.identificador + '</strong>',
                                                type: 'danger',
                                                showCancelButton: false,
                                                confirmButtonColor: "#9a0000",
                                                confirmButtonText: "Aceptar"
                                              });
                                        });
                                  });

                            });

                  });

            }

    };

})();