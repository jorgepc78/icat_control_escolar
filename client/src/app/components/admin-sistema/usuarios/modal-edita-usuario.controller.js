(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ModalEditaUsuarioController', ModalEditaUsuarioController);

        ModalEditaUsuarioController.$inject = ['$scope', '$timeout', '$modalInstance', 'usuarioEditar', 'Usuario', 'Role', 'CatalogoUnidadesAdmtvas'];

    function ModalEditaUsuarioController($scope, $timeout, $modalInstance, usuarioEditar, Usuario, Role, CatalogoUnidadesAdmtvas) {

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
                    
                    avisoMinimoInscritosCurso    : usuarioEditar.avisoMinimoInscritosCurso,
                    avisoMinimoPagadosCurso      : usuarioEditar.avisoMinimoPagadosCurso,
                    avisoReversionPagadosCurso   : usuarioEditar.avisoReversionPagadosCurso,
                    avisoCancelacionCurso        : usuarioEditar.avisoCancelacionCurso,
                    avisoReprogCurso             : usuarioEditar.avisoReprogCurso,
                    avisoTerminacionCurso        : usuarioEditar.avisoTerminacionCurso,
                    avisoCierreCurso             : usuarioEditar.avisoCierreCurso,

                    avisoEnvioEvaluacion         : usuarioEditar.avisoEnvioEvaluacion,
                    avisoRevisionEvaluacionProgr : usuarioEditar.avisoRevisionEvaluacionProgr,
                    avisoRechazoEvaluacionProgr  : usuarioEditar.avisoRechazoEvaluacionProgr,
                    avisoRevisionEvaluacionAcad  : usuarioEditar.avisoRevisionEvaluacionAcad,
                    avisoRechazoEvaluacionAcad   : usuarioEditar.avisoRechazoEvaluacionAcad,
                    avisoRevisionEvaluacionPlan  : usuarioEditar.avisoRevisionEvaluacionPlan,
                    avisoRechazoEvaluacionPlan   : usuarioEditar.avisoRechazoEvaluacionPlan,
                    avisoRevisionEvaluacionGral  : usuarioEditar.avisoRevisionEvaluacionGral,
                    avisoRechazoEvaluacionGral   : usuarioEditar.avisoRechazoEvaluacionGral,
                    avisoCancelacionEvaluacion   : usuarioEditar.avisoCancelacionEvaluacion,
                    avisoCierreEvaluacion        : usuarioEditar.avisoCierreEvaluacion,

                    activo                       : usuarioEditar.activo,
                    idPerfil                     : (usuarioEditar.perfil.length > 0 ? usuarioEditar.perfil[0].id : 0),
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

                        var unidadSelecccionadaIndex = vm.listaUnidades.map(function(unidad) {
                                                            return unidad.idUnidadAdmtva;
                                                          }).indexOf(vm.usuarioEditar.idUnidadAdmtva);

                        vm.unidadSelecccionada = vm.listaUnidades[unidadSelecccionadaIndex];

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

                                var perfilSeleccionadoIndex = vm.listaRoles.map(function(rol) {
                                                                    return rol.id;
                                                                  }).indexOf(vm.usuarioEditar.idPerfil);

                                vm.perfilSeleccionado = vm.listaRoles[perfilSeleccionadoIndex];

                                if(vm.perfilSeleccionado.name == 'programas') {
                                    vm.tabs = [{active: true}, {active: false}];
                                    vm.mostrarUnidadesRevisa = true;
                                }
                                else {
                                    vm.tabs = [{active: false}, {active: true}];
                                    vm.mostrarUnidadesRevisa = false;
                                }
                        });


                        angular.forEach(vm.listaUnidades, function(registro) {

                                var index = usuarioEditar.unidad_revisa.map(function(record) {
                                                                return record.idUnidadAdmtva;
                                                              }).indexOf(registro.idUnidadAdmtva);
                                
                                if(registro.idUnidadAdmtva > 1)
                                {
                                        if(index >= 0)
                                        {
                                            vm.unidades_checkbox.push({
                                              idUnidadAdmtva : registro.idUnidadAdmtva,
                                              nombre         : registro.nombre,
                                              seleccionado   : true
                                            });
                                        }
                                        else
                                        {
                                            vm.unidades_checkbox.push({
                                              idUnidadAdmtva : registro.idUnidadAdmtva,
                                              nombre         : registro.nombre,
                                              seleccionado   : false
                                            });
                                        }
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
                    var datos = {
                    nombre                       : vm.usuarioEditar.nombre,
                    puesto                       : vm.usuarioEditar.puesto,
                    email                        : vm.usuarioEditar.email,
                    username                     : vm.usuarioEditar.username,
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
                    };
                }
                else
                {
                    var datos = {
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

                    Usuario.unidad_revisa.destroyAll({ id: vm.usuarioEditar.idUsuario })
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

                    });

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