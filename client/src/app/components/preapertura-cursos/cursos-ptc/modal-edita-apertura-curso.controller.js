(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ModalEditaAperturaCursoController', ModalEditaAperturaCursoController);

        ModalEditaAperturaCursoController.$inject = ['$scope', '$timeout', '$modalInstance', 'registroEditar', 'CursosPtc', 'CatalogoCursos', 'CatalogoInstructores', 'CatalogoLocalidades', 'CursosOficiales'];

    function ModalEditaAperturaCursoController($scope, $timeout, $modalInstance, registroEditar, CursosPtc, CatalogoCursos, CatalogoInstructores, CatalogoLocalidades, CursosOficiales) {

            var vm = this;

            vm.sort_by = sort_by;
            vm.openCalendar1 = openCalendar1;
            vm.openCalendar2 = openCalendar2;

            //vm.agregaInstructor = agregaInstructor;
            //vm.eliminaInstructor = eliminaInstructor;
            vm.guardar = guardar;


            vm.mostrarSpiner = false;
            vm.mostrar_msg_error = false;

            vm.listaLocalidades = [];
            vm.localidadSeleccionada = {};
           
            vm.instructorSeleccionado = {};
            vm.radioidInstructorSeleccionado = 0;
            //vm.listaInstructores = [];
           

            vm.registroEdicion = {
                    idCurso                 : registroEditar.curso_oficial_registrado[0].idCurso,
                    idCursoPTC              : registroEditar.idCursoPTC,
                    idPtc                   : registroEditar.idPtc,
                    idCatalogoCurso         : registroEditar.idCatalogoCurso,
                    nombreCurso             : registroEditar.detalle_curso.nombreCurso,
                    modalidad_pertenece     : registroEditar.modalidad_pertenece,
                    claveCurso              : registroEditar.detalle_curso.claveCurso,
                    descripcion             : registroEditar.detalle_curso.descripcion,
                    horario                 : registroEditar.curso_oficial_registrado[0].horario,
                    aulaAsignada            : registroEditar.curso_oficial_registrado[0].aulaAsignada,
                    semanas                 : registroEditar.curso_oficial_registrado[0].horasSemana,
                    total                   : registroEditar.curso_oficial_registrado[0].numeroHoras,
                    costo                   : registroEditar.curso_oficial_registrado[0].costo,
                    capacitandos            : registroEditar.curso_oficial_registrado[0].cupoMaximo,
                    min_requerido_inscritos : registroEditar.curso_oficial_registrado[0].minRequeridoInscritos,
                    min_requerido_pago      : registroEditar.curso_oficial_registrado[0].minRequeridoPago,
                    fechaInicio             : registroEditar.curso_oficial_registrado[0].fechaInicio,
                    fechaFin                : registroEditar.curso_oficial_registrado[0].fechaFin,
                    idLocalidad             : registroEditar.curso_oficial_registrado[0].idLocalidad,
                    nombreLocalidad         : '',
                    nombreMunicipio         : '',
                    idInstructor            : registroEditar.curso_oficial_registrado[0].idInstructor,
                    nombreInstructor        : '',
                    publico                 : registroEditar.curso_oficial_registrado[0].publico,
                    observaciones           : registroEditar.curso_oficial_registrado[0].observaciones,
                    instructores_propuestos : []
            };

            angular.forEach(registroEditar.instructores_propuestos, function(record) {
                  vm.registroEdicion.instructores_propuestos.push({
                      idInstructor    : record.idInstructor,
                      apellidoPaterno : record.apellidoPaterno,
                      apellidoMaterno : record.apellidoMaterno,
                      nombre          : record.nombre,
                      curp            : record.curp,
                      nombre_completo : record.apellidoPaterno + ' ' + record.apellidoMaterno + ' ' + record.nombre
                  });
            });

            vm.radioidInstructorSeleccionado = vm.registroEdicion.idInstructor;

            inicia();


            function inicia() {

                /*CatalogoCursos.instructores_habilitados({
                        id: registroEditar.idCatalogoCurso,
                        filter: {
                            where: {idUnidadAdmtva: $scope.currentUser.unidad_pertenece_id},
                            fields: ['idInstructor','apellidoPaterno','apellidoMaterno','nombre']
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
                                nombre_completo : record.apellidoPaterno + ' ' + record.apellidoMaterno + ' ' + record.nombre
                            });
                    });

                    vm.listaInstructores.sort(sort_by('nombre_completo', false, function(a){return a.toUpperCase()}));

                    var index;
                    angular.forEach(vm.registroEdicion.instructores_propuestos, function(record) {
                            
                            index = vm.listaInstructores.map(function(instructor) {
                                                                return instructor.idInstructor;
                                                              }).indexOf(record.idInstructor);

                            if(index >= 0)
                                vm.listaInstructores.splice(index, 1);
                    });

                });*/
    
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


            /*function agregaInstructor() {

                if(vm.listaInstructores.length > 0)
                {
                        vm.registroEdicion.instructores_propuestos.push({
                            idInstructor    : vm.instructorSeleccionado.idInstructor,
                            apellidoPaterno : vm.instructorSeleccionado.apellidoPaterno,
                            apellidoMaterno : vm.instructorSeleccionado.apellidoMaterno,
                            nombre          : vm.instructorSeleccionado.nombre,
                            nombre_completo : vm.instructorSeleccionado.apellidoPaterno + ' ' + vm.instructorSeleccionado.apellidoMaterno + ' ' + vm.instructorSeleccionado.nombre
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
            };*/


            /*function eliminaInstructor(indice) {

                vm.listaInstructores.push({
                    idInstructor    : vm.registroEdicion.instructores_propuestos[indice].idInstructor,
                    apellidoPaterno : vm.registroEdicion.instructores_propuestos[indice].apellidoPaterno,
                    apellidoMaterno : vm.registroEdicion.instructores_propuestos[indice].apellidoMaterno,
                    nombre          : vm.registroEdicion.instructores_propuestos[indice].nombre,
                    nombre_completo : vm.registroEdicion.instructores_propuestos[indice].apellidoPaterno + ' ' + vm.registroEdicion.instructores_propuestos[indice].apellidoMaterno + ' ' + vm.registroEdicion.instructores_propuestos[indice].nombre
                });
                
                vm.registroEdicion.instructores_propuestos.splice(indice, 1);
                vm.instructorSeleccionado = {};
            };*/


            function guardar() {

                if(vm.radioidInstructorSeleccionado == 0)
                {
                    vm.mostrar_msg_error = true;
                    $timeout(function(){
                         vm.mostrar_msg_error = false;
                    }, 3000);
                    return;
                }

                vm.mostrarSpiner = true;

                CursosPtc.prototype$updateAttributes(
                {
                    id: vm.registroEdicion.idCursoPTC
                },{
                    estatus: 2
                })
                .$promise
                .then(function(respuesta) {

                        var index;
                        index = vm.registroEdicion.instructores_propuestos.map(function(instructor) {
                                                    return instructor.idInstructor;
                                                  }).indexOf( parseInt(vm.radioidInstructorSeleccionado) );

                        vm.registroEdicion.idInstructor     = vm.registroEdicion.instructores_propuestos[index].idInstructor;
                        vm.registroEdicion.nombreInstructor = vm.registroEdicion.instructores_propuestos[index].nombre_completo;

                        var fechaInicio = new Date(vm.registroEdicion.fechaInicio);
                        fechaInicio.setHours(0);
                        fechaInicio.setMinutes(0);
                        fechaInicio.setSeconds(0);
                        
                        var fechaFin = new Date(vm.registroEdicion.fechaFin);
                        fechaFin.setHours(0);
                        fechaFin.setMinutes(0);
                        fechaFin.setSeconds(0);

                        CursosOficiales.prototype$updateAttributes(
                        {
                            id: vm.registroEdicion.idCurso
                        },{
                            idUnidadAdmtva        : $scope.currentUser.unidad_pertenece_id,
                            idCursoPTC            : vm.registroEdicion.idCursoPTC,
                            idPtc                 : vm.registroEdicion.idPtc,
                            idLocalidad           : vm.localidadSeleccionada.selected.idLocalidad,
                            nombreCurso           : vm.registroEdicion.nombreCurso,
                            claveCurso            : vm.registroEdicion.claveCurso,
                            descripcionCurso      : vm.registroEdicion.descripcion,
                            modalidad             : vm.registroEdicion.modalidad_pertenece.modalidad,
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

                            idInstructor          : vm.registroEdicion.instructores_propuestos[index].idInstructor,
                            curpInstructor        : vm.registroEdicion.instructores_propuestos[index].curp,
                            nombreInstructor      : vm.registroEdicion.instructores_propuestos[index].nombre_completo,

                            observaciones         : vm.registroEdicion.observaciones,
                            estatus               : 0,
                            publico               : vm.registroEdicion.publico,
                            programadoPTC         : true
                        })
                        .$promise
                        .then(function(respuesta) {
                                vm.registroEdicion.idLocalidad  = vm.localidadSeleccionada.selected.idLocalidad;
                                vm.registroEdicion.nombreLocalidad  = vm.localidadSeleccionada.selected.nombre;
                                vm.registroEdicion.nombreMunicipio  = vm.localidadSeleccionada.selected.municipio;
                                $modalInstance.close(vm.registroEdicion);
                        })
                        .catch(function(error) {
                        });

                })
                .catch(function(error) {
                });


            };
    };

})();