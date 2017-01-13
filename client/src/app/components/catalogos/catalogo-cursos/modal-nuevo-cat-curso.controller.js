(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ModalnuevoCatCursoController', ModalnuevoCatCursoController);

        ModalnuevoCatCursoController.$inject = ['$scope', '$timeout', '$modalInstance', 'CatalogoCursos', 'CatalogoEspecialidades'];

    function ModalnuevoCatCursoController($scope, $timeout, $modalInstance, CatalogoCursos, CatalogoEspecialidades) {

            var vm = this;

            vm.guardar = guardar;
            vm.agregaTema = agregaTema;
            vm.eliminaRegistro = eliminaRegistro;

            vm.mostrarSpiner = false;
            vm.mostrar_msg_error = false;

            vm.especialidadSeleccionada = 0;
            vm.listaEspecialidades = {};
           
            vm.registroEdicion = {
                    idCatalogoCurso : '',
                    claveCurso      : '',
                    descripcion     : '',
                    perfilEgresado  : '',
                    perfilInstructor: '',
                    idEspecialidad  : '',
                    especialidad    : '',
                    modalidad       : '',
                    nombreCurso     : '',
                    numeroHoras     : '',
                    temario         : []
            };

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

                    CatalogoCursos
                    .create({
                        claveCurso     : vm.registroEdicion.claveCurso,
                        descripcion    : vm.registroEdicion.descripcion,
                        perfilEgresado : vm.registroEdicion.perfilEgresado,
                        perfilInstructor : vm.registroEdicion.perfilInstructor,
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