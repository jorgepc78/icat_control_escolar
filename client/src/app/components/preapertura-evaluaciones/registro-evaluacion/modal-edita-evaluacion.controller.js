(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ModalEditaEvaluacionController', ModalEditaEvaluacionController);

        ModalEditaEvaluacionController.$inject = ['$scope', '$timeout', '$modalInstance', 'tablaDatosService', 'registroEditar', 'CatalogoCursos', 'CatalogoEstandares', 'CatalogoInstructores', 'Evaluacion', 'Capacitandos'];

    function ModalEditaEvaluacionController($scope, $timeout, $modalInstance, tablaDatosService, registroEditar, CatalogoCursos, CatalogoEstandares, CatalogoInstructores, Evaluacion, Capacitandos) {

            var vm = this;

            vm.sort_by = sort_by;
            vm.openCalendar1 = openCalendar1;

            vm.muestraEvaluadoresCurso    = muestraEvaluadoresCurso;

            vm.cambiaModalidad            = cambiaModalidad;
            vm.muestraResultadosBusqueda  = muestraResultadosBusqueda;
            vm.limpiaBusqueda             = limpiaBusqueda;
            vm.seleccionaAlumno           = seleccionaAlumno;
            vm.eliminaAlumno              = eliminaAlumno;
            vm.cambiarPagina              = cambiarPagina;
            vm.guardar = guardar;

            vm.mostrarbtnLimpiar = false;
            vm.cadena_buscar = '';

            vm.listaCapacitandos = [];
            vm.personaSeleccionada = {};

            vm.tablalListaCapacitados = {
              totalElementos     : 0,
              paginaActual       : 1,
              registrosPorPagina : 5,
              inicio             : -1,
              fin                : 0,
              condicion          : {},
              filtro_datos       : {},
              fila_seleccionada  : undefined
            };


            vm.mostrarSpiner = false;
            vm.EdicionCurso = true;
            vm.mostrar_msg_error = false;
            vm.mensaje = '';

            vm.listaCursos = [];
            vm.cursoSeleccionado = {};

            vm.listaEstandares = [];
            vm.estandarSeleccionado = {};

            vm.listaInstructores = [];
            vm.instructorSeleccionado = {};


            vm.registroEdicion = {
                    idEvaluacion            : registroEditar.record.idEvaluacion,
                    tipoEvaluacion          : registroEditar.record.tipoEvaluacion.toString(),
                    idPtc                   : registroEditar.record.idPtc,
                    idCatalogoCurso         : registroEditar.record.idCatalogoCurso,
                    nombreCurso             : registroEditar.record.nombreCurso,
                    claveCurso              : registroEditar.record.claveCurso,
                    idEstandar              : registroEditar.record.idEstandar,
                    codigoEstandar          : registroEditar.record.codigoEstandar,
                    nombreEstandar          : registroEditar.record.nombreEstandar,
                    aulaAsignada            : registroEditar.record.aulaAsignada,
                    costo                   : registroEditar.record.costo,
                    fechaEvaluacion         : registroEditar.record.fechaEvaluacion,
                    horaEvaluacion          : registroEditar.record.horaEvaluacion,
                    idInstructor            : registroEditar.record.idInstructor,
                    nombre_completo         : registroEditar.record.nombreInstructor,
                    curp                    : registroEditar.record.curpInstructor,
                    cantidadPagoEvaluador   : registroEditar.record.cantidadPagoEvaluador,
                    nomenclaturaContrato    : registroEditar.record.nomenclaturaContrato,
                    observaciones           : registroEditar.record.observaciones,
                    idAlumno                : registroEditar.record.alumnos_inscritos[0].idAlumno,
                    nombreCompleto          : registroEditar.record.alumnos_inscritos[0].nombreCompleto
            };


            inicia();

            function inicia() {

                vm.tablalListaCapacitados.filtro_datos = {
                      filter: {
                          where: vm.tablalListaCapacitados.condicion,
                          fields: ['idAlumno', 'numControl', 'nombreCompleto','idUnidadAdmtva'],
                          order: ['nombreCompleto ASC','idAlumno ASC'],
                          limit: vm.tablalListaCapacitados.registrosPorPagina,
                          skip: vm.tablalListaCapacitados.paginaActual - 1,
                          include: [
                              {
                                  relation: 'unidad_pertenece',
                                  scope: {
                                    fields: ['nombre']
                                  }
                              }
                          ]
                      }
                };

                if(vm.registroEdicion.tipoEvaluacion == 1)
                {
                    CatalogoCursos.find({
                        filter: {
                            where: {activo: true},
                            fields: ['idCatalogoCurso','idEspecialidad','nombreCurso','claveCurso'],
                            order: 'nombreCurso ASC',
                            include: [
                                {
                                    relation: 'especialidad',
                                    scope: {
                                        fields:['nombre']
                                    }
                                }
                            ]
                        }
                    })
                    .$promise
                    .then(function(resp) {
                        vm.listaCursos = resp;

                        var index = vm.listaCursos.map(function(record) {
                                                            return record.idCatalogoCurso;
                                                          }).indexOf(vm.registroEdicion.idCatalogoCurso);
                        vm.cursoSeleccionado.selected = vm.listaCursos[index];


                        CatalogoCursos.evaluadores_habilitados({
                                id: vm.cursoSeleccionado.selected.idCatalogoCurso,
                                filter: {
                                    fields: ['idInstructor','nombre_completo','curp','idUnidadAdmtva'],
                                    include: [
                                        {
                                            relation: 'otras_unidades',
                                            scope: {
                                                where: {idUnidadAdmtva: $scope.currentUser.unidad_pertenece_id},
                                                fields:['idUnidadAdmtva']
                                            }
                                        }
                                    ]
                                }
                        })
                        .$promise
                        .then(function(resp) {
                            var index;
                            angular.forEach(resp, function(record) {

                                    index = record.otras_unidades.map(function(unidad) {
                                                                        return unidad.idUnidadAdmtva;
                                                                      }).indexOf($scope.currentUser.unidad_pertenece_id);
                                    if(index >= 0)
                                    {
                                        vm.listaInstructores.push({
                                            idInstructor    : record.idInstructor,
                                            nombre_completo : record.nombre_completo,
                                            curp            : record.curp
                                        });
                                    }
                            });
                            vm.listaInstructores.sort(sort_by('nombre_completo', false, function(a){return a.toUpperCase()}));

                            index = vm.listaInstructores.map(function(record) {
                                                                return record.idInstructor;
                                                              }).indexOf(vm.registroEdicion.idInstructor);
                            vm.instructorSeleccionado = vm.listaInstructores[index];

                        });

                    });
                }
                else
                {
                    CatalogoEstandares.find({
                        filter: {
                            order: 'nombre ASC'
                        }
                    })
                    .$promise
                    .then(function(resp) {
                        vm.listaEstandares = resp;

                        var index = vm.listaEstandares.map(function(record) {
                                                            return record.idEstandar;
                                                          }).indexOf(vm.registroEdicion.idEstandar);
                        vm.estandarSeleccionado = vm.listaEstandares[index];

                        CatalogoEstandares.evaluadores_habilitados({
                                id: vm.estandarSeleccionado.idEstandar,
                                filter: {
                                    fields: ['idInstructor','nombre_completo','curp','idUnidadAdmtva'],
                                    include: [
                                        {
                                            relation: 'otras_unidades',
                                            scope: {
                                                where: {idUnidadAdmtva: $scope.currentUser.unidad_pertenece_id},
                                                fields:['idUnidadAdmtva']
                                            }
                                        }
                                    ]
                                }
                        })
                        .$promise
                        .then(function(resp) {
                            var index;
                            angular.forEach(resp, function(record) {

                                    index = record.otras_unidades.map(function(unidad) {
                                                                        return unidad.idUnidadAdmtva;
                                                                      }).indexOf($scope.currentUser.unidad_pertenece_id);
                                    if(index >= 0)
                                    {
                                        vm.listaInstructores.push({
                                            idInstructor    : record.idInstructor,
                                            nombre_completo : record.nombre_completo,
                                            curp            : record.curp
                                        });
                                    }
                            });
                            vm.listaInstructores.sort(sort_by('nombre_completo', false, function(a){return a.toUpperCase()}));

                            index = vm.listaInstructores.map(function(record) {
                                                                return record.idInstructor;
                                                              }).indexOf(vm.registroEdicion.idInstructor);
                            vm.instructorSeleccionado = vm.listaInstructores[index];

                        });

                    });
                }

            };


            function cambiaModalidad() {
                vm.listaCursos = [];
                vm.cursoSeleccionado = {};
                vm.registroEdicion.idCatalogoCurso = 0;
                vm.registroEdicion.nombreCurso = '';
                vm.registroEdicion.claveCurso = '';

                vm.listaEstandares = [];
                vm.estandarSeleccionado = {};
                vm.registroEdicion.idEstandar = 0;
                vm.registroEdicion.codigoEstandar = '';
                vm.registroEdicion.nombreEstandar = '';

                vm.instructorSeleccionado = {};
                vm.listaInstructores = [];

                if(vm.registroEdicion.tipoEvaluacion == 1)
                {
                    CatalogoCursos.find({
                        filter: {
                            where: {activo: true},
                            fields: ['idCatalogoCurso','idEspecialidad','nombreCurso','claveCurso'],
                            order: 'nombreCurso ASC',
                            include: [
                                {
                                    relation: 'especialidad',
                                    scope: {
                                        fields:['nombre']
                                    }
                                }
                            ]
                        }
                    })
                    .$promise
                    .then(function(resp) {
                        vm.listaCursos = resp;
                    });
                }
                else
                {
                    CatalogoEstandares.find({
                        filter: {
                            order: 'nombre ASC'
                        }
                    })
                    .$promise
                    .then(function(resp) {
                        vm.listaEstandares = resp;
                    });
                }
            }


            function muestraEvaluadoresCurso(){

                if(vm.registroEdicion.tipoEvaluacion == 1)
                {
                      vm.registroEdicion.idCatalogoCurso = vm.cursoSeleccionado.selected.idCatalogoCurso;
                      vm.registroEdicion.nombreCurso = vm.cursoSeleccionado.selected.nombreCurso;
                      vm.registroEdicion.claveCurso = vm.cursoSeleccionado.selected.claveCurso;

                      vm.listaInstructores = [];
                      vm.instructorSeleccionado = {};
                      CatalogoCursos.evaluadores_habilitados({
                              id: vm.cursoSeleccionado.selected.idCatalogoCurso,
                              filter: {
                                  fields: ['idInstructor','nombre_completo','curp','idUnidadAdmtva'],
                                  include: [
                                      {
                                          relation: 'otras_unidades',
                                          scope: {
                                              where: {idUnidadAdmtva: $scope.currentUser.unidad_pertenece_id},
                                              fields:['idUnidadAdmtva']
                                          }
                                      }
                                  ]
                              }
                      })
                      .$promise
                      .then(function(resp) {
                          var index;
                          angular.forEach(resp, function(record) {

                                  index = record.otras_unidades.map(function(unidad) {
                                                                      return unidad.idUnidadAdmtva;
                                                                    }).indexOf($scope.currentUser.unidad_pertenece_id);
                                  if(index >= 0)
                                  {
                                      vm.listaInstructores.push({
                                          idInstructor    : record.idInstructor,
                                          nombre_completo : record.nombre_completo,
                                          curp            : record.curp
                                      });
                                  }
                          });
                          vm.listaInstructores.sort(sort_by('nombre_completo', false, function(a){return a.toUpperCase()}));
                      });
                }
                else
                {
                      vm.registroEdicion.idEstandar = vm.estandarSeleccionado.idEstandar;
                      vm.registroEdicion.nombreEstandar = vm.estandarSeleccionado.nombre;
                      vm.registroEdicion.codigoEstandar = vm.estandarSeleccionado.codigo;

                      vm.listaInstructores = [];
                      vm.instructorSeleccionado = {};
                      CatalogoEstandares.evaluadores_habilitados({
                              id: vm.estandarSeleccionado.idEstandar,
                              filter: {
                                  fields: ['idInstructor','nombre_completo','curp','idUnidadAdmtva'],
                                  include: [
                                      {
                                          relation: 'otras_unidades',
                                          scope: {
                                              where: {idUnidadAdmtva: $scope.currentUser.unidad_pertenece_id},
                                              fields:['idUnidadAdmtva']
                                          }
                                      }
                                  ]
                              }
                      })
                      .$promise
                      .then(function(resp) {
                          var index;
                          angular.forEach(resp, function(record) {

                                  index = record.otras_unidades.map(function(unidad) {
                                                                      return unidad.idUnidadAdmtva;
                                                                    }).indexOf($scope.currentUser.unidad_pertenece_id);
                                  if(index >= 0)
                                  {
                                      vm.listaInstructores.push({
                                          idInstructor    : record.idInstructor,
                                          nombre_completo : record.nombre_completo,
                                          curp            : record.curp
                                      });
                                  }
                          });
                          vm.listaInstructores.sort(sort_by('nombre_completo', false, function(a){return a.toUpperCase()}));
                      });
                }

            }



            function muestraResultadosBusqueda() {

                  vm.listaCapacitandos = {};
                  vm.personaSeleccionada = {};
                  vm.tablalListaCapacitados.fila_seleccionada = undefined;
                  vm.tablalListaCapacitados.paginaActual = 1;
                  vm.tablalListaCapacitados.inicio = 0;
                  vm.tablalListaCapacitados.fin = 1;
                  vm.mostrarbtnLimpiar = true;

                  vm.tablalListaCapacitados.condicion = {nombreCompleto: {regexp: '/.*'+ vm.cadena_buscar +'.*/i'}};

                  tablaDatosService.obtiene_datos_tabla(Capacitandos, vm.tablalListaCapacitados)
                  .then(function(respuesta) {

                        vm.tablalListaCapacitados.totalElementos = respuesta.total_registros;
                        vm.tablalListaCapacitados.inicio = respuesta.inicio;
                        vm.tablalListaCapacitados.fin = respuesta.fin;

                        if(vm.tablalListaCapacitados.totalElementos > 0)
                        {
                            vm.listaCapacitandos = respuesta.datos;
                        }
                  });

            };


            function limpiaBusqueda() {

                  vm.mostrarbtnLimpiar = false;
                  vm.cadena_buscar = '';
                  vm.listaCapacitandos = {};
                  vm.personaSeleccionada = {};
                  vm.tablalListaCapacitados.paginaActual = 1;
                  vm.tablalListaCapacitados.inicio = -1;
                  vm.tablalListaCapacitados.fin = 0;
                  vm.tablalListaCapacitados.totalElementos = 0;
                  vm.tablalListaCapacitados.condicion = {};
            };


            function seleccionaAlumno(seleccion) {
                  var index = vm.listaCapacitandos.indexOf(seleccion);
                  vm.personaSeleccionada = seleccion;
                  vm.tablalListaCapacitados.fila_seleccionada = index;
                  vm.registroEdicion.nombreCompleto = vm.personaSeleccionada.nombreCompleto;
                  vm.registroEdicion.idAlumno = vm.personaSeleccionada.idAlumno;              
            };


            function eliminaAlumno() {
                  vm.personaSeleccionada = {};
                  vm.tablalListaCapacitados.fila_seleccionada = undefined;
                  vm.registroEdicion.nombreCompleto = '';
                  vm.registroEdicion.idAlumno = 0;
            };


            function cambiarPagina() {

                  if(vm.tablalListaCapacitados.totalElementos > 0)
                  {
                        tablaDatosService.cambia_pagina(Capacitandos, vm.tablalListaCapacitados)
                        .then(function(respuesta) {

                            vm.tablalListaCapacitados.inicio = respuesta.inicio;
                            vm.tablalListaCapacitados.fin = respuesta.fin;
                            vm.listaCapacitandos = respuesta.datos;
                            vm.tablalListaCapacitados.fila_seleccionada = undefined;
                        });
                  }
            }



            function sort_by(field, reverse, primer) {
                var key = primer ? 
                   function(x) {return primer(x[field])} : 
                   function(x) {return x[field]};

                reverse = !reverse ? 1 : -1;

                return function (a, b) {
                   return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
                }                 
            }


            function openCalendar1($event) {
                $event.preventDefault();
                $event.stopPropagation();
                vm.opened1 = true;
            };


            function guardar() {

                vm.mostrarSpiner = true;

                if(vm.registroEdicion.idAlumno == 0)
                {
                        vm.mostrarSpiner = false;
                        vm.mensaje = 'Falta seleccionar el capacitando que tomará la evaluación';
                        vm.mostrar_msg_error = true;
                        $timeout(function(){
                             vm.mensaje = '';
                             vm.mostrar_msg_error = false;
                        }, 6000);
                        return;
                }
                else
                {

                        Evaluacion.inscripcionesEvaluaciones.destroyAll({
                            id: vm.registroEdicion.idEvaluacion 
                        })
                        .$promise
                        .then(function() {

                                Evaluacion
                                .prototype$updateAttributes({
                                    id: vm.registroEdicion.idEvaluacion
                                },{
                                    tipoEvaluacion        : vm.registroEdicion.tipoEvaluacion,
                                    idUnidadAdmtva        : $scope.currentUser.unidad_pertenece_id,
                                    idPtc                 : vm.registroEdicion.idPtc,
                                    idCatalogoCurso       : vm.registroEdicion.idCatalogoCurso,
                                    nombreCurso           : vm.registroEdicion.nombreCurso,
                                    claveCurso            : vm.registroEdicion.claveCurso,
                                    idEstandar            : vm.registroEdicion.idEstandar,
                                    codigoEstandar        : vm.registroEdicion.codigoEstandar,
                                    nombreEstandar        : vm.registroEdicion.nombreEstandar,
                                    aulaAsignada          : vm.registroEdicion.aulaAsignada,
                                    costo                 : vm.registroEdicion.costo,
                                    fechaEvaluacion       : vm.registroEdicion.fechaEvaluacion,
                                    horaEvaluacion        : vm.registroEdicion.horaEvaluacion,
                                    idInstructor          : vm.instructorSeleccionado.idInstructor,
                                    curpInstructor        : vm.instructorSeleccionado.curp,
                                    nombreInstructor      : vm.instructorSeleccionado.nombre_completo,

                                    cantidadPagoEvaluador : vm.registroEdicion.cantidadPagoEvaluador,
                                    nomenclaturaContrato  : vm.registroEdicion.nomenclaturaContrato,

                                    observaciones         : vm.registroEdicion.observaciones,
                                    estatus               : 0
                                })
                                .$promise
                                .then(function(respuesta) {

                                        Evaluacion.inscripcionesEvaluaciones.create(
                                        {
                                            id: vm.registroEdicion.idEvaluacion
                                        },{
                                            idAlumno: vm.registroEdicion.idAlumno
                                        }) 
                                        .$promise
                                        .then(function(resp) {

                                                vm.registroEdicion.idInstructor     = vm.instructorSeleccionado.idInstructor;
                                                vm.registroEdicion.nombreInstructor = vm.instructorSeleccionado.nombre_completo;
                                                vm.registroEdicion.estatus          = 0;
                                                $modalInstance.close(vm.registroEdicion);
                                        });

                                })
                                .catch(function(error) {
                                });
                        })
                        .catch(function(error) {
                        });
                }

            };
    };

})();