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
            username: '',
            password: ''
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

                            var usuario = resp[0];
                            var perfil_menu = crea_perfil_menu(usuario.perfil[0].name);

                            $timeout(function() {

                                    $rootScope.currentUser = {
                                        id_usuario          : usuario.idUsuario,
                                        nombre              : usuario.nombre,
                                        puesto              : usuario.puesto,
                                        perfil              : usuario.perfil[0].name,
                                        descripcion_perfil  : usuario.perfil[0].description,
                                        unidad_pertenece_id : usuario.idUnidadAdmtva,
                                        nombre_unidad       : usuario.unidad_pertenece.nombre,
                                        perfil_menu         : perfil_menu,
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


    function crea_perfil_menu(perfil) {

        var json_perfil_menu = {};
        
        switch (perfil) {
            case 'admin_sistema':
                json_perfil_menu = {
                    usuarios_menu                             : true,
                    usuarios_sistema                          : true,
                    catalogos_menu                            : false,
                    catalogos_temas                           : false,
                    catalogos_especialidades                  : false,
                    catalogos_cursos                          : false,
                    instructores_menu                         : false,
                    instructores_catinstructores              : false,
                    instructores_consinstructores             : false,
                    plan_cursos_menu                          : false,
                    plan_cursos_horas_unidad                  : false,
                    plan_cursos_metas_capacit                 : false,
                    plan_cursos_planeacion_ptc                : false,
                    plan_cursos_revision_ptc                  : false,
                    plan_cursos_resumen_ptc_unidades          : false,
                    plan_cursos_ptc_autorizados               : false,
                    pre_cursos_eval_menu                      : false,
                    pre_cursos_eval_cursos_ptc                : false,
                    pre_cursos_eval_cursos_fuera_ptc          : false,
                    pre_cursos_eval_validacion_cursos         : false,
                    pre_cursos_eval_roco_estandar             : false,
                    pre_cursos_eval_validacion_roco_estandar  : false,
                    cursos_eval_autorizados_menu              : false,
                    cursos_eval_autorizados_cursos_vigentes   : false,
                    cursos_eval_autorizados_cursos_historicos : false,
                    cursos_eval_autorizados_eval_vigentes     : false,
                    cursos_eval_autorizados_eval_historicos   : false,
                    registro_capacitandos_menu                : false,
                    inscrip_pagos_menu                        : false,
                    inscrip_pagos_registro_pago_curso         : false,
                    inscrip_pagos_registro_pago_eval          : false,
                    reportes_menu                             : false,
                    reportes_resumen_alumnos_cursos           : false,
                    reportes_bitacora                         : false,
                    tutorial_menu                             : false,
                    encuestas_menu                            : false,
                    encuestas_participante_curso              : false
                };
                break;
            case 'dir_gral':
                json_perfil_menu = {
                    usuarios_menu                             : false,
                    usuarios_sistema                          : false,

                    catalogos_menu                            : true,
                    catalogos_temas                           : true,
                    catalogos_especialidades                  : true,
                    catalogos_cursos                          : true,

                    instructores_menu                         : true,
                    instructores_catinstructores              : true,
                    instructores_consinstructores             : false,

                    plan_cursos_menu                          : true,
                    plan_cursos_horas_unidad                  : false,
                    plan_cursos_metas_capacit                 : false,
                    plan_cursos_planeacion_ptc                : false,
                    plan_cursos_revision_ptc                  : true,
                    plan_cursos_resumen_ptc_unidades          : false,
                    plan_cursos_ptc_autorizados               : true,

                    pre_cursos_eval_menu                      : true,
                    pre_cursos_eval_cursos_ptc                : false,
                    pre_cursos_eval_cursos_fuera_ptc          : false,
                    pre_cursos_eval_validacion_cursos         : true,
                    pre_cursos_eval_roco_estandar             : false,
                    pre_cursos_eval_validacion_roco_estandar  : true,

                    cursos_eval_autorizados_menu              : true,
                    cursos_eval_autorizados_cursos_vigentes   : true,
                    cursos_eval_autorizados_cursos_historicos : true,
                    cursos_eval_autorizados_eval_vigentes     : true,
                    cursos_eval_autorizados_eval_historicos   : true,

                    registro_capacitandos_menu                : false,

                    inscrip_pagos_menu                        : false,
                    inscrip_pagos_registro_pago_curso         : false,
                    inscrip_pagos_registro_pago_eval          : false,

                    reportes_menu                             : true,
                    reportes_resumen_alumnos_cursos           : true,
                    reportes_bitacora                         : true,

                    tutorial_menu                             : false,
                    encuestas_menu                            : false,
                    encuestas_participante_curso              : false
                };
                break;
            case 'dir_academica':
                json_perfil_menu = {
                    usuarios_menu                             : false,
                    usuarios_sistema                          : false,

                    catalogos_menu                            : true,
                    catalogos_temas                           : true,
                    catalogos_especialidades                  : true,
                    catalogos_cursos                          : true,

                    instructores_menu                         : true,
                    instructores_catinstructores              : true,
                    instructores_consinstructores             : false,

                    plan_cursos_menu                          : true,
                    plan_cursos_horas_unidad                  : false,
                    plan_cursos_metas_capacit                 : false,
                    plan_cursos_planeacion_ptc                : false,
                    plan_cursos_revision_ptc                  : true,
                    plan_cursos_resumen_ptc_unidades          : true,
                    plan_cursos_ptc_autorizados               : true,

                    pre_cursos_eval_menu                      : true,
                    pre_cursos_eval_cursos_ptc                : false,
                    pre_cursos_eval_cursos_fuera_ptc          : false,
                    pre_cursos_eval_validacion_cursos         : true,
                    pre_cursos_eval_roco_estandar             : false,
                    pre_cursos_eval_validacion_roco_estandar  : true,

                    cursos_eval_autorizados_menu              : true,
                    cursos_eval_autorizados_cursos_vigentes   : true,
                    cursos_eval_autorizados_cursos_historicos : true,
                    cursos_eval_autorizados_eval_vigentes     : true,
                    cursos_eval_autorizados_eval_historicos   : true,

                    registro_capacitandos_menu                : false,

                    inscrip_pagos_menu                        : false,
                    inscrip_pagos_registro_pago_curso         : false,
                    inscrip_pagos_registro_pago_eval          : false,

                    reportes_menu                             : true,
                    reportes_resumen_alumnos_cursos           : true,
                    reportes_bitacora                         : true,

                    tutorial_menu                             : false,
                    encuestas_menu                            : false,
                    encuestas_participante_curso              : false
                };
                break;
            case 'programas':
                json_perfil_menu = {
                    usuarios_menu                             : false,
                    usuarios_sistema                          : false,

                    catalogos_menu                            : true,
                    catalogos_temas                           : true,
                    catalogos_especialidades                  : true,
                    catalogos_cursos                          : true,

                    instructores_menu                         : true,
                    instructores_catinstructores              : true,
                    instructores_consinstructores             : false,

                    plan_cursos_menu                          : true,
                    plan_cursos_horas_unidad                  : false,
                    plan_cursos_metas_capacit                 : false,
                    plan_cursos_planeacion_ptc                : false,
                    plan_cursos_revision_ptc                  : true,
                    plan_cursos_resumen_ptc_unidades          : true,
                    plan_cursos_ptc_autorizados               : true,

                    pre_cursos_eval_menu                      : true,
                    pre_cursos_eval_cursos_ptc                : false,
                    pre_cursos_eval_cursos_fuera_ptc          : false,
                    pre_cursos_eval_validacion_cursos         : true,
                    pre_cursos_eval_roco_estandar             : false,
                    pre_cursos_eval_validacion_roco_estandar  : true,

                    cursos_eval_autorizados_menu              : true,
                    cursos_eval_autorizados_cursos_vigentes   : true,
                    cursos_eval_autorizados_cursos_historicos : true,
                    cursos_eval_autorizados_eval_vigentes     : true,
                    cursos_eval_autorizados_eval_historicos   : true,

                    registro_capacitandos_menu                : false,

                    inscrip_pagos_menu                        : false,
                    inscrip_pagos_registro_pago_curso         : false,
                    inscrip_pagos_registro_pago_eval          : false,

                    reportes_menu                             : true,
                    reportes_resumen_alumnos_cursos           : true,
                    reportes_bitacora                         : true,

                    tutorial_menu                             : false,
                    encuestas_menu                            : false,
                    encuestas_participante_curso              : false
                };
                break;
            case 'serv_escolar':
                json_perfil_menu = {
                    usuarios_menu                             : false,
                    usuarios_sistema                          : false,

                    catalogos_menu                            : true,
                    catalogos_temas                           : false,
                    catalogos_especialidades                  : true,
                    catalogos_cursos                          : true,

                    instructores_menu                         : true,
                    instructores_catinstructores              : true,
                    instructores_consinstructores             : false,

                    plan_cursos_menu                          : true,
                    plan_cursos_horas_unidad                  : false,
                    plan_cursos_metas_capacit                 : false,
                    plan_cursos_planeacion_ptc                : false,
                    plan_cursos_revision_ptc                  : false,
                    plan_cursos_resumen_ptc_unidades          : true,
                    plan_cursos_ptc_autorizados               : true,

                    pre_cursos_eval_menu                      : false,
                    pre_cursos_eval_cursos_ptc                : false,
                    pre_cursos_eval_cursos_fuera_ptc          : false,
                    pre_cursos_eval_validacion_cursos         : false,
                    pre_cursos_eval_roco_estandar             : false,
                    pre_cursos_eval_validacion_roco_estandar  : false,

                    cursos_eval_autorizados_menu              : true,
                    cursos_eval_autorizados_cursos_vigentes   : true,
                    cursos_eval_autorizados_cursos_historicos : true,
                    cursos_eval_autorizados_eval_vigentes     : true,
                    cursos_eval_autorizados_eval_historicos   : true,

                    registro_capacitandos_menu                : true,

                    inscrip_pagos_menu                        : false,
                    inscrip_pagos_registro_pago_curso         : false,
                    inscrip_pagos_registro_pago_eval          : false,

                    reportes_menu                             : true,
                    reportes_resumen_alumnos_cursos           : true,
                    reportes_bitacora                         : true,

                    tutorial_menu                             : false,
                    encuestas_menu                            : false,
                    encuestas_participante_curso              : false
                };
                break;
            case 'dir_planeacion':
                json_perfil_menu = {
                    usuarios_menu                             : false,
                    usuarios_sistema                          : false,

                    catalogos_menu                            : true,
                    catalogos_temas                           : false,
                    catalogos_especialidades                  : true,
                    catalogos_cursos                          : true,

                    instructores_menu                         : true,
                    instructores_catinstructores              : true,
                    instructores_consinstructores             : false,

                    plan_cursos_menu                          : true,
                    plan_cursos_horas_unidad                  : true,
                    plan_cursos_metas_capacit                 : true,
                    plan_cursos_planeacion_ptc                : false,
                    plan_cursos_revision_ptc                  : false,
                    plan_cursos_resumen_ptc_unidades          : false,
                    plan_cursos_ptc_autorizados               : true,

                    pre_cursos_eval_menu                      : false,
                    pre_cursos_eval_cursos_ptc                : false,
                    pre_cursos_eval_cursos_fuera_ptc          : false,
                    pre_cursos_eval_validacion_cursos         : false,
                    pre_cursos_eval_roco_estandar             : false,
                    pre_cursos_eval_validacion_roco_estandar  : false,

                    cursos_eval_autorizados_menu              : true,
                    cursos_eval_autorizados_cursos_vigentes   : true,
                    cursos_eval_autorizados_cursos_historicos : true,
                    cursos_eval_autorizados_eval_vigentes     : true,
                    cursos_eval_autorizados_eval_historicos   : true,

                    registro_capacitandos_menu                : false,

                    inscrip_pagos_menu                        : false,
                    inscrip_pagos_registro_pago_curso         : false,
                    inscrip_pagos_registro_pago_eval          : false,

                    reportes_menu                             : true,
                    reportes_resumen_alumnos_cursos           : true,
                    reportes_bitacora                         : true,

                    tutorial_menu                             : false,
                    encuestas_menu                            : false,
                    encuestas_participante_curso              : false
                };
                break;
            case 'dir_admin':
                json_perfil_menu = {
                    usuarios_menu                             : false,
                    usuarios_sistema                          : false,

                    catalogos_menu                            : true,
                    catalogos_temas                           : false,
                    catalogos_especialidades                  : true,
                    catalogos_cursos                          : true,

                    instructores_menu                         : true,
                    instructores_catinstructores              : true,
                    instructores_consinstructores             : false,

                    plan_cursos_menu                          : true,
                    plan_cursos_horas_unidad                  : false,
                    plan_cursos_metas_capacit                 : false,
                    plan_cursos_planeacion_ptc                : false,
                    plan_cursos_revision_ptc                  : false,
                    plan_cursos_resumen_ptc_unidades          : false,
                    plan_cursos_ptc_autorizados               : true,

                    pre_cursos_eval_menu                      : false,
                    pre_cursos_eval_cursos_ptc                : false,
                    pre_cursos_eval_cursos_fuera_ptc          : false,
                    pre_cursos_eval_validacion_cursos         : false,
                    pre_cursos_eval_roco_estandar             : false,
                    pre_cursos_eval_validacion_roco_estandar  : false,

                    cursos_eval_autorizados_menu              : true,
                    cursos_eval_autorizados_cursos_vigentes   : true,
                    cursos_eval_autorizados_cursos_historicos : true,
                    cursos_eval_autorizados_eval_vigentes     : true,
                    cursos_eval_autorizados_eval_historicos   : true,

                    registro_capacitandos_menu                : false,

                    inscrip_pagos_menu                        : false,
                    inscrip_pagos_registro_pago_curso         : false,
                    inscrip_pagos_registro_pago_eval          : false,

                    reportes_menu                             : true,
                    reportes_resumen_alumnos_cursos           : true,
                    reportes_bitacora                         : true,

                    tutorial_menu                             : false,
                    encuestas_menu                            : false,
                    encuestas_participante_curso              : false
                };
                break;
            case 'dir_vincula':
                json_perfil_menu = {
                    usuarios_menu                             : false,
                    usuarios_sistema                          : false,

                    catalogos_menu                            : true,
                    catalogos_temas                           : false,
                    catalogos_especialidades                  : true,
                    catalogos_cursos                          : true,

                    instructores_menu                         : false,
                    instructores_catinstructores              : false,
                    instructores_consinstructores             : false,

                    plan_cursos_menu                          : true,
                    plan_cursos_horas_unidad                  : false,
                    plan_cursos_metas_capacit                 : false,
                    plan_cursos_planeacion_ptc                : false,
                    plan_cursos_revision_ptc                  : false,
                    plan_cursos_resumen_ptc_unidades          : false,
                    plan_cursos_ptc_autorizados               : true,

                    pre_cursos_eval_menu                      : false,
                    pre_cursos_eval_cursos_ptc                : false,
                    pre_cursos_eval_cursos_fuera_ptc          : false,
                    pre_cursos_eval_validacion_cursos         : false,
                    pre_cursos_eval_roco_estandar             : false,
                    pre_cursos_eval_validacion_roco_estandar  : false,

                    cursos_eval_autorizados_menu              : true,
                    cursos_eval_autorizados_cursos_vigentes   : true,
                    cursos_eval_autorizados_cursos_historicos : true,
                    cursos_eval_autorizados_eval_vigentes     : true,
                    cursos_eval_autorizados_eval_historicos   : true,

                    registro_capacitandos_menu                : true,

                    inscrip_pagos_menu                        : false,
                    inscrip_pagos_registro_pago_curso         : false,
                    inscrip_pagos_registro_pago_eval          : false,

                    reportes_menu                             : true,
                    reportes_resumen_alumnos_cursos           : true,
                    reportes_bitacora                         : true,

                    tutorial_menu                             : false,
                    encuestas_menu                            : false,
                    encuestas_participante_curso              : false
                };
                break;
            case 'unidad_capacit':
                json_perfil_menu = {
                    usuarios_menu                             : false,
                    usuarios_sistema                          : false,

                    catalogos_menu                            : true,
                    catalogos_temas                           : false,
                    catalogos_especialidades                  : true,
                    catalogos_cursos                          : true,

                    instructores_menu                         : true,
                    instructores_catinstructores              : false,
                    instructores_consinstructores             : true,

                    plan_cursos_menu                          : true,
                    plan_cursos_horas_unidad                  : false,
                    plan_cursos_metas_capacit                 : false,
                    plan_cursos_planeacion_ptc                : true,
                    plan_cursos_revision_ptc                  : false,
                    plan_cursos_resumen_ptc_unidades          : false,
                    plan_cursos_ptc_autorizados               : true,

                    pre_cursos_eval_menu                      : true,
                    pre_cursos_eval_cursos_ptc                : true,
                    pre_cursos_eval_cursos_fuera_ptc          : true,
                    pre_cursos_eval_validacion_cursos         : false,
                    pre_cursos_eval_roco_estandar             : true,
                    pre_cursos_eval_validacion_roco_estandar  : false,

                    cursos_eval_autorizados_menu              : true,
                    cursos_eval_autorizados_cursos_vigentes   : true,
                    cursos_eval_autorizados_cursos_historicos : true,
                    cursos_eval_autorizados_eval_vigentes     : true,
                    cursos_eval_autorizados_eval_historicos   : true,

                    registro_capacitandos_menu                : true,

                    inscrip_pagos_menu                        : true,
                    inscrip_pagos_registro_pago_curso         : true,
                    inscrip_pagos_registro_pago_eval          : true,

                    reportes_menu                             : true,
                    reportes_resumen_alumnos_cursos           : true,
                    reportes_bitacora                         : true,

                    tutorial_menu                             : true,
                    encuestas_menu                            : false,
                    encuestas_participante_curso              : false
                };
                break;
            case 'unidad_inscrip':
                json_perfil_menu = {
                    usuarios_menu                             : false,
                    usuarios_sistema                          : false,

                    catalogos_menu                            : false,
                    catalogos_temas                           : false,
                    catalogos_especialidades                  : false,
                    catalogos_cursos                          : false,

                    instructores_menu                         : false,
                    instructores_catinstructores              : false,
                    instructores_consinstructores             : false,

                    plan_cursos_menu                          : false,
                    plan_cursos_horas_unidad                  : false,
                    plan_cursos_metas_capacit                 : false,
                    plan_cursos_planeacion_ptc                : false,
                    plan_cursos_revision_ptc                  : false,
                    plan_cursos_resumen_ptc_unidades          : false,
                    plan_cursos_ptc_autorizados               : false,

                    pre_cursos_eval_menu                      : false,
                    pre_cursos_eval_cursos_ptc                : false,
                    pre_cursos_eval_cursos_fuera_ptc          : false,
                    pre_cursos_eval_validacion_cursos         : false,
                    pre_cursos_eval_roco_estandar             : false,
                    pre_cursos_eval_validacion_roco_estandar  : false,

                    cursos_eval_autorizados_menu              : false,
                    cursos_eval_autorizados_cursos_vigentes   : false,
                    cursos_eval_autorizados_cursos_historicos : false,
                    cursos_eval_autorizados_eval_vigentes     : false,
                    cursos_eval_autorizados_eval_historicos   : false,

                    registro_capacitandos_menu                : true,

                    inscrip_pagos_menu                        : true,
                    inscrip_pagos_registro_pago_curso         : true,
                    inscrip_pagos_registro_pago_eval          : true,

                    reportes_menu                             : false,
                    reportes_resumen_alumnos_cursos           : false,
                    reportes_bitacora                         : false,

                    tutorial_menu                             : false,
                    encuestas_menu                            : false,
                    encuestas_participante_curso              : false
                };
                break;
            case 'unidad_admin':
                json_perfil_menu = {
                    usuarios_menu                             : false,
                    usuarios_sistema                          : false,

                    catalogos_menu                            : true,
                    catalogos_temas                           : false,
                    catalogos_especialidades                  : true,
                    catalogos_cursos                          : true,

                    instructores_menu                         : true,
                    instructores_catinstructores              : false,
                    instructores_consinstructores             : true,

                    plan_cursos_menu                          : true,
                    plan_cursos_horas_unidad                  : false,
                    plan_cursos_metas_capacit                 : false,
                    plan_cursos_planeacion_ptc                : false,
                    plan_cursos_revision_ptc                  : false,
                    plan_cursos_resumen_ptc_unidades          : false,
                    plan_cursos_ptc_autorizados               : true,

                    pre_cursos_eval_menu                      : false,
                    pre_cursos_eval_cursos_ptc                : false,
                    pre_cursos_eval_cursos_fuera_ptc          : false,
                    pre_cursos_eval_validacion_cursos         : false,
                    pre_cursos_eval_roco_estandar             : false,
                    pre_cursos_eval_validacion_roco_estandar  : false,

                    cursos_eval_autorizados_menu              : true,
                    cursos_eval_autorizados_cursos_vigentes   : true,
                    cursos_eval_autorizados_cursos_historicos : true,
                    cursos_eval_autorizados_eval_vigentes     : true,
                    cursos_eval_autorizados_eval_historicos   : true,

                    registro_capacitandos_menu                : true,

                    inscrip_pagos_menu                        : true,
                    inscrip_pagos_registro_pago_curso         : true,
                    inscrip_pagos_registro_pago_eval          : true,

                    reportes_menu                             : false,
                    reportes_resumen_alumnos_cursos           : false,
                    reportes_bitacora                         : false,

                    tutorial_menu                             : false,
                    encuestas_menu                            : false,
                    encuestas_participante_curso              : false
                };
                break;
            case 'unidad_vincula':
                json_perfil_menu = {
                    usuarios_menu                             : false,
                    usuarios_sistema                          : false,

                    catalogos_menu                            : true,
                    catalogos_temas                           : false,
                    catalogos_especialidades                  : true,
                    catalogos_cursos                          : true,

                    instructores_menu                         : false,
                    instructores_catinstructores              : false,
                    instructores_consinstructores             : false,

                    plan_cursos_menu                          : true,
                    plan_cursos_horas_unidad                  : false,
                    plan_cursos_metas_capacit                 : false,
                    plan_cursos_planeacion_ptc                : false,
                    plan_cursos_revision_ptc                  : false,
                    plan_cursos_resumen_ptc_unidades          : false,
                    plan_cursos_ptc_autorizados               : true,

                    pre_cursos_eval_menu                      : false,
                    pre_cursos_eval_cursos_ptc                : false,
                    pre_cursos_eval_cursos_fuera_ptc          : false,
                    pre_cursos_eval_validacion_cursos         : false,
                    pre_cursos_eval_roco_estandar             : false,
                    pre_cursos_eval_validacion_roco_estandar  : false,

                    cursos_eval_autorizados_menu              : true,
                    cursos_eval_autorizados_cursos_vigentes   : true,
                    cursos_eval_autorizados_cursos_historicos : true,
                    cursos_eval_autorizados_eval_vigentes     : true,
                    cursos_eval_autorizados_eval_historicos   : true,

                    registro_capacitandos_menu                : true,

                    inscrip_pagos_menu                        : false,
                    inscrip_pagos_registro_pago_curso         : false,
                    inscrip_pagos_registro_pago_eval          : false,

                    reportes_menu                             : false,
                    reportes_resumen_alumnos_cursos           : false,
                    reportes_bitacora                         : false,

                    tutorial_menu                             : false,
                    encuestas_menu                            : false,
                    encuestas_participante_curso              : false
                };
                break;
            case 'certificacion':
                json_perfil_menu = {
                    usuarios_menu                             : false,
                    usuarios_sistema                          : false,

                    catalogos_menu                            : true,
                    catalogos_temas                           : false,
                    catalogos_especialidades                  : true,
                    catalogos_cursos                          : true,

                    instructores_menu                         : false,
                    instructores_catinstructores              : false,
                    instructores_consinstructores             : false,

                    plan_cursos_menu                          : false,
                    plan_cursos_horas_unidad                  : false,
                    plan_cursos_metas_capacit                 : false,
                    plan_cursos_planeacion_ptc                : false,
                    plan_cursos_revision_ptc                  : false,
                    plan_cursos_resumen_ptc_unidades          : false,
                    plan_cursos_ptc_autorizados               : false,

                    pre_cursos_eval_menu                      : true,
                    pre_cursos_eval_cursos_ptc                : false,
                    pre_cursos_eval_cursos_fuera_ptc          : false,
                    pre_cursos_eval_validacion_cursos         : false,
                    pre_cursos_eval_roco_estandar             : false,
                    pre_cursos_eval_validacion_roco_estandar  : true,

                    cursos_eval_autorizados_menu              : true,
                    cursos_eval_autorizados_cursos_vigentes   : true,
                    cursos_eval_autorizados_cursos_historicos : true,
                    cursos_eval_autorizados_eval_vigentes     : true,
                    cursos_eval_autorizados_eval_historicos   : true,

                    registro_capacitandos_menu                : true,

                    inscrip_pagos_menu                        : false,
                    inscrip_pagos_registro_pago_curso         : false,
                    inscrip_pagos_registro_pago_eval          : false,

                    reportes_menu                             : false,
                    reportes_resumen_alumnos_cursos           : false,
                    reportes_bitacora                         : false,

                    tutorial_menu                             : false,
                    encuestas_menu                            : false,
                    encuestas_participante_curso              : false
                };
                break;
            case 'unidad_encuesta_alumno':
                json_perfil_menu = {
                    usuarios_menu                             : false,
                    usuarios_sistema                          : false,

                    catalogos_menu                            : false,
                    catalogos_temas                           : false,
                    catalogos_especialidades                  : false,
                    catalogos_cursos                          : false,

                    instructores_menu                         : false,
                    instructores_catinstructores              : false,
                    instructores_consinstructores             : false,

                    plan_cursos_menu                          : false,
                    plan_cursos_horas_unidad                  : false,
                    plan_cursos_metas_capacit                 : false,
                    plan_cursos_planeacion_ptc                : false,
                    plan_cursos_revision_ptc                  : false,
                    plan_cursos_resumen_ptc_unidades          : false,
                    plan_cursos_ptc_autorizados               : false,

                    pre_cursos_eval_menu                      : false,
                    pre_cursos_eval_cursos_ptc                : false,
                    pre_cursos_eval_cursos_fuera_ptc          : false,
                    pre_cursos_eval_validacion_cursos         : false,
                    pre_cursos_eval_roco_estandar             : false,
                    pre_cursos_eval_validacion_roco_estandar  : false,

                    cursos_eval_autorizados_menu              : false,
                    cursos_eval_autorizados_cursos_vigentes   : false,
                    cursos_eval_autorizados_cursos_historicos : false,
                    cursos_eval_autorizados_eval_vigentes     : false,
                    cursos_eval_autorizados_eval_historicos   : false,

                    registro_capacitandos_menu                : false,

                    inscrip_pagos_menu                        : false,
                    inscrip_pagos_registro_pago_curso         : false,
                    inscrip_pagos_registro_pago_eval          : false,

                    reportes_menu                             : false,
                    reportes_resumen_alumnos_cursos           : false,
                    reportes_bitacora                         : false,

                    tutorial_menu                             : false,
                    encuestas_menu                            : true,
                    encuestas_participante_curso              : true
                };
                break;
        } 

        return json_perfil_menu;       

    };


})();