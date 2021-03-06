(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('PrincipalRevisionPTCController', PrincipalRevisionPTCController);

    PrincipalRevisionPTCController.$inject = ['$scope', '$rootScope', '$modal', '$q', 'tablaDatosService', 'ProgTrimCursos', 'HorasAsignadasUnidad', 'CursosPtc', 'CatalogoUnidadesAdmtvas', 'ControlProcesos', 'Usuario'];

    function PrincipalRevisionPTCController($scope, $rootScope, $modal, $q, tablaDatosService, ProgTrimCursos, HorasAsignadasUnidad, CursosPtc, CatalogoUnidadesAdmtvas, ControlProcesos, Usuario) {

            var vm = this;

            /****** DEFINICION DE FUNCIONES DE LA TABLA PRINCIPAL ******/
            vm.muestra_ptc_unidad      = muestra_ptc_unidad;
            vm.muestra_ptc_unidad_anio = muestra_ptc_unidad_anio;
            
            vm.muestraCursosPTCActual  = muestraCursosPTCActual;
            vm.cambiarPaginaPrincipal  = cambiarPaginaPrincipal;
            vm.cambiarPaginaDetalle    = cambiarPaginaDetalle;
            
            vm.aceptaPTC              = aceptaPTC;
            vm.rechazaPTC             = rechazaPTC;
            vm.agregaObserRevision    = agregaObserRevision;

            vm.generaDocumento        = generaDocumento;


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
            
            vm.listaAniosDisp = [];
            vm.anioSeleccionado = [];
            vm.horas_disponibles = 0;

            vm.tablaListaPTCs.fila_seleccionada = undefined;
            vm.registrosPTCs = [];
            vm.RegistroPTCSeleccionado = [];

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



            inicia();
            

            function inicia() {


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
                      vm.listaUnidades = resp;
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
                                }
                              ]
                          }
                  };

                  vm.tablaListaCursos.filtro_datos = {
                          filter: {
                              where: vm.tablaListaCursos.condicion,
                              order: ['fechaInicio ASC','idCursoPTC ASC'],
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
                                      relation: 'modalidad_pertenece',
                                      scope: {
                                        fields: ['idModalidad','modalidad']
                                      }
                                  },
                                  {
                                      relation: 'instructores_propuestos',
                                      scope: {
                                        fields: ['apellidoPaterno','apellidoMaterno','nombre'],
                                        order: ['apellidoPaterno ASC','apellidoMaterno ASC','nombre ASC','idInstructor ASC']
                                      }
                                  }
                              ]
                          }
                  };
            }



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

                  vm.anioSeleccionado = [];
                  vm.listaAniosDisp = [];

                  var fechaHoy = new Date();
                  
                  HorasAsignadasUnidad.find({
                      filter: {
                          where: {
                            and: [
                              {idUnidadAdmtva: vm.unidadSeleccionada.idUnidadAdmtva},
                              {anio:{gte: fechaHoy.getFullYear()}}
                            ]
                          },
                          fields: ['id','anio','horasAsignadas'],
                          order: 'anio DESC'
                      }
                  })
                  .$promise
                  .then(function(resp) {

                        vm.listaAniosDisp = resp;
                        
                        if(vm.listaAniosDisp.length > 0)
                        {
                              vm.anioSeleccionado = vm.listaAniosDisp[0];

                              vm.tablaListaPTCs.condicion = {
                                  and: [
                                    {anio: vm.anioSeleccionado.anio},
                                    {idUnidadAdmtva: vm.unidadSeleccionada.idUnidadAdmtva},
                                    {
                                        or: [
                                          {estatus: 1},
                                          {estatus: 3}
                                        ]
                                    },
                                  ]
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
                                        vm.client = 2;
                                        vm.tablaListaPTCs.fila_seleccionada = 0;
                                        muestraCursosPTCActual(vm.RegistroPTCSeleccionado);
                                    }
                                    //calcula_horas_disponibles();
                              });
                        }
                        else
                        {
                              vm.tablaListaPTCs.totalElementos = 0;
                              vm.tablaListaPTCs.inicio = -1;
                              vm.tablaListaPTCs.fin = 0;
                        }

                  });

            };




            function muestra_ptc_unidad_anio() {

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


                  vm.tablaListaPTCs.condicion = {
                      and: [
                        {anio: vm.anioSeleccionado.anio},
                        {idUnidadAdmtva: vm.unidadSeleccionada.idUnidadAdmtva},
                        {
                            or: [
                              {estatus: 1},
                              {estatus: 3}
                            ]
                        },
                      ]
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
                            vm.client = 2;
                            vm.tablaListaPTCs.fila_seleccionada = 0;
                            muestraCursosPTCActual(vm.RegistroPTCSeleccionado);
                        }
                        //calcula_horas_disponibles();

                  });

            };





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
                            //calcula_horas_disponibles();
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

            }


            function generaDocumento(idPtc) {
                    Usuario.prototype$__get__accessTokens({ 
                        id: $rootScope.currentUser.id_usuario
                    })
                    .$promise
                    .then(function(resp) {
                        var link = angular.element('<a href="api/ProgTrimCursos/exporta_doc_autorizacion_ptc/'+idPtc+'?access_token='+resp[0].id+'" target="_blank"></a>');
                        angular.element(document.body).append(link);
                        link[0].click();
                        link.remove();
                    });
            }


/************ SECCION DE EDICION *****************/



            function aceptaPTC(RegistroSeleccionado, origen) {

                  var trimestres = ['PRIMER','SEGUNDO','TERCER','CUARTO'];

                  var datos;
                  var mensaje_confirmacion = '';
                  var mensaje_accion = '';
                  if(origen == 'dp')
                  {
                      datos = {
                        revisadoProgramas: true
                      };
                      mensaje_confirmacion = 'El PTC del <strong>'+ trimestres[(RegistroSeleccionado.trimestre-1)] +'</strong> trimestre, del a&ntilde;o <strong>'+ RegistroSeleccionado.anio +'</strong> ser&aacute; marcado como <strong>REVISADO</strong> por el Depto. de programas de capacitaci&oacute;n, ¿Continuar?';
                      mensaje_accion = 'PTC REVISADO PROGRAMAS';
                  }
                  else if(origen == 'da')
                  {
                      datos = {
                        aprobadoAcademica: true
                      };
                      mensaje_confirmacion = 'El PTC del <strong>'+ trimestres[(RegistroSeleccionado.trimestre-1)] +'</strong> trimestre, del a&ntilde;o <strong>'+ RegistroSeleccionado.anio +'</strong> ser&aacute; marcado como <strong>APROBADO</strong> por la Direcci&oacute;n Acad&eacute;mica, ¿Continuar?';
                      mensaje_accion = 'PTC APROBADO ACADEMICA';
                  }
                  else if(origen == 'dg')
                  {
                      datos = {
                        aprobadoDireccionGral: true,
                        estatus: 2,
                        fechaAceptacion: Date()
                      };
                      mensaje_confirmacion = 'El PTC del <strong>'+ trimestres[(RegistroSeleccionado.trimestre-1)] +'</strong> trimestre, del a&ntilde;o <strong>'+ RegistroSeleccionado.anio +'</strong> ser&aacute; marcado como <strong>AUTORIZADO</strong>, ¿Continuar?';
                      mensaje_accion = 'PTC APROBADO DIR GRAL';
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

                            ProgTrimCursos.prototype$updateAttributes(
                            {
                                id: RegistroSeleccionado.idPtc
                            },
                                datos
                            )
                            .$promise
                            .then(function(respuesta) {

                                  if(origen == 'dg')
                                  {
                                        ProgTrimCursos.find({
                                            filter: {
                                                where: {
                                                  and: [
                                                      {idUnidadAdmtva: vm.unidadSeleccionada.idUnidadAdmtva},
                                                      {anio: vm.anioSeleccionado.anio},
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
                                              
                                              vm.horas_disponibles = vm.anioSeleccionado.horasAsignadas - num_horas_separadas;

                                              HorasAsignadasUnidad.prototype$updateAttributes(
                                              {
                                                  id: vm.anioSeleccionado.id
                                              },{
                                                  horasSeparadas: num_horas_separadas
                                              })
                                              .$promise
                                              .then(function(respuesta) {
                                              })
                                              .catch(function(error) {
                                              });
                                        });                                    
                                  }


                                  ControlProcesos
                                  .create({
                                      proceso         : 'PTC',
                                      accion          : mensaje_accion,
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

                                              vm.muestra_ptc_unidad_anio();

                                              var titulo_ventana_aviso = 'PTC aprobado';
                                              
                                              if(origen == 'dp') {
                                                  titulo_ventana_aviso = 'PTC Revisado';
                                                  var mensaje_ventana_aviso = 'se marc&oacute; el PTC como <strong>REVISADO</strong> por el &aacute;rea de programas de capacitaci&oacute;n y se gener&oacute; el identificador del proceso <br><strong style="font-size: 13px;">' + resp_control.identificador + '</strong>';
                                              }
                                              if(origen == 'da')
                                                  var mensaje_ventana_aviso = 'se marc&oacute; el PTC como <strong>APROBADO</strong> por el &aacute;rea acad&eacute;mica y se gener&oacute; el identificador del proceso <br><strong style="font-size: 13px;">' + resp_control.identificador + '</strong>';
                                              /*else if($scope.currentUser.perfil == 'dir_planeacion')
                                                  var mensaje_ventana_aviso = 'se marc&oacute; el PTC como <strong>APROBADO</strong> por el &aacute;rea de planeaci&oacute;n y se gener&oacute; el identificador del proceso <br><strong style="font-size: 13px;">' + resp_control.identificador + '</strong>';*/
                                              else if(origen == 'dg')
                                              {
                                                  titulo_ventana_aviso = 'PTC Aceptado';
                                                  var mensaje_ventana_aviso = 'se marc&oacute; el PTC como <strong>AUTORIZADO</strong> y se le di&oacute; aviso a la unidad. Se gener&oacute; el identificador del proceso <br><strong style="font-size: 13px;">' + resp_control.identificador + '</strong>';
                                              }

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

            };


            function rechazaPTC(RegistroSeleccionado) {

                  var trimestres = ['PRIMERO','SEGUNDO','TERCERO','CUARTO'];
                  var datos;
                  var mensaje_confirmacion = '';
                  var mensaje_accion = '';

                  datos = {
                    estatus: 3,
                    fechaRechazo: Date()
                  };
                  mensaje_confirmacion = 'Se confirma que el PTC del <strong>'+ trimestres[(RegistroSeleccionado.trimestre-1)] +'</strong> trimestre, del a&ntilde;o <strong>'+ RegistroSeleccionado.anio +'</strong> ser&aacute; marcado como <strong>RECHAZADO</strong> y ser&aacute; regresado a la unidad, ¿Continuar?';
                  mensaje_accion = 'PTC RECHAZADO PROGRAMAS';

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

                            ProgTrimCursos.prototype$updateAttributes(
                            {
                                id: RegistroSeleccionado.idPtc
                            },
                                datos
                            )
                            .$promise
                            .then(function(respuesta) {

                                  vm.RegistroPTCSeleccionado.estatus      = respuesta.estatus;
                                  vm.RegistroPTCSeleccionado.fechaRechazo = respuesta.fechaRechazo;

                                  ControlProcesos
                                  .create({
                                      proceso              : 'PTC',
                                      accion               : mensaje_accion,
                                      idDocumento          : RegistroSeleccionado.idPtc,
                                      idUsuario            : $scope.currentUser.id_usuario,
                                      idUnidadAdmtva       : $scope.currentUser.unidad_pertenece_id,
                                      idUnidadAdmtvaRecibe : RegistroSeleccionado.idUnidadAdmtva
                                  })
                                  .$promise
                                  .then(function(resp) {

                                        vm.muestra_ptc_unidad_anio();

                                        ControlProcesos.findById({ 
                                            id: resp.id,
                                            filter: {
                                              fields : ['identificador']
                                            }
                                        })
                                        .$promise
                                        .then(function(resp_control) {

                                              swal({
                                                title: 'PTC Rechazado',
                                                html: 'se marc&oacute; el PTC como <strong>RECHAZADO</strong> y se gener&oacute; el identificador del proceso <br><strong style="font-size: 13px;">' + resp_control.identificador + '</strong>',
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


            function calcula_horas_disponibles() {

                  ProgTrimCursos.find({
                      filter: {
                          where: {
                            and: [
                                {idUnidadAdmtva: vm.unidadSeleccionada.idUnidadAdmtva},
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
                      
                      vm.horas_disponibles = vm.anioSeleccionado.horasAsignadas - num_horas_separadas;

                  });

            }
    };

})();