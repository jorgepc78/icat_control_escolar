(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ModalAsientaCalifEvaluacionController', ModalAsientaCalifEvaluacionController);

        ModalAsientaCalifEvaluacionController.$inject = ['$scope', '$timeout', '$modalInstance', 'tablaDatosService', 'registroEditar', 'InscripcionEvaluaciones'];

    function ModalAsientaCalifEvaluacionController($scope, $timeout, $modalInstance, tablaDatosService, registroEditar, InscripcionEvaluaciones) {

            var vm = this;

            vm.mostrarSpiner = false;
                  
            vm.tablaListaAlumnos = {
              totalElementos     : 0,
              paginaActual       : 1,
              registrosPorPagina : 5,
              inicio             : 0,
              fin                : 1,
              condicion          : {},
              filtro_datos       : {},
              fila_seleccionada  : 0
            };

            vm.registroEdicion = {
                    idEvaluacion              : registroEditar.idEvaluacion,
                    nombreCurso               : registroEditar.nombreCurso,
                    nombreInstructor          : registroEditar.nombreInstructor,
                    inscripcionesEvaluaciones : []
            };

            angular.forEach(registroEditar.inscripcionesEvaluaciones, function(registro) {
              vm.registroEdicion.inscripcionesEvaluaciones.push({
                  id: registro.id,
                  numDocAcreditacion: registro.numDocAcreditacion,
                  calificacion: registro.calificacion,
                  Capacitandos: registro.Capacitandos
              });
            });


            vm.ddSelectOptions = [
                  {
                      text: 'COMPETENTE',
                      value: 'COMPETENTE'
                  },
                  {
                      text: 'NO COMPETENTE',
                      value: 'NO COMPETENTE'
                  }
              ];

            vm.cambiarPagina = cambiarPagina;
            vm.guardar       = guardar;

            inicia();

            function inicia() {
   
                    vm.tablaListaAlumnos.paginaActual = 1;
                    vm.tablaListaAlumnos.inicio = 0;
                    vm.tablaListaAlumnos.fin = 1;
                    vm.tablaListaAlumnos.totalElementos = vm.registroEdicion.inscripcionesEvaluaciones.length;

                    for (var i = 0; i < vm.registroEdicion.inscripcionesEvaluaciones.length; i++) {

                        if(vm.registroEdicion.inscripcionesEvaluaciones[i].numDocAcreditacion === undefined)
                          vm.registroEdicion.inscripcionesEvaluaciones[i].numDocAcreditacion = '';

                        if(vm.registroEdicion.inscripcionesEvaluaciones[i].calificacion === undefined || vm.registroEdicion.inscripcionesEvaluaciones[i].calificacion == '')
                          vm.registroEdicion.inscripcionesEvaluaciones[i].calificacion = {text: "Seleccione",value: ''};
                        else
                          vm.registroEdicion.inscripcionesEvaluaciones[i].calificacion = {text: vm.registroEdicion.inscripcionesEvaluaciones[i].calificacion ,value: vm.registroEdicion.inscripcionesEvaluaciones[i].calificacion};

                    }

            };


            function cambiarPagina(value) {
       
                var inicio  = (vm.tablaListaCursos.paginaActual - 1) * vm.tablaListaCursos.registrosPorPagina;
                var fin     = inicio + vm.tablaListaCursos.registrosPorPagina;

                if(fin > vm.tablaListaCursos.totalElementos)
                    fin = vm.tablaListaCursos.totalElementos;

                var index = vm.registroEdicion.inscripcionesEvaluaciones.indexOf(value);
                return (vm.tablaListaCursos.inicio <= index && index < vm.tablaListaCursos.fin);            
            }



            function guardar() {

                vm.mostrarSpiner = true;

                angular.forEach(vm.registroEdicion.inscripcionesEvaluaciones, function(registro) {
                    if(registro.calificacion.value != '')
                    {
                        InscripcionEvaluaciones.prototype$updateAttributes(
                            {id: registro.id }, 
                            {calificacion : registro.calificacion.value, numDocAcreditacion : registro.numDocAcreditacion}
                        )
                        .$promise.then(function() {
                        });
                    }
                });

                $modalInstance.close(vm.registroEdicion);

            };

    };

})();