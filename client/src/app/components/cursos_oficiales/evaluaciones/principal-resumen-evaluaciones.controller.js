(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ResumenEvaluacionesController', ResumenEvaluacionesController);

    ResumenEvaluacionesController.$inject = ['$scope', '$stateParams', '$modal', 'tablaDatosService', 'CatalogoUnidadesAdmtvas', 'HorasAsignadasUnidad', 'Evaluacion', 'ControlProcesos'];

    function ResumenEvaluacionesController($scope, $stateParams, $modal, tablaDatosService, CatalogoUnidadesAdmtvas, HorasAsignadasUnidad, Evaluacion, ControlProcesos ) {

            var vm = this;

            vm.muestra_cursos_unidad      = muestra_cursos_unidad;

            vm.muestraResultadosBusqueda  = muestraResultadosBusqueda;
            vm.limpiaBusqueda             = limpiaBusqueda;

            vm.muestraDatosRegistroActual = muestraDatosRegistroActual;
            vm.cambiarPagina              = cambiarPagina;
            vm.cancelaEvaluacion          = cancelaEvaluacion;
            vm.cierraEvaluacion           = cierraEvaluacion;
            vm.asientaCalificacion        = asientaCalificacion;
            vm.ventanaListaFormatos       = ventanaListaFormatos;


            vm.mostrarbtnLimpiar = false;
            vm.cadena_buscar = '';

            vm.listaUnidades = [];
            vm.unidadSeleccionada = undefined;

            vm.listaEvaluaciones = [];
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

                  vm.tipo_vista = $stateParams.tipo;

                  if(vm.tipo_vista == 'historicos') {
                      vm.titulo_seccion = 'Evaluaciones concluidas o canceladas';

                      vm.condicion_estatus = {
                              or: [
                                {estatus: 4},
                                {estatus: 5}
                              ]
                      };
                  }
                  else
                  {
                      vm.titulo_seccion = 'Evaluaciones vigentes';

                      vm.condicion_estatus = {
                              or: [
                                {estatus: 2}
                              ]
                      };
                  }


                  if($scope.currentUser.unidad_pertenece_id > 1)
                  {
                        vm.unidadSeleccionada = {
                            idUnidadAdmtva  : $scope.currentUser.unidad_pertenece_id,
                            nombre          : $scope.currentUser.nombre_unidad
                        };

                        vm.tablaListaEvaluaciones.condicion = {
                            and: [
                              vm.condicion_estatus,
                              {idUnidadAdmtva: $scope.currentUser.unidad_pertenece_id}
                            ]
                        };
                  }
                  else
                  {
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

                        vm.tablaListaEvaluaciones.condicion = vm.condicion_estatus;
                  }
                  


                  vm.tablaListaEvaluaciones.filtro_datos = {
                          filter: {
                              where: vm.tablaListaEvaluaciones.condicion,
                              order: ['fechaEvaluacion DESC','nombreCurso ASC'],
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
                                      relation: 'inscripcionesEvaluaciones',
                                      scope: {
                                        fields: ['id', 'idAlumno', 'pagado', 'fechaPago','numFactura','calificacion','numDocAcreditacion'],
                                        include:{
                                            relation: 'Capacitandos',
                                            scope: {
                                                fields:['numControl','apellidoPaterno','apellidoMaterno','nombre','curp'],
                                                order: ['apellidoPaterno ASC','apellidoMaterno ASC','nombre ASC']
                                            }
                                        }
                                      }
                                  }
                              ]
                          }
                  };

                  vm.client = 1;
                  vm.tablaListaEvaluaciones.paginaActual = 1;
                  vm.tablaListaEvaluaciones.inicio = 0;
                  vm.tablaListaEvaluaciones.fin = 1;

                  vm.listaEvaluaciones = {};
                  tablaDatosService.obtiene_datos_tabla(Evaluacion, vm.tablaListaEvaluaciones)
                  .then(function(respuesta) {

                        vm.tablaListaEvaluaciones.totalElementos = respuesta.total_registros;
                        vm.tablaListaEvaluaciones.inicio = respuesta.inicio;
                        vm.tablaListaEvaluaciones.fin = respuesta.fin;

                        if(vm.tablaListaEvaluaciones.totalElementos > 0)
                        {
                            vm.listaEvaluaciones = respuesta.datos;
                            formateaListado();
                            vm.EvaluacionSeleccionada = vm.listaEvaluaciones[0];
                            vm.client = 2;
                            vm.tablaListaEvaluaciones.fila_seleccionada = 0;
                            muestraDatosRegistroActual(vm.EvaluacionSeleccionada);
                        }
                  });

            }


            function muestra_cursos_unidad() {

                  vm.client = 1;
                  vm.listaEvaluaciones = {};
                  vm.EvaluacionSeleccionada = {};
                  vm.tablaListaEvaluaciones.fila_seleccionada = undefined;
                  vm.tablaListaEvaluaciones.paginaActual = 1;
                  vm.tablaListaEvaluaciones.inicio = 0;
                  vm.tablaListaEvaluaciones.fin = 1;

                  vm.cadena_buscar = '';
                  vm.mostrarbtnLimpiar = false;

                  if(vm.unidadSeleccionada.idUnidadAdmtva == -1)
                  {
                        vm.tablaListaEvaluaciones.condicion = vm.condicion_estatus;
                  }
                  else
                  {
                        vm.tablaListaEvaluaciones.condicion = {
                            and: [
                              {idUnidadAdmtva: vm.unidadSeleccionada.idUnidadAdmtva},
                              vm.condicion_estatus,
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
                            vm.listaEvaluaciones = respuesta.datos;
                            formateaListado();
                            vm.EvaluacionSeleccionada = vm.listaEvaluaciones[0];
                            vm.client = 2;
                            vm.tablaListaEvaluaciones.fila_seleccionada = 0;
                            muestraDatosRegistroActual(vm.EvaluacionSeleccionada);
                        }
                  });
            };




            function muestraResultadosBusqueda() {

                  vm.client = 1;
                  vm.listaEvaluaciones = {};
                  vm.EvaluacionSeleccionada = {};
                  vm.tablaListaEvaluaciones.fila_seleccionada = undefined;
                  vm.tablaListaEvaluaciones.paginaActual = 1;
                  vm.tablaListaEvaluaciones.inicio = 0;
                  vm.tablaListaEvaluaciones.fin = 1;


                  var condicion_busqueda = {
                                    nombreCurso: {regexp: '/.*'+ vm.cadena_buscar +'.*/i'}
                                };

                  if(vm.unidadSeleccionada.idUnidadAdmtva == -1)
                  {
                        vm.tablaListaEvaluaciones.condicion = {
                            and: [
                              vm.condicion_estatus,
                              condicion_busqueda,
                            ]
                        };
                  }
                  else
                  {
                        vm.tablaListaEvaluaciones.condicion = {
                            and: [
                              {idUnidadAdmtva: vm.unidadSeleccionada.idUnidadAdmtva},
                              vm.condicion_estatus,
                              condicion_busqueda
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
                            vm.listaEvaluaciones = respuesta.datos;
                            formateaListado();
                            vm.EvaluacionSeleccionada = vm.listaEvaluaciones[0];
                            vm.client = 2;
                            vm.tablaListaEvaluaciones.fila_seleccionada = 0;
                            muestraDatosRegistroActual(vm.EvaluacionSeleccionada);
                        }
                        vm.mostrarbtnLimpiar = true;
                  });

            };


            function limpiaBusqueda() {

                  vm.mostrarbtnLimpiar = false;
                  vm.cadena_buscar = '';
                  vm.client = 1;
                  vm.listaEvaluaciones = {};
                  vm.EvaluacionSeleccionada = {};
                  vm.tablaListaEvaluaciones.fila_seleccionada = undefined;
                  vm.tablaListaEvaluaciones.paginaActual = 1;
                  vm.tablaListaEvaluaciones.inicio = 0;
                  vm.tablaListaEvaluaciones.fin = 1;


                  if(vm.unidadSeleccionada.idUnidadAdmtva == -1)
                  {
                        vm.tablaListaEvaluaciones.condicion = vm.condicion_estatus;
                  }
                  else
                  {
                        vm.tablaListaEvaluaciones.condicion = {
                            and: [
                              {idUnidadAdmtva: vm.unidadSeleccionada.idUnidadAdmtva},
                              vm.condicion_estatus,
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
                            vm.listaEvaluaciones = respuesta.datos;
                            formateaListado();
                            vm.EvaluacionSeleccionada = vm.listaEvaluaciones[0];
                            vm.client = 2;
                            vm.tablaListaEvaluaciones.fila_seleccionada = 0;
                            muestraDatosRegistroActual(vm.EvaluacionSeleccionada);
                        }
                  });

            };



            function muestraDatosRegistroActual(seleccion) {

                  var index = vm.listaEvaluaciones.indexOf(seleccion);
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

                            vm.listaEvaluaciones = respuesta.datos;
                            formateaListado();
                            vm.EvaluacionSeleccionada = vm.listaEvaluaciones[0];
                            vm.client = 2;
                            vm.tablaListaEvaluaciones.fila_seleccionada = 0;
                            muestraDatosRegistroActual(vm.EvaluacionSeleccionada);
                        });
                  }
            }



            function cierraEvaluacion(seleccion) {

                  swal({
                    title: "Confirmar",
                    html: 'La Evaluaci&oacute;n <strong>'+ seleccion.nombreCurso +'</strong> cambiar&aacute; su estatus a concluida, una vez realizado esto la evaluaci&oacute;n pasar&aacute; a la secci&oacute;n de hist&oacute;ricos, ¿Continuar?',
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
                            },{
                                estatus: 4
                            })
                            .$promise
                            .then(function(respuesta) {

                                  vm.EvaluacionSeleccionada.estatus = respuesta.estatus;

                                  ControlProcesos
                                  .create({
                                      proceso         : 'Evaluaciones vigentes',
                                      accion          : 'CIERRE DE EVALUACION',
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

                                              swal({
                                                title: 'Cambio de estatus',
                                                html: 'se realiz&oacute; el cambio de estatus de la evaluaci&oacute;n a concluida y se gener&oacute; el identificador de proceso <br><strong style="font-size: 13px;">' + resp_control.identificador + '</strong>',
                                                type: 'success',
                                                showCancelButton: false,
                                                confirmButtonColor: "#9a0000",
                                                confirmButtonText: "Aceptar"
                                              });

                                              vm.limpiaBusqueda();
                                        });
                                  });

                            });

                  });

            }



            function asientaCalificacion(seleccion) {

                    var modalInstance = $modal.open({
                        templateUrl: 'app/components/cursos_oficiales/evaluaciones/modal-asienta-calif_evaluacion.html',
                        windowClass: "animated fadeIn",
                        controller: 'ModalAsientaCalifEvaluacionController as vm',
                        size: 'lg',
                        resolve: {
                          registroEditar: function () { return seleccion }
                        }
                    });

                    modalInstance.result.then(function (respuesta) {

                        angular.forEach(respuesta.inscripcionesEvaluaciones, function(registro) {

                              var index = vm.EvaluacionSeleccionada.inscripcionesEvaluaciones.map(function(record) {
                                                                                    return record.id;
                                                                                  }).indexOf(registro.id);
                              vm.EvaluacionSeleccionada.inscripcionesEvaluaciones[index].calificacion = registro.calificacion.value;
                              vm.EvaluacionSeleccionada.inscripcionesEvaluaciones[index].numDocAcreditacion = registro.numDocAcreditacion;
                        });

                    }, function () {
                    });

            }





            function cancelaEvaluacion(seleccion) {

                  swal({
                    title: "Confirmar",
                    html: 'La Evaluaci&oacute;n <strong>'+ seleccion.nombreCurso +'</strong> se marcar&aacute; como cancelada y se les avisar&aacute; a las persona inscrita de la cancelaci&oacute;n, una vez realizado este cambio la evaluaci&oacute;n pasar&aacute; a la secci&oacute;n de hist&oacute;ricos, ¿Continuar?',
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
                            },{
                                estatus: 5
                            })
                            .$promise
                            .then(function(respuesta) {

                                  vm.EvaluacionSeleccionada.estatus = respuesta.estatus;

                                  ControlProcesos
                                  .create({
                                      proceso         : 'Evaluaciones vigentes',
                                      accion          : 'CANCELACION DE EVALUACION',
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

                                              swal({
                                                title: 'Cambio de estatus registrado',
                                                html: 'se realiz&oacute; el cambio de estatus de la evaluaci&oacute;n a cancelada y se gener&oacute; el identificador de proceso <br><strong style="font-size: 13px;">' + resp_control.identificador + '</strong>',
                                                type: 'success',
                                                showCancelButton: false,
                                                confirmButtonColor: "#9a0000",
                                                confirmButtonText: "Aceptar"
                                              });

                                              vm.limpiaBusqueda();
                                        });
                                  });

                            });

                  });

            }


            function ventanaListaFormatos(seleccion) {

                    var modalInstance = $modal.open({
                        templateUrl: 'app/components/cursos_oficiales/resumen-cursos/modal-lista-formatos.html',
                        windowClass: "animated fadeIn",
                        controller: 'ModalListaFormatosController as vm',
                        windowClass: 'app-modal-window',
                        resolve: {
                          registroEditar: function () { return seleccion }
                        }
                    });

            }



            function formateaListado() {
                  
                  var hoy = new Date();
                  hoy.setHours(0);
                  hoy.setMinutes(0);
                  hoy.setSeconds(0);
                  hoy.setMilliseconds(0);

                  for(var i=0; i < vm.listaEvaluaciones.length; i++)
                  {
                      if(vm.listaEvaluaciones[i].estatus == 4 || vm.listaEvaluaciones[i].estatus == 5)
                      {
                            vm.listaEvaluaciones[i].diasDif = 0;
                      }
                      else
                      {
                            var fecha_evaluacion = new Date(vm.listaEvaluaciones[i].fechaEvaluacion);

                            fecha_evaluacion.setHours(0);
                            fecha_evaluacion.setMinutes(0);
                            fecha_evaluacion.setSeconds(0);
                            fecha_evaluacion.setMilliseconds(0);

                            var dif = hoy - fecha_evaluacion;
                            var num_dias_diferencia = Math.floor(dif / (1000 * 60 * 60 * 24)); 

                            vm.listaEvaluaciones[i].diasDif = num_dias_diferencia;
                      }
                  }
            }


    };

})();