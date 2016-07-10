(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('loginController', loginController)

    loginController.$inject = ['$rootScope','$timeout', '$state', 'localStorageService', 'Usuario'];

    function loginController($rootScope, $timeout, $state, localStorageService, Usuario) {

        var vm = this;

        vm.login = login;

        vm.user = {
            username: 'jorgepc',
            password: 'jorgepc'
        };

        vm.mostrar_msg_login = false;
        vm.msg_login_txt = '';
        vm.msg_color = 'danger';


        function login() {

            vm.mostrar_msg_login = false;

            Usuario
            .login({
                username: vm.user.username,
                password: vm.user.password
            })
            .$promise
            .then(function(response) {

                    Usuario.find({ 
                        filter: {
                              where: {
                                and : [{idUsuario: response.userId},{'activo': true}]
                              },
                              fields: ['idUsuario','nombre','puesto','idUnidadAdmtva','avisoCurso'],
                              include: [
                                'unidad_pertenece',
                                {
                                    relation: 'perfil',
                                    scope: {
                                        fields:['name','description']
                                    }
                                }
                              ]
                        }
                    })
                    .$promise
                    .then(function(resp) {

                        if(resp.length == 0)
                        {
                            vm.msg_login_txt = 'Usuario desactivado';
                            vm.msg_color = 'warning';

                            vm.mostrar_msg_login = true;
                            $timeout(function(){
                                 vm.mostrar_msg_login = false;
                                 vm.msg_login_txt = '';
                            }, 3000);
                        }
                        else
                        {
                            vm.msg_login_txt = 'Entrando al sistema...';
                            vm.msg_color = 'success';
                            vm.mostrar_msg_login = true;
                            $timeout(function() {

                                    var usuario = resp[0];

                                    $rootScope.currentUser = {
                                        id_usuario          : usuario.idUsuario,
                                        nombre              : usuario.nombre,
                                        puesto              : usuario.puesto,
                                        perfil              : usuario.perfil[0].name,
                                        descripcion_perfil  : usuario.perfil[0].description,
                                        unidad_pertenece_id : usuario.idUnidadAdmtva,
                                        nombre_unidad       : usuario.unidad_pertenece.nombre,
                                        estatus             : 200
                                    };
                                    localStorageService.set('usuario', $rootScope.currentUser);
                                    $state.go('index.inicio');

                            }, 1000);
                        }
                    });
            })
            .catch(function(error) {
                if(error.status == 401) {

                    $rootScope.currentUser = {
                        estatus: error.status
                    };

                    if(error.data.error.message == 'login failed as the email has not been verified') {
                        vm.msg_login_txt = 'El email no ha sido verificado';
                        vm.msg_color = 'warning';
                    }
                    else {
                        vm.msg_login_txt = 'El nombre de usuario no existe o contraseña incorrecta';
                        vm.msg_color = 'danger';
                    }

                    vm.mostrar_msg_login = true;
                    $timeout(function(){
                         vm.mostrar_msg_login = false;
                         vm.msg_login_txt = '';
                    }, 3000);

                  }
            });
        }

    };

})();