(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ModalEditaCursoPTCController', ModalEditaCursoPTCController);

        ModalEditaCursoPTCController.$inject = ['$scope', '$modalInstance', 'registroEditar', 'ProgTrimCursos', 'CursosPtc', 'CatalogoCursos', 'CatalogoInstructores'];

    function ModalEditaCursoPTCController($scope, $modalInstance, registroEditar, ProgTrimCursos, CursosPtc, CatalogoCursos, CatalogoInstructores) {

            var vm = this;

            vm.mostrarSpiner = false;
            vm.EdicionCurso = true;

            vm.cursoSeleccionado = 0;
            vm.listaCursos = {};
           
            vm.instructorSeleccionado = {};
            vm.listaInstructores = [];
           

            vm.registroEdicion = {
                    idPtc           : registroEditar.idPtc,
                    idCursoPTC         : registroEditar.idCursoPTC,
                    idCatalogoCurso : registroEditar.idCatalogoCurso,
                    nombreCurso     : '',
                    modalidad       : '',
                    horario         : registroEditar.horario,
                    aulaAsignada    : registroEditar.aulaAsignada,
                    capacitandos    : registroEditar.capacitandos,
                    semanas         : registroEditar.semanas,
                    total           : registroEditar.total,
                    fechaInicio     : registroEditar.fechaInicio,
                    fechaFin        : registroEditar.fechaFin,
                    observaciones   : registroEditar.observaciones,

                    estatusPTC      : 0,
                    fechaModificacionPTC: '',

                    instructores_propuestos: []
            };

            angular.forEach(registroEditar.instructores_propuestos, function(record) {
                  vm.registroEdicion.instructores_propuestos.push({
                      idInstructor    : record.idInstructor,
                      apellidoPaterno : record.apellidoPaterno,
                      apellidoMaterno : record.apellidoMaterno,
                      nombre          : record.nombre,
                      nombre_completo : record.apellidoPaterno + ' ' + record.apellidoMaterno + ' ' + record.nombre
                  });
            });

            vm.sort_by = sort_by;
            vm.openCalendar1 = openCalendar1;
            vm.openCalendar2 = openCalendar2;

            vm.guardar = guardar;
            vm.agregaInstructor = agregaInstructor;
            vm.eliminaInstructor = eliminaInstructor;

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

                    vm.cursoSeleccionado = vm.listaCursos[index];
                });
    

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

                vm.mostrarSpiner = true;
                
                var datos = {
                        idCatalogoCurso : vm.cursoSeleccionado.idCatalogoCurso,
                        horario         : vm.registroEdicion.horario,
                        aulaAsignada    : vm.registroEdicion.aulaAsignada,
                        capacitandos    : vm.registroEdicion.capacitandos,
                        semanas         : vm.registroEdicion.semanas,
                        total           : vm.registroEdicion.total,
                        fechaInicio     : vm.registroEdicion.fechaInicio,
                        fechaFin        : vm.registroEdicion.fechaFin,
                        observaciones   : vm.registroEdicion.observaciones
                };

                vm.registroEdicion.nombreCurso = vm.cursoSeleccionado.nombreCurso;
                vm.registroEdicion.modalidad   = vm.cursoSeleccionado.modalidad;

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

                            ProgTrimCursos.prototype$updateAttributes(
                            {
                                id: vm.registroEdicion.idPtc
                            },{
                                estatus: 0,
                                fechaModificacion : Date()
                            })
                            .$promise
                            .then(function(respuesta) {
                                    vm.registroEdicion.estatusPTC = 0;
                                    vm.registroEdicion.fechaModificacionPTC = respuesta.fechaModificacion;
                                    $modalInstance.close(vm.registroEdicion);
                            });

                    });

                })
                .catch(function(error) {
                });
            };
    };

})();