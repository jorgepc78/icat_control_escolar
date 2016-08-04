(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ModalNuevoUsuarioController', ModalNuevoUsuarioController);

        ModalNuevoUsuarioController.$inject = ['$scope', '$timeout', '$modalInstance', 'Usuario', 'Role', 'CatalogoUnidadesAdmtvas'];

    function ModalNuevoUsuarioController($scope, $timeout, $modalInstance, Usuario, Role, CatalogoUnidadesAdmtvas) {

            var vm = this;
            
            vm.guardar = guardar;

            vm.mostrarSpiner = false;
            vm.msg_password = false;
            vm.txt_msg_password = '';

            vm.usuarioEditar = {
                    nombre                  : '',
                    puesto                  : '',
                    email                   : '',
                    username                : '',
                    idUnidadAdmtva          : 0,
                    UnidadAdmtva            : '',
                    avisosPTC               : false,
                    avisosPreaperturaCursos : false,
                    avisosInscripcion       : false,
                    avisosCierreCursos      : false,
                    activo                  : true,
                    idPerfil                : 0,
                    perfil                  : ''
            };

            vm.perfilSeleccionado = 0;
            vm.unidadSelecccionada = 0;


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
                });
    
                CatalogoUnidadesAdmtvas.find({
                    filter: {
                        order: 'nombre ASC'
                    }
                })
                .$promise
                .then(function(resp) {
                    vm.listaUnidades = resp;
                });

            };

            function guardar() {

                vm.mostrarSpiner = true;

                if(vm.usuarioEditar.password == '' || vm.usuarioEditar.password === undefined)
                {
                    vm.mostrarSpiner = false;
                    vm.txt_msg_password = 'En necesario escribir el password';
                    vm.msg_password = true;
                    $timeout(function(){
                         vm.msg_password = false;
                         vm.txt_msg_password = '';
                    }, 3000);
                }
                else
                {
                    Usuario
                    .create({
                            nombre         : vm.usuarioEditar.nombre,
                            puesto         : vm.usuarioEditar.puesto,
                            email          : vm.usuarioEditar.email,
                            username       : vm.usuarioEditar.username,
                            password       : vm.usuarioEditar.password,
                            idUnidadAdmtva : vm.unidadSelecccionada.idUnidadAdmtva,
                            avisoCurso     : vm.usuarioEditar.avisoCurso,
                            activo         : vm.usuarioEditar.activo
                    })
                    .$promise
                    .then(function(respuesta) {
                            Role.principals.create({
                                id: vm.perfilSeleccionado.id
                            },{
                                principalType: 'USER',
                                principalId: respuesta.idUsuario,
                                roleId: vm.perfilSeleccionado.id
                            }) 
                            .$promise
                            .then(function() {                
                                $modalInstance.close();
                            });
                    })
                    .catch(function(error) {
                        if(error.status == 422) {
                                vm.mostrarSpiner = false;
                                vm.txt_msg_password = 'El nombre de usuario o el email ya existen';
                                vm.msg_password = true;
                                $timeout(function(){
                                     vm.msg_password = false;
                                     vm.txt_msg_password = '';
                                }, 3000);
                        }
                    });

                }
            };
    };

})();