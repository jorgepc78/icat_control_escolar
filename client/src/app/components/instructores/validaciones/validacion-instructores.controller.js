(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ValidacionInstructoresController', ValidacionInstructoresController);

    ValidacionInstructoresController.$inject = ['$scope', '$modal', 'tablaDatosService', 'CatalogoInstructores', 'CatalogoUnidadesAdmtvas', 'AlmacenDocumentos', 'Usuario', 'ControlProcesos'];

    function ValidacionInstructoresController($scope, $modal, tablaDatosService, CatalogoInstructores, CatalogoUnidadesAdmtvas, AlmacenDocumentos, Usuario, ControlProcesos ) {

            var vm = this;

            vm.muestraDatosRegistroActual = muestraDatosRegistroActual;
            vm.muestraResultadosBusqueda  = muestraResultadosBusqueda;
            vm.limpiaBusqueda             = limpiaBusqueda;
            vm.cambiarPagina              = cambiarPagina;
            vm.muestra_ptc_unidad         = muestra_ptc_unidad;
            vm.abreDocumento              = abreDocumento;
            vm.evaluaCurso                = evaluaCurso;
            vm.aceptaCurso                = aceptaCurso;
            vm.rechazaCurso               = rechazaCurso;

            vm.listaUnidades = [];
            vm.unidadSeleccionada = undefined;

            vm.tablaListaRegistros = {
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

                  vm.tablaListaRegistros.condicion = {
                      or: [
                        {estatus: 1},
                        {estatus: 2}
                      ]
                  };

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


                  vm.tablaListaRegistros.filtro_datos = {
                          filter: {
                              where: vm.tablaListaRegistros.condicion,
                              //fields: ['idCatalogoCurso','claveCurso','descripcion','idEspecialidad','modalidad','nombreCurso','numeroHoras'],
                              order: ['apellidoPaterno ASC','apellidoMaterno ASC','nombre ASC','idInstructor ASC'],
                              limit: vm.tablaListaRegistros.registrosPorPagina,
                              skip: vm.tablaListaRegistros.paginaActual - 1,
                              include: [
                                'localidad_pertenece',
                                'nivel_estudios',
                                {
                                    relation: 'unidad_pertenece',
                                    scope: {
                                        fields:['idUnidadAdmtva','nombre']
                                    }
                                },
                                {
                                    relation: 'documentos',
                                    scope: {
                                        fields:['idDocumento','documento','nombreArchivo','tipoArchivo']
                                    }
                                },
                                {
                                    relation: 'evaluacion_curso',
                                    scope: {
                                        fields:['id','idInstructor','idCatalogoCurso','calificacion'],
                                        include:{
                                            relation: 'CatalogoCursos',
                                            scope: {
                                                fields:['idCatalogoCurso','nombreCurso','numeroHoras','idEspecialidad'],
                                                order: ['nombreCurso ASC','idCatalogoCurso ASC'],
                                                include:{
                                                    relation: 'especialidad',
                                                    scope: {
                                                        fields:['nombre']
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                              ]
                          }
                  };

                  vm.registros = {};
                  vm.RegistroSeleccionado = {};
                  vm.tablaListaRegistros.fila_seleccionada = undefined;
                  vm.client = 1;

                  tablaDatosService.obtiene_datos_tabla(CatalogoInstructores, vm.tablaListaRegistros)
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


            function muestra_ptc_unidad() {

                  vm.registros = {};
                  vm.RegistroSeleccionado = {};
                  vm.tablaListaRegistros.fila_seleccionada = undefined;
                  vm.tablaListaRegistros.paginaActual = 1;
                  vm.tablaListaRegistros.inicio = 0;
                  vm.tablaListaRegistros.fin = 1;
                  vm.client = 1;
                  vm.mostrarbtnLimpiar = false;
                  vm.cadena_buscar = '';

                  if(vm.unidadSeleccionada.idUnidadAdmtva == -1)
                  {
                        vm.tablaListaRegistros.condicion = {
                            or: [
                              {estatus: 1},
                              {estatus: 2}
                            ]
                        };
                  }
                  else
                  {
                        vm.tablaListaRegistros.condicion = {
                          and: [
                              {
                                idUnidadAdmtva: vm.unidadSeleccionada.idUnidadAdmtva
                              },{
                                or: [
                                  {estatus: 1},
                                  {estatus: 2}
                                ]
                              }
                          ]
                        };
                  }

                  tablaDatosService.obtiene_datos_tabla(CatalogoInstructores, vm.tablaListaRegistros)
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
            };


            function muestraResultadosBusqueda() {

                  vm.registros = {};
                  vm.RegistroSeleccionado = {};
                  vm.tablaListaRegistros.fila_seleccionada = undefined;
                  vm.client = 1;
                  vm.tablaListaRegistros.paginaActual = 1;
                  vm.tablaListaRegistros.inicio = 0;
                  vm.tablaListaRegistros.fin = 1;

                  vm.unidadSeleccionada = vm.listaUnidades[0];

                  vm.tablaListaRegistros.condicion = {
                    and: [
                        {
                          nombre_completo: {regexp: '/.*'+ vm.cadena_buscar +'.*/i'}
                        },{
                          or: [
                            {estatus: 1},
                            {estatus: 2}
                          ]
                        }
                    ]
                  };

                  tablaDatosService.obtiene_datos_tabla(CatalogoInstructores, vm.tablaListaRegistros)
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

                        vm.mostrarbtnLimpiar = true;
                  });
            };


            function limpiaBusqueda() {

                  vm.registros = {};
                  vm.RegistroSeleccionado = {};
                  vm.tablaListaRegistros.fila_seleccionada = undefined;
                  vm.client = 1;
                  vm.tablaListaRegistros.paginaActual = 1;
                  vm.tablaListaRegistros.inicio = 0;
                  vm.tablaListaRegistros.fin = 1;

                  vm.tablaListaRegistros.condicion = {
                      or: [
                        {estatus: 1},
                        {estatus: 2}
                      ]
                  };

                  tablaDatosService.obtiene_datos_tabla(CatalogoInstructores, vm.tablaListaRegistros)
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

                        vm.mostrarbtnLimpiar = false;
                        vm.cadena_buscar = '';
                  });

            };


            function cambiarPagina() {

                  if(vm.tablaListaRegistros.totalElementos > 0)
                  {
                        tablaDatosService.cambia_pagina(CatalogoInstructores, vm.tablaListaRegistros)
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


            function abreDocumento(seleccion) {

                    Usuario.prototype$__get__accessTokens({ 
                        id: $scope.currentUser.id_usuario
                    })
                    .$promise
                    .then(function(resp) {
                      var link = angular.element('<a href="api/AlmacenDocumentos/instructores/download/'+seleccion.nombreArchivo+'?access_token='+resp[0].id+'" target="_blank"></a>');
                        angular.element(document.body).append(link);
                        link[0].click();
                        link.remove();
                    });
            }


            function muestraDatosRegistroActual(seleccion) {

                  var index = vm.registros.indexOf(seleccion);
                  vm.RegistroSeleccionado = seleccion;
                  vm.client = 2;
                  vm.tablaListaRegistros.fila_seleccionada = index;
            };


            function evaluaCurso(seleccion) {

                  var modalInstance = $modal.open({
                      templateUrl: 'app/components/instructores/validaciones/modal-evalua-cursos.html',
                      windowClass: "animated fadeIn",
                      controller: 'ModalEvaluaCursosController as vm',
                      windowClass: 'app-modal-window2',
                      resolve: {
                        registroEditar: function () { return seleccion }
                      }

                  });

                  modalInstance.result.then(function (respuesta) {

                      if(respuesta.length > 0)
                      {
                            var index = 0;
                            angular.forEach(respuesta, function(record) {

                                index = vm.RegistroSeleccionado.evaluacion_curso.map(function(registro) {
                                                                                      return registro.id;
                                                                                    }).indexOf(record.id);

                                vm.RegistroSeleccionado.evaluacion_curso[index].calificacion = record.calificacion;

                            });
                      }
                  }, function () {
                  });
            };


            function aceptaCurso(seleccion) {

                  swal({
                    title: "Confirmar",
                    html: 'Se confirma que la persona <strong>'+ seleccion.nombre_completo +'</strong> de la <strong>' + seleccion.unidad_pertenece.nombre + '</strong> se aceptar&aacute; como instructor, ¿Continuar?',
                    type: "info",
                    showCancelButton: true,
                    confirmButtonColor: "#9a0000",
                    confirmButtonText: "Aceptar",
                    cancelButtonText: "Cancelar",
                    closeOnConfirm: false,
                    closeOnCancel: true
                  }, function(){

                          swal.disableButtons();
                          CatalogoInstructores.prototype$updateAttributes(
                          {
                              id: seleccion.idInstructor
                          },{
                              estatus: 3,
                              activo: true,
                              fechaAceptacion: Date()
                          })
                          .$promise
                          .then(function(respuesta) {

                                ControlProcesos
                                .create({
                                    proceso              : 'INSTRUCTORES',
                                    accion               : 'INSTRUCTOR APROBADO',
                                    idDocumento          : seleccion.idInstructor,
                                    idUsuario            : $scope.currentUser.id_usuario,
                                    idUnidadAdmtva       : $scope.currentUser.unidad_pertenece_id,
                                    idUnidadAdmtvaRecibe : seleccion.idUnidadAdmtva
                                })
                                .$promise
                                .then(function(resp) {

                                      vm.limpiaBusqueda();

                                      ControlProcesos.findById({ 
                                          id: resp.id,
                                          filter: {
                                            fields : ['identificador']
                                          }
                                      })
                                      .$promise
                                      .then(function(resp_control) {

                                            swal({
                                              title: 'Instructor aprobado',
                                              html: 'se marc&oacute; al instructor como <strong>ACEPTADO</strong> y se agreg&oacute; al cat&aacute;logo de instructores de la unidad. Se gener&oacute; el identificador del proceso <br><strong style="font-size: 13px;">' + resp_control.identificador + '</strong>',
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


            function rechazaCurso(seleccion) {

                  swal({
                    title: "Confirmar",
                    html: 'Se confirma que la persona <strong>'+ seleccion.nombre_completo +'</strong> de la <strong>' + seleccion.unidad_pertenece.nombre + '</strong> se rechaz&oacute; y ser&aacute; regresado a la unidad para su revisi&oacute;n, ¿Continuar?',
                    type: "info",
                    showCancelButton: true,
                    confirmButtonColor: "#9a0000",
                    confirmButtonText: "Aceptar",
                    cancelButtonText: "Cancelar",
                    closeOnConfirm: true,
                    closeOnCancel: true
                  }, function(){

                          var modalInstance = $modal.open({
                              templateUrl: 'app/components/instructores/validaciones/modal-captura-observacion-rechazo.html',
                              windowClass: "animated fadeIn",
                              controller: 'ModalCapturaObservacionRechazoController as vm',
                              resolve: {
                                registroEditar: function () { return {seleccion: seleccion} }
                              }

                          });

                          modalInstance.result.then(function (respuesta) {
                              
                                  seleccion.observacionesRevision = respuesta.observacionesRevision;
                                  seleccion.estatus = 2;

                                  CatalogoInstructores.prototype$updateAttributes(
                                  {
                                      id: seleccion.idInstructor
                                  },{
                                      estatus: 2,
                                      observacionesRevision:seleccion.observacionesRevision
                                  })
                                  .$promise
                                  .then(function(respuesta) {

                                        ControlProcesos
                                        .create({
                                            proceso              : 'INSTRUCTORES',
                                            accion               : 'INSTRUCTOR RECHAZADO',
                                            idDocumento          : seleccion.idInstructor,
                                            idUsuario            : $scope.currentUser.id_usuario,
                                            idUnidadAdmtva       : $scope.currentUser.unidad_pertenece_id,
                                            idUnidadAdmtvaRecibe : seleccion.idUnidadAdmtva
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
                                                      title: 'Instructor rechazado',
                                                      html: 'se marc&oacute; la propuesta del instructor como <strong>RECHAZADA</strong> y se gener&oacute; el identificador del proceso <br><strong style="font-size: 13px;">' + resp_control.identificador + '</strong>',
                                                      type: 'success',
                                                      showCancelButton: false,
                                                      confirmButtonColor: "#9a0000",
                                                      confirmButtonText: "Aceptar"
                                                    });

                                              });
                                        });
                                  });

                          }, function () {
                          });

                  });
            }

    };

})();