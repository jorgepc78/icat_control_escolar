(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('PreAperturaCursoExtraController', PreAperturaCursoExtraController);

    PreAperturaCursoExtraController.$inject = ['$scope', '$modal', 'tablaDatosService', 'ProgTrimCursos', 'CursosOficiales', 'ControlProcesos'];

    function PreAperturaCursoExtraController($scope, $modal, tablaDatosService, ProgTrimCursos, CursosOficiales, ControlProcesos ) {

            var vm = this;

            vm.listaPTCautorizados = [];
            vm.PTCSeleccionado = {};

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

            vm.registrosCursosExtras = {};
            vm.CursoExtraSeleccionado = {};

            vm.muestraCursosExtrasPTCseleccionado = muestraCursosExtrasPTCseleccionado;
            vm.muestraDatosRegistroActual   = muestraDatosRegistroActual;
            vm.cambiarPagina                = cambiarPagina;

            vm.abreExtraCurso = abreExtraCurso;
            vm.editaCurso = editaCurso;
            vm.enviaCursoRevision = enviaCursoRevision;

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
                              order: ['nombreCurso ASC'],
                              limit: vm.tablaListaCursos.registrosPorPagina,
                              skip: vm.tablaListaCursos.paginaActual - 1,
                              include: [
                                  {
                                      relation: 'localidad_pertenece',
                                      scope: {
                                        fields: ['nombre']
                                      }
                                  }
                              ]
                          }
                  };

            }


            
            function muestraCursosExtrasPTCseleccionado() {

                  vm.client = 1;
                  vm.tablaListaCursos.paginaActual = 1;
                  vm.tablaListaCursos.inicio = 0;
                  vm.tablaListaCursos.fin = 1;
                  vm.tablaListaCursos.condicion = {
                    and:[
                      {idPtc: vm.PTCSeleccionado.idPtc},
                      {programadoPTC: false}
                    ]
                  };

                  vm.registrosCursosExtras = {};
                  tablaDatosService.obtiene_datos_tabla(CursosOficiales, vm.tablaListaCursos)
                  .then(function(respuesta) {

                        vm.tablaListaCursos.totalElementos = respuesta.total_registros;
                        vm.tablaListaCursos.inicio = respuesta.inicio;
                        vm.tablaListaCursos.fin = respuesta.fin;

                        if(vm.tablaListaCursos.totalElementos > 0)
                        {
                            vm.registrosCursosExtras = respuesta.datos;
                            vm.CursoExtraSeleccionado = vm.registrosCursosExtras[0];
                            vm.client = 2;
                            vm.tablaListaCursos.fila_seleccionada = 0;
                            muestraDatosRegistroActual(vm.CursoExtraSeleccionado);
                        }
                  });

            }


            function muestraDatosRegistroActual(seleccion) {

                  var index = vm.registrosCursosExtras.indexOf(seleccion);
                  vm.CursoExtraSeleccionado = seleccion;
                  vm.client = 2;
                  vm.tablaListaCursos.fila_seleccionada = index;
            };



            function cambiarPagina() {

                  if(vm.tablaListaCursos.totalElementos > 0)
                  {
                        tablaDatosService.cambia_pagina(CursosOficiales, vm.tablaListaCursos)
                        .then(function(respuesta) {

                            vm.tablaListaCursos.inicio = respuesta.inicio;
                            vm.tablaListaCursos.fin = respuesta.fin;

                            vm.registrosCursosExtras = respuesta.datos;
                            vm.CursoExtraSeleccionado = vm.registrosCursosExtras[0];
                            vm.client = 2;
                            vm.tablaListaCursos.fila_seleccionada = 0;
                            muestraDatosRegistroActual(vm.CursoExtraSeleccionado);
                        });
                  }
            }


            function abreExtraCurso(PTCSeleccionado) {

                    var modalInstance = $modal.open({
                        templateUrl: 'app/components/preapertura-cursos/cursos-fuera-ptc/modal-apertura-curso-extra.html',
                        windowClass: "animated fadeIn",
                        controller: 'ModalAperturaCursoExtraController as vm',
                        windowClass: 'app-modal-window',
                        resolve: {
                          registroEditar: function () { return PTCSeleccionado }
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
                        vm.muestraCursosExtrasPTCseleccionado();

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

                        vm.CursoExtraSeleccionado.curso_oficial_registrado[0].horario = respuesta.horario;
                        vm.CursoExtraSeleccionado.curso_oficial_registrado[0].aulaAsignada = respuesta.aulaAsignada;
                        vm.CursoExtraSeleccionado.curso_oficial_registrado[0].cupoMaximo = respuesta.capacitandos;
                        vm.CursoExtraSeleccionado.curso_oficial_registrado[0].minRequeridoInscritos = respuesta.min_requerido_inscritos;
                        vm.CursoExtraSeleccionado.curso_oficial_registrado[0].minRequeridoPago = respuesta.min_requerido_pago;
                        vm.CursoExtraSeleccionado.curso_oficial_registrado[0].fechaInicio = respuesta.fechaInicio;
                        vm.CursoExtraSeleccionado.curso_oficial_registrado[0].fechaFin = respuesta.fechaFin;
                        vm.CursoExtraSeleccionado.curso_oficial_registrado[0].idInstructor = respuesta.idInstructor;
                        vm.CursoExtraSeleccionado.curso_oficial_registrado[0].nombreInstructor = respuesta.nombreInstructor;
                        vm.CursoExtraSeleccionado.curso_oficial_registrado[0].observaciones = respuesta.observaciones;
                        vm.CursoExtraSeleccionado.curso_oficial_registrado[0].idLocalidad = respuesta.idLocalidad;
                        vm.CursoExtraSeleccionado.curso_oficial_registrado[0].horasSemana = respuesta.semanas;
                        vm.CursoExtraSeleccionado.curso_oficial_registrado[0].numeroHoras = respuesta.total;
                        vm.CursoExtraSeleccionado.curso_oficial_registrado[0].costo = respuesta.costo;
                        vm.CursoExtraSeleccionado.curso_oficial_registrado[0].publico = respuesta.publico;

                        vm.CursoExtraSeleccionado.curso_oficial_registrado[0].localidad_pertenece.idLocalidad = respuesta.idLocalidad;
                        vm.CursoExtraSeleccionado.curso_oficial_registrado[0].localidad_pertenece.nombre = respuesta.nombreLocalidad;
                    }, function () {
                    });

            }


            function enviaCursoRevision(RegistroSeleccionado) {

                  swal({
                    title: "Confirmar",
                    html: 'La propuesta del curso <strong>'+ RegistroSeleccionado.nombreCurso +'</strong> ser&aacute; enviada a validaci&oacute;n, ¿Continuar?',
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
                                id: RegistroSeleccionado.idCurso
                            },{
                                estatus: 1
                            })
                            .$promise
                            .then(function(respuesta) {

                                  vm.CursoExtraSeleccionado.estatus = respuesta.estatus;

                                  ControlProcesos
                                  .create({
                                      proceso         : 'Pre-Apertura Curso Extra',
                                      accion          : 'ENVIO VALIDACION',
                                      idDocumento     : RegistroSeleccionado.idCurso,
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

            }


    };

})();