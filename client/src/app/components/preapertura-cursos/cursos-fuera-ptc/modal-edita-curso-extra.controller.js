(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ModalEditaaCursoExtraController', ModalEditaaCursoExtraController);

        ModalEditaaCursoExtraController.$inject = ['$scope', '$timeout', '$modalInstance', 'registroEditar', 'CatalogoCursos', 'CatalogoInstructores', 'CatalogoLocalidades', 'CursosOficiales'];

    function ModalEditaaCursoExtraController($scope, $timeout, $modalInstance, registroEditar, CatalogoCursos, CatalogoInstructores, CatalogoLocalidades, CursosOficiales) {

            var vm = this;

            vm.sort_by = sort_by;
            vm.openCalendar1 = openCalendar1;
            vm.openCalendar2 = openCalendar2;

            vm.muestraInstructoresCurso = muestraInstructoresCurso;
            vm.guardar = guardar;

            vm.mostrarSpiner = false;
            vm.EdicionCurso = true;
            vm.mostrar_msg_error = false;
            vm.mensaje = '';

            vm.cursoSeleccionado = {};
            vm.listaCursos = [];

            vm.localidadSeleccionada = {};
            vm.listaLocalidades = [];
           
            vm.instructorSeleccionado = {};
            vm.listaInstructores = [];
            
            vm.horas_disponibles = registroEditar.horas_disponibles;

            vm.registroEdicion = {
                    idCurso                 : registroEditar.record.idCurso,
                    idPtc                   : registroEditar.record.idPtc,
                    idCatalogoCurso         : registroEditar.record.idCatalogoCurso,
                    nombreCurso             : registroEditar.record.nombreCurso,
                    modalidad               : registroEditar.record.modalidad,
                    claveCurso              : registroEditar.record.claveCurso,
                    descripcion             : registroEditar.record.descripcionCurso,
                    horario                 : registroEditar.record.horario,
                    aulaAsignada            : registroEditar.record.aulaAsignada,
                    semanas                 : registroEditar.record.horasSemana,
                    total                   : registroEditar.record.numeroHoras,
                    costo                   : registroEditar.record.costo,
                    capacitandos            : registroEditar.record.cupoMaximo,
                    min_requerido_inscritos : registroEditar.record.minRequeridoInscritos,
                    min_requerido_pago      : registroEditar.record.minRequeridoPago,
                    fechaInicio             : registroEditar.record.fechaInicio,
                    fechaFin                : registroEditar.record.fechaFin,
                    idLocalidad             : registroEditar.record.idLocalidad,
                    nombreLocalidad         : '',
                    nombreMunicipio         : '',
                    idInstructor            : registroEditar.record.idInstructor,
                    nombreInstructor        : registroEditar.record.nombreInstructor,
                    publico                 : registroEditar.record.publico,
                    estatus                 : registroEditar.record.estatus,
                    observaciones           : registroEditar.record.observaciones
            };


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
                    vm.cursoSeleccionado.selected = vm.listaCursos[index];
                });

    
                CatalogoCursos.instructores_habilitados({
                        id: vm.registroEdicion.idCatalogoCurso,
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

                    var index = vm.listaInstructores.map(function(record) {
                                                        return record.idInstructor;
                                                      }).indexOf(vm.registroEdicion.idInstructor);
                    vm.instructorSeleccionado = vm.listaInstructores[index];
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

                    var index = vm.listaLocalidades.map(function(record) {
                                                        return record.idLocalidad;
                                                      }).indexOf(vm.registroEdicion.idLocalidad);
                    vm.localidadSeleccionada.selected = vm.listaLocalidades[index];
                });

            };


            function muestraInstructoresCurso(){

                vm.registroEdicion.idCatalogoCurso = vm.cursoSeleccionado.selected.idCatalogoCurso;
                vm.registroEdicion.nombreCurso = vm.cursoSeleccionado.selected.nombreCurso;
                vm.registroEdicion.claveCurso = vm.cursoSeleccionado.selected.claveCurso;
                vm.registroEdicion.modalidad = vm.cursoSeleccionado.selected.modalidad;
                //vm.registroEdicion.total = vm.cursoSeleccionado.selected.numeroHoras;
                vm.registroEdicion.descripcion = vm.cursoSeleccionado.selected.descripcion;

                vm.listaInstructores = [];
                vm.instructorSeleccionado = "";
                CatalogoCursos.instructores_habilitados({
                        id: vm.cursoSeleccionado.selected.idCatalogoCurso,
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

                if(vm.registroEdicion.total > vm.horas_disponibles)
                {
                        vm.mostrarSpiner = false;
                        vm.mensaje = 'El número de horas de este curso ('+vm.registroEdicion.total+' horas) sobrepasa las horas disponibles para la unidad ('+registroEditar.horas_disponibles+' horas)';
                        vm.mostrar_msg_error = true;
                        $timeout(function(){
                             vm.mensaje = '';
                             vm.mostrar_msg_error = false;
                        }, 6000);
                        return;
                }
                else
                {

                        var fechaInicio = new Date(vm.registroEdicion.fechaInicio);
                        fechaInicio.setHours(0);
                        fechaInicio.setMinutes(0);
                        fechaInicio.setSeconds(0);
                        
                        var fechaFin = new Date(vm.registroEdicion.fechaFin);
                        fechaFin.setHours(0);
                        fechaFin.setMinutes(0);
                        fechaFin.setSeconds(0);

                        CursosOficiales
                        .prototype$updateAttributes({
                            id: vm.registroEdicion.idCurso
                        },{
                            idUnidadAdmtva        : $scope.currentUser.unidad_pertenece_id,
                            idCursoPTC            : 0,
                            idPtc                 : vm.registroEdicion.idPtc,
                            idLocalidad           : vm.localidadSeleccionada.selected.idLocalidad,
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

                                vm.registroEdicion.idInstructor     = vm.instructorSeleccionado.idInstructor;
                                vm.registroEdicion.nombreInstructor = vm.instructorSeleccionado.nombre_completo;
                                vm.registroEdicion.idLocalidad      = vm.localidadSeleccionada.selected.idLocalidad;
                                vm.registroEdicion.nombreLocalidad  = vm.localidadSeleccionada.selected.nombre;
                                vm.registroEdicion.nombreMunicipio  = vm.localidadSeleccionada.selected.municipio;
                                vm.registroEdicion.estatus          = 0;

                                $modalInstance.close(vm.registroEdicion);
                        })
                        .catch(function(error) {
                        });

                }

            };
    };

})();