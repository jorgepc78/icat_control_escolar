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
                    nombre                    : '',
                    puesto                    : '',
                    email                     : '',
                    username                  : '',
                    idUnidadAdmtva            : 0,
                    UnidadAdmtva              : '',

                    avisoEnvioPTC                : false,
                    avisoRevisonPTCProgr         : false,
                    avisoRechazoPTCProgr         : false,
                    avisoRevisonPTCAcad          : false,
                    avisoRechazoPTCAcad          : false,
                    avisoRevisonPTCPlan          : false,
                    avisoRechazoPTCPlan          : false,
                    avisoRevisionPTCGral         : false,
                    avisoRechazoPTCGral          : false,
                    
                    avisoEnvioPreapCurso         : false,
                    avisoRevisionPreapCursoProgr : false,
                    avisoRechazoPreapCursoProgr  : false,
                    avisoRevisionPreapCursoAcad  : false,
                    avisoRechazoPreapCursoAcad   : false,
                    avisoRevisionPreapCursoPlan  : false,
                    avisoRechazoPreapCursoPlan   : false,
                    avisoRevisionPreapCursoGral  : false,
                    avisoRechazoPreapCursoGral   : false,

                    avisoMinimoInscritosCurso    : false,
                    avisoMinimoPagadosCurso    : false,
                    avisoReversionPagadosCurso    : false,

                    avisoCancelacionCurso     : false,
                    avisoReprogCurso          : false,
                    avisoTerminacionCurso     : false,
                    avisoCierreCurso          : false,
                    avisoEnvioEvaluacion      : false,
                    avisoRechazoEvaluacion    : false,
                    avisoAceptacionEvaluacion : false,
                    avisoCierreEvaluacion     : false,
                    activo                    : true,
                    idPerfil                  : 0,
                    perfil                    : ''
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

                            avisoMinimoInscritosCurso         : vm.usuarioEditar.avisoMinimoInscritosCurso,
                            avisoMinimoPagadosCurso         : vm.usuarioEditar.avisoMinimoPagadosCurso,
                            avisoReversionPagadosCurso         : vm.usuarioEditar.avisoReversionPagadosCurso,

                            avisoCancelacionCurso     : vm.usuarioEditar.avisoCancelacionCurso,
                            avisoReprogCurso          : vm.usuarioEditar.avisoReprogCurso,
                            avisoTerminacionCurso     : vm.usuarioEditar.avisoTerminacionCurso,
                            avisoCierreCurso          : vm.usuarioEditar.avisoCierreCurso,
                            avisoEnvioEvaluacion      : vm.usuarioEditar.avisoEnvioEvaluacion,
                            avisoRechazoEvaluacion    : vm.usuarioEditar.avisoRechazoEvaluacion,
                            avisoAceptacionEvaluacion : vm.usuarioEditar.avisoAceptacionEvaluacion,
                            avisoCierreEvaluacion     : vm.usuarioEditar.avisoCierreEvaluacion,
                            activo                    : vm.usuarioEditar.activo
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