(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ValidaAperturaEvaluacionController', ValidaAperturaEvaluacionController);

    ValidaAperturaEvaluacionController.$inject = ['$scope', '$rootScope', '$modal', 'Usuario', 'tablaDatosService', 'HorasAsignadasUnidad', 'ProgTrimCursos', 'CursosPtc', 'CatalogoUnidadesAdmtvas', 'Evaluacion', 'ControlProcesos'];

    function ValidaAperturaEvaluacionController($scope, $rootScope, $modal, Usuario, tablaDatosService, HorasAsignadasUnidad, ProgTrimCursos, CursosPtc, CatalogoUnidadesAdmtvas, Evaluacion, ControlProcesos ) {

            var vm = this;

            vm.muestra_evaluaciones_unidad = muestra_evaluaciones_unidad;
            vm.muestraDatosRegistroActual  = muestraDatosRegistroActual;
            vm.cambiarPagina               = cambiarPagina;

            vm.apruebaEvaluacion           = apruebaEvaluacion;
            vm.rechazaEvaluacion           = rechazaEvaluacion;
            vm.generaDocumento             = generaDocumento;

            vm.listaUnidades = [];
            vm.unidadSeleccionada = undefined;

            vm.listaEvaluacionesValidar = [];
            vm.EvaluacionSeleccionada = {};

            vm.tablaListaEvaluaciones = {
              totalElementos     : 0,
              paginaActual       : 1,
              registrosPorPagina : 5,
              inicio             : 0,
              fin                : 1,
              condicion          : {},
              filtro_datos       : {},
              fila_seleccionada  : 0
            };

            inicia();

            function inicia() {

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

                  vm.tablaListaEvaluaciones.condicion = {
                    or:[
                      {estatus: 1},
                      {estatus: 3}
                    ]
                  };

                  vm.tablaListaEvaluaciones.filtro_datos = {
                          filter: {
                              where: vm.tablaListaEvaluaciones.condicion,
                              fields:['idEvaluacion','tipoEvaluacion','idUnidadAdmtva','idPtc','idCatalogoCurso','nombreCurso','claveCurso','idEstandar','codigoEstandar','nombreEstandar','aulaAsignada','costo','fechaEvaluacion','horaEvaluacion','idInstructor','curpInstructor','nombreInstructor','cantidadPagoEvaluador','nomenclaturaContrato','observaciones','estatus','revisadoCertificacion','aprobadoAcademica'],
                              limit: vm.tablaListaEvaluaciones.registrosPorPagina,
                              skip: vm.tablaListaEvaluaciones.paginaActual - 1,
                              include: [
                                  {
                                      relation: 'unidad_pertenece',
                                      scope: {
                                        fields: ['nombre']
                                      }
                                  },
                                  {
                                      relation: 'alumnos_inscritos',
                                      scope: {
                                        fields: ['idAlumno', 'numControl', 'nombreCompleto','idUnidadAdmtva'],
                                      }
                                  },
                                  {
                                      relation: 'inscripcionesEvaluaciones',
                                      scope: {
                                        fields: ['id', 'idAlumno', 'pagado', 'fechaPago','numFactura','calificacion','numDocAcreditacion']
                                      }
                                  }
                              ]
                          }
                  };
            }


            function muestra_evaluaciones_unidad() {

                  vm.client = 1;
                  vm.listaEvaluacionesValidar = {};
                  vm.EvaluacionSeleccionada = {};
                  vm.tablaListaEvaluaciones.fila_seleccionada = undefined;
                  vm.tablaListaEvaluaciones.paginaActual = 1;
                  vm.tablaListaEvaluaciones.inicio = 0;
                  vm.tablaListaEvaluaciones.fin = 1;

                  if(vm.unidadSeleccionada.idUnidadAdmtva == -1)
                  {
                        vm.tablaListaEvaluaciones.condicion = {
                            or: [
                              {estatus: 1},
                              {estatus: 3}
                            ]
                        };
                  }
                  else
                  {
                        vm.tablaListaEvaluaciones.condicion = {
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

                  tablaDatosService.obtiene_datos_tabla(Evaluacion, vm.tablaListaEvaluaciones)
                  .then(function(respuesta) {

                        vm.tablaListaEvaluaciones.totalElementos = respuesta.total_registros;
                        vm.tablaListaEvaluaciones.inicio = respuesta.inicio;
                        vm.tablaListaEvaluaciones.fin = respuesta.fin;

                        if(vm.tablaListaEvaluaciones.totalElementos > 0)
                        {
                            vm.listaEvaluacionesValidar = respuesta.datos;
                            vm.EvaluacionSeleccionada = vm.listaEvaluacionesValidar[0];
                            vm.client = 2;
                            vm.tablaListaEvaluaciones.fila_seleccionada = 0;
                            muestraDatosRegistroActual(vm.EvaluacionSeleccionada);
                        }
                  });
            };


            function muestraDatosRegistroActual(seleccion) {

                  var index = vm.listaEvaluacionesValidar.indexOf(seleccion);
                  vm.EvaluacionSeleccionada = seleccion;
                  vm.client = 2;
                  vm.tablaListaEvaluaciones.fila_seleccionada = index;
            };



            function cambiarPagina() {

                  if(vm.tablaListaEvaluaciones.totalElementos > 0)
                  {
                        tablaDatosService.cambia_pagina(Evaluacion, vm.tablaListaEvaluaciones)
                        .then(function(respuesta) {

                            vm.tablaListaEvaluaciones.inicio = respuesta.inicio;
                            vm.tablaListaEvaluaciones.fin = respuesta.fin;

                            vm.listaEvaluacionesValidar = respuesta.datos;
                            vm.EvaluacionSeleccionada = vm.listaEvaluacionesValidar[0];
                            vm.client = 2;
                            vm.tablaListaEvaluaciones.fila_seleccionada = 0;
                            muestraDatosRegistroActual(vm.EvaluacionSeleccionada);
                        });
                  }
            }



            function apruebaEvaluacion(seleccion, origen) {

                  var datos;
                  var mensaje_confirmacion = '';
                  var mensaje_accion = '';
                  var nombreEvaluacion = (seleccion.tipoEvaluacion == 1 ? seleccion.nombreCurso : seleccion.nombreEstandar);

                  if(origen == 'ce')
                  {
                      datos = {
                        revisadoCertificacion: true
                      };
                      mensaje_confirmacion = 'La propuesta de la evaluaci&oacute;n <strong>'+ nombreEvaluacion +'</strong> ser&aacute; marcada como <strong>REVISADA</strong> por el &aacute;rea de certificaci&oacute;n, ¿Continuar?';
                      mensaje_accion = 'EVALUACION REVISADA CERTIFICACION';
                  }
                   else if(origen == 'da')
                  {
                      datos = {
                        aprobadoAcademica: true
                      };
                      mensaje_confirmacion = 'La propuesta de la evaluaci&oacute;n <strong>'+ nombreEvaluacion +'</strong> ser&aacute; marcada como <strong>APROBADA</strong> por el Dir. acad&eacute;mica, ¿Continuar?';
                      mensaje_accion = 'EVALUACION APROBADA ACADEMICA';
                  }
                  else if(origen == 'dg')
                  {
                      datos = {
                        aprobadoDireccionGral: true,
                        estatus: 2
                      };
                      mensaje_confirmacion = 'La propuesta de la evaluaci&oacute;n <strong>'+ nombreEvaluacion +'</strong> ser&aacute; registrada como <strong>AUTORIZADA</strong> para su aplicaci&oacute;n, ¿Continuar?';
                      mensaje_accion = 'EVALUACION APROBADA DIR GRAL';
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

                            Evaluacion.prototype$updateAttributes(
                            {
                                id: seleccion.idEvaluacion
                            },
                                datos
                            )
                            .$promise
                            .then(function(respuesta) {

                                  ControlProcesos
                                  .create({
                                      proceso         : 'Pre-Apertura Evaluacion',
                                      accion          : mensaje_accion,
                                      idDocumento     : seleccion.idEvaluacion,
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

                                              var titulo_ventana_aviso = 'Evaluación Revisada';
                                              
                                              if(origen == 'ce')
                                                  var mensaje_ventana_aviso = 'se marc&oacute; la evaluaci&oacute;n como <strong>REVISADA</strong> por el &aacute;rea de certificaci&oacute;n y se gener&oacute; el identificador de proceso <br><strong style="font-size: 13px;">' + resp_control.identificador + '</strong>';
                                              else if(origen == 'da')
                                                  var mensaje_ventana_aviso = 'se marc&oacute; la evaluaci&oacute;n como <strong>APROBADA</strong> por la Dir. acad&eacute;mica; y se gener&oacute; el identificador de proceso <br><strong style="font-size: 13px;">' + resp_control.identificador + '</strong>';
                                              else if(origen == 'dg')
                                              {
                                                  titulo_ventana_aviso = 'Evaluación Aceptada';
                                                  var mensaje_ventana_aviso = 'se marc&oacute; la evaluaci&oacute;n como <strong>AUTORIZADA</strong> para su aplicaci&oacute;n y se gener&oacute; el identificador de proceso <br><strong style="font-size: 13px;">' + resp_control.identificador + '</strong>';
                                              }

                                              swal({
                                                title: titulo_ventana_aviso,
                                                html: mensaje_ventana_aviso,
                                                type: 'success',
                                                showCancelButton: false,
                                                confirmButtonColor: "#9a0000",
                                                confirmButtonText: "Aceptar"
                                              });
                                              
                                              vm.muestra_evaluaciones_unidad();
                                        });
                                  });

                            });

                  });

            }



            function rechazaEvaluacion(seleccion) {

                  swal({
                    title: "Confirmar",
                    html: 'La propuesta de evaluaci&oacute;n <strong>'+ (seleccion.tipoEvaluacion == 1 ? seleccion.nombreCurso : seleccion.nombreEstandar) +'</strong> ser&aacute; registrada como <strong>RECHAZADA</strong> y regresada a la unidad, ¿Continuar?',
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#9a0000",
                    confirmButtonText: "Aceptar",
                    cancelButtonText: "Cancelar",
                    closeOnConfirm: false,
                    closeOnCancel: true
                  }, function(){
                          swal.disableButtons();

                            Evaluacion.prototype$updateAttributes(
                            {
                                id: seleccion.idEvaluacion
                            },
                                {estatus: 3}
                            )
                            .$promise
                            .then(function(respuesta) {

                                  vm.EvaluacionSeleccionada.estatus = respuesta.estatus;

                                  ControlProcesos
                                  .create({
                                      proceso         : 'Pre-Apertura Evaluacion',
                                      accion          : 'EVALUACION RECHAZADA CERTIFICACION',
                                      idDocumento     : seleccion.idEvaluacion,
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

                                              vm.muestra_evaluaciones_unidad();

                                              var titulo_ventana_aviso = 'No autorización de pre-apertura';
                                              
                                              if($scope.currentUser.perfil == 'programas')
                                                  var mensaje_ventana_aviso = 'se registr&oacute; la evaluaci&oacute;n como <strong>RECHAZADA</strong> para su aplicaci&oacute;n y se gener&oacute; el identificador de proceso <br><strong style="font-size: 13px;">' + resp_control.identificador + '</strong>';
                                              if($scope.currentUser.perfil == 'dir_academica')
                                                  var mensaje_ventana_aviso = 'se marc&oacute; la evaluaci&oacute;n como <strong>RECHAZADA</strong> por el &aacute;rea acad&eacute;mica y se gener&oacute; el identificador de proceso <br><strong style="font-size: 13px;">' + resp_control.identificador + '</strong>';
                                              else if($scope.currentUser.perfil == 'dir_planeacion')
                                                  var mensaje_ventana_aviso = 'se marc&oacute; la evaluaci&oacute;n como <strong>RECHAZADA</strong> por el &aacute;rea de planeaci&oacute;n y se gener&oacute; el identificador de proceso <br><strong style="font-size: 13px;">' + resp_control.identificador + '</strong>';
                                              else if($scope.currentUser.perfil == 'dir_gral')
                                                  var mensaje_ventana_aviso = 'se marc&oacute; la evaluaci&oacute;n como <strong>RECHAZADA</strong> y se gener&oacute; el identificador de proceso <br><strong style="font-size: 13px;">' + resp_control.identificador + '</strong>';


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


            function generaDocumento(idEvaluacion) {
                    Usuario.prototype$__get__accessTokens({ 
                        id: $rootScope.currentUser.id_usuario
                    })
                    .$promise
                    .then(function(resp) {
                        var link = angular.element('<a href="api/Evaluaciones/exporta_doc_valida_evaluacion/'+idEvaluacion+'?access_token='+resp[0].id+'" target="_blank"></a>');
                        angular.element(document.body).append(link);
                        link[0].click();
                        link.remove();
                    });
            }

    };

})();