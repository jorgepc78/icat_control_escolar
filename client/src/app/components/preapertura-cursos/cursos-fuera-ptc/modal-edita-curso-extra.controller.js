(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ModalEditaaCursoExtraController', ModalEditaaCursoExtraController);

        ModalEditaaCursoExtraController.$inject = ['$scope', '$timeout', '$modalInstance', 'registroEditar', 'CatalogoCursos', 'CatalogoInstructores', 'CatalogoLocalidades', 'CursosOficiales'];

    function ModalEditaaCursoExtraController($scope, $timeout, $modalInstance, registroEditar, CatalogoCursos, CatalogoInstructores, CatalogoLocalidades, CursosOficiales) {

            var vm = this;

            vm.mostrarSpiner = false;
            vm.EdicionCurso = true;

            vm.listaCursos = {};
            vm.cursoSeleccionado = {};

            vm.listaLocalidades = {};
            vm.localidadSeleccionada = "";
           
            vm.instructorSeleccionado = "";
            vm.listaInstructores = [];
         
            vm.registroEdicion = {
                    idCurso                 : registroEditar.idCurso,
                    idPtc                   : registroEditar.idPtc,
                    idCatalogoCurso         : registroEditar.idCatalogoCurso,
                    nombreCurso             : registroEditar.nombreCurso,
                    modalidad               : registroEditar.modalidad,
                    claveCurso              : registroEditar.claveCurso,
                    descripcion             : registroEditar.descripcionCurso,
                    horario                 : registroEditar.horario,
                    aulaAsignada            : registroEditar.aulaAsignada,
                    semanas                 : registroEditar.horasSemana,
                    total                   : registroEditar.numeroHoras,
                    costo                   : registroEditar.costo,
                    capacitandos            : registroEditar.cupoMaximo,
                    min_requerido_inscritos : registroEditar.minRequeridoInscritos,
                    min_requerido_pago      : registroEditar.minRequeridoPago,
                    fechaInicio             : registroEditar.fechaInicio,
                    fechaFin                : registroEditar.fechaFin,
                    idLocalidad             : registroEditar.idLocalidad,
                    nombreLocalidad         : '',
                    idInstructor            : registroEditar.idInstructor,
                    nombreInstructor        : registroEditar.nombreInstructor,
                    publico                 : registroEditar.publico,
                    observaciones           : registroEditar.observaciones
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

                    var index = vm.listaCursos.map(function(record) {
                                                        return record.idCatalogoCurso;
                                                      }).indexOf(vm.registroEdicion.idCatalogoCurso);
                    vm.cursoSeleccionado = vm.listaCursos[index];
                });

    
                CatalogoCursos.instructores_habilitados({
                        id: vm.registroEdicion.idCatalogoCurso,
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
                                curp          : record.curp,
                                nombre_completo : record.apellidoPaterno + ' ' + record.apellidoMaterno + ' ' + record.nombre
                            });
                    });

                    vm.listaInstructores.sort(sort_by('nombre_completo', false, function(a){return a.toUpperCase()}));

                    var index = vm.listaInstructores.map(function(record) {
                                                        return record.idInstructor;
                                                      }).indexOf(vm.registroEdicion.idInstructor);
                    vm.instructorSeleccionado = vm.listaInstructores[index];
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

                    var index = vm.listaLocalidades.map(function(record) {
                                                        return record.idLocalidad;
                                                      }).indexOf(vm.registroEdicion.idLocalidad);
                    vm.localidadSeleccionada = vm.listaLocalidades[index];
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
                .prototype$updateAttributes({
                    id: vm.registroEdicion.idCurso
                },{
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

                        vm.registroEdicion.idInstructor     = vm.instructorSeleccionado.idInstructor;
                        vm.registroEdicion.nombreInstructor = vm.instructorSeleccionado.nombre_completo;
                        vm.registroEdicion.idLocalidad      = vm.localidadSeleccionada.idLocalidad;
                        vm.registroEdicion.nombreLocalidad  = vm.localidadSeleccionada.nombre;

                        $modalInstance.close(vm.registroEdicion);
                })
                .catch(function(error) {
                });


            };
    };

})();