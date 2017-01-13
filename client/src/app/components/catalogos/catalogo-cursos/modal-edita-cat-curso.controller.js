(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ModalEditaCatCursoController', ModalEditaCatCursoController);

        ModalEditaCatCursoController.$inject = ['$scope', '$timeout', '$modalInstance', 'registroEditar', 'CatalogoCursos', 'CatalogoEspecialidades'];

    function ModalEditaCatCursoController($scope,  $timeout, $modalInstance, registroEditar, CatalogoCursos, CatalogoEspecialidades) {

            var vm = this;

            vm.agregaTema      = agregaTema;
            vm.eliminaRegistro = eliminaRegistro;
            vm.guardar         = guardar;

            vm.mostrarSpiner            = false;
            vm.mostrar_msg_error        = false;

            vm.especialidadSeleccionada = 0;
            vm.listaEspecialidades      = {};
           
            vm.registroEdicion = {
                    idCatalogoCurso : registroEditar.idCatalogoCurso,
                    claveCurso      : registroEditar.claveCurso,
                    descripcion     : registroEditar.descripcion,
                    perfilEgresado  : registroEditar.perfilEgresado,
                    perfilInstructor: registroEditar.perfilInstructor,
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

                vm.mostrarSpiner = true;

                var temasVacios = false;
                angular.forEach(vm.registroEdicion.temario, function(record) {
                      if(record.tema == '')
                      temasVacios = true;
                });

                if(temasVacios == true)
                {
                    vm.mostrarSpiner = false;
                    vm.mostrar_msg_error = true;
                    $timeout(function(){
                         vm.mostrar_msg_error = false;
                    }, 2000);
                    return;                        
                }


                var datos = {
                        claveCurso     : vm.registroEdicion.claveCurso,
                        descripcion    : vm.registroEdicion.descripcion,
                        perfilEgresado  : vm.registroEdicion.perfilEgresado,
                        perfilInstructor: vm.registroEdicion.perfilInstructor,
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