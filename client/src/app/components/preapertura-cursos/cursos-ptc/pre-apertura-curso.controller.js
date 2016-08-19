(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('PreAperturaCursoPTCController', PreAperturaCursoPTCController);

    PreAperturaCursoPTCController.$inject = ['$scope', '$modal', 'tablaDatosService', 'ProgTrimCursos', 'CursosPtc', 'CursosOficiales', 'ControlProcesos'];

    function PreAperturaCursoPTCController($scope, $modal, tablaDatosService, ProgTrimCursos, CursosPtc, CursosOficiales, ControlProcesos ) {

            var vm = this;

            vm.muestraCursosPTCseleccionado = muestraCursosPTCseleccionado;
            vm.muestraDatosRegistroActual   = muestraDatosRegistroActual;
            vm.cambiarPagina                = cambiarPagina;

            vm.editaCurso = editaCurso;
            vm.abreCurso = abreCurso;
            vm.enviaCursoRevision = enviaCursoRevision;
            vm.eliminaCurso = eliminaCurso;

            vm.listaPTCautorizados = [];
            vm.PTCSeleccionado = {};

            vm.tabs = [{active: true}, {active: false}];

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

            vm.registrosCursosPTCs = {};
            vm.CursoPTCSeleccionado = {};


            inicia();

            function inicia() {

                  ProgTrimCursos.find({
                      filter: {
                          where: {
                              and: [
                                {and:[{estatus:2}]},
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
                            
                            var trimestres = ['PRIMER TRIMESTRE','SEGUNDO TRIMESTRE','TERCER TRIMESTRE','CUARTO TRIMESTRE'];
                            vm.listaPTCautorizados.push({
                                idPtc        : registro.idPtc,
                                anio         : registro.anio,
                                trimestretxt : trimestres[(registro.trimestre-1)]
                            });
                      });

                  });


                  vm.tablaListaCursos.filtro_datos = {
                          filter: {
                              where: vm.tablaListaCursos.condicion,
                              order: ['fechaInicio ASC'],
                              limit: vm.tablaListaCursos.registrosPorPagina,
                              skip: vm.tablaListaCursos.paginaActual - 1,
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
                                  },
                                  {
                                      relation: 'curso_oficial_registrado',
                                      scope: {
                                        fields: ['idCurso','idLocalidad','nombreCurso','claveCurso','modalidad','horario','aulaAsignada','horasSemana','numeroHoras','costo','cupoMaximo','minRequeridoInscritos','minRequeridoPago','fechaInicio','fechaFin','idInstructor','nombreInstructor','observaciones','estatus','publico'],
                                        include: {
                                          relation: 'localidad_pertenece',
                                          scope: {
                                            fields: ['nombre']
                                          }
                                        }
                                      }
                                  }
                              ]
                          }
                  };

            }


            
            function muestraCursosPTCseleccionado() {

                  vm.client = 1;
                  vm.tablaListaCursos.paginaActual = 1;
                  vm.tablaListaCursos.inicio = 0;
                  vm.tablaListaCursos.fin = 1;
                  vm.tablaListaCursos.condicion = {idPtc: vm.PTCSeleccionado.idPtc};

                  vm.registrosCursosPTCs = {};
                  tablaDatosService.obtiene_datos_tabla(CursosPtc, vm.tablaListaCursos)
                  .then(function(respuesta) {

                        vm.tablaListaCursos.totalElementos = respuesta.total_registros;
                        vm.tablaListaCursos.inicio = respuesta.inicio;
                        vm.tablaListaCursos.fin = respuesta.fin;

                        if(vm.tablaListaCursos.totalElementos > 0)
                        {
                            vm.registrosCursosPTCs = respuesta.datos;
                            vm.CursoPTCSeleccionado = vm.registrosCursosPTCs[0];
                            vm.client = 2;
                            vm.tablaListaCursos.fila_seleccionada = 0;
                            muestraDatosRegistroActual(vm.CursoPTCSeleccionado);
                        }
                  });

            }


            function muestraDatosRegistroActual(seleccion) {

                  var index = vm.registrosCursosPTCs.indexOf(seleccion);
                  vm.CursoPTCSeleccionado = seleccion;
                  vm.client = 2;
                  vm.tablaListaCursos.fila_seleccionada = index;
                  
                  if(vm.CursoPTCSeleccionado.curso_oficial_registrado.length > 0)
                      vm.tabs = [{active: true}, {active: false}];
                  else
                      vm.tabs = [{active: false}, {active: true}]; 

            };



            function cambiarPagina() {

                  if(vm.tablaListaCursos.totalElementos > 0)
                  {
                        tablaDatosService.cambia_pagina(CursosPtc, vm.tablaListaCursos)
                        .then(function(respuesta) {

                            vm.tablaListaCursos.inicio = respuesta.inicio;
                            vm.tablaListaCursos.fin = respuesta.fin;

                            vm.registrosCursosPTCs = respuesta.datos;
                            vm.CursoPTCSeleccionado = vm.registrosCursosPTCs[0];
                            vm.client = 2;
                            vm.tablaListaCursos.fila_seleccionada = 0;
                            muestraDatosRegistroActual(vm.CursoPTCSeleccionado);
                        });
                  }
            }


            function abreCurso(seleccion) {

                    var modalInstance = $modal.open({
                        templateUrl: 'app/components/preapertura-cursos/cursos-ptc/modal-apertura-curso.html',
                        windowClass: "animated fadeIn",
                        controller: 'ModalAperturaCursoController as vm',
                        windowClass: 'app-modal-window',
                        resolve: {
                          registroEditar: function () { return seleccion }
                        }

                    });

                    modalInstance.result.then(function (respuesta) {

                        swal({
                          title: 'Curso creado',
                          html: 'EL curso <strong>'+ respuesta.nombreCurso+'</strong> se registr&oacute; como un curso pendiente de validaci&oacute;n de apertura',
                          type: 'success',
                          showCancelButton: false,
                          confirmButtonColor: "#9a0000",
                          confirmButtonText: "Aceptar"
                        });

                        vm.CursoPTCSeleccionado.estatus = respuesta.estatusCursoPTC;
                        vm.CursoPTCSeleccionado.curso_oficial_registrado = [{
                            idCurso               : respuesta.idCurso,
                            nombreCurso           : respuesta.nombreCurso,
                            modalidad             : respuesta.modalidad,
                            horario               : respuesta.horario,
                            aulaAsignada          : respuesta.aulaAsignada,
                            cupoMaximo            : respuesta.capacitandos,
                            minRequeridoInscritos : respuesta.min_requerido_inscritos,
                            minRequeridoPago      : respuesta.min_requerido_pago,
                            fechaInicio           : respuesta.fechaInicio,
                            fechaFin              : respuesta.fechaFin,
                            idInstructor          : respuesta.idInstructor,
                            nombreInstructor      : respuesta.nombreInstructor,
                            observaciones         : respuesta.observaciones,
                            idLocalidad           : respuesta.idLocalidad,
                            horasSemana           : respuesta.semanas,
                            numeroHoras           : respuesta.total,
                            costo                 : respuesta.costo,
                            publico               : respuesta.publico,
                            localidad_pertenece   : {
                                idLocalidad : respuesta.idLocalidad,
                                nombre      : respuesta.nombreLocalidad
                            }
                        }];

                        vm.tabs = [{active: true}, {active: false}];

                    }, function () {
                    });

            }


            function editaCurso(seleccion) {

                    var modalInstance = $modal.open({
                        templateUrl: 'app/components/preapertura-cursos/cursos-ptc/modal-apertura-curso.html',
                        windowClass: "animated fadeIn",
                        controller: 'ModalEditaAperturaCursoController as vm',
                        windowClass: 'app-modal-window',
                        resolve: {
                          registroEditar: function () { return seleccion }
                        }

                    });

                    modalInstance.result.then(function (respuesta) {

                        vm.CursoPTCSeleccionado.curso_oficial_registrado[0].horario = respuesta.horario;
                        vm.CursoPTCSeleccionado.curso_oficial_registrado[0].aulaAsignada = respuesta.aulaAsignada;
                        vm.CursoPTCSeleccionado.curso_oficial_registrado[0].cupoMaximo = respuesta.capacitandos;
                        vm.CursoPTCSeleccionado.curso_oficial_registrado[0].minRequeridoInscritos = respuesta.min_requerido_inscritos;
                        vm.CursoPTCSeleccionado.curso_oficial_registrado[0].minRequeridoPago = respuesta.min_requerido_pago;
                        vm.CursoPTCSeleccionado.curso_oficial_registrado[0].fechaInicio = respuesta.fechaInicio;
                        vm.CursoPTCSeleccionado.curso_oficial_registrado[0].fechaFin = respuesta.fechaFin;
                        vm.CursoPTCSeleccionado.curso_oficial_registrado[0].idInstructor = respuesta.idInstructor;
                        vm.CursoPTCSeleccionado.curso_oficial_registrado[0].nombreInstructor = respuesta.nombreInstructor;
                        vm.CursoPTCSeleccionado.curso_oficial_registrado[0].observaciones = respuesta.observaciones;
                        vm.CursoPTCSeleccionado.curso_oficial_registrado[0].idLocalidad = respuesta.idLocalidad;
                        vm.CursoPTCSeleccionado.curso_oficial_registrado[0].horasSemana = respuesta.semanas;
                        vm.CursoPTCSeleccionado.curso_oficial_registrado[0].numeroHoras = respuesta.total;
                        vm.CursoPTCSeleccionado.curso_oficial_registrado[0].costo = respuesta.costo;
                        vm.CursoPTCSeleccionado.curso_oficial_registrado[0].publico = respuesta.publico;

                        vm.CursoPTCSeleccionado.curso_oficial_registrado[0].localidad_pertenece.idLocalidad = respuesta.idLocalidad;
                        vm.CursoPTCSeleccionado.curso_oficial_registrado[0].localidad_pertenece.nombre = respuesta.nombreLocalidad;
                    }, function () {
                    });

            }


            function enviaCursoRevision(seleccion) {

                  swal({
                    title: "Confirmar",
                    html: 'La propuesta del curso <strong>'+ seleccion.curso_oficial_registrado[0].nombreCurso +'</strong> ser&aacute; enviada a validaci&oacute;n, ¿Continuar?',
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#9a0000",
                    confirmButtonText: "Aceptar",
                    cancelButtonText: "Cancelar",
                    closeOnConfirm: false,
                    closeOnCancel: true
                  }, function(){
                          swal.disableButtons();

                            CursosPtc.prototype$updateAttributes(
                            {
                                id: seleccion.idCursoPTC
                            },{
                                estatus: 3
                            })
                            .$promise
                            .then(function(respuesta) {

                                  vm.CursoPTCSeleccionado.estatus = respuesta.estatus;

                                  CursosOficiales.prototype$updateAttributes(
                                  {
                                      id: seleccion.curso_oficial_registrado[0].idCurso
                                  },{
                                      estatus: 1
                                  })
                                  .$promise
                                  .then(function(resp) {

                                        ControlProcesos
                                        .create({
                                            proceso         : 'Pre-Apertura Curso PTC',
                                            accion          : 'ENVIO VALIDACION',
                                            idDocumento     : seleccion.curso_oficial_registrado[0].idCurso,
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
                                                      title: 'PTC enviado',
                                                      html: 'se env&iacute;o el curso a validaci&oacute;n y se gener&oacute; el identificador de proceso <br><strong style="font-size: 13px;">' + resp_control.identificador + '</strong>',
                                                      type: 'success',
                                                      showCancelButton: false,
                                                      confirmButtonColor: "#9a0000",
                                                      confirmButtonText: "Aceptar"
                                                    });

                                              });
                                        });


                                  });

                            });

                  });

            }


            function eliminaCurso(seleccion) {
                  
                  swal({
                    title: "Confirmar",
                    html: 'Se eliminar&aacute; la propuesta de pre-apertura del curso <strong>'+ seleccion.curso_oficial_registrado[0].nombreCurso +'</strong>, ¿Continuar?',
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#9a0000",
                    confirmButtonText: "Aceptar",
                    cancelButtonText: "Cancelar",
                    closeOnConfirm: false,
                    closeOnCancel: true
                  }, function(){
                          swal.disableButtons();

                            CursosPtc.prototype$updateAttributes(
                            {
                                id: seleccion.idCursoPTC
                            },{
                                estatus: 0
                            })
                            .$promise
                            .then(function(respuesta) {

                                  vm.CursoPTCSeleccionado.estatus = respuesta.estatus;

                                  CursosOficiales.deleteById({ id: seleccion.curso_oficial_registrado[0].idCurso })
                                  .$promise
                                  .then(function() {
                                        vm.muestraCursosPTCseleccionado();
                                        swal('Curso de pre-apertura eliminado', '', 'success');

                                  });

                            });

                  });

            }


    };

})();