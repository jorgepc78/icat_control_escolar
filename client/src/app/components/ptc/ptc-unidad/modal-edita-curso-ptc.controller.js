(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ModalEditaCursoPTCController', ModalEditaCursoPTCController);

        ModalEditaCursoPTCController.$inject = ['$scope', '$timeout', '$modalInstance', 'registroEditar', 'ProgTrimCursos', 'CursosPtc', 'CatalogoCursos', 'CatalogoInstructores', 'CatalogoModalidades'];

    function ModalEditaCursoPTCController($scope, $timeout, $modalInstance, registroEditar, ProgTrimCursos, CursosPtc, CatalogoCursos, CatalogoInstructores, CatalogoModalidades) {

            var vm = this;

            vm.sort_by = sort_by;
            vm.openCalendar1 = openCalendar1;
            vm.openCalendar2 = openCalendar2;

            vm.guardar = guardar;
            vm.agregaInstructor = agregaInstructor;
            vm.eliminaInstructor = eliminaInstructor;


            vm.opened1 = false;
            vm.opened2 = false;

            vm.mostrarSpiner = false;
            vm.mostrar_msg_error = false;
            vm.mensaje = '';
            vm.EdicionCurso = true;

            vm.cursoSeleccionado = {};
            vm.listaCursos = [];
           
            vm.modalidadSeleccionada = {};
            vm.listaModalidades = [];
           
            vm.instructorSeleccionado = {};
            vm.listaInstructores = [];
           
            //vm.horas_disponibles = registroEditar.horas_disponibles - registroEditar.horas_usadas;
            vm.horas_curso_temp  = registroEditar.recordPTC.total;

            vm.registroEdicion = {
                    idPtc           : registroEditar.recordPTC.idPtc,
                    idCursoPTC      : registroEditar.recordPTC.idCursoPTC,
                    idCatalogoCurso : registroEditar.recordPTC.idCatalogoCurso,
                    idModalidad     : registroEditar.recordPTC.idModalidad,
                    modalidad       : registroEditar.recordPTC.modalidad_pertenece.modalidad,
                    claveCurso      : '',
                    nombreCurso     : '',
                    horario         : registroEditar.recordPTC.horario,
                    aulaAsignada    : registroEditar.recordPTC.aulaAsignada,
                    capacitandos    : registroEditar.recordPTC.capacitandos,
                    semanas         : registroEditar.recordPTC.semanas,
                    total           : registroEditar.recordPTC.total,
                    fechaInicio     : registroEditar.recordPTC.fechaInicio,
                    fechaFin        : registroEditar.recordPTC.fechaFin,
                    observaciones   : registroEditar.recordPTC.observaciones,

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
                    var index = vm.listaCursos.map(function(curso) {
                                                        return curso.idCatalogoCurso;
                                                      }).indexOf(vm.registroEdicion.idCatalogoCurso);

                    vm.cursoSeleccionado.selected = vm.listaCursos[index];
                    vm.registroEdicion.claveCurso = vm.cursoSeleccionado.selected.claveCurso;
                    vm.registroEdicion.modalidad = vm.cursoSeleccionado.selected.modalidad;
                    //vm.registroEdicion.total = vm.cursoSeleccionado.selected.numeroHoras;
                });
    

                CatalogoModalidades.find({
                    filter: {
                        fields: ['idModalidad','modalidad'],
                        order: 'modalidad ASC'
                    }
                })
                .$promise
                .then(function(resp) {
                    vm.listaModalidades = resp;                   
                    var index = vm.listaModalidades.map(function(curso) {
                                                        return curso.idModalidad;
                                                      }).indexOf(vm.registroEdicion.idModalidad);

                    vm.modalidadSeleccionada = vm.listaModalidades[index];
                });
    

                CatalogoCursos.instructores_habilitados({
                        id: vm.registroEdicion.idCatalogoCurso,
                        filter: {
                            //where: {idUnidadAdmtva: $scope.currentUser.unidad_pertenece_id},
                            fields: ['idInstructor','apellidoPaterno','apellidoMaterno','nombre','efTerminal'],
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
                                        nombre_completo : record.apellidoPaterno + ' ' + record.apellidoMaterno + ' ' + record.nombre,
                                        calificacion    : record.evaluacion_curso[0].calificacion,
                                        efTerminal      : record.efTerminal
                                    });
                                }

                        });

                        angular.forEach(registroEditar.recordPTC.instructores_propuestos, function(record) {
                                
                                index = vm.listaInstructores.map(function(instructor) {
                                                                    return instructor.idInstructor;
                                                                  }).indexOf(record.idInstructor);

                                vm.registroEdicion.instructores_propuestos.push({
                                    idInstructor    : vm.listaInstructores[index].idInstructor,
                                    apellidoPaterno : vm.listaInstructores[index].apellidoPaterno,
                                    apellidoMaterno : vm.listaInstructores[index].apellidoMaterno,
                                    nombre          : vm.listaInstructores[index].nombre,
                                    nombre_completo : vm.listaInstructores[index].apellidoPaterno + ' ' + vm.listaInstructores[index].apellidoMaterno + ' ' + vm.listaInstructores[index].nombre,
                                    calificacion    : vm.listaInstructores[index].calificacion,
                                    efTerminal      : vm.listaInstructores[index].efTerminal
                                });

                                if(index >= 0)
                                    vm.listaInstructores.splice(index, 1);
                        });

                        vm.listaInstructores.sort(sort_by('nombre_completo', false, function(a){return a.toUpperCase()}));

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
                
                var diferencia = vm.registroEdicion.total - vm.horas_curso_temp;

                //if(diferencia > vm.horas_disponibles)
                //{
                //        vm.mostrarSpiner = false;
                //        vm.mensaje = 'El número de horas de este curso incrementa las horas total del PTC ('+(registroEditar.horas_usadas + diferencia)+' horas) siendo mayor a las horas disponibles para la unidad ('+registroEditar.horas_disponibles+' horas)';
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

                        var datos = {
                                idCatalogoCurso : vm.cursoSeleccionado.selected.idCatalogoCurso,
                                idModalidad     : vm.modalidadSeleccionada.idModalidad,
                                horario         : vm.registroEdicion.horario,
                                aulaAsignada    : vm.registroEdicion.aulaAsignada,
                                capacitandos    : vm.registroEdicion.capacitandos,
                                semanas         : vm.registroEdicion.semanas,
                                total           : vm.registroEdicion.total,
                                fechaInicio     : fechaInicio,
                                fechaFin        : fechaFin,
                                observaciones   : vm.registroEdicion.observaciones
                        };

                        vm.registroEdicion.modalidad   = vm.modalidadSeleccionada.modalidad;
                        vm.registroEdicion.nombreCurso = vm.cursoSeleccionado.selected.nombreCurso;
                        vm.registroEdicion.claveCurso  = vm.cursoSeleccionado.selected.claveCurso;

                        CursosPtc.prototype$updateAttributes(
                        {
                            id: vm.registroEdicion.idCursoPTC
                        },
                            datos
                        )
                        .$promise
                        .then(function(respuesta) {

                            CursosPtc.instructores_propuestos.destroyAll({ id: vm.registroEdicion.idCursoPTC })
                              .$promise
                              .then(function() { 

                                    if(vm.registroEdicion.instructores_propuestos.length > 0)
                                    {

                                            angular.forEach(vm.registroEdicion.instructores_propuestos, function(record) {

                                                    CursosPtc.instructores_propuestos.link({
                                                          id: vm.registroEdicion.idCursoPTC,
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

                            });

                        })
                        .catch(function(error) {
                        });
                //}

            };
    };

})();