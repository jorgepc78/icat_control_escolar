(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('PreAperturaCursoExtraController', PreAperturaCursoExtraController);

    PreAperturaCursoExtraController.$inject = ['$scope', '$modal', 'tablaDatosService', 'HorasAsignadasUnidad', 'ProgTrimCursos', 'CursosOficiales', 'ControlProcesos'];

    function PreAperturaCursoExtraController($scope, $modal, tablaDatosService, HorasAsignadasUnidad, ProgTrimCursos, CursosOficiales, ControlProcesos ) {

            var vm = this;

            vm.muestraCursosExtrasPTCseleccionado = muestraCursosExtrasPTCseleccionado;
            vm.muestraDatosRegistroActual   = muestraDatosRegistroActual;
            vm.cambiarPagina                = cambiarPagina;

            vm.abreExtraCurso = abreExtraCurso;
            vm.editaCurso = editaCurso;
            vm.enviaCursoRevision = enviaCursoRevision;
            vm.eliminaCurso = eliminaCurso;


            vm.anioSeleccionado = [];
            vm.horas_disponibles = 0;
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

                  HorasAsignadasUnidad.find({
                      filter: {
                          where: {
                            and: [
                              {idUnidadAdmtva: $scope.currentUser.unidad_pertenece_id},
                              {anio: vm.PTCSeleccionado.anio}
                            ]
                          },
                          fields: ['id','anio','horasAsignadas'],
                          order: 'anio DESC'
                      }
                  })
                  .$promise
                  .then(function(resp) {
                        vm.anioSeleccionado = resp[0];
                  });

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
                        
                        calcula_horas_disponibles();
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
                          registroEditar: function () { return {horas_disponibles: vm.horas_disponibles, record: PTCSeleccionado} }
                        }
                    });

                    modalInstance.result.then(function (respuesta) {

                        swal({
                          title: 'Curso creado',
                          html: 'EL curso <strong>'+ respuesta.nombreCurso+'</strong> se registr&oacute; como un curso pendiente de enviar a validaci&oacute;n de apertura',
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

                    var temp_horas_disponibles = vm.horas_disponibles + seleccion.numeroHoras;

                    var modalInstance = $modal.open({
                        templateUrl: 'app/components/preapertura-cursos/cursos-fuera-ptc/modal-apertura-curso-extra.html',
                        windowClass: "animated fadeIn",
                        controller: 'ModalEditaaCursoExtraController as vm',
                        windowClass: 'app-modal-window',
                        resolve: {
                          registroEditar: function () { return {horas_disponibles: temp_horas_disponibles, record: seleccion} }
                        }

                    });

                    modalInstance.result.then(function (respuesta) {

                        vm.CursoExtraSeleccionado.horario               = respuesta.horario;
                        vm.CursoExtraSeleccionado.aulaAsignada          = respuesta.aulaAsignada;
                        vm.CursoExtraSeleccionado.cupoMaximo            = respuesta.capacitandos;
                        vm.CursoExtraSeleccionado.minRequeridoInscritos = respuesta.min_requerido_inscritos;
                        vm.CursoExtraSeleccionado.minRequeridoPago      = respuesta.min_requerido_pago;
                        vm.CursoExtraSeleccionado.fechaInicio           = respuesta.fechaInicio;
                        vm.CursoExtraSeleccionado.fechaFin              = respuesta.fechaFin;
                        vm.CursoExtraSeleccionado.idInstructor          = respuesta.idInstructor;
                        vm.CursoExtraSeleccionado.nombreInstructor      = respuesta.nombreInstructor;
                        vm.CursoExtraSeleccionado.observaciones         = respuesta.observaciones;
                        
                        vm.CursoExtraSeleccionado.idLocalidad           = respuesta.idLocalidad;
                        vm.CursoExtraSeleccionado.horasSemana           = respuesta.semanas;
                        vm.CursoExtraSeleccionado.numeroHoras           = respuesta.total;
                        vm.CursoExtraSeleccionado.costo                 = respuesta.costo;
                        vm.CursoExtraSeleccionado.estatus                 = respuesta.estatus;
                        vm.CursoExtraSeleccionado.publico               = respuesta.publico;

                        vm.CursoExtraSeleccionado.localidad_pertenece.idLocalidad = respuesta.idLocalidad;
                        vm.CursoExtraSeleccionado.localidad_pertenece.nombre = respuesta.nombreLocalidad;

                        calcula_horas_disponibles();
                    }, function () {
                    });

            }


            function enviaCursoRevision(seleccion) {

                  swal({
                    title: "Confirmar",
                    html: 'La propuesta del curso <strong>'+ seleccion.nombreCurso +'</strong> ser&aacute; enviada a validaci&oacute;n, ¿Continuar?',
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
                                estatus: 1
                            })
                            .$promise
                            .then(function(respuesta) {

                                  vm.CursoExtraSeleccionado.estatus = respuesta.estatus;

                                  ControlProcesos
                                  .create({
                                      proceso         : 'Pre-Apertura Curso Extra',
                                      accion          : 'ENVIO VALIDACION CURSO',
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


            function eliminaCurso(seleccion) {
                  
                  swal({
                    title: "Confirmar",
                    html: 'Se eliminar&aacute; el curso <strong>'+ seleccion.nombreCurso +'</strong>, ¿Continuar?',
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#9a0000",
                    confirmButtonText: "Aceptar",
                    cancelButtonText: "Cancelar",
                    closeOnConfirm: false,
                    closeOnCancel: true
                  }, function(){
                          swal.disableButtons();

                          CursosOficiales.deleteById({ id: seleccion.idCurso })
                          .$promise
                          .then(function() {
                                vm.muestraCursosExtrasPTCseleccionado();
                                swal('Curso eliminado', '', 'success');

                          });

                  });

            }

            function calcula_horas_disponibles() {

                  ProgTrimCursos.find({
                      filter: {
                          where: {
                            and: [
                                {idUnidadAdmtva: $scope.currentUser.unidad_pertenece_id},
                                {anio: vm.anioSeleccionado.anio},
                                {or: [
                                  {estatus: 2},
                                  {estatus: 4}
                                ]}
                            ]
                          },
                          fields: ['idPtc','horasSeparadas','estatus']
                      }
                  })
                  .$promise
                  .then(function(resp) {

                      var num_horas_separadas = 0;
                      angular.forEach(resp, function(registro) {
                          num_horas_separadas += registro.horasSeparadas;
                      });
                      
                      angular.forEach(vm.registrosCursosExtras, function(registro) {
                          num_horas_separadas += registro.numeroHoras;
                      });

                      vm.horas_disponibles = vm.anioSeleccionado.horasAsignadas - num_horas_separadas;

                  });

            }



    };

})();