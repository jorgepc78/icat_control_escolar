(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ModalAperturaCursoController', ModalAperturaCursoController);

        ModalAperturaCursoController.$inject = ['$scope', '$timeout', '$modalInstance', 'registroEditar', 'CursosPtc', 'CatalogoCursos', 'CatalogoInstructores', 'CatalogoLocalidades', 'CursosOficiales'];

    function ModalAperturaCursoController($scope, $timeout, $modalInstance, registroEditar, CursosPtc, CatalogoCursos, CatalogoInstructores, CatalogoLocalidades, CursosOficiales) {

            var vm = this;

            vm.mostrarSpiner = false;
            vm.mostrar_msg_error = false;

            vm.listaLocalidades = {};
            vm.localidadSeleccionada = {};
           
            vm.instructorSeleccionado = {};
            vm.radioidInstructorSeleccionado = 0;
            vm.listaInstructores = [];
           
            vm.registroEdicion = {
                    idCurso                 : 0,
                    idCursoPTC              : registroEditar.idCursoPTC,
                    idPtc                   : registroEditar.idPtc,
                    idCatalogoCurso         : registroEditar.idCatalogoCurso,
                    nombreCurso             : registroEditar.detalle_curso.nombreCurso,
                    modalidad               : registroEditar.detalle_curso.modalidad,
                    claveCurso              : registroEditar.detalle_curso.claveCurso,
                    descripcion             : registroEditar.detalle_curso.descripcion,
                    horario                 : registroEditar.horario,
                    aulaAsignada            : registroEditar.aulaAsignada,
                    semanas                 : registroEditar.semanas,
                    total                   : registroEditar.total,
                    costo                   : 0,
                    capacitandos            : registroEditar.capacitandos,
                    min_requerido_inscritos : 0,
                    min_requerido_pago      : 0,
                    fechaInicio             : registroEditar.fechaInicio,
                    fechaFin                : registroEditar.fechaFin,
                    idLocalidad             : '',
                    nombreLocalidad         : '',
                    idInstructor            : '',
                    nombreInstructor        : '',
                    publico                 : '',
                    observaciones           : '',
                    estatusCursoPTC         : registroEditar.estatus,
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

            vm.sort_by = sort_by;
            vm.openCalendar1 = openCalendar1;
            vm.openCalendar2 = openCalendar2;

            vm.agregaInstructor = agregaInstructor;
            vm.eliminaInstructor = eliminaInstructor;
            vm.guardar = guardar;

            inicia();

            function inicia() {

                CatalogoCursos.instructores_habilitados({
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
            };


            function eliminaInstructor(indice) {

                vm.listaInstructores.push({
                    idInstructor    : vm.registroEdicion.instructores_propuestos[indice].idInstructor,
                    apellidoPaterno : vm.registroEdicion.instructores_propuestos[indice].apellidoPaterno,
                    apellidoMaterno : vm.registroEdicion.instructores_propuestos[indice].apellidoMaterno,
                    nombre          : vm.registroEdicion.instructores_propuestos[indice].nombre,
                    nombre_completo : vm.registroEdicion.instructores_propuestos[indice].apellidoPaterno + ' ' + vm.registroEdicion.instructores_propuestos[indice].apellidoMaterno + ' ' + vm.registroEdicion.instructores_propuestos[indice].nombre
                });
                
                vm.registroEdicion.instructores_propuestos.splice(indice, 1);
                vm.instructorSeleccionado = {};
            };


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

                        CursosOficiales
                        .create({
                            idUnidadAdmtva        : $scope.currentUser.unidad_pertenece_id,
                            idCursoPTC            : vm.registroEdicion.idCursoPTC,
                            idPtc                 : vm.registroEdicion.idPtc,
                            idLocalidad           : vm.localidadSeleccionada.idLocalidad,
                            nombreCurso           : vm.registroEdicion.nombreCurso,
                            claveCurso            : vm.registroEdicion.claveCurso,
                            descripcionCurso      : vm.registroEdicion.descripcion,
                            modalidad             : vm.registroEdicion.modalidad,
                            horario               : vm.registroEdicion.horario,
                            aulaAsignada          : vm.registroEdicion.aulaAsignada,
                            numeroHoras           : vm.registroEdicion.total,
                            costo                 : vm.registroEdicion.costo,
                            cupoMaximo            : vm.registroEdicion.capacitandos,
                            minRequeridoInscritos : vm.registroEdicion.min_requerido_inscritos,
                            minRequeridoPago      : vm.registroEdicion.min_requerido_pago,
                            fechaInicio           : vm.registroEdicion.fechaInicio,
                            fechaFin              : vm.registroEdicion.fechaFin,

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
                                vm.registroEdicion.idCurso  = respuesta.idCurso;
                                vm.registroEdicion.estatusCursoPTC  = 2;
                                vm.registroEdicion.idInstructor     = vm.registroEdicion.instructores_propuestos[index].idInstructor;
                                vm.registroEdicion.nombreInstructor = vm.registroEdicion.instructores_propuestos[index].nombre_completo;
                                vm.registroEdicion.observaciones    = vm.registroEdicion.observaciones;
                                vm.registroEdicion.idLocalidad      = vm.localidadSeleccionada.idLocalidad;
                                vm.registroEdicion.nombreLocalidad  = vm.localidadSeleccionada.nombre;
                                
                                vm.registroEdicion.nombreCurso  = vm.registroEdicion.nombreCurso;
                                vm.registroEdicion.modalidad    = vm.registroEdicion.modalidad;

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