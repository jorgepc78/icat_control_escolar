(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ModalEvaluaCursosController', ModalEvaluaCursosController);

        ModalEvaluaCursosController.$inject = ['$scope', '$timeout', '$modalInstance', 'RelInstrucCatCurso', 'registroEditar'];

    function ModalEvaluaCursosController($scope, $timeout, $modalInstance, RelInstrucCatCurso, registroEditar) {

            var vm = this;

            vm.guardar = guardar;

            vm.mostrarSpiner = false;
            vm.mostrar_msg_error = false;
            vm.mensaje = '';

            vm.registroEdicion = {
                    idInstructor    : registroEditar.idInstructor,
                    evaluacion_curso: []
            };
            vm.cursos_habilitados = [];

            inicia();


            function inicia() {

                angular.forEach(registroEditar.evaluacion_curso, function(record) {
                      vm.cursos_habilitados.push({
                          id              : record.id,
                          idCatalogoCurso : record.CatalogoCursos.idCatalogoCurso,
                          especialidad    : record.CatalogoCursos.especialidad.nombre,
                          nombreCurso     : record.CatalogoCursos.nombreCurso,
                          numeroHoras     : record.CatalogoCursos.numeroHoras,
                          calificacion    : record.calificacion
                      });
                });    
            };



            function guardar() {

                vm.mostrarSpiner = true;
                var faltaEvalacion = false;
                angular.forEach(vm.cursos_habilitados, function(record) {
                    if(record.calificacion == 0)
                        faltaEvalacion = true;
                });

                if(faltaEvalacion == true)
                {
                        vm.mostrarSpiner = false;
                        vm.mensaje = 'Falta el puntaje en un curso';
                        vm.mostrar_msg_error = true;
                        $timeout(function(){
                             vm.mensaje = '';
                             vm.mostrar_msg_error = false;
                        }, 3000);
                }
                else
                {
                        var totalregistros = 0;
                        angular.forEach(vm.cursos_habilitados, function(record) {

                                RelInstrucCatCurso.prototype$updateAttributes(
                                {
                                    id: record.id
                                },{
                                    calificacion: record.calificacion
                                }) 
                                .$promise
                                .then(function(resp) {

                                    totalregistros++;
                                    if(totalregistros == vm.cursos_habilitados.length)
                                        $modalInstance.close(vm.cursos_habilitados);

                                });
                        });
                }
            };
    };

})();