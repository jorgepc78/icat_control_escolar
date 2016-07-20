(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ModalAperturaCursoExtraController', ModalAperturaCursoExtraController);

        ModalAperturaCursoExtraController.$inject = ['$scope', '$timeout', '$modalInstance', 'registroEditar', 'CatalogoCursos', 'CatalogoInstructores', 'CatalogoLocalidades', 'CursosOficiales'];

    function ModalAperturaCursoExtraController($scope, $timeout, $modalInstance, registroEditar, CatalogoCursos, CatalogoInstructores, CatalogoLocalidades, CursosOficiales) {

            var vm = this;

            vm.mostrarSpiner = false;
            vm.EdicionCurso = false;

            vm.listaCursos = {};
            vm.cursoSeleccionado = {};

            vm.listaLocalidades = {};
            vm.localidadSeleccionada = "";
           
            vm.instructorSeleccionado = "";
            vm.listaInstructores = [];
           
            vm.registroEdicion = {
                    idCurso                 : 0,
                    idPtc                   : registroEditar.idPtc,
                    idCatalogoCurso         : 0,
                    nombreCurso             : '',
                    modalidad               : '',
                    claveCurso              : '',
                    descripcion             : '',
                    horario                 : '',
                    aulaAsignada            : '',
                    semanas                 : '',
                    total                   : '',
                    costo                   : 0,
                    capacitandos            : 0,
                    min_requerido_inscritos : 0,
                    min_requerido_pago      : 0,
                    fechaInicio             : '',
                    fechaFin                : '',
                    idLocalidad             : '',
                    nombreLocalidad         : '',
                    idInstructor            : '',
                    nombreInstructor        : '',
                    publico                 : false,
                    observaciones           : '',
                    instructores_propuestos : []
            };

            vm.sort_by = sort_by;
            vm.openCalendar1 = openCalendar1;
            vm.openCalendar2 = openCalendar2;

            vm.muestraInstructoresCurso = muestraInstructoresCurso;
            vm.guardar = guardar;

            inicia();

            function inicia() {

                CatalogoCursos.find({
                    filter: {
                        fields: ['idCatalogoCurso','nombreCurso','modalidad','claveCurso','descripcion','numeroHoras'],
                        order: 'nombreCurso ASC'
                    }
                })
                .$promise
                .then(function(resp) {
                    vm.listaCursos = resp;
                });

    
                CatalogoLocalidades.find({
                    filter: {
                        fields: ['idLocalidad','nombre'],
                        order: 'nombre ASC'
                    }
                })
                .$promise
                .then(function(resp) {
                    vm.listaLocalidades = resp;
                });


            };


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
                            where: {idUnidadAdmtva: $scope.currentUser.unidad_pertenece_id},
                            fields: ['idInstructor','apellidoPaterno','apellidoMaterno','nombre','curp']
                        }
                })
                .$promise
                .then(function(resp) {

                    angular.forEach(resp, function(record) {
                            vm.listaInstructores.push({
                                idInstructor    : record.idInstructor,
                                apellidoPaterno : record.apellidoPaterno,
                                apellidoMaterno : record.apellidoMaterno,
                                nombre          : record.nombre,
                                curp            : record.curp,
                                nombre_completo : record.apellidoPaterno + ' ' + record.apellidoMaterno + ' ' + record.nombre
                            });
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


            function openCalendar2($event) {
                $event.preventDefault();
                $event.stopPropagation();
                vm.opened2 = true;
            };


            function guardar() {

                vm.mostrarSpiner = true;

                CursosOficiales
                .create({
                    idUnidadAdmtva        : $scope.currentUser.unidad_pertenece_id,
                    idCursoPTC            : 0,
                    idPtc                 : vm.registroEdicion.idPtc,
                    idLocalidad           : vm.localidadSeleccionada.idLocalidad,
                    nombreCurso           : vm.registroEdicion.nombreCurso,
                    claveCurso            : vm.registroEdicion.claveCurso,
                    descripcionCurso      : vm.registroEdicion.descripcion,
                    modalidad             : vm.registroEdicion.modalidad,
                    horario               : vm.registroEdicion.horario,
                    aulaAsignada          : vm.registroEdicion.aulaAsignada,
                    horasSemana           : vm.registroEdicion.semanas,
                    numeroHoras           : vm.registroEdicion.total,
                    costo                 : vm.registroEdicion.costo,
                    cupoMaximo            : vm.registroEdicion.capacitandos,
                    minRequeridoInscritos : vm.registroEdicion.min_requerido_inscritos,
                    minRequeridoPago      : vm.registroEdicion.min_requerido_pago,
                    fechaInicio           : vm.registroEdicion.fechaInicio,
                    fechaFin              : vm.registroEdicion.fechaFin,
                    publico               : vm.registroEdicion.publico,

                    idInstructor          : vm.instructorSeleccionado.idInstructor,
                    curpInstructor        : vm.instructorSeleccionado.curp,
                    nombreInstructor      : vm.instructorSeleccionado.nombre_completo,

                    observaciones         : vm.registroEdicion.observaciones,
                    estatus               : 0,
                    programadoPTC         : false
                })
                .$promise
                .then(function(respuesta) {
                      $modalInstance.close(vm.registroEdicion);
                })
                .catch(function(error) {
                });


            };
    };

})();