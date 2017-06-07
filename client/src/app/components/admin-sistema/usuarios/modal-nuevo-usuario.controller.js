(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ModalNuevoUsuarioController', ModalNuevoUsuarioController);

        ModalNuevoUsuarioController.$inject = ['$scope', '$timeout', '$modalInstance', 'Usuario', 'Role', 'CatalogoUnidadesAdmtvas'];

    function ModalNuevoUsuarioController($scope, $timeout, $modalInstance, Usuario, Role, CatalogoUnidadesAdmtvas) {

            var vm = this;
            
            vm.muestraPerfilesUnidad = muestraPerfilesUnidad;
            vm.muestraUnidadesRevisa = muestraUnidadesRevisa;
            vm.guardar               = guardar;

            vm.mostrarSpiner = false;
            vm.msg_password = false;
            vm.txt_msg_password = '';
            vm.listaUnidades = [];
            vm.listaRoles = [];
            vm.unidades_checkbox = [];
            vm.mostrarUnidadesRevisa = false;
            vm.tabs = [{active: false}, {active: true}];

            vm.usuarioEditar = {
                    nombre                       : '',
                    puesto                       : '',
                    email                        : '',
                    username                     : '',
                    idUnidadAdmtva               : 0,
                    UnidadAdmtva                 : '',

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
                    avisoMinimoPagadosCurso      : false,
                    avisoReversionPagadosCurso   : false,

                    avisoCancelacionCurso        : false,
                    avisoReprogCurso             : false,
                    avisoTerminacionCurso        : false,
                    avisoCierreCurso             : false,
                    
                    avisoEnvioEvaluacion         : false,
                    avisoRevisionEvaluacionProgr : false,
                    avisoRechazoEvaluacionProgr  : false,
                    avisoRevisionEvaluacionAcad  : false,
                    avisoRechazoEvaluacionAcad   : false,
                    avisoRevisionEvaluacionPlan  : false,
                    avisoRechazoEvaluacionPlan   : false,
                    avisoRevisionEvaluacionGral  : false,
                    avisoRechazoEvaluacionGral   : false,
                    avisoCancelacionEvaluacion   : false,
                    avisoCierreEvaluacion        : false,
                    
                    activo                       : true,
                    idPerfil                     : 0,
                    perfil                       : '',
                    unidad_revisa                : []
            };

            vm.unidadSelecccionada = {};
            vm.perfilSeleccionado = {};


            inicia();

            function inicia() {
       
                CatalogoUnidadesAdmtvas.find({
                    filter: {
                        fields: ['idUnidadAdmtva','nombre'],
                        order: 'nombre ASC'
                    }
                })
                .$promise
                .then(function(resp) {
                    vm.listaUnidades = resp;

                    angular.forEach(vm.listaUnidades, function(registro) {

                            if(registro.idUnidadAdmtva > 1)
                            {
                                vm.unidades_checkbox.push({
                                  idUnidadAdmtva : registro.idUnidadAdmtva,
                                  nombre         : registro.nombre,
                                  seleccionado   : false
                                });
                            }
                    });

                });

            };



            function muestraPerfilesUnidad() {

                vm.listaRoles = [];

                if(vm.unidadSelecccionada.idUnidadAdmtva == 1)
                    var condicion = {name: {inq: ["dir_gral", "dir_academica","programas","serv_escolar","dir_planeacion","dir_admin","dir_vincula","certificacion"]}};
                else
                    var condicion = {name: {inq: ["unidad_capacit", "unidad_inscrip","unidad_admin","unidad_vincula","unidad_encuesta_alumno"]}};

                Role.find({
                    filter: {
                        where: condicion,
                        fields:['id','name','description'],
                        order: 'description ASC'
                    }
                })
                .$promise
                .then(function(resp) {
                    vm.listaRoles = resp;
                });    

            }



            function muestraUnidadesRevisa() {
                if(vm.perfilSeleccionado == undefined) {
                    vm.tabs = [{active: false}, {active: true}];
                    vm.mostrarUnidadesRevisa = false;
                }
                else if(vm.perfilSeleccionado.name == 'programas') {
                    vm.tabs = [{active: true}, {active: false}];
                    vm.mostrarUnidadesRevisa = true;
                }
                else {
                    vm.tabs = [{active: false}, {active: true}];
                    vm.mostrarUnidadesRevisa = false;
                }
            }



            function guardar() {

                vm.mostrarSpiner = true;

                if(vm.unidadSelecccionada.idUnidadAdmtva > 1)
                {
                        vm.usuarioEditar.avisoEnvioPTC                = false;
                        vm.usuarioEditar.avisoRevisonPTCProgr         = false;
                        vm.usuarioEditar.avisoRechazoPTCProgr         = false;
                        vm.usuarioEditar.avisoRevisonPTCAcad          = false;
                        vm.usuarioEditar.avisoRechazoPTCAcad          = false;
                        vm.usuarioEditar.avisoRevisonPTCPlan          = false;
                        vm.usuarioEditar.avisoRechazoPTCPlan          = false;
                        vm.usuarioEditar.avisoRevisionPTCGral         = false;
                        vm.usuarioEditar.avisoRechazoPTCGral          = false;
                        
                        vm.usuarioEditar.avisoEnvioPreapCurso         = false;
                        vm.usuarioEditar.avisoRevisionPreapCursoProgr = false;
                        vm.usuarioEditar.avisoRechazoPreapCursoProgr  = false;
                        vm.usuarioEditar.avisoRevisionPreapCursoAcad  = false;
                        vm.usuarioEditar.avisoRechazoPreapCursoAcad   = false;
                        vm.usuarioEditar.avisoRevisionPreapCursoPlan  = false;
                        vm.usuarioEditar.avisoRechazoPreapCursoPlan   = false;
                        vm.usuarioEditar.avisoRevisionPreapCursoGral  = false;
                        vm.usuarioEditar.avisoRechazoPreapCursoGral   = false;

                        vm.usuarioEditar.avisoMinimoInscritosCurso    = false;
                        vm.usuarioEditar.avisoMinimoPagadosCurso      = false;
                        vm.usuarioEditar.avisoReversionPagadosCurso   = false;

                        vm.usuarioEditar.avisoCancelacionCurso        = false;
                        vm.usuarioEditar.avisoReprogCurso             = false;
                        vm.usuarioEditar.avisoTerminacionCurso        = false;
                        vm.usuarioEditar.avisoCierreCurso             = false;
                        
                        vm.usuarioEditar.avisoEnvioEvaluacion         = false;
                        vm.usuarioEditar.avisoRevisionEvaluacionProgr = false;
                        vm.usuarioEditar.avisoRechazoEvaluacionProgr  = false;
                        vm.usuarioEditar.avisoRevisionEvaluacionAcad  = false;
                        vm.usuarioEditar.avisoRechazoEvaluacionAcad   = false;
                        vm.usuarioEditar.avisoRevisionEvaluacionPlan  = false;
                        vm.usuarioEditar.avisoRechazoEvaluacionPlan   = false;
                        vm.usuarioEditar.avisoRevisionEvaluacionGral  = false;
                        vm.usuarioEditar.avisoRechazoEvaluacionGral   = false;
                        vm.usuarioEditar.avisoCancelacionEvaluacion   = false;
                        vm.usuarioEditar.avisoCierreEvaluacion        = false;
                }

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
                            nombre                       : vm.usuarioEditar.nombre,
                            puesto                       : vm.usuarioEditar.puesto,
                            email                        : vm.usuarioEditar.email,
                            username                     : vm.usuarioEditar.username,
                            password                     : vm.usuarioEditar.password,
                            idUnidadAdmtva               : vm.unidadSelecccionada.idUnidadAdmtva,

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

                            avisoMinimoInscritosCurso    : vm.usuarioEditar.avisoMinimoInscritosCurso,
                            avisoMinimoPagadosCurso      : vm.usuarioEditar.avisoMinimoPagadosCurso,
                            avisoReversionPagadosCurso   : vm.usuarioEditar.avisoReversionPagadosCurso,

                            avisoCancelacionCurso        : vm.usuarioEditar.avisoCancelacionCurso,
                            avisoReprogCurso             : vm.usuarioEditar.avisoReprogCurso,
                            avisoTerminacionCurso        : vm.usuarioEditar.avisoTerminacionCurso,
                            avisoCierreCurso             : vm.usuarioEditar.avisoCierreCurso,

                            avisoEnvioEvaluacion         : vm.usuarioEditar.avisoEnvioEvaluacion,
                            avisoRevisionEvaluacionProgr : vm.usuarioEditar.avisoRevisionEvaluacionProgr,
                            avisoRechazoEvaluacionProgr  : vm.usuarioEditar.avisoRechazoEvaluacionProgr,
                            avisoRevisionEvaluacionAcad  : vm.usuarioEditar.avisoRevisionEvaluacionAcad,
                            avisoRechazoEvaluacionAcad   : vm.usuarioEditar.avisoRechazoEvaluacionAcad,
                            avisoRevisionEvaluacionPlan  : vm.usuarioEditar.avisoRevisionEvaluacionPlan,
                            avisoRechazoEvaluacionPlan   : vm.usuarioEditar.avisoRechazoEvaluacionPlan,
                            avisoRevisionEvaluacionGral  : vm.usuarioEditar.avisoRevisionEvaluacionGral,
                            avisoRechazoEvaluacionGral   : vm.usuarioEditar.avisoRechazoEvaluacionGral,
                            avisoCancelacionEvaluacion   : vm.usuarioEditar.avisoCancelacionEvaluacion,
                            avisoCierreEvaluacion        : vm.usuarioEditar.avisoCierreEvaluacion,

                            activo                       : vm.usuarioEditar.activo
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

                                    for(var i=0; i < vm.unidades_checkbox.length; i++)
                                    {
                                        if(vm.unidades_checkbox[i].seleccionado == true )
                                        {
                                                vm.usuarioEditar.unidad_revisa.push({
                                                  idUnidadAdmtva : vm.unidades_checkbox[i].idUnidadAdmtva,
                                                  nombre         : vm.unidades_checkbox[i].nombre
                                                });
                                        }
                                    }

                                    angular.forEach(vm.usuarioEditar.unidad_revisa, function(registro) {

                                            Usuario.unidad_revisa.link({
                                                id: vm.usuarioEditar.idUsuario,
                                                fk: registro.idUnidadAdmtva
                                            },{}) 
                                            .$promise
                                            .then(function(resp) {
                                            });

                                    });

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