(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ModalNUevoInstructorController', ModalNUevoInstructorController);

        ModalNUevoInstructorController.$inject = ['$scope', '$modalInstance', 'CatalogoInstructores', 'CatalogoUnidadesAdmtvas', 'CatalogoLocalidades', 'CatalogoEspecialidades', 'CatalogoCursos'];

    function ModalNUevoInstructorController($scope, $modalInstance, CatalogoInstructores, CatalogoUnidadesAdmtvas, CatalogoLocalidades, CatalogoEspecialidades, CatalogoCursos) {

            var vm = this;

            vm.mostrarSpiner = false;

            vm.listaUnidades = {};
            vm.unidadSeleccionada = {};

            vm.listaLocalidades = {};
            vm.localidadSeleccionada = {};

            vm.listaEspecialidades = {};
            vm.especialidadSeleccionada = {};

            vm.listaCursosInhabilit = true;
            vm.cursoSeleccionado = {};
            vm.listaCursos = [];

            vm.registroEdicion = {
                    idInstructor       : '',
                    idUnidadAdmtva     : 0,
                    curp               : '',
                    apellidoPaterno    : '',
                    apellidoMaterno    : '',
                    nombre             : '',
                    rfc                : '',
                    gradoAcademico     : '',
                    telefono           : '',
                    email              : '',
                    escolaridad        : '',
                    idLocalidad        : 0,
                    activo             : true,
                    cursos_habilitados : []
            };

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

                    if($scope.currentUser.unidad_pertenece_id > 1)
                    {
                        var index = vm.listaUnidades.map(function(record) {
                                                            return record.idUnidadAdmtva;
                                                          }).indexOf($scope.currentUser.unidad_pertenece_id);

                        vm.unidadSeleccionada = vm.listaUnidades[index];                        
                    }
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
                vm.cursoSeleccionado = {};
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

                vm.cursoSeleccionado = {};
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

                vm.mostrarSpiner = true;

                CatalogoInstructores
                .create({
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
                })
                .$promise
                .then(function(respuesta) {

                        if(vm.registroEdicion.cursos_habilitados.length > 0)
                        {
                                angular.forEach(vm.registroEdicion.cursos_habilitados, function(record) {

                                        CatalogoInstructores.cursos_habilitados.link({
                                              id: respuesta.idInstructor,
                                              fk: record.idCatalogoCurso
                                        },{
                                        }) 
                                        .$promise
                                        .then(function() {
                                        });
                                });
                                $modalInstance.close();
                        }
                        else
                        {
                                $modalInstance.close();
                        }

                })
                .catch(function(error) {
                });

            };
    };

})();