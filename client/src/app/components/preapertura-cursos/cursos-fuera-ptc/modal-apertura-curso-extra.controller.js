(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ModalAperturaCursoExtraController', ModalAperturaCursoExtraController);

        ModalAperturaCursoExtraController.$inject = ['$scope', '$timeout', '$modalInstance', 'registroEditar', 'CatalogoCursos', 'CatalogoInstructores', 'CatalogoLocalidades', 'CursosOficiales', 'CatalogoModalidades'];

    function ModalAperturaCursoExtraController($scope, $timeout, $modalInstance, registroEditar, CatalogoCursos, CatalogoInstructores, CatalogoLocalidades, CursosOficiales, CatalogoModalidades) {

            var vm = this;

            vm.sort_by = sort_by;
            vm.openCalendar1 = openCalendar1;
            vm.openCalendar2 = openCalendar2;

            vm.muestraInstructoresCurso = muestraInstructoresCurso;
            vm.guardar = guardar;

            vm.mostrarSpiner = false;
            vm.EdicionCurso = false;
            vm.mostrar_msg_error = false;
            vm.mensaje = '';

            vm.cursoSeleccionado = {};
            vm.listaCursos = [];

            vm.modalidadSeleccionada = {};
            vm.listaModalidades = [];

            vm.localidadSeleccionada = {};
            vm.listaLocalidades = [];
           
            vm.instructorSeleccionado = {};
            vm.listaInstructores = [];
           
            vm.horas_disponibles = registroEditar.horas_disponibles;

            vm.registroEdicion = {
                    idCurso                 : 0,
                    idPtc                   : registroEditar.record.idPtc,
                    idCatalogoCurso         : 0,
                    nombreCurso             : '',
                    idModalidad             : 0,
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
                    nombreMunicipio         : '',
                    idInstructor            : '',
                    nombreInstructor        : '',
                    publico                 : false,
                    observaciones           : '',
                    instructores_propuestos : []
            };


            inicia();

            function inicia() {

                CatalogoCursos.find({
                    filter: {
                        fields: ['idCatalogoCurso','nombreCurso','claveCurso','descripcion','numeroHoras'],
                        order: 'nombreCurso ASC'
                    }
                })
                .$promise
                .then(function(resp) {
                    vm.listaCursos = resp;
                });

    
                CatalogoModalidades.find({
                    filter: {
                        where: {activo: true},
                        fields: ['idModalidad','modalidad'],
                        order: 'modalidad ASC'
                    }
                })
                .$promise
                .then(function(resp) {
                    vm.listaModalidades = resp;
                });

                CatalogoLocalidades.find({
                    filter: {
                        fields: ['idLocalidad','nombre','municipio'],
                        order: 'nombre ASC'
                    }
                })
                .$promise
                .then(function(resp) {
                    vm.listaLocalidades = resp;
                });


            };


            function muestraInstructoresCurso(){

                vm.registroEdicion.idCatalogoCurso = vm.cursoSeleccionado.selected.idCatalogoCurso;
                vm.registroEdicion.nombreCurso = vm.cursoSeleccionado.selected.nombreCurso;
                vm.registroEdicion.claveCurso = vm.cursoSeleccionado.selected.claveCurso;
                //vm.registroEdicion.modalidad = vm.cursoSeleccionado.selected.modalidad;
                vm.registroEdicion.total = vm.cursoSeleccionado.selected.numeroHoras;
                vm.registroEdicion.descripcion = vm.cursoSeleccionado.selected.descripcion;

                vm.listaInstructores = [];
                vm.instructorSeleccionado = "";
                CatalogoCursos.instructores_habilitados({
                        id: vm.cursoSeleccionado.selected.idCatalogoCurso,
                        filter: {
                            //where: {idUnidadAdmtva: $scope.currentUser.unidad_pertenece_id},
                            fields: ['idInstructor','apellidoPaterno','apellidoMaterno','nombre','curp','efTerminal'],
                            include: [
                                {
                                    relation: 'calif_evaluacion_curso',
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
                                    calificacion    : record.calif_evaluacion_curso[0].calificacion,
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


            function openCalendar2($event) {
                $event.preventDefault();
                $event.stopPropagation();
                vm.opened2 = true;
            };


            function guardar() {

                vm.mostrarSpiner = true;

                //if(vm.registroEdicion.total > vm.horas_disponibles)
                //{
                //        vm.mostrarSpiner = false;
                //        vm.mensaje = 'El número de horas de este curso ('+vm.registroEdicion.total+' horas) sobrepasa las horas disponibles para la unidad ('+registroEditar.horas_disponibles+' horas)';
                //        vm.mostrar_msg_error = true;
                //        $timeout(function(){
                //             vm.mensaje = '';
                //             vm.mostrar_msg_error = false;
                //        }, 6000);
                //        return;
                //}
                //else
                //{

                        var fechaInicio = new Date(vm.registroEdicion.fechaInicio);
                        fechaInicio.setHours(0);
                        fechaInicio.setMinutes(0);
                        fechaInicio.setSeconds(0);
                        
                        var fechaFin = new Date(vm.registroEdicion.fechaFin);
                        fechaFin.setHours(0);
                        fechaFin.setMinutes(0);
                        fechaFin.setSeconds(0);

                        CursosOficiales
                        .create({
                            idUnidadAdmtva        : $scope.currentUser.unidad_pertenece_id,
                            idCursoPTC            : 0,
                            idPtc                 : vm.registroEdicion.idPtc,
                            idLocalidad           : vm.localidadSeleccionada.selected.idLocalidad,
                            idCatalogoCurso       : vm.registroEdicion.idCatalogoCurso,
                            nombreCurso           : vm.registroEdicion.nombreCurso,
                            claveCurso            : vm.registroEdicion.claveCurso,
                            descripcionCurso      : vm.registroEdicion.descripcion,
                            modalidad             : vm.modalidadSeleccionada.modalidad,
                            horario               : vm.registroEdicion.horario,
                            aulaAsignada          : vm.registroEdicion.aulaAsignada,
                            horasSemana           : vm.registroEdicion.semanas,
                            numeroHoras           : vm.registroEdicion.total,
                            costo                 : vm.registroEdicion.costo,
                            cupoMaximo            : vm.registroEdicion.capacitandos,
                            minRequeridoInscritos : vm.registroEdicion.min_requerido_inscritos,
                            minRequeridoPago      : vm.registroEdicion.min_requerido_pago,
                            fechaInicio           : fechaInicio,
                            fechaFin              : fechaFin,
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
                //}

            };
    };

})();