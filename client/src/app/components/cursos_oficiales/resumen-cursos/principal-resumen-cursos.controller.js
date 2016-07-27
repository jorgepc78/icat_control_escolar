(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ResumenCursosController', ResumenCursosController);

    ResumenCursosController.$inject = ['$scope', '$stateParams', '$modal', 'tablaDatosService', 'CatalogoUnidadesAdmtvas', 'CursosOficiales', 'ControlProcesos'];

    function ResumenCursosController($scope, $stateParams, $modal, tablaDatosService, CatalogoUnidadesAdmtvas, CursosOficiales, ControlProcesos ) {

            var vm = this;

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

            vm.muestra_cursos_unidad      = muestra_cursos_unidad;
            vm.muestra_estatus_curso      = muestra_estatus_curso;

            vm.muestraResultadosBusqueda  = muestraResultadosBusqueda;
            vm.limpiaBusqueda             = limpiaBusqueda;

            vm.muestraDatosRegistroActual = muestraDatosRegistroActual;
            vm.cambiarPagina              = cambiarPagina;

            vm.reprogramaCurso            = reprogramaCurso;
            vm.concluyeCurso              = concluyeCurso;
            vm.cierraCurso                = cierraCurso;
            vm.asientaCalificaciones      = asientaCalificaciones;

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
                              order: ['nombreCurso ASC'],
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
                                      relation: 'inscripcionesCursos',
                                      scope: {
                                          fields:['id','pagado','idAlumno','calificacion','numDocAcreditacion'],
                                          include:{
                                              relation: 'Capacitandos',
                                              scope: {
                                                  fields:['apellidoPaterno','apellidoMaterno','nombre','curp'],
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
                    }, function () {
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


            function formateaListado() {
                  
                  var hoy = new Date();
                  hoy.setHours(0);
                  hoy.setMinutes(0);
                  hoy.setSeconds(0);
                  hoy.setMilliseconds(0);

                  for(var i=0; i < vm.listaCursos.length; i++)
                  {
                      var fecha_inicio = new Date(vm.listaCursos[i].fechaInicio);

                      fecha_inicio.setHours(0);
                      fecha_inicio.setMinutes(0);
                      fecha_inicio.setSeconds(0);
                      fecha_inicio.setMilliseconds(0);

                      var dif = fecha_inicio - hoy;
                      var num_dias_falta = Math.floor(dif / (1000 * 60 * 60 * 24)); 

                      vm.listaCursos[i].diasDif = num_dias_falta;
                  }
            }


    };

})();