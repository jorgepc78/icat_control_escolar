(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('PrincipalRevisionPTCController', PrincipalRevisionPTCController);

    PrincipalRevisionPTCController.$inject = ['$scope', '$modal', '$q', 'tablaDatosService', 'ProgTrimCursos', 'CursosPtc', 'CatalogoUnidadesAdmtvas', 'ControlProcesos'];

    function PrincipalRevisionPTCController($scope, $modal, $q, tablaDatosService, ProgTrimCursos, CursosPtc, CatalogoUnidadesAdmtvas, ControlProcesos) {

            var vm = this;

            /****** ELEMENTOS DE LA TABLA PRINCIPAL ******/
            vm.tablaListaPTCs = {
              totalElementos     : 0,
              paginaActual       : 1,
              registrosPorPagina : 5,
              inicio             : 0,
              fin                : 1,
              condicion          : {estatus:{lt: 4}},
              filtro_datos       : {},
              fila_seleccionada  : 0
            };

            vm.tablaListaPTCs.fila_seleccionada = undefined;
            vm.registrosPTCs = {};
            vm.RegistroPTCSeleccionado = {};

            vm.listaEstatus = [];
            vm.estatusSeleccionado = undefined;

            vm.listaUnidades = [];
            vm.unidadSeleccionada = undefined;

            /****** ELEMENTOS DE LA TABLA DE CURSOS ******/

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

            vm.registrosCursosPTCs = {};


            /****** DEFINICION DE FUNCIONES DE LA TABLA PRINCIPAL ******/
            vm.muestra_ptc_unidad     = muestra_ptc_unidad;
            vm.muestra_ptc_estatus    = muestra_ptc_estatus;
            
            vm.muestraCursosPTCActual = muestraCursosPTCActual;
            vm.cambiarPaginaPrincipal = cambiarPaginaPrincipal;
            vm.cambiarPaginaDetalle   = cambiarPaginaDetalle;
            
            vm.aceptaPTC       = aceptaPTC;
            vm.rechazaPTC      = rechazaPTC;
            vm.agregaObserRevision = agregaObserRevision;

            inicia();
            

            function inicia() {

                  vm.listaEstatus = [
                      {valor: -1, texto: 'Todos'},
                      {valor: 1, texto: 'En proceso de revisión'},
                      {valor: 3, texto: 'Rechazado'}
                  ];

                  vm.tablaListaPTCs.condicion = {
                      or: [
                        {estatus: 1},
                        {estatus: 3}
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

                  vm.estatusSeleccionado = vm.listaEstatus[0];
                  
                  vm.tablaListaPTCs.filtro_datos = {
                          filter: {
                              where: vm.tablaListaPTCs.condicion,
                              order: ['idUnidadAdmtva ASC', 'anio DESC', 'trimestre DESC'],
                              limit: vm.tablaListaPTCs.registrosPorPagina,
                              skip: vm.tablaListaPTCs.paginaActual - 1,
                              include: [
                                'unidad_pertenece',
                                {
                                    relation: 'cursos_programados',
                                    scope: {
                                      fields: ['idCursoPTC']
                                    }
                                },
                              ]
                          }
                  };

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
                                        fields: ['nombreCurso','modalidad']
                                      }
                                  },
                                  {
                                      relation: 'instructores_propuestos',
                                      scope: {
                                        fields: ['apellidoPaterno','apellidoMaterno','nombre'],
                                        order: ['apellidoPaterno ASC','apellidoMaterno ASC','nombre ASC']
                                      }
                                  }
                              ]
                          }
                  };


                  tablaDatosService.obtiene_datos_tabla(ProgTrimCursos, vm.tablaListaPTCs)
                  .then(function(respuesta) {

                        vm.tablaListaPTCs.totalElementos = respuesta.total_registros;
                        vm.tablaListaPTCs.inicio = respuesta.inicio;
                        vm.tablaListaPTCs.fin = respuesta.fin;

                        if(vm.tablaListaPTCs.totalElementos > 0)
                        {
                            vm.registrosPTCs = respuesta.datos;
                            vm.RegistroPTCSeleccionado = vm.registrosPTCs[0];
                            vm.tablaListaPTCs.fila_seleccionada = 0;
                            vm.client = 2;
                            muestraCursosPTCActual(vm.RegistroPTCSeleccionado);
                        }
                  });

            }


            function cambiarPaginaPrincipal() {

                  if(vm.tablaListaPTCs.totalElementos > 0)
                  {
                        tablaDatosService.cambia_pagina(ProgTrimCursos, vm.tablaListaPTCs)
                        .then(function(respuesta) {

                            vm.tablaListaPTCs.inicio = respuesta.inicio;
                            vm.tablaListaPTCs.fin = respuesta.fin;

                            vm.registrosPTCs = respuesta.datos;
                            vm.RegistroPTCSeleccionado = vm.registrosPTCs[0];
                            vm.client = 2;
                            vm.tablaListaPTCs.fila_seleccionada = 0;
                            muestraCursosPTCActual(vm.RegistroPTCSeleccionado);
                        });
                  }
            }



            function cambiarPaginaDetalle() {

                  if(vm.tablaListaCursos.totalElementos > 0)
                  {
                        tablaDatosService.cambia_pagina(CursosPtc, vm.tablaListaCursos)
                        .then(function(respuesta) {

                            vm.tablaListaCursos.inicio = respuesta.inicio;
                            vm.tablaListaCursos.fin = respuesta.fin;

                            vm.registrosCursosPTCs = respuesta.datos;
                        });
                  }
            }



            function muestraCursosPTCActual(seleccion) {

                  var index = vm.registrosPTCs.indexOf(seleccion);
                  vm.RegistroPTCSeleccionado = seleccion;
                  vm.tablaListaPTCs.fila_seleccionada = index;

                  vm.client = 1;
                  vm.tablaListaCursos.paginaActual = 1;
                  vm.tablaListaCursos.inicio = 0;
                  vm.tablaListaCursos.fin = 1;
                  vm.tablaListaCursos.condicion = {idPtc: seleccion.idPtc};

                  vm.registrosCursosPTCs = {};
                  tablaDatosService.obtiene_datos_tabla(CursosPtc, vm.tablaListaCursos)
                  .then(function(respuesta) {

                        vm.tablaListaCursos.totalElementos = respuesta.total_registros;
                        vm.tablaListaCursos.inicio = respuesta.inicio;
                        vm.tablaListaCursos.fin = respuesta.fin;

                        if(vm.tablaListaCursos.totalElementos > 0)
                        {
                            vm.client = 2;
                            vm.registrosCursosPTCs = respuesta.datos;
                        }
                  });

            };


            function muestra_ptc_unidad() {

                  vm.registrosPTCs = {};
                  vm.RegistroPTCSeleccionado = {};
                  vm.tablaListaPTCs.fila_seleccionada = undefined;
                  vm.client = 1;
                  vm.tablaListaPTCs.paginaActual = 1;
                  vm.tablaListaPTCs.inicio = 0;
                  vm.tablaListaPTCs.fin = 1;

                  vm.registrosCursosPTCs = {};
                  vm.tablaListaCursos.totalElementos = 0;
                  vm.tablaListaCursos.paginaActual = 1;
                  vm.tablaListaCursos.inicio = -1;
                  vm.tablaListaCursos.fin = 0;
                  vm.estatusSeleccionado = vm.listaEstatus[0];

                  if(vm.unidadSeleccionada.idUnidadAdmtva == -1)
                  {
                        vm.tablaListaPTCs.condicion = {
                            or: [
                              {estatus: 1},
                              {estatus: 3}
                            ]
                        };
                  }
                  else
                  {
                        vm.tablaListaPTCs.condicion = {
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

                  tablaDatosService.obtiene_datos_tabla(ProgTrimCursos, vm.tablaListaPTCs)
                  .then(function(respuesta) {

                        vm.tablaListaPTCs.totalElementos = respuesta.total_registros;
                        vm.tablaListaPTCs.inicio = respuesta.inicio;
                        vm.tablaListaPTCs.fin = respuesta.fin;

                        if(vm.tablaListaPTCs.totalElementos > 0)
                        {
                            vm.registrosPTCs = respuesta.datos;
                            vm.RegistroPTCSeleccionado = vm.registrosPTCs[0];
                            vm.client = 2;
                            vm.tablaListaPTCs.fila_seleccionada = 0;
                            muestraCursosPTCActual(vm.RegistroPTCSeleccionado);
                        }

                  });
            };


            function muestra_ptc_estatus() {

                  vm.registrosPTCs = {};
                  vm.RegistroPTCSeleccionado = {};
                  vm.tablaListaPTCs.fila_seleccionada = undefined;
                  vm.client = 1;
                  vm.tablaListaPTCs.paginaActual = 1;
                  vm.tablaListaPTCs.inicio = 0;
                  vm.tablaListaPTCs.fin = 1;

                  if(vm.estatusSeleccionado.valor == -1)
                  {
                        if(vm.unidadSeleccionada.idUnidadAdmtva == -1)
                        {
                              vm.tablaListaPTCs.condicion = {
                                  or: [
                                    {estatus: 1},
                                    {estatus: 3}
                                  ]
                              };
                        }
                        else
                        {
                              vm.tablaListaPTCs.condicion = {
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
                  }
                  else
                  {
                        if(vm.unidadSeleccionada.idUnidadAdmtva == -1)
                        {
                              vm.tablaListaPTCs.condicion = {estatus: vm.estatusSeleccionado.valor};
                        }
                        else
                        {
                              vm.tablaListaPTCs.condicion = {
                                  and: [
                                    {estatus: vm.estatusSeleccionado.valor},
                                    {idUnidadAdmtva: vm.unidadSeleccionada.idUnidadAdmtva}
                                  ]
                              };
                        }
                  }

                  tablaDatosService.obtiene_datos_tabla(ProgTrimCursos, vm.tablaListaPTCs)
                  .then(function(respuesta) {

                        vm.tablaListaPTCs.totalElementos = respuesta.total_registros;
                        vm.tablaListaPTCs.inicio = respuesta.inicio;
                        vm.tablaListaPTCs.fin = respuesta.fin;

                        if(vm.tablaListaPTCs.totalElementos > 0)
                        {
                            vm.registrosPTCs = respuesta.datos;
                            vm.RegistroPTCSeleccionado = vm.registrosPTCs[0];
                            vm.client = 2;
                            vm.tablaListaPTCs.fila_seleccionada = 0;
                            muestraCursosPTCActual(vm.RegistroPTCSeleccionado);
                        }

                  });
            };


/************ SECCION DE EDICION *****************/



            function aceptaPTC(RegistroSeleccionado) {

                  var trimestres = ['PRIMERO','SEGUNDO','TERCERO','CUARTO'];
                  swal({
                    title: "Confirmar",
                    html: 'Se confirma que el PTC del <strong>'+ trimestres[(RegistroSeleccionado.trimestre-1)] +'</strong> trimestre, del a&ntilde;o <strong>'+ RegistroSeleccionado.anio +'</strong> ser&aacute; marcado como <strong>ACEPTADO</strong>, ¿Continuar?',
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#9a0000",
                    confirmButtonText: "Aceptar",
                    cancelButtonText: "Cancelar",
                    closeOnConfirm: false,
                    closeOnCancel: true
                  }, function(){
                          swal.disableButtons();

                            ProgTrimCursos.prototype$updateAttributes(
                            {
                                id: RegistroSeleccionado.idPtc
                            },{
                                estatus: 2,
                                fechaAceptacion: Date()
                            })
                            .$promise
                            .then(function(respuesta) {
                                  vm.RegistroPTCSeleccionado.estatus         = respuesta.estatus;
                                  vm.RegistroPTCSeleccionado.fechaAceptacion = respuesta.fechaAceptacion;

                                  ControlProcesos
                                  .create({
                                      proceso         : 'PTC',
                                      accion          : 'PTC ACEPTADO',
                                      idDocumento     : RegistroSeleccionado.idPtc,
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
                                                html: 'se marc&oacute; el PTC como aceptado y se gener&oacute; el identificador del proceso <br><strong style="font-size: 13px;">' + resp_control.identificador + '</strong>',
                                                type: 'success',
                                                showCancelButton: false,
                                                confirmButtonColor: "#9a0000",
                                                confirmButtonText: "Aceptar"
                                              });

                                        });
                                  });

                            });

                  });

            };


            function rechazaPTC(RegistroSeleccionado) {

                  var trimestres = ['PRIMERO','SEGUNDO','TERCERO','CUARTO'];
                  swal({
                    title: "Confirmar",
                    html: 'Se confirma que el PTC del <strong>'+ trimestres[(RegistroSeleccionado.trimestre-1)] +'</strong> trimestre, del a&ntilde;o <strong>'+ RegistroSeleccionado.anio +'</strong> ser&aacute; marcado como <strong>RECHAZADO</strong>, ¿Continuar?',
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#9a0000",
                    confirmButtonText: "Aceptar",
                    cancelButtonText: "Cancelar",
                    closeOnConfirm: false,
                    closeOnCancel: true
                  }, function(){
                          swal.disableButtons();

                            ProgTrimCursos.prototype$updateAttributes(
                            {
                                id: RegistroSeleccionado.idPtc
                            },{
                                estatus: 3,
                                fechaRechazo: Date()
                            })
                            .$promise
                            .then(function(respuesta) {
                                  vm.RegistroPTCSeleccionado.estatus      = respuesta.estatus;
                                  vm.RegistroPTCSeleccionado.fechaRechazo = respuesta.fechaRechazo;

                                  ControlProcesos
                                  .create({
                                      proceso         : 'PTC',
                                      accion          : 'PTC RECHAZADO',
                                      idDocumento     : RegistroSeleccionado.idPtc,
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
                                                html: 'se marc&oacute; el PTC como rechazado y se gener&oacute; el identificador del proceso <br><strong style="font-size: 13px;">' + resp_control.identificador + '</strong>',
                                                type: 'success',
                                                showCancelButton: false,
                                                confirmButtonColor: "#9a0000",
                                                confirmButtonText: "Aceptar"
                                              });

                                        });
                                  });
                            });

                  });

            };

/************* FUNCIONES DE EDICION DE LOS CURSOS DEL PTC *******************/

            function agregaObserRevision(seleccion) {

                    var modalInstance = $modal.open({
                        templateUrl: 'app/components/ptc/revision-ptc/modal-edita-observaciones-curso.html',
                        windowClass: "animated fadeIn",
                        controller: 'ModalEditaObserCursoController as vm',
                        resolve: {
                          registroEditar: function () { return seleccion }
                        }

                    });

                    modalInstance.result.then(function (respuesta) {
                        seleccion.observacionesRevision = respuesta.observacionesRevision;
                    }, function () {
                    });
            };


    };

})();