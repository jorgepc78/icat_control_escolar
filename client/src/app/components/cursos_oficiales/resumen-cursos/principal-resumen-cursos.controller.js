(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ResumenCursosController', ResumenCursosController);

    ResumenCursosController.$inject = ['$scope', '$stateParams', '$modal', 'tablaDatosService', 'CatalogoUnidadesAdmtvas', 'HorasAsignadasUnidad', 'ProgTrimCursos', 'CursosOficiales', 'InscripcionCurso', 'CatalogoInstructores', 'ControlProcesos'];

    function ResumenCursosController($scope, $stateParams, $modal, tablaDatosService, CatalogoUnidadesAdmtvas, HorasAsignadasUnidad, ProgTrimCursos, CursosOficiales, InscripcionCurso, CatalogoInstructores, ControlProcesos ) {

            var vm = this;

            vm.muestra_cursos_unidad      = muestra_cursos_unidad;
            vm.muestra_estatus_curso      = muestra_estatus_curso;

            vm.muestraResultadosBusqueda  = muestraResultadosBusqueda;
            vm.limpiaBusqueda             = limpiaBusqueda;

            vm.muestraDatosRegistroActual = muestraDatosRegistroActual;
            vm.cambiarPagina              = cambiarPagina;
            vm.reprogramaCurso            = reprogramaCurso;
            vm.cancelaCurso               = cancelaCurso;
            vm.concluyeCurso              = concluyeCurso;
            vm.cierraCurso                = cierraCurso;
            vm.asientaCalificaciones      = asientaCalificaciones;
            vm.generaListados             = generaListados;


            vm.tabs = [{active: true}, {active: false}];
            vm.total_pagados = 0;
            vm.mostrarbtnLimpiar = false;
            vm.cadena_buscar = '';

            vm.listaUnidades = [];
            vm.unidadSeleccionada = undefined;

            vm.listaCursos = [];
            vm.cursoSeleccionado = {};

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


            inicia();

            function inicia() {

                  vm.tipo_vista = $stateParams.tipo;

                  if(vm.tipo_vista == 'historicos') {
                      vm.titulo_seccion = 'Cursos realizados o cancelados';

                      vm.listaEstatus = [
                          {valor: -1, texto: 'Todos'},
                          {valor: 6, texto: 'Cerrado'},
                          {valor: 7, texto: 'Cancelado'}
                      ];

                      vm.condicion_estatus = {
                              or: [
                                {estatus: 6},
                                {estatus: 7}
                              ]
                      };
                  }
                  else {
                      vm.titulo_seccion = 'Cursos vigentes';

                      vm.listaEstatus = [
                          {valor: -1, texto: 'Todos'},
                          {valor: 2, texto: 'En espera'},
                          {valor: 4, texto: 'Activo'},
                          {valor: 5, texto: 'Concluido'}
                      ];

                      vm.condicion_estatus = {
                              or: [
                                {estatus: 2},
                                {estatus: 4},
                                {estatus: 5}
                              ]
                      };

                  }


                  if($scope.currentUser.unidad_pertenece_id > 1)
                  {
                        vm.unidadSeleccionada = {
                            idUnidadAdmtva  : $scope.currentUser.unidad_pertenece_id,
                            nombre          : $scope.currentUser.nombre_unidad
                        };

                        vm.tablaListaCursos.condicion = {
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

                        vm.tablaListaCursos.condicion = vm.condicion_estatus;
                  }
                  
                  vm.estatusSeleccionado = vm.listaEstatus[0];


                  vm.tablaListaCursos.filtro_datos = {
                          filter: {
                              where: vm.tablaListaCursos.condicion,
                              order: ['fechaInicio DESC','nombreCurso ASC'],
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
                                        fields: ['anio','trimestre']
                                      }
                                  },
                                  {
                                      relation: 'inscripcionesCursos',
                                      scope: {
                                          fields:['id','pagado','idAlumno','calificacion','numDocAcreditacion'],
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
                  vm.tablaListaCursos.paginaActual = 1;
                  vm.tablaListaCursos.inicio = 0;
                  vm.tablaListaCursos.fin = 1;

                  vm.listaCursos = {};
                  tablaDatosService.obtiene_datos_tabla(CursosOficiales, vm.tablaListaCursos)
                  .then(function(respuesta) {

                        vm.tablaListaCursos.totalElementos = respuesta.total_registros;
                        vm.tablaListaCursos.inicio = respuesta.inicio;
                        vm.tablaListaCursos.fin = respuesta.fin;

                        if(vm.tablaListaCursos.totalElementos > 0)
                        {
                            vm.listaCursos = respuesta.datos;
                            formateaListado();
                            vm.cursoSeleccionado = vm.listaCursos[0];
                            vm.client = 2;
                            vm.tablaListaCursos.fila_seleccionada = 0;
                            muestraDatosRegistroActual(vm.cursoSeleccionado);
                        }
                  });

            }


            function muestra_cursos_unidad() {

                  vm.client = 1;
                  vm.listaCursos = {};
                  vm.cursoSeleccionado = {};
                  vm.tablaListaCursos.fila_seleccionada = undefined;
                  vm.tablaListaCursos.paginaActual = 1;
                  vm.tablaListaCursos.inicio = 0;
                  vm.tablaListaCursos.fin = 1;
                  vm.estatusSeleccionado = vm.listaEstatus[0];

                  vm.cadena_buscar = '';
                  vm.mostrarbtnLimpiar = false;

                  if(vm.unidadSeleccionada.idUnidadAdmtva == -1)
                  {
                        vm.tablaListaCursos.condicion = vm.condicion_estatus;
                  }
                  else
                  {
                        vm.tablaListaCursos.condicion = {
                            and: [
                              {idUnidadAdmtva: vm.unidadSeleccionada.idUnidadAdmtva},
                              vm.condicion_estatus,
                            ]
                        };
                  }

                  tablaDatosService.obtiene_datos_tabla(CursosOficiales, vm.tablaListaCursos)
                  .then(function(respuesta) {

                        vm.tablaListaCursos.totalElementos = respuesta.total_registros;
                        vm.tablaListaCursos.inicio = respuesta.inicio;
                        vm.tablaListaCursos.fin = respuesta.fin;

                        if(vm.tablaListaCursos.totalElementos > 0)
                        {
                            vm.listaCursos = respuesta.datos;
                            formateaListado();
                            vm.cursoSeleccionado = vm.listaCursos[0];
                            vm.client = 2;
                            vm.tablaListaCursos.fila_seleccionada = 0;
                            muestraDatosRegistroActual(vm.cursoSeleccionado);
                        }
                  });
            };


            function muestra_estatus_curso() {

                  vm.client = 1;
                  vm.listaCursos = {};
                  vm.cursoSeleccionado = {};
                  vm.tablaListaCursos.fila_seleccionada = undefined;
                  vm.tablaListaCursos.paginaActual = 1;
                  vm.tablaListaCursos.inicio = 0;
                  vm.tablaListaCursos.fin = 1;

                  vm.cadena_buscar = '';
                  vm.mostrarbtnLimpiar = false;

                  if(vm.estatusSeleccionado.valor == -1)
                  {
                        if(vm.unidadSeleccionada.idUnidadAdmtva == -1)
                        {
                              vm.tablaListaCursos.condicion = vm.condicion_estatus;
                        }
                        else
                        {
                              vm.tablaListaCursos.condicion = {
                                  and: [
                                    {idUnidadAdmtva: vm.unidadSeleccionada.idUnidadAdmtva},
                                    vm.condicion_estatus,
                                  ]
                              };
                        }
                  }
                  else
                  {
                        if(vm.unidadSeleccionada.idUnidadAdmtva == -1)
                        {
                              vm.tablaListaCursos.condicion = {estatus: vm.estatusSeleccionado.valor};
                        }
                        else
                        {
                              vm.tablaListaCursos.condicion = {
                                  and: [
                                    {estatus: vm.estatusSeleccionado.valor},
                                    {idUnidadAdmtva: vm.unidadSeleccionada.idUnidadAdmtva}
                                  ]
                              };
                        }
                  }

                  tablaDatosService.obtiene_datos_tabla(CursosOficiales, vm.tablaListaCursos)
                  .then(function(respuesta) {

                        vm.tablaListaCursos.totalElementos = respuesta.total_registros;
                        vm.tablaListaCursos.inicio = respuesta.inicio;
                        vm.tablaListaCursos.fin = respuesta.fin;

                        if(vm.tablaListaCursos.totalElementos > 0)
                        {
                            vm.listaCursos = respuesta.datos;
                            formateaListado();
                            vm.cursoSeleccionado = vm.listaCursos[0];
                            vm.client = 2;
                            vm.tablaListaCursos.fila_seleccionada = 0;
                            muestraDatosRegistroActual(vm.cursoSeleccionado);
                        }
                  });
            };


            function muestraResultadosBusqueda() {

                  vm.client = 1;
                  vm.listaCursos = {};
                  vm.cursoSeleccionado = {};
                  vm.tablaListaCursos.fila_seleccionada = undefined;
                  vm.tablaListaCursos.paginaActual = 1;
                  vm.tablaListaCursos.inicio = 0;
                  vm.tablaListaCursos.fin = 1;

                  vm.estatusSeleccionado = vm.listaEstatus[0];

                  var condicion_busqueda = {
                                    nombreCurso: {regexp: '/.*'+ vm.cadena_buscar +'.*/i'}
                                };

                  if(vm.unidadSeleccionada.idUnidadAdmtva == -1)
                  {
                        vm.tablaListaCursos.condicion = {
                            and: [
                              vm.condicion_estatus,
                              condicion_busqueda,
                            ]
                        };
                  }
                  else
                  {
                        vm.tablaListaCursos.condicion = {
                            and: [
                              {idUnidadAdmtva: vm.unidadSeleccionada.idUnidadAdmtva},
                              vm.condicion_estatus,
                              condicion_busqueda
                            ]
                        };
                  }

                  tablaDatosService.obtiene_datos_tabla(CursosOficiales, vm.tablaListaCursos)
                  .then(function(respuesta) {

                        vm.tablaListaCursos.totalElementos = respuesta.total_registros;
                        vm.tablaListaCursos.inicio = respuesta.inicio;
                        vm.tablaListaCursos.fin = respuesta.fin;

                        if(vm.tablaListaCursos.totalElementos > 0)
                        {
                            vm.listaCursos = respuesta.datos;
                            formateaListado();
                            vm.cursoSeleccionado = vm.listaCursos[0];
                            vm.client = 2;
                            vm.tablaListaCursos.fila_seleccionada = 0;
                            muestraDatosRegistroActual(vm.cursoSeleccionado);
                        }
                        vm.mostrarbtnLimpiar = true;
                  });

            };


            function limpiaBusqueda() {

                  vm.mostrarbtnLimpiar = false;
                  vm.cadena_buscar = '';
                  vm.client = 1;
                  vm.listaCursos = {};
                  vm.cursoSeleccionado = {};
                  vm.tablaListaCursos.fila_seleccionada = undefined;
                  vm.tablaListaCursos.paginaActual = 1;
                  vm.tablaListaCursos.inicio = 0;
                  vm.tablaListaCursos.fin = 1;

                  vm.estatusSeleccionado = vm.listaEstatus[0];

                  if(vm.unidadSeleccionada.idUnidadAdmtva == -1)
                  {
                        vm.tablaListaCursos.condicion = vm.condicion_estatus;
                  }
                  else
                  {
                        vm.tablaListaCursos.condicion = {
                            and: [
                              {idUnidadAdmtva: vm.unidadSeleccionada.idUnidadAdmtva},
                              vm.condicion_estatus,
                            ]
                        };
                  }

                  tablaDatosService.obtiene_datos_tabla(CursosOficiales, vm.tablaListaCursos)
                  .then(function(respuesta) {

                        vm.tablaListaCursos.totalElementos = respuesta.total_registros;
                        vm.tablaListaCursos.inicio = respuesta.inicio;
                        vm.tablaListaCursos.fin = respuesta.fin;

                        if(vm.tablaListaCursos.totalElementos > 0)
                        {
                            vm.listaCursos = respuesta.datos;
                            formateaListado();
                            vm.cursoSeleccionado = vm.listaCursos[0];
                            vm.client = 2;
                            vm.tablaListaCursos.fila_seleccionada = 0;
                            muestraDatosRegistroActual(vm.cursoSeleccionado);
                        }
                  });

            };



            function muestraDatosRegistroActual(seleccion) {

                  var index = vm.listaCursos.indexOf(seleccion);
                  vm.cursoSeleccionado = seleccion;
                  vm.client = 2;
                  vm.tablaListaCursos.fila_seleccionada = index;
                  vm.total_pagados = 0;
                  angular.forEach(vm.cursoSeleccionado.inscripcionesCursos, function(inscripcion) {
                    if(inscripcion.pagado > 0)
                    vm.total_pagados++;
                  });


                  vm.tabs = [{active: true}, {active: false}]; 
            };



            function cambiarPagina() {

                  if(vm.tablaListaCursos.totalElementos > 0)
                  {
                        tablaDatosService.cambia_pagina(CursosOficiales, vm.tablaListaCursos)
                        .then(function(respuesta) {

                            vm.tablaListaCursos.inicio = respuesta.inicio;
                            vm.tablaListaCursos.fin = respuesta.fin;

                            vm.listaCursos = respuesta.datos;
                            formateaListado();
                            vm.cursoSeleccionado = vm.listaCursos[0];
                            vm.client = 2;
                            vm.tablaListaCursos.fila_seleccionada = 0;
                            muestraDatosRegistroActual(vm.cursoSeleccionado);
                        });
                  }
            }


            function reprogramaCurso(seleccion) {

                    var modalInstance = $modal.open({
                        templateUrl: 'app/components/cursos_oficiales/resumen-cursos/modal-reprograma-curso.html',
                        windowClass: "animated fadeIn",
                        controller: 'ModalReprogramaCursoController as vm',
                        resolve: {
                          registroEditar: function () { return seleccion }
                        }

                    });

                    modalInstance.result.then(function (respuesta) {

                        vm.cursoSeleccionado.horario               = respuesta.horario;
                        vm.cursoSeleccionado.aulaAsignada          = respuesta.aulaAsignada;
                        vm.cursoSeleccionado.fechaInicio           = respuesta.fechaInicio;
                        vm.cursoSeleccionado.fechaFin              = respuesta.fechaFin;
                        vm.cursoSeleccionado.idInstructor          = respuesta.idInstructor;
                        vm.cursoSeleccionado.nombreInstructor      = respuesta.nombreInstructor;
                        vm.cursoSeleccionado.observaciones         = respuesta.observaciones;
                        formateaListado();

                        ControlProcesos
                        .create({
                            proceso         : 'Cursos vigentes',
                            accion          : 'REPROGRAMACION DE CURSO',
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
                                      title: 'Reprogramación de curso',
                                      html: 'se realiz&oacute; el cambio de fechas del curso seleccionado y se envi&oacute; el aviso de cambio a las personas inscritas. Se gener&oacute; de igual manera el identificador de proceso <br><strong style="font-size: 13px;">' + resp_control.identificador + '</strong>',
                                      type: 'success',
                                      showCancelButton: false,
                                      confirmButtonColor: "#9a0000",
                                      confirmButtonText: "Aceptar"
                                    });

                              });
                        });

                    }, function () {
                    });

            }



            function cierraCurso(seleccion) {

                  swal({
                    title: "Confirmar",
                    html: 'El curso <strong>'+ seleccion.nombreCurso +'</strong> cambiar&aacute; su estatus a cerrado, una vez realizado esto el curso pasar&aacute; a la secci&oacute;n de hist&oacute;ricos, ¿Continuar?',
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
                                estatus: 6
                            })
                            .$promise
                            .then(function(respuesta) {

                                  vm.cursoSeleccionado.estatus = respuesta.estatus;

                                  CatalogoInstructores.ef_ter_anio({
                                    id_instructor: seleccion.idInstructor
                                  })
                                  .$promise
                                  .then(function(resp) {
                                        
                                        if(resp.length == 0)
                                          var valor = 0;
                                        else
                                          var valor = resp[0].eficiencia_terminal;
                                        
                                        CatalogoInstructores.prototype$updateAttributes(
                                        {
                                            id: seleccion.idInstructor
                                        },{
                                            efTerminal: valor
                                        })
                                        .$promise
                                        .then(function(resp) {
                                        });

                                  });


                                  ControlProcesos
                                  .create({
                                      proceso         : 'Cursos vigentes',
                                      accion          : 'CIERRE DE CURSO',
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
                                                title: 'Cambio de estatus registrado',
                                                html: 'se realiz&oacute; el cambio de estatus del curso a cerrado y se gener&oacute; el identificador de proceso <br><strong style="font-size: 13px;">' + resp_control.identificador + '</strong>',
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



            function asientaCalificaciones(seleccion) {

                    var modalInstance = $modal.open({
                        templateUrl: 'app/components/cursos_oficiales/resumen-cursos/modal-asienta-calificaciones.html',
                        windowClass: "animated fadeIn",
                        controller: 'ModalAsientaCalificacionesController as vm',
                        size: 'lg',
                        resolve: {
                          registroEditar: function () { return seleccion }
                        }
                    });

                    modalInstance.result.then(function (respuesta) {

                        angular.forEach(respuesta.inscripcionesCursos, function(registro) {

                              var index = vm.cursoSeleccionado.inscripcionesCursos.map(function(record) {
                                                                                    return record.id;
                                                                                  }).indexOf(registro.id);
                              vm.cursoSeleccionado.inscripcionesCursos[index].calificacion = registro.calificacion.value;
                              vm.cursoSeleccionado.inscripcionesCursos[index].numDocAcreditacion = registro.numDocAcreditacion;
                        });

                    }, function () {
                    });

            }


            function concluyeCurso(seleccion) {

                  swal({
                    title: "Confirmar",
                    html: 'El curso <strong>'+ seleccion.nombreCurso +'</strong> cambiar&aacute; su estatus a concluido, una vez realizado esto se podr&aacute; realizar el registro de calificaciones, ¿Continuar?',
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
                                estatus: 5
                            })
                            .$promise
                            .then(function(respuesta) {

                                  vm.cursoSeleccionado.estatus = respuesta.estatus;
                                  

                                  ProgTrimCursos.findById({ 
                                      id: vm.cursoSeleccionado.idPtc,
                                      filter: {
                                        fields : ['idPtc','horasAplicadas']
                                      }
                                  })
                                  .$promise
                                  .then(function(resp) {

                                       var horas_aplicadas = resp.horasAplicadas + vm.cursoSeleccionado.numeroHoras;

                                        ProgTrimCursos.prototype$updateAttributes(
                                        {
                                            id: vm.cursoSeleccionado.idPtc
                                        },{
                                            horasAplicadas: horas_aplicadas
                                        })
                                        .$promise
                                        .then(function(respuesta) {

                                              ProgTrimCursos.find({
                                                  filter: {
                                                      where: {
                                                        and: [
                                                            {idUnidadAdmtva: vm.cursoSeleccionado.idUnidadAdmtva},
                                                            {anio: vm.cursoSeleccionado.ptc_pertenece.anio}
                                                        ]
                                                      },
                                                      fields: ['idPtc','horasAplicadas']
                                                  }
                                              })
                                              .$promise
                                              .then(function(resp) {

                                                    var suma = 0;
                                                    angular.forEach(resp, function(resultado) {
                                                      suma += resultado.horasAplicadas;
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
                                                              horasAplicadas: suma
                                                          })
                                                          .$promise
                                                          .then(function(respuesta) {
                                                          })
                                                          .catch(function(error) {
                                                          });

                                                    });

                                              });

                                        })
                                        .catch(function(error) {
                                        });

                                  });


                                  ControlProcesos
                                  .create({
                                      proceso         : 'Cursos vigentes',
                                      accion          : 'CONCLUSION DE CURSO',
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
                                                title: 'Cambio de estatus registrado',
                                                html: 'se realiz&oacute; el cambio de estatus del curso a concluido y se gener&oacute; el identificador de proceso <br><strong style="font-size: 13px;">' + resp_control.identificador + '</strong>',
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


            function cancelaCurso(seleccion) {

                  swal({
                    title: "Confirmar",
                    html: 'El curso <strong>'+ seleccion.nombreCurso +'</strong> se marcar&aacute; como cancelado y se les avisar&aacute; a las personas inscritas de la cancelaci&oacute;n, una vez realizado este cambio el curso pasar&aacute; a la secci&oacute;n de hist&oacute;ricos, ¿Continuar?',
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
                                estatus: 7
                            })
                            .$promise
                            .then(function(respuesta) {

                                  vm.cursoSeleccionado.estatus = respuesta.estatus;

                                  ControlProcesos
                                  .create({
                                      proceso         : 'Cursos vigentes',
                                      accion          : 'CANCELACION DE CURSO',
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
                                                title: 'Cambio de estatus registrado',
                                                html: 'se realiz&oacute; el cambio de estatus del curso a cancelado y se gener&oacute; el identificador de proceso <br><strong style="font-size: 13px;">' + resp_control.identificador + '</strong>',
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


            function generaListados(seleccion) {

                  InscripcionCurso.find({
                        filter: {
                            fields:['idAlumno','pagado','fechaInscripcion','fechaPago','numFactura','calificacion','numDocAcreditacion'],
                            where: {
                              idCurso: seleccion.idCurso
                            },
                            include: [
                                  {
                                      relation: 'Capacitandos',
                                      scope: {
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
                                                    relation: 'actividades_desempena',
                                                    scope: {
                                                      fields: ['actividad']
                                                    }
                                                },
                                                {
                                                    relation: 'experiencia_laboral',
                                                    scope: {
                                                      fields: ['experiencia']
                                                    }
                                                },
                                                {
                                                    relation: 'medio_comunicacion',
                                                    scope: {
                                                      fields: ['medio']
                                                    }
                                                },
                                                {
                                                    relation: 'motivos_capacitarse',
                                                    scope: {
                                                      fields: ['motivo']
                                                    }
                                                },
                                                {
                                                    relation: 'nivel_estudios',
                                                    scope: {
                                                      fields: ['nivelEstudios']
                                                    }
                                                }
                                          ]
                                      }
                                  }
                            ]
                        }
                  }) 
                  .$promise
                  .then(function(listaInscripcion) {


                          var fecha_inicio_temp = new Date(seleccion.fechaInicio);
                          var fecha_fin_temp = new Date(seleccion.fechaFin);

                          var meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

                          var contenido = '    <table width="100%">'+
                                          '        <tbody>'+
                                          '            <tr>'+
                                          '                <td>Nombre del curso</td>'+
                                          '                <td>'+codifica_caracteres_html(seleccion.nombreCurso)+'</td>'+
                                          '            </tr>'+
                                          '            <tr>'+
                                          '                <td>Clave del curso</td>'+
                                          '                <td>'+seleccion.claveCurso+'</td>'+
                                          '            </tr>'+
                                          '            <tr>'+
                                          '                <td>Localidad impartici&oacute;n</td>'+
                                          '                <td>'+codifica_caracteres_html(seleccion.localidad_pertenece.nombre)+'</td>'+
                                          '            </tr>'+
                                          '            <tr>'+
                                          '                <td>Unidad de capacitaci&oacute;n</td>'+
                                          '                <td>'+codifica_caracteres_html(seleccion.unidad_pertenece.nombre)+'</td>'+
                                          '            </tr>'+
                                          '            <tr>'+
                                          '                <td>Fecha de inicio</td>'+
                                          '                <td>'+( fecha_inicio_temp.getDate() +' de '+ meses[fecha_inicio_temp.getMonth()] +' de '+ fecha_inicio_temp.getFullYear() )+'</td>'+
                                          '            </tr>'+
                                          '            <tr>'+
                                          '                <td>Fecha fin</td>'+
                                          '                <td>'+( fecha_fin_temp.getDate() +' de '+ meses[fecha_fin_temp.getMonth()] +' de '+ fecha_fin_temp.getFullYear() )+'</td>'+
                                          '            </tr>'+
                                          '            <tr>'+
                                          '                <td>Horario</td>'+
                                          '                <td>'+seleccion.horario+'</td>'+
                                          '            </tr>'+
                                          '            <tr>'+
                                          '                <td>N&uacute;mero de horas</td>'+
                                          '                <td>'+seleccion.numeroHoras+'</td>'+
                                          '            </tr>'+
                                          '            <tr>'+
                                          '                <td>Instructor</td>'+
                                          '                <td>'+codifica_caracteres_html(seleccion.nombreInstructor)+'</td>'+
                                          '            </tr>'+
                                          '            <tr>'+
                                          '                <td>Cupo m&aacute;ximo</td>'+
                                          '                <td>'+seleccion.cupoMaximo+'</td>'+
                                          '            </tr>'+
                                          '            <tr>'+
                                          '                <td>Inscritos</td>'+
                                          '                <td>'+seleccion.inscripcionesCursos.length+'</td>'+
                                          '            </tr>'+
                                          '        </tbody>'+
                                          '    </table><br>'+

                                          '    <table width="100%">'+
                                          '        <thead>'+
                                          '            <tr>'+
                                          '                <th>Fecha de inscripci&oacute;n</th>'+
                                          '                <th>Estatus pago</th>'+
                                          '                <th>Fecha de pago</th>'+
                                          '                <th>N&uacute;m. recibo</th>'+
                                          '                <th>Calificaci&oacute;n</th>'+
                                          '                <th>N&uacute;m. documento acreditaci&oacute;n</th>'+
                                          '                <th>N&uacute;m. control</th>'+
                                          '                <th>Apellido Paterno</th>'+
                                          '                <th>Apellido Materno</th>'+
                                          '                <th>Nombre(s)</th>'+
                                          '                <th>Sexo</th>'+
                                          '                <th>Email</th>'+
                                          '                <th>Edad</th>'+
                                          '                <th>Tel&eacute;fono</th>'+
                                          '                <th>Celular</th>'+
                                          '                <th>CURP</th>'+
                                          '                <th>Direcci&oacute;n</th>'+
                                          '                <th>Colonia</th>'+
                                          '                <th>C&oacute;digo postal</th>'+
                                          '                <th>Localidad</th>'+
                                          '                <th>Estudios</th>'+
                                          '                <th>Estado civil</th>'+
                                          '                <th>Discapacidad visual</th>'+
                                          '                <th>Discapacidad auditiva</th>'+
                                          '                <th>Discapacidad lenguaje</th>'+
                                          '                <th>Discapacidad motriz</th>'+
                                          '                <th>Discapacidad mental</th>'+
                                          '                <th>&iquest;Padece alguna enfermedad o alergia?</th>'+
                                          '                <th>&iquest;Cual?</th>'+
                                          '                <th>Nombre tutor</th>'+
                                          '                <th>CURP tutor</th>'+
                                          '                <th>Parentesco tutor</th>'+
                                          '                <th>Direcci&oacute;n tutor</th>'+
                                          '                <th>Tel&eacute;fono tutor</th>'+
                                          '                <th>Acta nacimiento</th>'+
                                          '                <th>Comprobante de estudios</th>'+
                                          '                <th>Identificaci&oacute;n oficial</th>'+
                                          '                <th>Constancia CURP</th>'+
                                          '                <th>Fotograf&iacute;as</th>'+
                                          '                <th>Comprobante migratorio</th>'+
                                          '                <th>Comprobante de domicilio</th>'+
                                          '                <th>CURP del tutor</th>'+
                                          '                <th>Actividad laboral</th>'+
                                          '                <th>Experiencia</th>'+
                                          '                <th>Empresa trabaja</th>'+
                                          '                <th>Empresa puesto</th>'+
                                          '                <th>Empresa antiguedad</th>'+
                                          '                <th>Empresa direcci&oacute;n</th>'+
                                          '                <th>Empresa tel&eacute;fono</th>'+
                                          '                <th>Motivos para capacitarse</th>'+
                                          '            </tr>'+
                                          '        </thead>'+
                                          '        <tbody>';

                                          angular.forEach(listaInscripcion, function(registro) {

                                                  var fechaInscripcion    = new Date(registro.fechaInscripcion);
                                                  var fechaPago           = new Date(registro.fechaPago);

                                                  var fechaInscripcionTXT = fechaInscripcion.getDate() +'/'+ meses[fechaInscripcion.getMonth()] +'-'+ fechaInscripcion.getFullYear();
                                                  var fechaPagoTXT        = fechaPago.getDate() +'/'+ meses[fechaPago.getMonth()] +'-'+ fechaPago.getFullYear();

                                                  if(registro.pagado == 0)
                                                    var pagadoTXT = 'No pagado';
                                                  else if(registro.pagado == 1)
                                                    var pagadoTXT = 'Pagado';
                                                  else if(registro.pagado == 2)
                                                    var pagadoTXT = 'Exento al 100%';
                                                  else if(registro.pagado == 3)
                                                    var pagadoTXT = 'Exento con porcentaje';

                                                 contenido += '<tr>'+
                                                              '    <td>'+fechaInscripcionTXT+'</td>'+
                                                              '    <td>'+pagadoTXT+'</td>'+
                                                              '    <td>'+fechaPagoTXT+'</td>'+
                                                              '    <td>'+(registro.numFactura                                                            == undefined ? ''     : registro.numFactura) +'</td>'+
                                                              '    <td>'+registro.calificacion+'</td>'+
                                                              '    <td>'+registro.numDocAcreditacion+'</td>'+
                                                              '    <td>'+registro.Capacitandos.numControl+'</td>'+
                                                              '    <td>'+codifica_caracteres_html((registro.Capacitandos.apellidoPaterno                 == undefined ? ''     : registro.Capacitandos.apellidoPaterno)) +'</td>'+
                                                              '    <td>'+codifica_caracteres_html((registro.Capacitandos.apellidoMaterno                 == undefined ? ''     : registro.Capacitandos.apellidoMaterno)) +'</td>'+
                                                              '    <td>'+codifica_caracteres_html((registro.Capacitandos.nombre                          == undefined ? ''     : registro.Capacitandos.nombre)) +'</td>'+
                                                              '    <td>'+(registro.Capacitandos.sexo                                                     == undefined ? ''     : (registro.Capacitandos.sexo == 'H' ? 'Hombre' : 'Mujer' ) ) +'</td>'+
                                                              '    <td>'+registro.Capacitandos.email+'</td>'+
                                                              '    <td>'+(registro.Capacitandos.edad                                                     == undefined ? ''     : registro.Capacitandos.edad) +'</td>'+
                                                              '    <td>'+(registro.Capacitandos.telefono                                                 == undefined ? ''     : registro.Capacitandos.telefono) +'</td>'+
                                                              '    <td>'+(registro.Capacitandos.celular                                                  == undefined ? ''     : registro.Capacitandos.celular) +'</td>'+
                                                              '    <td>'+(registro.Capacitandos.curp                                                     == undefined ? ''     : registro.Capacitandos.curp) +'</td>'+
                                                              '    <td>'+codifica_caracteres_html((registro.Capacitandos.domicilio                       == undefined ? ''     : registro.Capacitandos.domicilio)) +'</td>'+
                                                              '    <td>'+codifica_caracteres_html((registro.Capacitandos.colonia                         == undefined ? ''     : registro.Capacitandos.colonia)) +'</td>'+
                                                              '    <td>'+(registro.Capacitandos.codigoPostal                                             == undefined ? ''     : registro.Capacitandos.codigoPostal) +'</td>'+
                                                              '    <td>'+codifica_caracteres_html((registro.Capacitandos.localidad_pertenece             == undefined ? ''     : registro.Capacitandos.localidad_pertenece.nombre)) +'</td>'+
                                                              '    <td>'+codifica_caracteres_html((registro.Capacitandos.nivel_estudios                  == undefined ? ''     : registro.Capacitandos.nivel_estudios.nivelEstudios)) +'</td>'+
                                                              '    <td>'+(registro.Capacitandos.estadoCivil                                              == undefined ? ''     : registro.Capacitandos.estadoCivil) +'</td>'+

                                                              '    <td>'+(registro.Capacitandos.disVisual                                                == undefined ? ''     : (registro.Capacitandos.disVisual == true ? 'S&iacute;' : 'No' ) )+'</td>'+
                                                              '    <td>'+(registro.Capacitandos.disAuditiva                                              == undefined ? ''     : (registro.Capacitandos.disAuditiva == true ? 'S&iacute;' : 'No' ) )+'</td>'+
                                                              '    <td>'+(registro.Capacitandos.disLenguaje                                              == undefined ? ''     : (registro.Capacitandos.disLenguaje == true ? 'S&iacute;' : 'No' ) )+'</td>'+
                                                              '    <td>'+(registro.Capacitandos.disMotriz                                                == undefined ? ''     : (registro.Capacitandos.disMotriz == true ? 'S&iacute;' : 'No' ) )+'</td>'+
                                                              '    <td>'+(registro.Capacitandos.disMental                                                == undefined ? ''     : (registro.Capacitandos.disMental == true ? 'S&iacute;' : 'No' ) )+'</td>'+

                                                              '    <td>'+(registro.Capacitandos.enfermedadPadece                                         == undefined ? ''     : (registro.Capacitandos.enfermedadPadece == true ? 'S&iacute;' : 'No' ) )+'</td>'+
                                                              
                                                              '    <td>'+codifica_caracteres_html((registro.Capacitandos.enfermedadCual                  == undefined ? ''     : registro.Capacitandos.enfermedadCual))+'</td>'+
                                                              '    <td>'+codifica_caracteres_html((registro.Capacitandos.tutorNombre                     == undefined ? ''     : registro.Capacitandos.tutorNombre))+'</td>'+
                                                              '    <td>'+(registro.Capacitandos.tutorCurp                                                == undefined ? ''     : registro.Capacitandos.tutorCurp)+'</td>'+
                                                              '    <td>'+codifica_caracteres_html((registro.Capacitandos.tutorParentesco                 == undefined ? ''     : registro.Capacitandos.tutorParentesco))+'</td>'+
                                                              '    <td>'+codifica_caracteres_html((registro.Capacitandos.tutorDireccion                  == undefined ? ''     : registro.Capacitandos.tutorDireccion))+'</td>'+
                                                              '    <td>'+(registro.Capacitandos.tutorTelefono                                            == undefined ? ''     : registro.Capacitandos.tutorTelefono)+'</td>'+
                                                              '    <td>'+(registro.Capacitandos.docActaNacimiento                                        == undefined ? ''     : (registro.Capacitandos.docActaNacimiento == true ? 'S&iacute;' : 'No' ) )+'</td>'+
                                                              '    <td>'+(registro.Capacitandos.docCompEstudios                                          == undefined ? ''     : (registro.Capacitandos.docCompEstudios == true ? 'S&iacute;' : 'No' ) )+'</td>'+
                                                              '    <td>'+(registro.Capacitandos.docIdentOficial                                          == undefined ? ''     : (registro.Capacitandos.docIdentOficial == true ? 'S&iacute;' : 'No' ) )+'</td>'+
                                                              '    <td>'+(registro.Capacitandos.docConstCurp                                             == undefined ? ''     : (registro.Capacitandos.docConstCurp == true ? 'S&iacute;' : 'No' ) )+'</td>'+
                                                              '    <td>'+(registro.Capacitandos.docFotografias                                           == undefined ? ''     : (registro.Capacitandos.docFotografias == true ? 'S&iacute;' : 'No' ) )+'</td>'+
                                                              '    <td>'+(registro.Capacitandos.docCompMigratorio                                        == undefined ? ''     : (registro.Capacitandos.docCompMigratorio == true ? 'S&iacute;' : 'No' ) )+'</td>'+
                                                              '    <td>'+(registro.Capacitandos.docCompDomicilio                                         == undefined ? ''     : (registro.Capacitandos.docCompDomicilio == true ? 'S&iacute;' : 'No' ) )+'</td>'+
                                                              '    <td>'+(registro.Capacitandos.docCurpTutor                                             == undefined ? ''     : (registro.Capacitandos.docCurpTutor == true ? 'S&iacute;' : 'No' ) )+'</td>'+
                                                              '    <td>'+codifica_caracteres_html((registro.Capacitandos.actividades_desempena           == undefined ? ''     : registro.Capacitandos.actividades_desempena.actividad))+'</td>'+
                                                              '    <td>'+codifica_caracteres_html((registro.Capacitandos.experiencia_laboral             == undefined ? ''     : registro.Capacitandos.experiencia_laboral.experiencia))+'</td>'+
                                                              
                                                              '    <td>'+codifica_caracteres_html((registro.Capacitandos.empresaTrabaja                  == undefined ? ''     : registro.Capacitandos.empresaTrabaja))+'</td>'+
                                                              '    <td>'+codifica_caracteres_html((registro.Capacitandos.empresaPuesto                   == undefined ? ''     : registro.Capacitandos.empresaPuesto))+'</td>'+
                                                              '    <td>'+codifica_caracteres_html((registro.Capacitandos.empresaAntiguedad               == undefined ? ''     : registro.Capacitandos.empresaAntiguedad))+'</td>'+
                                                              '    <td>'+codifica_caracteres_html((registro.Capacitandos.empresaDireccion                == undefined ? ''     : registro.Capacitandos.empresaDireccion))+'</td>'+
                                                              '    <td>'+(registro.Capacitandos.empresaTelefono                                          == undefined ? ''     : registro.Capacitandos.empresaTelefono)+'</td>'+
                                                              '    <td>'+codifica_caracteres_html((registro.Capacitandos.motivos_capacitarse             == undefined ? ''     : registro.Capacitandos.motivos_capacitarse.motivo))+'</td>'+
                                                              ' </tr>';
                                          });

                              contenido +='        </tbody>'+
                                          '    </table>';

                              var blob = new Blob([contenido], {
                                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=ISO-8859-1"
                                });
                                saveAs(blob, "lista_capacitandos_curso_exportado.xls");
                  });
            }



            function codifica_caracteres_html(tx)
            {
                  var rp = String(tx);
                  //
                  rp = rp.replace(/á/g, '&aacute;');
                  rp = rp.replace(/é/g, '&eacute;');
                  rp = rp.replace(/í/g, '&iacute;');
                  rp = rp.replace(/ó/g, '&oacute;');
                  rp = rp.replace(/ú/g, '&uacute;');
                  rp = rp.replace(/ñ/g, '&ntilde;');
                  rp = rp.replace(/ü/g, '&uuml;');
                  //
                  rp = rp.replace(/Á/g, '&Aacute;');
                  rp = rp.replace(/É/g, '&Eacute;');
                  rp = rp.replace(/Í/g, '&Iacute;');
                  rp = rp.replace(/Ó/g, '&Oacute;');
                  rp = rp.replace(/Ú/g, '&Uacute;');
                  rp = rp.replace(/Ñ/g, '&Ntilde;');
                  rp = rp.replace(/Ü/g, '&Uuml;');
                  //
                  return rp;
            }



            function formateaListado() {
                  
                  var hoy = new Date();
                  hoy.setHours(0);
                  hoy.setMinutes(0);
                  hoy.setSeconds(0);
                  hoy.setMilliseconds(0);

                  for(var i=0; i < vm.listaCursos.length; i++)
                  {
                      if(vm.listaCursos[i].estatus == 6 || vm.listaCursos[i].estatus == 7)
                      {
                            vm.listaCursos[i].diasDif = 0;
                            vm.listaCursos[i].diasTermine = 0;
                      }
                      else
                      {
                            var fecha_inicio = new Date(vm.listaCursos[i].fechaInicio);

                            fecha_inicio.setHours(0);
                            fecha_inicio.setMinutes(0);
                            fecha_inicio.setSeconds(0);
                            fecha_inicio.setMilliseconds(0);

                            var dif = fecha_inicio - hoy;
                            var num_dias_falta = Math.floor(dif / (1000 * 60 * 60 * 24)); 

                            vm.listaCursos[i].diasDif = num_dias_falta;

                            var fecha_fin = new Date(vm.listaCursos[i].fechaFin);

                            fecha_fin.setHours(0);
                            fecha_fin.setMinutes(0);
                            fecha_fin.setSeconds(0);
                            fecha_fin.setMilliseconds(0);

                            dif = fecha_fin - hoy;
                            num_dias_falta = Math.floor(dif / (1000 * 60 * 60 * 24)); 

                            vm.listaCursos[i].diasTermine = num_dias_falta;
                      }
                  }
            }


    };

})();