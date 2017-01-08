(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ModalAsientaCalificacionesController', ModalAsientaCalificacionesController);

        ModalAsientaCalificacionesController.$inject = ['$scope', '$timeout', '$modalInstance', 'tablaDatosService', 'registroEditar', 'CatalogoCursos', 'InscripcionCurso'];

    function ModalAsientaCalificacionesController($scope, $timeout, $modalInstance, tablaDatosService, registroEditar, CatalogoCursos, InscripcionCurso) {

            var vm = this;

            vm.cambiarPagina = cambiarPagina;
            vm.guardar       = guardar;

            vm.mostrarSpiner = false;
          
            vm.instructorSeleccionado = "";
            vm.listaInstructores = [];
         
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
                    idCurso                 : registroEditar.idCurso,
                    nombreCurso             : registroEditar.nombreCurso,
                    nombreInstructor        : registroEditar.nombreInstructor,
                    inscripcionesCursos     : registroEditar.inscripcionesCursos
            };

            vm.ddSelectOptions = [
                  {
                      text: 'ACREDITADO',
                      value: 'ACREDITADO'
                  },
                  {
                      text: 'NO ACREDITADO',
                      value: 'NO ACREDITADO'
                  },
                  {
                      text: 'DESERTOR',
                      value: 'DESERTOR'
                  }
              ];

            inicia();

            function inicia() {
   
                    vm.tablaListaAlumnos.paginaActual = 1;
                    vm.tablaListaAlumnos.inicio = 0;
                    vm.tablaListaAlumnos.fin = 1;
                    vm.tablaListaAlumnos.totalElementos = vm.registroEdicion.inscripcionesCursos.length;

                    for (var i = 0; i < vm.registroEdicion.inscripcionesCursos.length; i++) {

                        if(vm.registroEdicion.inscripcionesCursos[i].numDocAcreditacion === undefined)
                          vm.registroEdicion.inscripcionesCursos[i].numDocAcreditacion = '';

                        if(vm.registroEdicion.inscripcionesCursos[i].calificacion === undefined || vm.registroEdicion.inscripcionesCursos[i].calificacion == '')
                          vm.registroEdicion.inscripcionesCursos[i].calificacion = {text: "Seleccione",value: ''};
                        else
                          vm.registroEdicion.inscripcionesCursos[i].calificacion = {text: vm.registroEdicion.inscripcionesCursos[i].calificacion ,value: vm.registroEdicion.inscripcionesCursos[i].calificacion};

                    }

            };


            function cambiarPagina(value) {
       
                var inicio  = (vm.tablaListaCursos.paginaActual - 1) * vm.tablaListaCursos.registrosPorPagina;
                var fin     = inicio + vm.tablaListaCursos.registrosPorPagina;

                if(fin > vm.tablaListaCursos.totalElementos)
                    fin = vm.tablaListaCursos.totalElementos;

                var index = vm.registroEdicion.inscripcionesCursos.indexOf(value);
                return (vm.tablaListaCursos.inicio <= index && index < vm.tablaListaCursos.fin);            
            }



            function guardar() {

                vm.mostrarSpiner = true;

                angular.forEach(vm.registroEdicion.inscripcionesCursos, function(registro) {
                    if(registro.calificacion.value != '')
                    {
                        InscripcionCurso.prototype$updateAttributes(
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