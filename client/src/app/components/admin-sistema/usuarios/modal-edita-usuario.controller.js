(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ModalEditaUsuarioController', ModalEditaUsuarioController);

        ModalEditaUsuarioController.$inject = ['$scope', '$timeout', '$modalInstance', 'usuarioEditar', 'Usuario', 'Role', 'CatalogoUnidadesAdmtvas'];

    function ModalEditaUsuarioController($scope, $timeout, $modalInstance, usuarioEditar, Usuario, Role, CatalogoUnidadesAdmtvas) {

            var vm = this;

            vm.muestraPerfilesUnidad = muestraPerfilesUnidad;
            vm.guardar               = guardar;

            vm.mostrarSpiner = false;
            vm.msg_password = false;
            vm.txt_msg_password = '';
            vm.listaUnidades = [];
            vm.listaRoles = [];
            
            vm.usuarioEditar = {
                    idUsuario               : usuarioEditar.idUsuario,
                    nombre                  : usuarioEditar.nombre,
                    puesto                  : usuarioEditar.puesto,
                    email                   : usuarioEditar.email,
                    username                : usuarioEditar.username,
                    idUnidadAdmtva          : usuarioEditar.idUnidadAdmtva,
                    UnidadAdmtva            : '',
                    avisosPTC               : usuarioEditar.avisosPTC,
                    avisosPreaperturaCursos : usuarioEditar.avisosPreaperturaCursos,
                    avisosInscripcion       : usuarioEditar.avisosInscripcion,
                    avisosCierreCursos      : usuarioEditar.avisosCierreCursos,
                    activo                  : usuarioEditar.activo,
                    idPerfil                : (usuarioEditar.perfil.length > 0 ? usuarioEditar.perfil[0].id : 0),
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

                        var unidadSelecccionadaIndex = vm.listaUnidades.map(function(unidad) {
                                                            return unidad.idUnidadAdmtva;
                                                          }).indexOf(vm.usuarioEditar.idUnidadAdmtva);

                        vm.unidadSelecccionada = vm.listaUnidades[unidadSelecccionadaIndex];

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

                            var perfilSeleccionadoIndex = vm.listaRoles.map(function(rol) {
                                                                return rol.id;
                                                              }).indexOf(vm.usuarioEditar.idPerfil);

                            vm.perfilSeleccionado = vm.listaRoles[perfilSeleccionadoIndex];
                        });

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
                    var datos = {

                            nombre                  : vm.usuarioEditar.nombre,
                            puesto                  : vm.usuarioEditar.puesto,
                            email                   : vm.usuarioEditar.email,
                            username                : vm.usuarioEditar.username,
                            idUnidadAdmtva          : vm.unidadSelecccionada.idUnidadAdmtva,
                            avisosPTC               : vm.usuarioEditar.avisosPTC,
                            avisosPreaperturaCursos : vm.usuarioEditar.avisosPreaperturaCursos,
                            avisosInscripcion       : vm.usuarioEditar.avisosInscripcion,
                            avisosCierreCursos      : vm.usuarioEditar.avisosCierreCursos,
                            activo                  : vm.usuarioEditar.activo
                    };
                }
                else
                {
                    var datos = {
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
                            vm.mostrarSpiner = false;
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