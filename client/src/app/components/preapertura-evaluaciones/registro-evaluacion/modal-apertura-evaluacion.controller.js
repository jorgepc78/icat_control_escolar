(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ModalAperturaEvaluacionController', ModalAperturaEvaluacionController);

        ModalAperturaEvaluacionController.$inject = ['$scope', '$timeout', '$modalInstance', 'tablaDatosService', 'registroEditar', 'CatalogoCursos', 'CatalogoInstructores', 'Evaluacion', 'Capacitandos'];

    function ModalAperturaEvaluacionController($scope, $timeout, $modalInstance, tablaDatosService, registroEditar, CatalogoCursos, CatalogoInstructores, Evaluacion, Capacitandos) {

            var vm = this;

            vm.sort_by = sort_by;
            vm.openCalendar1 = openCalendar1;

            vm.muestraResultadosBusqueda  = muestraResultadosBusqueda;
            vm.limpiaBusqueda             = limpiaBusqueda;
            vm.seleccionaAlumno           = seleccionaAlumno;
            vm.eliminaAlumno              = eliminaAlumno;
            vm.cambiarPagina              = cambiarPagina;

            vm.muestraInstructoresCurso = muestraInstructoresCurso;
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
            vm.EdicionCurso = false;
            vm.mostrar_msg_error = false;
            vm.mensaje = '';

            vm.listaCursos = {};
            vm.cursoSeleccionado = {};

            vm.instructorSeleccionado = "";
            vm.listaInstructores = [];
           
            vm.registroEdicion = {
                    idEvaluacion            : 0,
                    idPtc                   : registroEditar.record.idPtc,
                    idCatalogoCurso         : 0,
                    nombreCurso             : '',
                    modalidad               : '',
                    claveCurso              : '',
                    descripcion             : '',
                    horaEvaluacion          : '',
                    costo                   : 0,
                    fechaEvaluacion         : '',
                    aulaAsignada            : '',
                    idInstructor            : '',
                    nombreInstructor        : '',
                    observaciones           : '',
                    idAlumno                : 0,
                    nombreCompleto          : ''
            };


            inicia();

            function inicia() {

                CatalogoCursos.find({
                    filter: {
                        where: {or:[
                            {modalidad: 'Estandar competencia'},
                            {modalidad: 'ROCO'}
                        ]},
                        fields: ['idCatalogoCurso','nombreCurso','modalidad','claveCurso','descripcion','numeroHoras'],
                        order: 'nombreCurso ASC'
                    }
                })
                .$promise
                .then(function(resp) {
                    vm.listaCursos = resp;
                });

    
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


            };



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



            function muestraInstructoresCurso(){

                vm.registroEdicion.idCatalogoCurso = vm.cursoSeleccionado.idCatalogoCurso;
                vm.registroEdicion.nombreCurso = vm.cursoSeleccionado.nombreCurso;
                vm.registroEdicion.claveCurso = vm.cursoSeleccionado.claveCurso;
                vm.registroEdicion.modalidad = vm.cursoSeleccionado.modalidad;
                vm.registroEdicion.descripcion = vm.cursoSeleccionado.descripcion;

                vm.listaInstructores = [];
                vm.instructorSeleccionado = "";
                CatalogoCursos.instructores_habilitados({
                        id: vm.cursoSeleccionado.idCatalogoCurso,
                        filter: {
                            //where: {idUnidadAdmtva: $scope.currentUser.unidad_pertenece_id},
                            fields: ['idInstructor','apellidoPaterno','apellidoMaterno','nombre','curp','efTerminal'],
                            include: [
                                {
                                    relation: 'evaluacion_curso',
                                    scope: {
                                        where: {idCatalogoCurso: vm.registroEdicion.idCatalogoCurso},
                                        fields:['calificacion']
                                    }
                                },
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
                                    apellidoPaterno : record.apellidoPaterno,
                                    apellidoMaterno : record.apellidoMaterno,
                                    nombre          : record.nombre,
                                    curp            : record.curp,
                                    nombre_completo : record.apellidoPaterno + ' ' + record.apellidoMaterno + ' ' + record.nombre,
                                    calificacion    : record.evaluacion_curso[0].calificacion,
                                    efTerminal      : record.efTerminal
                                });
                            }

                    });


                    vm.listaInstructores.sort(sort_by('nombre_completo', false, function(a){return a.toUpperCase()}));

                });

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

                        Evaluacion
                        .create({
                            idUnidadAdmtva        : $scope.currentUser.unidad_pertenece_id,
                            idPtc                 : vm.registroEdicion.idPtc,
                            idCatalogoCurso       : vm.registroEdicion.idCatalogoCurso,
                            nombreCurso           : vm.registroEdicion.nombreCurso,
                            claveCurso            : vm.registroEdicion.claveCurso,
                            descripcionCurso      : vm.registroEdicion.descripcion,
                            modalidad             : vm.registroEdicion.modalidad,
                            horaEvaluacion        : vm.registroEdicion.horaEvaluacion,
                            costo                 : vm.registroEdicion.costo,
                            fechaEvaluacion       : vm.registroEdicion.fechaEvaluacion,
                            aulaAsignada          : vm.registroEdicion.aulaAsignada,

                            idInstructor          : vm.instructorSeleccionado.idInstructor,
                            curpInstructor        : vm.instructorSeleccionado.curp,
                            nombreInstructor      : vm.instructorSeleccionado.nombre_completo,

                            observaciones         : vm.registroEdicion.observaciones,
                            estatus               : 0
                        })
                        .$promise
                        .then(function(respuesta) {


                                Evaluacion.inscripcionesEvaluaciones.create(
                                {
                                    id: respuesta.idEvaluacion
                                },{
                                    idAlumno: vm.registroEdicion.idAlumno
                                }) 
                                .$promise
                                .then(function(resp) {

                                    $modalInstance.close(vm.registroEdicion);
                                });
                        })
                        .catch(function(error) {
                        });
                }
            };
    };

})();