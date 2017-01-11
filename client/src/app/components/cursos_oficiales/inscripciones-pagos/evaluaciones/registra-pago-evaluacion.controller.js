(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('RegistroPagoEvaluacionController', RegistroPagoEvaluacionController);

    RegistroPagoEvaluacionController.$inject = ['$scope', '$stateParams', '$modal', 'tablaDatosService', 'CatalogoUnidadesAdmtvas', 'Evaluacion', 'ControlProcesos'];

    function RegistroPagoEvaluacionController($scope, $stateParams, $modal, tablaDatosService, CatalogoUnidadesAdmtvas, Evaluacion, ControlProcesos ) {

            var vm = this;

            vm.muestraResultadosBusqueda  = muestraResultadosBusqueda;
            vm.limpiaBusqueda             = limpiaBusqueda;

            vm.muestraDatosRegistroActual = muestraDatosRegistroActual;
            vm.cambiarPagina              = cambiarPagina;
            vm.registraPagoEval           = registraPagoEval;
            vm.generaFormato              = generaFormato;
            vm.editaNumFactura            = editaNumFactura;

            vm.mostrarbtnLimpiar = false;
            vm.cadena_buscar = '';

            vm.tablaListaEvaluaciones = {
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

                  vm.tablaListaEvaluaciones.condicion = {
                      and: [
                        {estatus: 0},
                        {idUnidadAdmtva: $scope.currentUser.unidad_pertenece_id}
                      ]
                  };
                  

                  vm.tablaListaEvaluaciones.filtro_datos = {
                          filter: {
                              where: vm.tablaListaEvaluaciones.condicion,
                              order: ['fechaEvaluacion DESC','nombreCurso ASC'],
                              limit: vm.tablaListaEvaluaciones.registrosPorPagina,
                              skip: vm.tablaListaEvaluaciones.paginaActual - 1,
                              include: [
                                  {
                                      relation: 'inscripcionesEvaluaciones',
                                      scope: {
                                        fields: ['id', 'idAlumno', 'pagado', 'fechaPago','numFactura','calificacion','numDocAcreditacion'],
                                        include:{
                                            relation: 'Capacitandos',
                                            scope: {
                                                fields:['numControl','nombreCompleto']
                                            }
                                        }
                                      }
                                  }
                              ]
                          }
                  };

                  vm.client = 1;
                  vm.tablaListaEvaluaciones.paginaActual = 1;
                  vm.tablaListaEvaluaciones.inicio = 0;
                  vm.tablaListaEvaluaciones.fin = 1;

                  vm.listaCursos = {};
                  tablaDatosService.obtiene_datos_tabla(Evaluacion, vm.tablaListaEvaluaciones)
                  .then(function(respuesta) {

                        vm.tablaListaEvaluaciones.totalElementos = respuesta.total_registros;
                        vm.tablaListaEvaluaciones.inicio = respuesta.inicio;
                        vm.tablaListaEvaluaciones.fin = respuesta.fin;

                        if(vm.tablaListaEvaluaciones.totalElementos > 0)
                        {
                            vm.listaCursos = respuesta.datos;
                            formateaListado();
                            vm.cursoSeleccionado = vm.listaCursos[0];
                            vm.client = 2;
                            vm.tablaListaEvaluaciones.fila_seleccionada = 0;
                            muestraDatosRegistroActual(vm.cursoSeleccionado);
                        }
                  });

            }




            function muestraResultadosBusqueda() {

                  vm.client = 1;
                  vm.listaCursos = {};
                  vm.cursoSeleccionado = {};
                  vm.tablaListaEvaluaciones.fila_seleccionada = undefined;
                  vm.tablaListaEvaluaciones.paginaActual = 1;
                  vm.tablaListaEvaluaciones.inicio = 0;
                  vm.tablaListaEvaluaciones.fin = 1;

                  var condicion_busqueda = {
                                    nombreCurso: {regexp: '/.*'+ vm.cadena_buscar +'.*/i'}
                                };

                  vm.tablaListaEvaluaciones.condicion = {
                      and: [
                        {idUnidadAdmtva: $scope.currentUser.unidad_pertenece_id},
                        condicion_busqueda
                      ]
                  };

                  tablaDatosService.obtiene_datos_tabla(Evaluacion, vm.tablaListaEvaluaciones)
                  .then(function(respuesta) {

                        vm.tablaListaEvaluaciones.totalElementos = respuesta.total_registros;
                        vm.tablaListaEvaluaciones.inicio = respuesta.inicio;
                        vm.tablaListaEvaluaciones.fin = respuesta.fin;

                        if(vm.tablaListaEvaluaciones.totalElementos > 0)
                        {
                            vm.listaCursos = respuesta.datos;
                            formateaListado();
                            vm.cursoSeleccionado = vm.listaCursos[0];
                            vm.client = 2;
                            vm.tablaListaEvaluaciones.fila_seleccionada = 0;
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
                  vm.tablaListaEvaluaciones.fila_seleccionada = undefined;
                  vm.tablaListaEvaluaciones.paginaActual = 1;
                  vm.tablaListaEvaluaciones.inicio = 0;
                  vm.tablaListaEvaluaciones.fin = 1;

                  vm.tablaListaEvaluaciones.condicion = {
                      and: [
                        {idUnidadAdmtva: $scope.currentUser.unidad_pertenece_id},
                        {or: [{estatus: 2}, {estatus: 4}]}
                      ]
                  };

                  tablaDatosService.obtiene_datos_tabla(Evaluacion, vm.tablaListaEvaluaciones)
                  .then(function(respuesta) {

                        vm.tablaListaEvaluaciones.totalElementos = respuesta.total_registros;
                        vm.tablaListaEvaluaciones.inicio = respuesta.inicio;
                        vm.tablaListaEvaluaciones.fin = respuesta.fin;

                        if(vm.tablaListaEvaluaciones.totalElementos > 0)
                        {
                            vm.listaCursos = respuesta.datos;
                            formateaListado();
                            vm.cursoSeleccionado = vm.listaCursos[0];
                            vm.client = 2;
                            vm.tablaListaEvaluaciones.fila_seleccionada = 0;
                            muestraDatosRegistroActual(vm.cursoSeleccionado);
                        }
                  });

            };



            function muestraDatosRegistroActual(seleccion) {

                  var index = vm.listaCursos.indexOf(seleccion);
                  vm.cursoSeleccionado = seleccion;
                  vm.client = 2;
                  vm.tablaListaEvaluaciones.fila_seleccionada = index;
            };



            function cambiarPagina() {

                  if(vm.tablaListaEvaluaciones.totalElementos > 0)
                  {
                        tablaDatosService.cambia_pagina(Evaluacion, vm.tablaListaEvaluaciones)
                        .then(function(respuesta) {

                            vm.tablaListaEvaluaciones.inicio = respuesta.inicio;
                            vm.tablaListaEvaluaciones.fin = respuesta.fin;

                            vm.listaCursos = respuesta.datos;
                            formateaListado();
                            vm.cursoSeleccionado = vm.listaCursos[0];
                            vm.client = 2;
                            vm.tablaListaEvaluaciones.fila_seleccionada = 0;
                            muestraDatosRegistroActual(vm.cursoSeleccionado);
                        });
                  }
            };




            function registraPagoEval(seleccion) {

                    var modalInstance = $modal.open({
                        templateUrl: 'app/components/cursos_oficiales/inscripciones-pagos/evaluaciones/modal-captura-num-factura-eval.html',
                        windowClass: "animated fadeIn",
                        controller: 'ModalCapturaNumFacturaEvalController as vm',
                        resolve: {
                          registroEditar: function () { return {nombreCurso: vm.cursoSeleccionado.nombreCurso ,seleccion: seleccion} }
                        }

                    });

                    modalInstance.result.then(function (respuesta) {
                        
                            var index = vm.cursoSeleccionado.inscripcionesEvaluaciones.map(function(instructor) {
                                                                return instructor.id;
                                                              }).indexOf(respuesta.id);

                            vm.cursoSeleccionado.inscripcionesEvaluaciones[index].pagado = respuesta.pagado;
                            vm.cursoSeleccionado.inscripcionesEvaluaciones[index].numFactura = respuesta.numFactura;

                    }, function () {
                    });

            }


            function generaFormato(seleccion) {

                    var link = angular.element('<a href="api/Capacitandos/exporta_doc_inscrip/'+seleccion.idCurso+'/'+seleccion.Capacitandos.idAlumno+'" target="_blank"></a>');

                    angular.element(document.body).append(link);

                    link[0].click();
                    link.remove();

            };


            function editaNumFactura(seleccion) {

                    var modalInstance = $modal.open({
                        templateUrl: 'app/components/cursos_oficiales/inscripciones-pagos/evaluaciones/modal-captura-num-factura-eval.html',
                        windowClass: "animated fadeIn",
                        controller: 'ModalCapturaNumFacturaEvalController as vm',
                        resolve: {
                          registroEditar: function () { return {nombreCurso: vm.cursoSeleccionado.nombreCurso ,seleccion: seleccion} }
                        }

                    });

                    modalInstance.result.then(function (respuesta) {
                        
                            var index = vm.cursoSeleccionado.inscripcionesEvaluaciones.map(function(instructor) {
                                                                return instructor.id;
                                                              }).indexOf(respuesta.id);

                            vm.cursoSeleccionado.inscripcionesEvaluaciones[index].pagado = respuesta.pagado;
                            vm.cursoSeleccionado.inscripcionesEvaluaciones[index].numFactura = respuesta.numFactura;

                    }, function () {
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