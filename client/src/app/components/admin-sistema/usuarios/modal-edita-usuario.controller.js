(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ModalEditaUsuarioController', ModalEditaUsuarioController);

        ModalEditaUsuarioController.$inject = ['$scope', '$modalInstance', 'usuarioEditar', 'Usuario', 'Role', 'CatalogoUnidadesAdmtvas'];

    function ModalEditaUsuarioController($scope, $modalInstance, usuarioEditar, Usuario, Role, CatalogoUnidadesAdmtvas) {

            var vm = this;

            vm.msg_password = false;
            vm.txt_msg_password = '';
            
            vm.usuarioEditar = {
                    idUsuario      : usuarioEditar.idUsuario,
                    nombre         : usuarioEditar.nombre,
                    puesto         : usuarioEditar.puesto,
                    email          : usuarioEditar.email,
                    username       : usuarioEditar.username,
                    idUnidadAdmtva : usuarioEditar.idUnidadAdmtva,
                    UnidadAdmtva   : '',
                    avisoCurso     : usuarioEditar.avisoCurso,
                    activo         : usuarioEditar.activo,
                    idPerfil       : usuarioEditar.idPerfil,
                    perfil         : ''
            };

            vm.perfilSeleccionado = 0;
            vm.unidadSelecccionada = 0;

            vm.guardar = guardar;

            inicia();

            function inicia() {

                Role.find({
                    filter: {
                        where: { name: {neq: 'admin_sistema'} },
                        order: 'description ASC'
                    }
                })
                .$promise
                .then(function(resp) {
                    vm.listaRoles = resp;

                    var perfilSeleccionadoIndex = vm.listaRoles.map(function(rol) {
                                                        return rol.id;
                                                      }).indexOf(vm.usuarioEditar.idPerfil);

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
                                                      }).indexOf(vm.usuarioEditar.idUnidadAdmtva);

                    vm.unidadSelecccionada = vm.listaUnidades[unidadSelecccionadaIndex];
                });
    
            };

            function guardar() {

                if(vm.usuarioEditar.password == '' || vm.usuarioEditar.password === undefined)
                {
                    var datos = {

                            nombre         : vm.usuarioEditar.nombre,
                            puesto         : vm.usuarioEditar.puesto,
                            email          : vm.usuarioEditar.email,
                            username       : vm.usuarioEditar.username,
                            idUnidadAdmtva : vm.unidadSelecccionada.idUnidadAdmtva,
                            avisoCurso     : vm.usuarioEditar.avisoCurso,
                            activo         : vm.usuarioEditar.activo
                    };
                }
                else
                {
                    var datos = {
                            nombre         : vm.usuarioEditar.nombre,
                            puesto         : vm.usuarioEditar.puesto,
                            email          : vm.usuarioEditar.email,
                            username       : vm.usuarioEditar.username,
                            password       : vm.usuarioEditar.password,
                            idUnidadAdmtva : vm.unidadSelecccionada.idUnidadAdmtva,
                            avisoCurso     : vm.usuarioEditar.avisoCurso,
                            activo         : vm.usuarioEditar.activo
                    };
                }

                vm.usuarioEditar.perfil = vm.perfilSeleccionado;
                vm.usuarioEditar.idUnidadAdmtva = vm.unidadSelecccionada.idUnidadAdmtva;
                vm.usuarioEditar.UnidadAdmtva = vm.unidadSelecccionada.nombre;

                Usuario.prototype$updateAttributes(
                {
                    id: vm.usuarioEditar.idUsuario
                },
                    datos
                )
                .$promise
                .then(function(respuesta) {

                    if(vm.usuarioEditar.idPerfil != vm.perfilSeleccionado.id)
                    {
                            Usuario.perfil.destroyAll({ id: vm.usuarioEditar.idUsuario })
                              .$promise
                              .then(function() { 

                                    Role.principals.create({
                                        id: vm.perfilSeleccionado.id
                                    },{
                                        principalType: 'USER',
                                        principalId: vm.usuarioEditar.idUsuario,
                                        roleId: vm.perfilSeleccionado.id
                                    }) 
                                    .$promise
                                    .then(function() {                
                                        $modalInstance.close(vm.usuarioEditar);
                                    });
                            });

                    }
                    else
                    {
                      $modalInstance.close(vm.usuarioEditar);

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