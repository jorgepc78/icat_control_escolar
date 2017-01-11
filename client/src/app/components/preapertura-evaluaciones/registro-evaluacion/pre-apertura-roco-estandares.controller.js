(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('PreAperturaRocoEstandaresController', PreAperturaRocoEstandaresController);

    PreAperturaRocoEstandaresController.$inject = ['$scope', '$modal', 'tablaDatosService', 'ProgTrimCursos', 'Evaluacion', 'ControlProcesos'];

    function PreAperturaRocoEstandaresController($scope, $modal, tablaDatosService, ProgTrimCursos, Evaluacion, ControlProcesos ) {

            var vm = this;

            vm.muestraEvaluacionesPTCseleccionado = muestraEvaluacionesPTCseleccionado;
            vm.muestraDatosRegistroActual         = muestraDatosRegistroActual;
            vm.cambiarPagina                      = cambiarPagina;
            vm.abreEvaluacion                     = abreEvaluacion;
            vm.editaEvaluacion                    = editaEvaluacion;
            vm.enviaEvaluacionRevision            = enviaEvaluacionRevision;
            vm.eliminaEvaluacion                  = eliminaEvaluacion;


            vm.anioSeleccionado    = [];
            vm.listaPTCautorizados = [];
            vm.PTCSeleccionado     = {};

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

            vm.registrosEvaluaciones = {};
            vm.EvaluacionSeleccionada = {};

            inicia();

            function inicia() {

                  ProgTrimCursos.find({
                      filter: {
                          where: {
                              and: [
                                {estatus:2},
                                {idUnidadAdmtva: $scope.currentUser.unidad_pertenece_id}
                              ]                            
                          },
                          fields: ['idPtc','anio','trimestre'],
                          order: ['anio DESC','trimestre DESC']
                      }
                  })
                  .$promise
                  .then(function(resp) {
                      angular.forEach(resp, function(registro) {
                            
                            var trimestres = ['PRIMER TRIMESTRE (Enero - Marzo)','SEGUNDO TRIMESTRE (Abril - Junio)','TERCER TRIMESTRE (Julio - Septiembre)','CUARTO TRIMESTRE (Octubre - Dciembre)'];
                            vm.listaPTCautorizados.push({
                                idPtc        : registro.idPtc,
                                anio         : registro.anio,
                                trimestretxt : trimestres[(registro.trimestre-1)]
                            });
                      });

                  });


                  vm.tablaListaEvaluaciones.filtro_datos = {
                          filter: {
                              where: vm.tablaListaEvaluaciones.condicion,
                              order: ['nombreCurso ASC'],
                              limit: vm.tablaListaEvaluaciones.registrosPorPagina,
                              skip: vm.tablaListaEvaluaciones.paginaActual - 1,
                              include: [
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


            
            function muestraEvaluacionesPTCseleccionado() {

                  vm.client = 1;
                  vm.tablaListaEvaluaciones.paginaActual = 1;
                  vm.tablaListaEvaluaciones.inicio = 0;
                  vm.tablaListaEvaluaciones.fin = 1;
                  vm.tablaListaEvaluaciones.condicion = {idPtc: vm.PTCSeleccionado.idPtc};

                  vm.registrosEvaluaciones = {};
                  tablaDatosService.obtiene_datos_tabla(Evaluacion, vm.tablaListaEvaluaciones)
                  .then(function(respuesta) {

                        vm.tablaListaEvaluaciones.totalElementos = respuesta.total_registros;
                        vm.tablaListaEvaluaciones.inicio = respuesta.inicio;
                        vm.tablaListaEvaluaciones.fin = respuesta.fin;

                        if(vm.tablaListaEvaluaciones.totalElementos > 0)
                        {
                            vm.registrosEvaluaciones = respuesta.datos;
                            vm.EvaluacionSeleccionada = vm.registrosEvaluaciones[0];
                            vm.client = 2;
                            vm.tablaListaEvaluaciones.fila_seleccionada = 0;
                            muestraDatosRegistroActual(vm.EvaluacionSeleccionada);
                        }
                        
                  });

            }


            function muestraDatosRegistroActual(seleccion) {

                  var index = vm.registrosEvaluaciones.indexOf(seleccion);
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

                            vm.registrosEvaluaciones = respuesta.datos;
                            vm.EvaluacionSeleccionada = vm.registrosEvaluaciones[0];
                            vm.client = 2;
                            vm.tablaListaEvaluaciones.fila_seleccionada = 0;
                            muestraDatosRegistroActual(vm.EvaluacionSeleccionada);
                        });
                  }
            }


            function abreEvaluacion(PTCSeleccionado) {

                    var modalInstance = $modal.open({
                        templateUrl: 'app/components/preapertura-evaluaciones/registro-evaluacion/modal-apertura-evaluacion.html',
                        windowClass: "animated fadeIn",
                        controller: 'ModalAperturaEvaluacionController as vm',
                        windowClass: 'app-modal-window',
                        resolve: {
                          registroEditar: function () { return {record: PTCSeleccionado} }
                        }
                    });

                    modalInstance.result.then(function (respuesta) {

                        swal({
                          title: 'Evaluación creada',
                          html: 'EL curso <strong>'+ respuesta.nombreCurso+'</strong> se registr&oacute; la evaluaci&oacute;n como pendiente de enviar a validaci&oacute;n de aceptaci&oacute;n',
                          type: 'success',
                          showCancelButton: false,
                          confirmButtonColor: "#9a0000",
                          confirmButtonText: "Aceptar"
                        });
                        vm.muestraEvaluacionesPTCseleccionado();

                    }, function () {
                    });

            }


            function editaEvaluacion(seleccion) {

                    if(seleccion.inscripcionesEvaluaciones[0].pagado === true) 
                    {
                          swal({
                            title: 'Error',
                            html: 'La evaluaci&oacute;n <strong>'+ seleccion.nombreCurso+'</strong> no puede ser editada ya que el capacitando ha realizado el pago correspondiente.',
                            type: 'error',
                            showCancelButton: false,
                            confirmButtonColor: "#9a0000",
                            confirmButtonText: "Aceptar"
                          });
                    }
                    else
                    {
                          var modalInstance = $modal.open({
                              templateUrl: 'app/components/preapertura-evaluaciones/registro-evaluacion/modal-apertura-evaluacion.html',
                              windowClass: "animated fadeIn",
                              controller: 'ModalEditaEvaluacionController as vm',
                              windowClass: 'app-modal-window',
                              resolve: {
                                registroEditar: function () { return {record: seleccion} }
                              }

                          });

                          modalInstance.result.then(function (respuesta) {

                              vm.EvaluacionSeleccionada.horaEvaluacion                    = respuesta.horaEvaluacion;
                              vm.EvaluacionSeleccionada.aulaAsignada                      = respuesta.aulaAsignada;
                              vm.EvaluacionSeleccionada.fechaEvaluacion                   = respuesta.fechaEvaluacion;
                              vm.EvaluacionSeleccionada.idInstructor                      = respuesta.idInstructor;
                              vm.EvaluacionSeleccionada.curpInstructor                    = respuesta.curpInstructor;
                              vm.EvaluacionSeleccionada.nombreInstructor                  = respuesta.nombreInstructor;
                              vm.EvaluacionSeleccionada.observaciones                     = respuesta.observaciones;
                              
                              vm.EvaluacionSeleccionada.costo                             = respuesta.costo;
                              vm.EvaluacionSeleccionada.estatus                           = respuesta.estatus;
                              
                              vm.EvaluacionSeleccionada.alumnos_inscritos[0].idAlumno        = respuesta.idAlumno;
                              vm.EvaluacionSeleccionada.alumnos_inscritos[0].nombreCompleto  = respuesta.nombreCompleto;

                          }, function () {
                          });
                    }
            }


            function enviaEvaluacionRevision(seleccion) {

                  swal({
                    title: "Confirmar",
                    html: 'La propuesta de evaluaci&oacute;n <strong>'+ seleccion.nombreCurso +'</strong> ser&aacute; enviada a validaci&oacute;n, ¿Continuar?',
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
                                estatus: 1
                            })
                            .$promise
                            .then(function(respuesta) {

                                  vm.EvaluacionSeleccionada.estatus = respuesta.estatus;

                                  ControlProcesos
                                  .create({
                                      proceso         : 'Pre-Apertura Evaluacion',
                                      accion          : 'ENVIO VALIDACION',
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
                                                title: 'Validación enviada',
                                                html: 'se env&iacute;o la evaluaci&oacute;n a validaci&oacute;n y se gener&oacute; el identificador de proceso <br><strong style="font-size: 13px;">' + resp_control.identificador + '</strong>',
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


            function eliminaEvaluacion(seleccion) {
                  
                    if(seleccion.inscripcionesEvaluaciones[0].pagado === true) 
                    {
                          swal({
                            title: 'Error',
                            html: 'La evaluaci&oacute;n <strong>'+ seleccion.nombreCurso+'</strong> no puede ser eliminada ya que el capacitando ha realizado el pago correspondiente.',
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
                            html: 'Se eliminar&aacute; la evaluaci&oacute;n <strong>'+ seleccion.nombreCurso +'</strong>, ¿Continuar?',
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#9a0000",
                            confirmButtonText: "Aceptar",
                            cancelButtonText: "Cancelar",
                            closeOnConfirm: false,
                            closeOnCancel: true
                          }, function(){
                                  swal.disableButtons();

                                Evaluacion.alumnos_inscritos.destroyById({
                                    id: seleccion.idEvaluacion 
                                })
                                .$promise
                                .then(function() {

                                    Evaluacion.deleteById({ id: seleccion.idEvaluacion })
                                    .$promise
                                    .then(function() {
                                          vm.muestraEvaluacionesPTCseleccionado();
                                          swal('Evaluación eliminada', '', 'success');
                                    });
                                });
                          });
                    }

            }



    };

})();