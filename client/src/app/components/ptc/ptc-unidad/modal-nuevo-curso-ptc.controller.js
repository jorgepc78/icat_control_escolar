(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ModalNuevoCursoPTCController', ModalNuevoCursoPTCController);

        ModalNuevoCursoPTCController.$inject = ['$scope', '$timeout', '$modalInstance', 'registroEditar', 'ProgTrimCursos', 'CursosPtc', 'CatalogoCursos', 'CatalogoInstructores'];

    function ModalNuevoCursoPTCController($scope, $timeout, $modalInstance, registroEditar, ProgTrimCursos, CursosPtc, CatalogoCursos, CatalogoInstructores) {

            var vm = this;

            vm.sort_by = sort_by;
            vm.openCalendar1 = openCalendar1;
            vm.openCalendar2 = openCalendar2;

            vm.muestraInstructoresCurso = muestraInstructoresCurso;
            vm.agregaInstructor = agregaInstructor;
            vm.eliminaInstructor = eliminaInstructor;
            vm.guardar = guardar;


            vm.opened1 = false;
            vm.opened2 = false;

            vm.mostrarSpiner = false;
            vm.mostrar_msg_error = false;
            vm.mensaje = '';
            vm.EdicionCurso = false;

            vm.cursoSeleccionado = 0;
            vm.listaCursos = {};
           
            vm.instructorSeleccionado = {};
            vm.listaInstructores = [];

            vm.horas_disponibles = registroEditar.horas_disponibles - registroEditar.horas_usadas;

            vm.registroEdicion = {
                    idPtc           : registroEditar.recordPTC.idPtc,
                    idCursoPTC      : 0,
                    idCatalogoCurso : 0,
                    nombreCurso     : '',
                    modalidad       : '',
                    horario         : '',
                    aulaAsignada    : '',
                    capacitandos    : 0,
                    semanas         : 0,
                    total           : 0,
                    fechaInicio     : '',
                    fechaFin        : '',
                    observaciones   : '',

                    estatusPTC      : 0,
                    fechaModificacionPTC: '',

                    instructores_propuestos: []
            };


            inicia();

            function inicia() {

                CatalogoCursos.find({
                    filter: {
                        fields: ['idCatalogoCurso','nombreCurso','modalidad','claveCurso','numeroHoras'],
                        order: 'nombreCurso ASC'
                    }
                })
                .$promise
                .then(function(resp) {
                    vm.listaCursos = resp;
                });
        
            };


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



            function muestraInstructoresCurso(){

                vm.registroEdicion.claveCurso = vm.cursoSeleccionado.claveCurso;
                vm.registroEdicion.modalidad = vm.cursoSeleccionado.modalidad;

                vm.listaInstructores = [];
                CatalogoCursos.instructores_habilitados({
                        id: vm.cursoSeleccionado.idCatalogoCurso,
                        filter: {
                            //where: {idUnidadAdmtva: $scope.currentUser.unidad_pertenece_id},
                            fields: ['idInstructor','apellidoPaterno','apellidoMaterno','nombre','efTerminal'],
                            include: [
                                {
                                    relation: 'evaluacion_curso',
                                    scope: {
                                        where: {idCatalogoCurso: vm.cursoSeleccionado.idCatalogoCurso},
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

                    angular.forEach(resp, function(record) {

                        var index = record.otras_unidades.map(function(unidad) {
                                                            return unidad.idUnidadAdmtva;
                                                          }).indexOf($scope.currentUser.unidad_pertenece_id);

                        if(index >= 0)
                        {
                            vm.listaInstructores.push({
                                idInstructor    : record.idInstructor,
                                apellidoPaterno : record.apellidoPaterno,
                                apellidoMaterno : record.apellidoMaterno,
                                nombre          : record.nombre,
                                nombre_completo : record.apellidoPaterno + ' ' + record.apellidoMaterno + ' ' + record.nombre,
                                calificacion    : record.evaluacion_curso[0].calificacion,
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


            function agregaInstructor() {

                if(vm.listaInstructores.length > 0)
                {
                        vm.registroEdicion.instructores_propuestos.push({
                            idInstructor    : vm.instructorSeleccionado.idInstructor,
                            apellidoPaterno : vm.instructorSeleccionado.apellidoPaterno,
                            apellidoMaterno : vm.instructorSeleccionado.apellidoMaterno,
                            nombre          : vm.instructorSeleccionado.nombre,
                            nombre_completo : vm.instructorSeleccionado.apellidoPaterno + ' ' + vm.instructorSeleccionado.apellidoMaterno + ' ' + vm.instructorSeleccionado.nombre,
                            calificacion    : vm.instructorSeleccionado.calificacion,
                            efTerminal      : vm.instructorSeleccionado.efTerminal
                        });

                        var index;
                        angular.forEach(vm.registroEdicion.instructores_propuestos, function(record) {
                                
                                index = vm.listaInstructores.map(function(instructor) {
                                                                    return instructor.idInstructor;
                                                                  }).indexOf(record.idInstructor);

                                if(index >= 0)
                                    vm.listaInstructores.splice(index, 1);
                        });
                        vm.instructorSeleccionado = {};
                }
            };


            function eliminaInstructor(indice) {

                vm.listaInstructores.push({
                    idInstructor    : vm.registroEdicion.instructores_propuestos[indice].idInstructor,
                    apellidoPaterno : vm.registroEdicion.instructores_propuestos[indice].apellidoPaterno,
                    apellidoMaterno : vm.registroEdicion.instructores_propuestos[indice].apellidoMaterno,
                    nombre          : vm.registroEdicion.instructores_propuestos[indice].nombre,
                    nombre_completo : vm.registroEdicion.instructores_propuestos[indice].apellidoPaterno + ' ' + vm.registroEdicion.instructores_propuestos[indice].apellidoMaterno + ' ' + vm.registroEdicion.instructores_propuestos[indice].nombre,
                    calificacion    : vm.registroEdicion.instructores_propuestos[indice].calificacion,
                    efTerminal      : vm.registroEdicion.instructores_propuestos[indice].efTerminal
                });
                
                vm.registroEdicion.instructores_propuestos.splice(indice, 1);
                vm.instructorSeleccionado = {};
            };


            function guardar() {

                vm.mostrarSpiner = true;

                if((registroEditar.horas_usadas + vm.registroEdicion.total) > registroEditar.horas_disponibles)
                {
                        vm.mostrarSpiner = false;
                        vm.mensaje = 'El número de horas de este curso incrementa las horas total del PTC ('+(registroEditar.horas_usadas + vm.registroEdicion.total)+' horas) siendo mayor a las horas disponibles para la unidad ('+registroEditar.horas_disponibles+' horas)';
                        vm.mostrar_msg_error = true;
                        $timeout(function(){
                             vm.mensaje = '';
                             vm.mostrar_msg_error = false;
                        }, 6000);
                        return;
                }
                else
                {
                            CursosPtc
                            .create({
                                idPtc           : vm.registroEdicion.idPtc,
                                idCatalogoCurso : vm.cursoSeleccionado.idCatalogoCurso,
                                horario         : vm.registroEdicion.horario,
                                aulaAsignada    : vm.registroEdicion.aulaAsignada,
                                capacitandos    : vm.registroEdicion.capacitandos,
                                semanas         : vm.registroEdicion.semanas,
                                total           : vm.registroEdicion.total,
                                fechaInicio     : vm.registroEdicion.fechaInicio,
                                fechaFin        : vm.registroEdicion.fechaFin,
                                observaciones   : vm.registroEdicion.observaciones
                            })
                            .$promise
                            .then(function(respuesta) {
                                
                                vm.registroEdicion.idCursoPTC = respuesta.idCursoPTC;

                                if(vm.registroEdicion.instructores_propuestos.length > 0)
                                {
                                        angular.forEach(vm.registroEdicion.instructores_propuestos, function(record) {

                                                CursosPtc.instructores_propuestos.link({
                                                      id: respuesta.idCursoPTC,
                                                      fk: record.idInstructor
                                                },{
                                                }) 
                                                .$promise
                                                .then(function() {
                                                });
                                        });
                                }

                                CursosPtc.find({
                                  filter: {
                                      where: {idPtc: vm.registroEdicion.idPtc},
                                      fields: ['total']
                                  }
                                })
                                .$promise
                                .then(function(resp) {

                                        var total_horas_separadas = 0;
                                        angular.forEach(resp, function(record) {

                                                total_horas_separadas += record.total;
                                        });

                                        ProgTrimCursos.prototype$updateAttributes(
                                        {
                                            id: vm.registroEdicion.idPtc
                                        },{
                                            estatus: 0,
                                            horasSeparadas :total_horas_separadas,
                                            fechaModificacion : Date()
                                        })
                                        .$promise
                                        .then(function(respuesta) {
                                                vm.registroEdicion.estatusPTC = 0;
                                                vm.registroEdicion.horasSeparadas = respuesta.horasSeparadas;
                                                vm.registroEdicion.fechaModificacionPTC = respuesta.fechaModificacion;
                                                $modalInstance.close(vm.registroEdicion);
                                        });

                                });

                            })
                            .catch(function(error) {
                            });
                }



            };
    };

})();