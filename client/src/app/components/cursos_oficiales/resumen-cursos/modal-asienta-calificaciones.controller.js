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

            vm.inscripcionesCursos_temp = [];

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
    
                    if(vm.tablaListaAlumnos.totalElementos <= vm.tablaListaAlumnos.registrosPorPagina)
                        vm.tablaListaAlumnos.fin = vm.tablaListaAlumnos.totalElementos;
                    else
                        vm.tablaListaAlumnos.fin = vm.tablaListaAlumnos.registrosPorPagina;
                        
                    if(vm.tablaListaAlumnos.totalElementos == 0) {
                        vm.tablaListaAlumnos.inicio = -1;
                        vm.tablaListaAlumnos.fin = 0;
                    }

                    angular.forEach(vm.registroEdicion.inscripcionesCursos, function(record, key) {

                          if(record.numDocAcreditacion === undefined)
                            var numDocAcreditacion = '';
                          else
                            var numDocAcreditacion = record.numDocAcreditacion;

                          if(record.calificacion === undefined || record.calificacion == '')
                            var calificacion = {text: "Seleccione", value: ''};
                          else
                            var calificacion = {text: record.calificacion, value: record.calificacion};

                          vm.inscripcionesCursos_temp.push({
                                id: record.id,
                                num: (key + 1),
                                numDocAcreditacion: numDocAcreditacion,
                                calificacion: calificacion,
                                Capacitandos: record.Capacitandos
                          });
                    });
                    //vm.cambiarPagina(value);

            };


            function cambiarPagina(value) {
       
                vm.tablaListaAlumnos.inicio  = (vm.tablaListaAlumnos.paginaActual - 1) * vm.tablaListaAlumnos.registrosPorPagina;
                vm.tablaListaAlumnos.fin     = vm.tablaListaAlumnos.inicio + vm.tablaListaAlumnos.registrosPorPagina;

                if(vm.tablaListaAlumnos.fin > vm.tablaListaAlumnos.totalElementos)
                    vm.tablaListaAlumnos.fin = vm.tablaListaAlumnos.totalElementos;

                var index = vm.inscripcionesCursos_temp.indexOf(value);
                return (vm.tablaListaAlumnos.inicio <= index && index < vm.tablaListaAlumnos.fin);            
            }



            function guardar() {

                vm.mostrarSpiner = true;

                angular.forEach(vm.inscripcionesCursos_temp, function(seleccion) {

                    if(seleccion.calificacion.value != '')
                    {
                        var indice = vm.registroEdicion.inscripcionesCursos.map(function(registro) {
                                                            return registro.id;
                                                          }).indexOf(seleccion.id);

                        vm.registroEdicion.inscripcionesCursos[indice].calificacion = seleccion.calificacion.value;
                        vm.registroEdicion.inscripcionesCursos[indice].numDocAcreditacion = seleccion.numDocAcreditacion;

                        InscripcionCurso.prototype$updateAttributes(
                            {id: seleccion.id }, 
                            {calificacion : seleccion.calificacion.value, numDocAcreditacion : seleccion.numDocAcreditacion}
                        )
                        .$promise.then(function() {
                        });
                    }
                });

                $modalInstance.close(vm.registroEdicion);

            };

    };

})();