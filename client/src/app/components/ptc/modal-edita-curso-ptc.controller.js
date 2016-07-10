(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ModalEditaCursoPTCController', ModalEditaCursoPTCController);

        ModalEditaCursoPTCController.$inject = ['$scope', '$modalInstance', 'registroEditar', 'ProgTrimCursos', 'CursosPtc', 'CatalogoCursos', 'CatalogoInstructores'];

    function ModalEditaCursoPTCController($scope, $modalInstance, registroEditar, ProgTrimCursos, CursosPtc, CatalogoCursos, CatalogoInstructores) {

            var vm = this;

            vm.mostrarSpiner = false;

            vm.cursoSeleccionado = 0;
            vm.listaCursos = {};
           
            vm.instructorSeleccionado = 0;
            vm.listaInstructores = {};
           

            vm.registroEdicion = {
                    idPtc           : registroEditar.idPtc,
                    idCurso         : registroEditar.idCurso,
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
                      nombre          : record.nombre
                  });
            });

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
    

                CatalogoInstructores.find({
                    filter: {
                        where: {idUnidadAdmtva: $scope.currentUser.unidad_pertenece_id},
                        fields: ['idInstructor','apellidoPaterno','apellidoMaterno','nombre'],
                        order: ['apellidoPaterno ASC','apellidoMaterno ASC','nombre ASC']
                    }
                })
                .$promise
                .then(function(resp) {

                    vm.listaInstructores = resp;

                    var index;
                    angular.forEach(vm.registroEdicion.instructores_propuestos, function(record) {
                            
                            index = vm.listaInstructores.map(function(instructor) {
                                                                return instructor.idInstructor;
                                                              }).indexOf(record.idInstructor);

                            vm.listaInstructores.splice(index, 1);
                    });

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

            function agregaInstructor() {

                if(vm.listaInstructores.length > 0)
                {
                        vm.registroEdicion.instructores_propuestos.push({
                            idInstructor    : vm.instructorSeleccionado.idInstructor,
                            apellidoPaterno : vm.instructorSeleccionado.apellidoPaterno,
                            apellidoMaterno : vm.instructorSeleccionado.apellidoMaterno,
                            nombre          : vm.instructorSeleccionado.nombre
                        });

                        var index;
                        angular.forEach(vm.registroEdicion.instructores_propuestos, function(record) {
                                
                                index = vm.listaInstructores.map(function(instructor) {
                                                                    return instructor.idInstructor;
                                                                  }).indexOf(record.idInstructor);

                                vm.listaInstructores.splice(index, 1);
                        });
                }
            };


            function eliminaInstructor(indice) {

                vm.listaInstructores.push({
                    idInstructor    : vm.registroEdicion.instructores_propuestos[indice].idInstructor,
                    apellidoPaterno : vm.registroEdicion.instructores_propuestos[indice].apellidoPaterno,
                    apellidoMaterno : vm.registroEdicion.instructores_propuestos[indice].apellidoMaterno,
                    nombre          : vm.registroEdicion.instructores_propuestos[indice].nombre
                });
                
                vm.registroEdicion.instructores_propuestos.splice(indice, 1);
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
                    id: vm.registroEdicion.idCurso
                },
                    datos
                )
                .$promise
                .then(function(respuesta) {

                    CursosPtc.instructores_propuestos.destroyAll({ id: vm.registroEdicion.idCurso })
                      .$promise
                      .then(function() { 

                            if(vm.registroEdicion.instructores_propuestos.length > 0)
                            {

                                    angular.forEach(vm.registroEdicion.instructores_propuestos, function(record) {

                                            CursosPtc.instructores_propuestos.link({
                                                  id: vm.registroEdicion.idCurso,
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