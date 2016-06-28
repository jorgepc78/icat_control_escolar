(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ModalEditaCatCursoController', ModalEditaCatCursoController);

        ModalEditaCatCursoController.$inject = ['$scope', '$modalInstance', 'registroEditar', 'CatalogoCursos', 'CatalogoEspecialidades'];

    function ModalEditaCatCursoController($scope, $modalInstance, registroEditar, CatalogoCursos, CatalogoEspecialidades) {

            var vm = this;

            vm.especialidadSeleccionada = 0;
            vm.listaEspecialidades = {};
           
            vm.registroEdicion = {
                    idCatalogoCurso : registroEditar.idCatalogoCurso,
                    claveCurso      : registroEditar.claveCurso,
                    descripcion     : registroEditar.descripcion,
                    idEspecialidad  : registroEditar.idEspecialidad,
                    especialidad    : '',
                    modalidad       : registroEditar.modalidad,
                    nombreCurso     : registroEditar.nombreCurso,
                    numeroHoras     : registroEditar.numeroHoras,
                    temario         : []
            };

            angular.forEach(registroEditar.temario, function(record) {
                  vm.registroEdicion.temario.push({
                      tema: record.tema
                  });
            });

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

                    var index = vm.listaEspecialidades.map(function(especialidad) {
                                                        return especialidad.idEspecialidad;
                                                      }).indexOf(vm.registroEdicion.idEspecialidad);

                    vm.especialidadSeleccionada = vm.listaEspecialidades[index];
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

                CatalogoCursos.prototype$updateAttributes(
                {
                    id: vm.registroEdicion.idCatalogoCurso
                },
                    datos
                )
                .$promise
                .then(function(respuesta) {

                    CatalogoCursos.temario.destroyAll({ id: vm.registroEdicion.idCatalogoCurso })
                      .$promise
                      .then(function() { 

                            if(vm.registroEdicion.temario.length > 0)
                            {
                                    var array_temario_enviar = [];
                                    angular.forEach(vm.registroEdicion.temario, function(record) {
                                          array_temario_enviar.push({
                                              idCatalogoCurso : vm.registroEdicion.idCatalogoCurso,
                                              tema            : record.tema
                                          });
                                    });

                                    CatalogoCursos.temario.createMany(
                                      {id: vm.registroEdicion.idCatalogoCurso},
                                      array_temario_enviar
                                    )
                                    .$promise
                                    .then(function(lista_temas) {
    
                                        vm.registroEdicion.temario = lista_temas;

                                        $modalInstance.close(vm.registroEdicion);
                                    });
                            }
                            else
                            {
                                    $modalInstance.close(vm.registroEdicion);
                            }

                    });

                })
                .catch(function(error) {
                });
            };
    };

})();