(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ModalEditaInstructorController', ModalEditaInstructorController);

        ModalEditaInstructorController.$inject = ['$scope', '$modalInstance', 'registroEditar', 'CatalogoInstructores', 'CatalogoUnidadesAdmtvas', 'CatalogoLocalidades', 'CatalogoEspecialidades', 'CatalogoCursos'];

    function ModalEditaInstructorController($scope, $modalInstance, registroEditar, CatalogoInstructores, CatalogoUnidadesAdmtvas, CatalogoLocalidades, CatalogoEspecialidades, CatalogoCursos) {

            var vm = this;

            vm.listaUnidades = {};
            vm.unidadSeleccionada = {};

            vm.listaLocalidades = {};
            vm.localidadSeleccionada = {};

            vm.listaEspecialidades = {};
            vm.especialidadSeleccionada = {};

            vm.listaCursosInhabilit = true;
            vm.cursoSeleccionado = {};
            vm.listaCursos = {};

            vm.registroEdicion = {
                    idInstructor       : registroEditar.idInstructor,
                    idUnidadAdmtva     : registroEditar.idUnidadAdmtva,
                    UnidadAdmtva       : '',
                    curp               : registroEditar.curp,
                    apellidoPaterno    : registroEditar.apellidoPaterno,
                    apellidoMaterno    : registroEditar.apellidoMaterno,
                    nombre             : registroEditar.nombre,
                    rfc                : registroEditar.rfc,
                    gradoAcademico     : registroEditar.gradoAcademico,
                    telefono           : registroEditar.telefono,
                    email              : registroEditar.email,
                    escolaridad        : registroEditar.escolaridad,
                    idLocalidad        : registroEditar.idLocalidad,
                    localidad          : '',
                    activo             : registroEditar.activo,
                    cursos_habilitados : []
            };

            angular.forEach(registroEditar.cursos_habilitados, function(record) {
                  vm.registroEdicion.cursos_habilitados.push({
                      idCatalogoCurso : record.idCatalogoCurso,
                      nombreCurso     : record.nombreCurso,
                      modalidad       : record.modalidad
                  });
            });

            vm.guardar = guardar;
            vm.muestraCursosEspecialidad = muestraCursosEspecialidad;
            vm.agregaCurso = agregaCurso;
            vm.eliminaRegistro = eliminaRegistro;

            inicia();

            function inicia() {

                CatalogoUnidadesAdmtvas.find({
                    filter: {
                        fields: ['idUnidadAdmtva','nombre'],
                        order: 'nombre ASC'
                    }
                })
                .$promise
                .then(function(resp) {
                    vm.listaUnidades = resp;

                    var index = vm.listaUnidades.map(function(record) {
                                                        return record.idUnidadAdmtva;
                                                      }).indexOf(vm.registroEdicion.idUnidadAdmtva);

                    vm.unidadSeleccionada = vm.listaUnidades[index];
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
    
                CatalogoEspecialidades.find({
                    filter: {
                        fields: ['idEspecialidad','nombre'],
                        order: 'nombre ASC'
                    }
                })
                .$promise
                .then(function(resp) {
                    vm.listaEspecialidades = resp;
                });
    
            };


            function muestraCursosEspecialidad() {

                vm.listaCursosInhabilit = true;
                vm.listaCursos = [];
                CatalogoCursos.find({
                    filter: {
                        where: {idEspecialidad: vm.especialidadSeleccionada.idEspecialidad},
                        fields: ['idCatalogoCurso','nombreCurso','modalidad'],
                        order: 'nombreCurso ASC'
                    }
                })
                .$promise
                .then(function(resp) {
                    vm.listaCursos = resp;
                    vm.listaCursosInhabilit = false;

                    angular.forEach(vm.registroEdicion.cursos_habilitados, function(record) {
                        
                        var index = vm.listaCursos.map(function(registro) {
                                                            return registro.idCatalogoCurso;
                                                          }).indexOf(record.idCatalogoCurso);

                        if(index >= 0) 
                            vm.listaCursos.splice(index, 1);
                    });

                });

            };


            function agregaCurso() {
                vm.registroEdicion.cursos_habilitados.push({
                    idCatalogoCurso : vm.cursoSeleccionado.idCatalogoCurso,
                    nombreCurso     : vm.cursoSeleccionado.nombreCurso,
                    modalidad       : vm.cursoSeleccionado.modalidad
                });

                angular.forEach(vm.registroEdicion.cursos_habilitados, function(record) {
                    
                    var index = vm.listaCursos.map(function(registro) {
                                                        return registro.idCatalogoCurso;
                                                      }).indexOf(record.idCatalogoCurso);

                    if(index >= 0) 
                        vm.listaCursos.splice(index, 1);
                });
            };


            function eliminaRegistro(indice) {
                vm.registroEdicion.cursos_habilitados.splice(indice, 1);
                vm.muestraCursosEspecialidad();
            };


            function guardar() {

                var datos = {
                        idUnidadAdmtva     : vm.unidadSeleccionada.idUnidadAdmtva,
                        curp               : vm.registroEdicion.curp,
                        apellidoPaterno    : vm.registroEdicion.apellidoPaterno,
                        apellidoMaterno    : vm.registroEdicion.apellidoMaterno,
                        nombre             : vm.registroEdicion.nombre,
                        rfc                : vm.registroEdicion.rfc,
                        gradoAcademico     : vm.registroEdicion.gradoAcademico,
                        telefono           : vm.registroEdicion.telefono,
                        email              : vm.registroEdicion.email,
                        escolaridad        : vm.registroEdicion.escolaridad,
                        idLocalidad        : vm.localidadSeleccionada.idLocalidad,
                        activo             : vm.registroEdicion.activo
                };


                vm.registroEdicion.UnidadAdmtva = vm.unidadSeleccionada.nombre;
                vm.registroEdicion.localidad = vm.localidadSeleccionada.nombre;

                CatalogoInstructores.prototype$updateAttributes(
                {
                    id: vm.registroEdicion.idInstructor
                },
                    datos
                )
                .$promise
                .then(function(respuesta) {

                    CatalogoInstructores.prototype$__destroyById__cursos_habilitados({ id: vm.registroEdicion.idInstructor })
                      .$promise
                      .then(function() { 

                            if(vm.registroEdicion.cursos_habilitados.length > 0)
                            {
                                    angular.forEach(vm.registroEdicion.cursos_habilitados, function(record) {

                                            CatalogoInstructores.prototype$__link__cursos_habilitados({
                                                  id: vm.registroEdicion.idInstructor,
                                                  fk: record.idCatalogoCurso
                                            },{
                                            }) 
                                            .$promise
                                            .then(function() {
                                            });
                                    });
                            }
                            
                            $modalInstance.close(vm.registroEdicion);

                    });

                })
                .catch(function(error) {
                });
            };
    };

})();