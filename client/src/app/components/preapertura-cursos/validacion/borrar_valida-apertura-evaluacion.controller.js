(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ValidaAperturaCursosController', ValidaAperturaCursosController);

    ValidaAperturaCursosController.$inject = ['$scope', '$modal', 'tablaDatosService', 'HorasAsignadasUnidad', 'ProgTrimCursos', 'CursosPtc', 'CatalogoUnidadesAdmtvas', 'CursosOficiales', 'ControlProcesos'];

    function ValidaAperturaCursosController($scope, $modal, tablaDatosService, HorasAsignadasUnidad, ProgTrimCursos, CursosPtc, CatalogoUnidadesAdmtvas, CursosOficiales, ControlProcesos ) {

            var vm = this;

            vm.muestra_cursos_unidad        = muestra_cursos_unidad;
            vm.muestraDatosRegistroActual   = muestraDatosRegistroActual;
            vm.cambiarPagina                = cambiarPagina;

            vm.apruebaCurso = apruebaCurso;
            vm.rechazaCurso = rechazaCurso;

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

            vm.mensaje_btn_aceptar = '';
            vm.mensaje_btn_rechazar = '';


            inicia();

            function inicia() {

                  if($scope.currentUser.perfil == 'programas')
                  {
                      vm.mensaje_btn_aceptar = 'Marcar como revisado';
                      vm.mensaje_btn_rechazar = 'Rechazar Pre-apertura';
                  }
                  else if( ($scope.currentUser.perfil == 'dir_academica') || ($scope.currentUser.perfil == 'dir_planeacion') )
                  {
                      vm.mensaje_btn_aceptar = 'Marcar como aceptado';
                      vm.mensaje_btn_rechazar = 'Regresar a revisión';
                  }
                  else if($scope.currentUser.perfil == 'dir_gral')
                  {
                      vm.mensaje_btn_aceptar = 'Marcar como autorizado';
                      vm.mensaje_btn_rechazar = 'Regresar a revisión';
                  }

                  vm.listaEstatus = [
                      {valor: -1, texto: 'Todos'},
                      {valor: 1, texto: 'En proceso de revisión'},
                      {valor: 3, texto: 'Rechazado'}
                  ];

                  vm.listaUnidades = [];
                  vm.unidadSeleccionada = undefined;
                  
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
                              order: ['nombreCurso ASC','idCurso ASC'],
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
                                        fields: ['anio','trimestre','horasSeparadas']
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
                                                  order: ['apellidoPaterno ASC','apellidoMaterno ASC','nombre ASC','idInstructor ASC']
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

                  var datos;
                  var mensaje_confirmacion = '';
                  var mensaje_accion = '';
                  if($scope.currentUser.perfil == 'programas')
                  {
                      datos = {
                        revisadoProgramas: true
                      };
                      mensaje_confirmacion = 'La propuesta del curso <strong>'+ seleccion.nombreCurso +'</strong> ser&aacute; marcada como <strong>REVISADA</strong> por el &aacute;rea de programas de capacitaci&oacute;n, ¿Continuar?';
                      mensaje_accion = 'CURSO REVISADO PROGRAMAS';
                  }
                  if($scope.currentUser.perfil == 'dir_academica')
                  {
                      datos = {
                        aprobadoAcademica: true
                      };
                      mensaje_confirmacion = 'La propuesta del curso <strong>'+ seleccion.nombreCurso +'</strong> ser&aacute; marcada como <strong>APROBADA</strong> por el &aacute;rea acad&eacute;mica, ¿Continuar?';
                      mensaje_accion = 'CURSO APROBADO ACADEMICA';
                  }
                  else if($scope.currentUser.perfil == 'dir_gral')
                  {
                      datos = {
                        aprobadoDireccionGral: true,
                        estatus: 2
                      };
                      mensaje_confirmacion = 'La propuesta del curso <strong>'+ seleccion.nombreCurso +'</strong> ser&aacute; registrada como <strong>AUTORIZADA</strong> para su pre-apertura y promoci&oacute;n, ¿Continuar?';
                      mensaje_accion = 'CURSO APROBADO DIR GRAL';
                  }


                  swal({
                    title: "Confirmar",
                    html: mensaje_confirmacion,
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
                            },
                                datos
                            )
                            .$promise
                            .then(function(respuesta) {

                                  if($scope.currentUser.perfil == 'dir_gral')
                                  {
                                        vm.cursoSeleccionado.estatus = respuesta.estatus;

                                        if(seleccion.programadoPTC == false)
                                        {
                                                ProgTrimCursos.find({
                                                    filter: {
                                                        where: {
                                                          and: [
                                                              {idUnidadAdmtva: vm.cursoSeleccionado.idUnidadAdmtva},
                                                              {anio: vm.cursoSeleccionado.ptc_pertenece.anio},
                                                              {or: [
                                                                {estatus: 2},
                                                                {estatus: 4}
                                                              ]}
                                                          ]
                                                        },
                                                        fields: ['idPtc','horasSeparadas']
                                                    }
                                                })
                                                .$promise
                                                .then(function(resp) {

                                                      var num_horas_separadas = 0;
                                                      angular.forEach(resp, function(registro) {
                                                          num_horas_separadas += registro.horasSeparadas;
                                                      });

                                                      num_horas_separadas += vm.cursoSeleccionado.numeroHoras;
                                                      
                                                      var num_horas_separdas_ptc = vm.cursoSeleccionado.ptc_pertenece.horasSeparadas + vm.cursoSeleccionado.numeroHoras;
                                                      ProgTrimCursos.prototype$updateAttributes(
                                                      {
                                                          id: vm.cursoSeleccionado.idPtc
                                                      },{
                                                          horasSeparadas: num_horas_separdas_ptc
                                                      })
                                                      .$promise
                                                      .then(function(respuesta) {
                                                      })
                                                      .catch(function(error) {
                                                      });

                                                      HorasAsignadasUnidad.find({
                                                          filter: {
                                                              where: {
                                                                and: [
                                                                    {idUnidadAdmtva: vm.cursoSeleccionado.idUnidadAdmtva},
                                                                    {anio: vm.cursoSeleccionado.ptc_pertenece.anio},
                                                                ]
                                                              },
                                                              fields: ['id']
                                                          }
                                                      })
                                                      .$promise
                                                      .then(function(respuesta) {
                                                            
                                                            HorasAsignadasUnidad.prototype$updateAttributes(
                                                            {
                                                                id: respuesta[0].id
                                                            },{
                                                                horasSeparadas: num_horas_separadas
                                                            })
                                                            .$promise
                                                            .then(function(respuesta) {
                                                            })
                                                            .catch(function(error) {
                                                            });

                                                      });

                                                });
                                        }
                                        else
                                        {
                                                CursosPtc.prototype$updateAttributes(
                                                {
                                                    id: vm.cursoSeleccionado.idCursoPTC
                                                },{
                                                    estatus: 1
                                                })
                                                .$promise
                                                .then(function(respuesta) {
                                                })
                                                .catch(function(error) {
                                                });
                                        }

                                  }


                                  if(seleccion.programadoPTC == true)
                                    var txt = 'Pre-Apertura Curso PTC';
                                  else
                                    var txt = 'Pre-Apertura Curso Extra';

                                  ControlProcesos
                                  .create({
                                      proceso         : txt,
                                      accion          : mensaje_accion,
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

                                              var titulo_ventana_aviso = 'Curso Revisado';
                                              
                                              if($scope.currentUser.perfil == 'programas')
                                                  var mensaje_ventana_aviso = 'se marc&oacute; el curso como <strong>REVISADO</strong> por el &aacute;rea de programas de capacitaci&oacute;n y se gener&oacute; el identificador del proceso <br><strong style="font-size: 13px;">' + resp_control.identificador + '</strong>';
                                              else if($scope.currentUser.perfil == 'dir_academica')
                                                  var mensaje_ventana_aviso = 'se marc&oacute; el curso como <strong>APROBADO</strong> por el &aacute;rea acad&eacute;mica; y se gener&oacute; el identificador del proceso <br><strong style="font-size: 13px;">' + resp_control.identificador + '</strong>';
                                              /*else if($scope.currentUser.perfil == 'dir_planeacion')
                                                  var mensaje_ventana_aviso = 'se marc&oacute; el curso como <strong>APROBADO</strong> por el &aacute;rea de planeaci&oacute;n; se gener&oacute; el identificador del proceso <br><strong style="font-size: 13px;">' + resp_control.identificador + '</strong>';*/
                                              else if($scope.currentUser.perfil == 'dir_gral')
                                              {
                                                  titulo_ventana_aviso = 'Curso Aceptado';
                                                  var mensaje_ventana_aviso = 'se marc&oacute; el curso como <strong>AUTORIZADO</strong> para su pre-apertura y promoci&oacute;n; se gener&oacute; el identificador del proceso <br><strong style="font-size: 13px;">' + resp_control.identificador + '</strong>';
                                              }

                                              swal({
                                                title: titulo_ventana_aviso,
                                                html: mensaje_ventana_aviso,
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

                  var datos;
                  var mensaje_confirmacion = '';
                  var mensaje_accion = '';
                  if($scope.currentUser.perfil == 'programas')
                  {
                      datos = {
                        estatus: 3
                      };
                      mensaje_confirmacion = 'La propuesta del curso <strong>'+ seleccion.nombreCurso +'</strong> ser&aacute; registrada como <strong>RECHAZADA</strong> y regresada a la unidad, ¿Continuar?';
                      mensaje_accion = 'CURSO RECHAZADO PROGRAMAS';
                  }
                  if($scope.currentUser.perfil == 'dir_academica')
                  {
                      datos = {
                        revisadoProgramas: false
                      };
                      mensaje_confirmacion = 'La propuesta del curso <strong>'+ seleccion.nombreCurso +'</strong> ser&aacute; regresado al &aacute;rea de programas para una nueva revisi&oacute;n, ¿Continuar?';
                      mensaje_accion = 'CURSO RECHAZADO ACADEMICA';
                  }
                  else if($scope.currentUser.perfil == 'dir_gral')
                  {
                      datos = {
                        aprobadoDireccionGral: false
                      };
                      mensaje_confirmacion = 'La propuesta del curso <strong>'+ seleccion.nombreCurso +'</strong> ser&aacute; regresado al &aacute;rea de planeaci&oacute;n para una nueva revisi&oacute;n, ¿Continuar?';
                      mensaje_accion = 'CURSO RECHAZADO DIR GRAL';
                  }

                  swal({
                    title: "Confirmar",
                    html: mensaje_confirmacion,
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
                            },
                                datos
                            )
                            .$promise
                            .then(function(respuesta) {

                                  if($scope.currentUser.perfil == 'programas')
                                      vm.cursoSeleccionado.estatus = respuesta.estatus;

                                  if(seleccion.programadoPTC == true)
                                    var txt = 'Pre-Apertura Curso PTC';
                                  else
                                    var txt = 'Pre-Apertura Curso Extra';

                                  ControlProcesos
                                  .create({
                                      proceso         : txt,
                                      accion          : mensaje_accion,
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

                                              vm.muestra_cursos_unidad();

                                              var titulo_ventana_aviso = 'No autorización de pre-apertura';
                                              
                                              if($scope.currentUser.perfil == 'programas')
                                                  var mensaje_ventana_aviso = 'se registr&oacute; el curso como <strong>RECHAZADO</strong> para su pre-apertura y promoci&oacute;n y se gener&oacute; el identificador de proceso <br><strong style="font-size: 13px;">' + resp_control.identificador + '</strong>';
                                              if($scope.currentUser.perfil == 'dir_academica')
                                                  var mensaje_ventana_aviso = 'se marc&oacute; el curso como <strong>RECHAZADO</strong> por el &aacute;rea acad&eacute;mica y se gener&oacute; el identificador del proceso <br><strong style="font-size: 13px;">' + resp_control.identificador + '</strong>';
                                              /*else if($scope.currentUser.perfil == 'dir_planeacion')
                                                  var mensaje_ventana_aviso = 'se marc&oacute; el curso como <strong>RECHAZADO</strong> por el &aacute;rea de planeaci&oacute;n y se gener&oacute; el identificador del proceso <br><strong style="font-size: 13px;">' + resp_control.identificador + '</strong>';*/
                                              else if($scope.currentUser.perfil == 'dir_gral')
                                                  var mensaje_ventana_aviso = 'se marc&oacute; el curso como <strong>RECHAZADO</strong> y se gener&oacute; el identificador del proceso <br><strong style="font-size: 13px;">' + resp_control.identificador + '</strong>';


                                              swal({
                                                title: titulo_ventana_aviso,
                                                html: mensaje_ventana_aviso,
                                                type: 'success',
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