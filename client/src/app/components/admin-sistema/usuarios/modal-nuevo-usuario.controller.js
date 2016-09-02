(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ModalNuevoUsuarioController', ModalNuevoUsuarioController);

        ModalNuevoUsuarioController.$inject = ['$scope', '$timeout', '$modalInstance', 'Usuario', 'Role', 'CatalogoUnidadesAdmtvas'];

    function ModalNuevoUsuarioController($scope, $timeout, $modalInstance, Usuario, Role, CatalogoUnidadesAdmtvas) {

            var vm = this;
            
            vm.muestraPerfilesUnidad = muestraPerfilesUnidad;
            vm.guardar               = guardar;

            vm.mostrarSpiner = false;
            vm.msg_password = false;
            vm.txt_msg_password = '';
            vm.listaUnidades = [];
            vm.listaRoles = [];

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

            vm.unidadSelecccionada = {};
            vm.perfilSeleccionado = {};


            inicia();

            function inicia() {
       
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



            function muestraPerfilesUnidad() {

                vm.listaRoles = [];

                if(vm.unidadSelecccionada.idUnidadAdmtva == 1)
                    var condicion = {name: {inq: ["dir_gral", "dir_academica","programas","serv_escolar","dir_planeacion","dir_admin","dir_vincula"]}};
                else
                    var condicion = {name: {inq: ["unidad_capacit", "unidad_inscrip","unidad_admin","unidad_vincula"]}};

                Role.find({
                    filter: {
                        where: condicion,
                        order: 'description ASC'
                    }
                })
                .$promise
                .then(function(resp) {
                    vm.listaRoles = resp;
                });    

            }



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
                            nombre                  : vm.usuarioEditar.nombre,
                            puesto                  : vm.usuarioEditar.puesto,
                            email                   : vm.usuarioEditar.email,
                            username                : vm.usuarioEditar.username,
                            password                : vm.usuarioEditar.password,
                            idUnidadAdmtva          : vm.unidadSelecccionada.idUnidadAdmtva,
                            avisosPTC               : vm.usuarioEditar.avisosPTC,
                            avisosPreaperturaCursos : vm.usuarioEditar.avisosPreaperturaCursos,
                            avisosInscripcion       : vm.usuarioEditar.avisosInscripcion,
                            avisosCierreCursos      : vm.usuarioEditar.avisosCierreCursos,
                            activo                  : vm.usuarioEditar.activo
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