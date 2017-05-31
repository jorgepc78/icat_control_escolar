(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ModalReprogramaCursoController', ModalReprogramaCursoController);

        ModalReprogramaCursoController.$inject = ['$scope', '$timeout', '$modalInstance', 'registroEditar', 'CatalogoCursos', 'CursosOficiales'];

    function ModalReprogramaCursoController($scope, $timeout, $modalInstance, registroEditar, CatalogoCursos, CursosOficiales) {

            var vm = this;

            vm.mostrarSpiner = false;
          
            vm.instructorSeleccionado = "";
            vm.listaInstructores = [];
         
            vm.registroEdicion = {
                    idCurso                 : registroEditar.idCurso,
                    idCatalogoCurso         : registroEditar.idCatalogoCurso,
                    nombreCurso             : registroEditar.nombreCurso,
                    horario                 : registroEditar.horario,
                    aulaAsignada            : registroEditar.aulaAsignada,
                    fechaInicio             : registroEditar.fechaInicio,
                    fechaFin                : registroEditar.fechaFin,
                    idInstructor            : registroEditar.idInstructor,
                    nombreInstructor        : registroEditar.nombreInstructor,
                    observaciones           : registroEditar.observaciones
            };

            vm.sort_by = sort_by;
            vm.openCalendar1 = openCalendar1;
            vm.openCalendar2 = openCalendar2;

            vm.guardar = guardar;

            inicia();

            function inicia() {
   
                CatalogoCursos.instructores_habilitados({
                        id: vm.registroEdicion.idCatalogoCurso,
                        filter: {
                            fields: ['idInstructor','apellidoPaterno','apellidoMaterno','nombre','curp'],
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
                                    apellidoPaterno : record.apellidoPaterno,
                                    apellidoMaterno : record.apellidoMaterno,
                                    nombre          : record.nombre,
                                    curp            : record.curp,
                                    nombre_completo : record.apellidoPaterno + ' ' + record.apellidoMaterno + ' ' + record.nombre
                                });
                            }

                    });

                    vm.listaInstructores.sort(sort_by('nombre_completo', false, function(a){return a.toUpperCase()}));

                    var index = vm.listaInstructores.map(function(record) {
                                                        return record.idInstructor;
                                                      }).indexOf(vm.registroEdicion.idInstructor);
                    vm.instructorSeleccionado = vm.listaInstructores[index];
                });

            };


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


            function openCalendar2($event) {
                $event.preventDefault();
                $event.stopPropagation();
                vm.opened2 = true;
            };


            function guardar() {

                vm.mostrarSpiner = true;

                CursosOficiales
                .prototype$updateAttributes({
                    id: vm.registroEdicion.idCurso
                },{
                    horario               : vm.registroEdicion.horario,
                    aulaAsignada          : vm.registroEdicion.aulaAsignada,
                    fechaInicio           : vm.registroEdicion.fechaInicio,
                    fechaFin              : vm.registroEdicion.fechaFin,
                    idInstructor          : vm.instructorSeleccionado.idInstructor,
                    curpInstructor        : vm.instructorSeleccionado.curp,
                    nombreInstructor      : vm.instructorSeleccionado.nombre_completo,
                    observaciones         : vm.registroEdicion.observaciones
                })
                .$promise
                .then(function(respuesta) {

                        vm.registroEdicion.idInstructor     = vm.instructorSeleccionado.idInstructor;
                        vm.registroEdicion.nombreInstructor = vm.instructorSeleccionado.nombre_completo;

                        $modalInstance.close(vm.registroEdicion);
                })
                .catch(function(error) {
                });


            };

    };

})();