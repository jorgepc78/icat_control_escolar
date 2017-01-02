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
                    idUsuario                    : usuarioEditar.idUsuario,
                    nombre                       : usuarioEditar.nombre,
                    puesto                       : usuarioEditar.puesto,
                    email                        : usuarioEditar.email,
                    username                     : usuarioEditar.username,
                    idUnidadAdmtva               : usuarioEditar.idUnidadAdmtva,
                    UnidadAdmtva                 : '',

                    avisoEnvioPTC                : (usuarioEditar.avisoEnvioPTC === true ? true : false),
                    avisoRevisonPTCProgr         : (usuarioEditar.avisoRevisonPTCProgr === true ? true : false),
                    avisoRechazoPTCProgr         : (usuarioEditar.avisoRechazoPTCProgr === true ? true : false),
                    avisoRevisonPTCAcad          : (usuarioEditar.avisoRevisonPTCAcad === true ? true : false),
                    avisoRechazoPTCAcad          : (usuarioEditar.avisoRechazoPTCAcad === true ? true : false),
                    avisoRevisonPTCPlan          : (usuarioEditar.avisoRevisonPTCPlan === true ? true : false),
                    avisoRechazoPTCPlan          : (usuarioEditar.avisoRechazoPTCPlan === true ? true : false),
                    avisoRevisionPTCGral         : (usuarioEditar.avisoRevisionPTCGral === true ? true : false),
                    avisoRechazoPTCGral          : (usuarioEditar.avisoRechazoPTCGral === true ? true : false),
                    
                    avisoEnvioPreapCurso         : (usuarioEditar.avisoEnvioPreapCurso === true ? true : false),
                    avisoRevisionPreapCursoProgr : (usuarioEditar.avisoRevisionPreapCursoProgr === true ? true : false),
                    avisoRechazoPreapCursoProgr  : (usuarioEditar.avisoRechazoPreapCursoProgr === true ? true : false),
                    avisoRevisionPreapCursoAcad  : (usuarioEditar.avisoRevisionPreapCursoAcad === true ? true : false),
                    avisoRechazoPreapCursoAcad   : (usuarioEditar.avisoRechazoPreapCursoAcad === true ? true : false),
                    avisoRevisionPreapCursoPlan  : (usuarioEditar.avisoRevisionPreapCursoPlan === true ? true : false),
                    avisoRechazoPreapCursoPlan   : (usuarioEditar.avisoRechazoPreapCursoPlan === true ? true : false),
                    avisoRevisionPreapCursoGral  : (usuarioEditar.avisoRevisionPreapCursoGral === true ? true : false),
                    avisoRechazoPreapCursoGral   : (usuarioEditar.avisoRechazoPreapCursoGral === true ? true : false),
                    
                    avisoMinimosCurso            : usuarioEditar.avisoMinimosCurso,
                    avisoCancelacionCurso        : usuarioEditar.avisoCancelacionCurso,
                    avisoReprogCurso             : usuarioEditar.avisoReprogCurso,
                    avisoTerminacionCurso        : usuarioEditar.avisoTerminacionCurso,
                    avisoCierreCurso             : usuarioEditar.avisoCierreCurso,
                    avisoEnvioEvaluacion         : usuarioEditar.avisoEnvioEvaluacion,
                    avisoRechazoEvaluacion       : usuarioEditar.avisoRechazoEvaluacion,
                    avisoAceptacionEvaluacion    : usuarioEditar.avisoAceptacionEvaluacion,
                    avisoCierreEvaluacion        : usuarioEditar.avisoCierreEvaluacion,
                    activo                       : usuarioEditar.activo,
                    idPerfil                     : (usuarioEditar.perfil.length > 0 ? usuarioEditar.perfil[0].id : 0),
                    perfil                       : ''
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
                            var condicion = {name: {inq: ["dir_gral", "dir_academica","programas","serv_escolar","dir_planeacion","dir_admin","dir_vincula","certificacion"]}};
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
                    var condicion = {name: {inq: ["dir_gral", "dir_academica","programas","serv_escolar","dir_planeacion","dir_admin","dir_vincula","certificacion"]}};
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
                            nombre                    : vm.usuarioEditar.nombre,
                            puesto                    : vm.usuarioEditar.puesto,
                            email                     : vm.usuarioEditar.email,
                            username                  : vm.usuarioEditar.username,
                            idUnidadAdmtva            : vm.unidadSelecccionada.idUnidadAdmtva,

                            avisoEnvioPTC                : vm.usuarioEditar.avisoEnvioPTC,
                            avisoRevisonPTCProgr         : vm.usuarioEditar.avisoRevisonPTCProgr,
                            avisoRechazoPTCProgr         : vm.usuarioEditar.avisoRechazoPTCProgr,
                            avisoRevisonPTCAcad          : vm.usuarioEditar.avisoRevisonPTCAcad,
                            avisoRechazoPTCAcad          : vm.usuarioEditar.avisoRechazoPTCAcad,
                            avisoRevisonPTCPlan          : vm.usuarioEditar.avisoRevisonPTCPlan,
                            avisoRechazoPTCPlan          : vm.usuarioEditar.avisoRechazoPTCPlan,
                            avisoRevisionPTCGral         : vm.usuarioEditar.avisoRevisionPTCGral,
                            avisoRechazoPTCGral          : vm.usuarioEditar.avisoRechazoPTCGral,
                            
                            avisoEnvioPreapCurso         : vm.usuarioEditar.avisoEnvioPreapCurso,
                            avisoRevisionPreapCursoProgr : vm.usuarioEditar.avisoRevisionPreapCursoProgr,
                            avisoRechazoPreapCursoProgr  : vm.usuarioEditar.avisoRechazoPreapCursoProgr,
                            avisoRevisionPreapCursoAcad  : vm.usuarioEditar.avisoRevisionPreapCursoAcad,
                            avisoRechazoPreapCursoAcad   : vm.usuarioEditar.avisoRechazoPreapCursoAcad,
                            avisoRevisionPreapCursoPlan  : vm.usuarioEditar.avisoRevisionPreapCursoPlan,
                            avisoRechazoPreapCursoPlan   : vm.usuarioEditar.avisoRechazoPreapCursoPlan,
                            avisoRevisionPreapCursoGral  : vm.usuarioEditar.avisoRevisionPreapCursoGral,
                            avisoRechazoPreapCursoGral   : vm.usuarioEditar.avisoRechazoPreapCursoGral,

                            avisoMinimosCurso         : vm.usuarioEditar.avisoMinimosCurso,
                            avisoCancelacionCurso     : vm.usuarioEditar.avisoCancelacionCurso,
                            avisoReprogCurso          : vm.usuarioEditar.avisoReprogCurso,
                            avisoTerminacionCurso     : vm.usuarioEditar.avisoTerminacionCurso,
                            avisoCierreCurso          : vm.usuarioEditar.avisoCierreCurso,
                            avisoEnvioEvaluacion      : vm.usuarioEditar.avisoEnvioEvaluacion,
                            avisoRechazoEvaluacion    : vm.usuarioEditar.avisoRechazoEvaluacion,
                            avisoAceptacionEvaluacion : vm.usuarioEditar.avisoAceptacionEvaluacion,
                            avisoCierreEvaluacion     : vm.usuarioEditar.avisoCierreEvaluacion,
                            activo                    : vm.usuarioEditar.activo
                    };
                }
                else
                {
                    var datos = {
                            nombre                    : vm.usuarioEditar.nombre,
                            puesto                    : vm.usuarioEditar.puesto,
                            email                     : vm.usuarioEditar.email,
                            username                  : vm.usuarioEditar.username,
                            password                  : vm.usuarioEditar.password,
                            idUnidadAdmtva            : vm.unidadSelecccionada.idUnidadAdmtva,

                            avisoEnvioPTC                : vm.usuarioEditar.avisoEnvioPTC,
                            avisoRevisonPTCProgr         : vm.usuarioEditar.avisoRevisonPTCProgr,
                            avisoRechazoPTCProgr         : vm.usuarioEditar.avisoRechazoPTCProgr,
                            avisoRevisonPTCAcad          : vm.usuarioEditar.avisoRevisonPTCAcad,
                            avisoRechazoPTCAcad          : vm.usuarioEditar.avisoRechazoPTCAcad,
                            avisoRevisonPTCPlan          : vm.usuarioEditar.avisoRevisonPTCPlan,
                            avisoRechazoPTCPlan          : vm.usuarioEditar.avisoRechazoPTCPlan,
                            avisoRevisionPTCGral         : vm.usuarioEditar.avisoRevisionPTCGral,
                            avisoRechazoPTCGral          : vm.usuarioEditar.avisoRechazoPTCGral,
                            
                            avisoEnvioPreapCurso         : vm.usuarioEditar.avisoEnvioPreapCurso,
                            avisoRevisionPreapCursoProgr : vm.usuarioEditar.avisoRevisionPreapCursoProgr,
                            avisoRechazoPreapCursoProgr  : vm.usuarioEditar.avisoRechazoPreapCursoProgr,
                            avisoRevisionPreapCursoAcad  : vm.usuarioEditar.avisoRevisionPreapCursoAcad,
                            avisoRechazoPreapCursoAcad   : vm.usuarioEditar.avisoRechazoPreapCursoAcad,
                            avisoRevisionPreapCursoPlan  : vm.usuarioEditar.avisoRevisionPreapCursoPlan,
                            avisoRechazoPreapCursoPlan   : vm.usuarioEditar.avisoRechazoPreapCursoPlan,
                            avisoRevisionPreapCursoGral  : vm.usuarioEditar.avisoRevisionPreapCursoGral,
                            avisoRechazoPreapCursoGral   : vm.usuarioEditar.avisoRechazoPreapCursoGral,

                            avisoMinimosCurso         : vm.usuarioEditar.avisoMinimosCurso,
                            avisoCancelacionCurso     : vm.usuarioEditar.avisoCancelacionCurso,
                            avisoReprogCurso          : vm.usuarioEditar.avisoReprogCurso,
                            avisoTerminacionCurso     : vm.usuarioEditar.avisoTerminacionCurso,
                            avisoCierreCurso          : vm.usuarioEditar.avisoCierreCurso,
                            avisoEnvioEvaluacion      : vm.usuarioEditar.avisoEnvioEvaluacion,
                            avisoRechazoEvaluacion    : vm.usuarioEditar.avisoRechazoEvaluacion,
                            avisoAceptacionEvaluacion : vm.usuarioEditar.avisoAceptacionEvaluacion,
                            avisoCierreEvaluacion     : vm.usuarioEditar.avisoCierreEvaluacion,
                            activo                    : vm.usuarioEditar.activo
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