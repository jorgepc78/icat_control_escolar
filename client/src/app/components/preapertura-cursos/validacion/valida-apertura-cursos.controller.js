(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ValidaAperturaCursosController', ValidaAperturaCursosController);

    ValidaAperturaCursosController.$inject = ['$scope', '$rootScope', '$modal', 'tablaDatosService', 'HorasAsignadasUnidad', 'ProgTrimCursos', 'CursosPtc', 'CatalogoUnidadesAdmtvas', 'CursosOficiales', 'ControlProcesos', 'Usuario'];

    function ValidaAperturaCursosController($scope, $rootScope, $modal, tablaDatosService, HorasAsignadasUnidad, ProgTrimCursos, CursosPtc, CatalogoUnidadesAdmtvas, CursosOficiales, ControlProcesos, Usuario ) {

            var vm = this;

            vm.muestra_cursos_unidad      = muestra_cursos_unidad;
            vm.muestraDatosRegistroActual = muestraDatosRegistroActual;
            vm.cambiarPagina              = cambiarPagina;

            vm.apruebaCurso               = apruebaCurso;
            vm.rechazaCurso               = rechazaCurso;
            vm.generaDocumento            = generaDocumento;

            vm.trimestres = ['PRIMER TRIMESTRE','SEGUNDO TRIMESTRE','TERCER TRIMESTRE','CUARTO TRIMESTRE'];

            vm.tabs = [{active: true}, {active: false}];

            vm.listaUnidades = [];
            vm.unidadSeleccionada = undefined;

            vm.listaCursosValidar = [];
            vm.cursoSeleccionado = {};

            vm.tablaListaCursos = {
              totalElementos     : 0,
              paginaActual       : 1,
              registrosPorPagina : 10,
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
                          nombre          : 'Seleccione la unidad'
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

                  /*vm.client = 1;
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
                  });*/

            }


            function muestra_cursos_unidad() {

                  vm.client = 1;
                  vm.listaCursosValidar = {};
                  vm.cursoSeleccionado = {};
                  vm.tablaListaCursos.fila_seleccionada = undefined;
                  vm.tablaListaCursos.paginaActual = 1;
                  vm.tablaListaCursos.inicio = 0;
                  vm.tablaListaCursos.fin = 1;

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



            function apruebaCurso(seleccion, origen) {

                  var datos;
                  var mensaje_confirmacion = '';
                  var mensaje_accion = '';
                  if(origen == 'dp')
                  {
                      datos = {
                        revisadoProgramas: true
                      };
                      mensaje_confirmacion = 'La propuesta del curso <strong>'+ seleccion.nombreCurso +'</strong> ser&aacute; marcada como <strong>REVISADA</strong> por el &aacute;rea de programas de capacitaci&oacute;n, ¿Continuar?';
                      mensaje_accion = 'CURSO REVISADO PROGRAMAS';
                  }
                  else if(origen == 'da')
                  {
                      datos = {
                        aprobadoAcademica: true
                      };
                      mensaje_confirmacion = 'La propuesta del curso <strong>'+ seleccion.nombreCurso +'</strong> ser&aacute; marcada como <strong>APROBADA</strong> por la direcci&oacute;n acad&eacute;mica, ¿Continuar?';
                      mensaje_accion = 'CURSO APROBADO ACADEMICA';
                  }
                  else if(origen == 'dg')
                  {
                      datos = {
                        aprobadoDireccionGral: true,
                        estatus: 2
                      };
                      mensaje_confirmacion = 'La propuesta del curso <strong>'+ seleccion.nombreCurso +'</strong> ser&aacute; registrada como <strong>AUTORIZADA</strong>, a partir de ahora podr&aacute; recibir inscripci&oacute;n, ¿Continuar?';
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

                                  if(origen == 'dg')
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
                                              
                                              if(origen == 'dp')
                                                  var mensaje_ventana_aviso = 'se marc&oacute; el curso como <strong>REVISADO</strong> por el &aacute;rea de programas de capacitaci&oacute;n y se gener&oacute; el identificador del proceso <br><strong style="font-size: 13px;">' + resp_control.identificador + '</strong>';
                                              else if(origen == 'da')
                                                  var mensaje_ventana_aviso = 'se marc&oacute; el curso como <strong>APROBADO</strong> por la direcci&oacute;n acad&eacute;mica; y se gener&oacute; el identificador del proceso <br><strong style="font-size: 13px;">' + resp_control.identificador + '</strong>';
                                              else if(origen == 'dg')
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
                                              
                                              //inicia();
                                              vm.muestra_cursos_unidad();
                                        });
                                  });

                            });

                  });

            }



            function rechazaCurso(seleccion) {

                  swal({
                    title: "Confirmar",
                    html: 'La propuesta del curso <strong>'+ seleccion.nombreCurso +'</strong> ser&aacute; registrada como <strong>RECHAZADA</strong> y regresada a la unidad, ¿Continuar?',
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

                                  if($scope.currentUser.perfil == 'programas')
                                      vm.cursoSeleccionado.estatus = respuesta.estatus;

                                  var txt = 'Pre-Apertura Curso Extra';
                                  if(seleccion.programadoPTC == true)
                                  {
                                      txt = 'Pre-Apertura Curso PTC';
                                      CursosPtc.prototype$updateAttributes(
                                      {
                                          id: seleccion.idCursoPTC
                                      },{
                                          estatus: 4
                                      })
                                      .$promise
                                      .then(function(respuesta) {
                                      });
                                  }

                                  ControlProcesos
                                  .create({
                                      proceso         : txt,
                                      accion          : 'CURSO RECHAZADO PROGRAMAS',
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

                                              swal({
                                                title: 'No autorización de pre-apertura',
                                                html: 'se registr&oacute; el curso como <strong>RECHAZADO</strong> para su pre-apertura y promoci&oacute;n y se gener&oacute; el identificador de proceso <br><strong style="font-size: 13px;">' + resp_control.identificador + '</strong>',
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

            function generaDocumento(idCurso) {
                    Usuario.prototype$__get__accessTokens({ 
                        id: $rootScope.currentUser.id_usuario
                    })
                    .$promise
                    .then(function(resp) {
                        var link = angular.element('<a href="api/CursosOficiales/exporta_doc_preapertura_curso/'+idCurso+'?access_token='+resp[0].id+'" target="_blank"></a>');
                        angular.element(document.body).append(link);
                        link[0].click();
                        link.remove();
                    });
            }

    };

})();