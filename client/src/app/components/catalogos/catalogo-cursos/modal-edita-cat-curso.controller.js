(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ModalEditaCatCursoController', ModalEditaCatCursoController);

        ModalEditaCatCursoController.$inject = ['$scope', '$modalInstance', 'registroEditar', 'CatalogoCursos', 'CatalogoEspecialidades'];

    function ModalEditaCatCursoController($scope, $modalInstance, registroEditar, CatalogoCursos, CatalogoEspecialidades) {

            var vm = this;

            vm.especialidadSeleccionado = 0;
            
            vm.registroEditar = {
                    idCatalogoCurso : registroEditar.idCatalogoCurso,
                    claveCurso      : registroEditar.claveCurso,
                    idEspecialidad  : registroEditar.idEspecialidad,
                    especialidad    : '',
                    modalidad       : registroEditar.modalidad,
                    nombreCurso     : registroEditar.nombreCurso,
                    numeroHoras     : registroEditar.numeroHoras
            };


            vm.guardar = guardar;

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
                    vm.listaRoles = resp;

                    var perfilSeleccionadoIndex = vm.listaRoles.map(function(rol) {
                                                        return rol.id;
                                                      }).indexOf(vm.registroEditar.idPerfil);

                    vm.perfilSeleccionado = vm.listaRoles[perfilSeleccionadoIndex];
                });
    
                CatalogoUnidadesAdmtvas.find({
                    filter: {
                        order: 'nombre ASC'
                    }
                })
                .$promise
                .then(function(resp) {
                    vm.listaUnidades = resp;

                    var unidadSelecccionadaIndex = vm.listaUnidades.map(function(unidad) {
                                                        return unidad.idUnidadAdmtva;
                                                      }).indexOf(vm.registroEditar.idUnidadAdmtva);

                    vm.unidadSelecccionada = vm.listaUnidades[unidadSelecccionadaIndex];
                });
    
            };

            function guardar() {

                if(vm.registroEditar.password == '' || vm.registroEditar.password === undefined)
                {
                    var datos = {

                            nombre         : vm.registroEditar.nombre,
                            puesto         : vm.registroEditar.puesto,
                            email          : vm.registroEditar.email,
                            username       : vm.registroEditar.username,
                            idUnidadAdmtva : vm.unidadSelecccionada.idUnidadAdmtva,
                            avisoCurso     : vm.registroEditar.avisoCurso,
                            activo         : vm.registroEditar.activo
                    };
                }
                else
                {
                    var datos = {
                            nombre         : vm.registroEditar.nombre,
                            puesto         : vm.registroEditar.puesto,
                            email          : vm.registroEditar.email,
                            username       : vm.registroEditar.username,
                            password       : vm.registroEditar.password,
                            idUnidadAdmtva : vm.unidadSelecccionada.idUnidadAdmtva,
                            avisoCurso     : vm.registroEditar.avisoCurso,
                            activo         : vm.registroEditar.activo
                    };
                }

                vm.registroEditar.perfil = vm.perfilSeleccionado;
                vm.registroEditar.idUnidadAdmtva = vm.unidadSelecccionada.idUnidadAdmtva;
                vm.registroEditar.UnidadAdmtva = vm.unidadSelecccionada.nombre;

                Usuario.prototype$updateAttributes(
                {
                    id: vm.registroEditar.idUsuario
                },
                    datos
                )
                .$promise
                .then(function(respuesta) {

                    if(vm.registroEditar.idPerfil != vm.perfilSeleccionado.id)
                    {
                            Usuario.perfil.destroyAll({ id: vm.registroEditar.idUsuario })
                              .$promise
                              .then(function() { 

                                    Role.principals.create({
                                        id: vm.perfilSeleccionado.id
                                    },{
                                        principalType: 'USER',
                                        principalId: vm.registroEditar.idUsuario,
                                        roleId: vm.perfilSeleccionado.id
                                    }) 
                                    .$promise
                                    .then(function() {                
                                        $modalInstance.close(vm.registroEditar);
                                    });
                            });

                    }
                    else
                    {
                      $modalInstance.close(vm.registroEditar);

                    }
                })
                .catch(function(error) {
                    if(error.status == 422) {
                            vm.txt_msg_password = 'El email ya existe';
                            vm.msg_password = true;
                            $timeout(function(){
                                 vm.msg_password = false;
                                 vm.txt_msg_password = '';
                            }, 3000);
                      }
                });
            };
    };

})();