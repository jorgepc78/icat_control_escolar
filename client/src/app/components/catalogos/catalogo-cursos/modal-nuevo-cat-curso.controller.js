(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ModalnuevoCatCursoController', ModalnuevoCatCursoController);

        ModalnuevoCatCursoController.$inject = ['$scope', '$modalInstance', 'CatalogoCursos', 'CatalogoEspecialidades'];

    function ModalnuevoCatCursoController($scope, $modalInstance, CatalogoCursos, CatalogoEspecialidades) {

            var vm = this;

            vm.especialidadSeleccionada = 0;
            vm.listaEspecialidades = {};
           
            vm.registroEdicion = {
                    idCatalogoCurso : '',
                    claveCurso      : '',
                    descripcion     : '',
                    idEspecialidad  : '',
                    especialidad    : '',
                    modalidad       : '',
                    nombreCurso     : '',
                    numeroHoras     : '',
                    temario         : []
            };

            vm.guardar = guardar;
            vm.agregaTema = agregaTema;
            vm.eliminaRegistro = eliminaRegistro;

            inicia();

            function inicia() {

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

            function agregaTema() {
                vm.registroEdicion.temario.push({
                    tema: ''
                });
            };

            function eliminaRegistro(indice) {
                vm.registroEdicion.temario.splice(indice, 1);
            };


            function guardar() {

                    var datos = {
                            claveCurso     : vm.registroEdicion.claveCurso,
                            descripcion    : vm.registroEdicion.descripcion,
                            idEspecialidad : vm.especialidadSeleccionada.idEspecialidad,
                            modalidad      : vm.registroEdicion.modalidad,
                            nombreCurso    : vm.registroEdicion.nombreCurso,
                            numeroHoras    : vm.registroEdicion.numeroHoras
                    };

                    vm.registroEdicion.idEspecialidad = vm.especialidadSeleccionada.idEspecialidad;
                    vm.registroEdicion.especialidad = vm.especialidadSeleccionada.nombre;

                    CatalogoCursos
                    .create({
                        claveCurso     : vm.registroEdicion.claveCurso,
                        descripcion    : vm.registroEdicion.descripcion,
                        idEspecialidad : vm.especialidadSeleccionada.idEspecialidad,
                        modalidad      : vm.registroEdicion.modalidad,
                        nombreCurso    : vm.registroEdicion.nombreCurso,
                        numeroHoras    : vm.registroEdicion.numeroHoras
                    })
                    .$promise
                    .then(function(respuesta) {

                            if(vm.registroEdicion.temario.length > 0)
                            {
                                    var array_temario_enviar = [];
                                    angular.forEach(vm.registroEdicion.temario, function(record) {
                                          array_temario_enviar.push({
                                              idCatalogoCurso : respuesta.idCatalogoCurso,
                                              tema            : record.tema
                                          });
                                    });

                                    CatalogoCursos.temario.createMany(
                                      {id: respuesta.idCatalogoCurso},
                                      array_temario_enviar
                                    )
                                    .$promise
                                    .then(function(lista_temas) {
                                        $modalInstance.close();
                                    });
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