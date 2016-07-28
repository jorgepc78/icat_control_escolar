(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ModalNuevoCapacitandoController', ModalNuevoCapacitandoController);

        ModalNuevoCapacitandoController.$inject = ['$scope', '$timeout', '$modalInstance', 'Capacitandos', 'CatalogoLocalidades', 'CatalogoNivelEstudios', 'CatalogoActividades', 'CatalogoExperiencias', 'CatalogoMedios', 'CatalogoMotivos'];

    function ModalNuevoCapacitandoController($scope, $timeout, $modalInstance, Capacitandos, CatalogoLocalidades, CatalogoNivelEstudios, CatalogoActividades, CatalogoExperiencias, CatalogoMedios, CatalogoMotivos) {

            var vm = this;

            vm.calculaNacim = calculaNacim;
            vm.guardar      = guardar;

            vm.mostrarSpiner = false;
            vm.mostrar_msg_error = false;
            vm.mensaje = '';

            vm.listaLocalidades = [];
            vm.listaNivelEstudios = [];
            vm.listaActividades = [];
            vm.listaExperiencia = [];
            vm.listaMedios = [];
            vm.listaMotivos = [];

            vm.registroEditar = {
                idUnidadAdmtva      : $scope.currentUser.unidad_pertenece_id,
                apellidoPaterno     : '',
                apellidoMaterno     : '',
                nombre              : '',
                sexo                : '',
                email               : '',
                diaNacimiento       : '',
                mesNacimiento       : '',
                anioNacimiento      : '',
                edad                : '',
                telefono            : '',
                celular             : '',
                curp                : '',
                domicilio           : '',
                colonia             : '',
                codigoPostal        : '',
                idLocalidad         : 0,
                idNivelEstudios     : 0,
                estadoCivil         : '',
                foto                : '',
                disVisual           : false,
                disAuditiva         : false,
                disLenguaje         : false,
                disMotriz           : false,
                disMental           : false,
                enfermedadPadece    : '',
                enfermedadCual      : '',
                tutorNombre         : '',
                tutorCurp           : '',
                tutorParentesco     : '',
                tutorDireccion      : '',
                tutorTelefono       : '',
                docActaNacimiento   : false,
                docCompEstudios     : false,
                docIdentOficial     : false,
                docConstCurp        : false,
                docFotografias      : false,
                docCompMigratorio   : false,
                docCompDomicilio    : false,
                docCurpTutor        : false,
                trabajaActualmente  : '',
                idActividad         : 0,
                empresaTrabaja      : '',
                empresaPuesto       : '',
                empresaAntiguedad   : '',
                empresaDireccion    : '',
                empresaTelefono     : '',
                idExperiencia       : 0,
                idMedio             : 0,
                idMotivo            : 0,
                idGrupoPertenece    : 0,
                gpoJefasFamilia     : false,
                gpoSitViolencia     : false,
                gpoAdolCalle        : false,
                gpoIndigenas        : false,
                gpoAdultoMayor      : false,
                gpoLgbttti          : false,
                gpoDentroCereso     : false,
                gpoCapDiferentes    : false,
                gpoMenorReadap      : false,
                gpoFueraCereso      : false,
                registroRemoto      : false,
                fechaRegistro       : '',
                ultimaActualizacion : ''
            };

            vm.temp = {};

            inicia();

            function inicia() {

                CatalogoLocalidades.find({
                    filter: {
                        fields: ['idLocalidad','nombre'],
                        order: 'nombre ASC'
                    }
                })
                .$promise
                .then(function(resp) {
                    vm.listaLocalidades = resp;
                });

                CatalogoNivelEstudios.find()
                .$promise
                .then(function(resp) {
                    vm.listaNivelEstudios = resp;
                });
        
                CatalogoActividades.find()
                .$promise
                .then(function(resp) {
                    vm.listaActividades = resp;
                });
        
                CatalogoExperiencias.find()
                .$promise
                .then(function(resp) {
                    vm.listaExperiencia = resp;
                });
        
                CatalogoMedios.find()
                .$promise
                .then(function(resp) {
                    vm.listaMedios = resp;
                });
        
                CatalogoMotivos.find()
                .$promise
                .then(function(resp) {
                    vm.listaMotivos = resp;
                });
        
            };


            function calculaNacim() {

                if(vm.registroEditar.curp.length >= 10)
                {
                        var error_fecha = false;

                        if( isNaN(Number(vm.registroEditar.curp.substr(4,2))))
                            error_fecha = true;
                        else if( isNaN(Number(vm.registroEditar.curp.substr(6,2))) )
                            error_fecha = true;
                        else if(isNaN(Number(vm.registroEditar.curp.substr(8,2))) )
                            error_fecha = true;

                        if(error_fecha == true)
                        {
                            vm.mostrar_msg_error = true;
                            vm.mensaje = 'La fecha de nacimiento dentro de la CURP es incorrecta';
                            vm.registroEditar.edad = '';
                            $timeout(function(){
                                 vm.mostrar_msg_error = false;
                                 vm.mensaje = '';
                            }, 2000);
                        }
                        else
                        {
                            var fechaHoy = new Date();
                            var anioHoy = fechaHoy.getFullYear();

                            var anio = parseInt(vm.registroEditar.curp.substr(4,2)) + 2000;
                            if( (anioHoy - anio) < 0)
                                var anio = parseInt(vm.registroEditar.curp.substr(4,2)) + 1900;

                            var mes = parseInt(vm.registroEditar.curp.substr(6,2));
                            var dia = parseInt(vm.registroEditar.curp.substr(8,2));

                            var fechaNacimiento = new Date(anio,(mes-1),dia);
                            
                            var edad = fechaHoy.getFullYear()- fechaNacimiento.getFullYear() - 1; 
                            
                            if(fechaHoy.getMonth() + 1 - mes > 0) 
                                edad++;
            
                            if( (fechaHoy.getDate() - dia >= 0) && (fechaHoy.getMonth() + 1 - mes == 0) ) 
                                edad++;

                            vm.registroEditar.edad = edad;
                            vm.registroEditar.anioNacimiento = anio.toString();
                            vm.registroEditar.mesNacimiento  = vm.registroEditar.curp.substr(6,2);
                            vm.registroEditar.diaNacimiento  = vm.registroEditar.curp.substr(8,2);

                        }
                }
            }


            function guardar() {

                vm.mostrarSpiner = true;

                if( vm.registroEditar.edad == '' )
                {
                    vm.mostrarSpiner = false;
                    vm.mostrar_msg_error = true;
                    vm.mensaje = 'La fecha de nacimiento dentro de la CURP es incorrecta';
                    $timeout(function(){
                         vm.mostrar_msg_error = false;
                         vm.mensaje = '';
                    }, 3000);
                    return;
                }

                Capacitandos.count({
                    where: {email: vm.registroEditar.email}
                })
                .$promise
                .then(function(resp) {
                    
                        if(resp.count > 0)
                        {
                            vm.mostrarSpiner = false;
                            vm.mostrar_msg_error = true;
                            vm.mensaje = 'El email ya se encuentra registrado';
                            $timeout(function(){
                                 vm.mostrar_msg_error = false;
                                 vm.mensaje = '';
                            }, 3000);
                        }
                        else
                        {
                                Capacitandos.count({
                                    where: {celular: vm.registroEditar.celular}
                                })
                                .$promise
                                .then(function(resp) {
                                    
                                    if(resp.count > 0)
                                    {
                                        vm.mostrarSpiner = false;
                                        vm.mostrar_msg_error = true;
                                        vm.mensaje = 'El número de celular ya se encuentra registrado';
                                        $timeout(function(){
                                             vm.mostrar_msg_error = false;
                                             vm.mensaje = '';
                                        }, 3000);

                                    }
                                    else
                                    {
                                        Capacitandos.count({
                                            where: {curp: vm.registroEditar.curp}
                                        })
                                        .$promise
                                        .then(function(resp) {
                                            
                                            if(resp.count > 0)
                                            {
                                                vm.mostrarSpiner = false;
                                                vm.mostrar_msg_error = true;
                                                vm.mensaje = 'El CURP ya se encuentra registrado';
                                                $timeout(function(){
                                                     vm.mostrar_msg_error = false;
                                                     vm.mensaje = '';
                                                }, 3000);

                                            }
                                            else
                                            {
                                                vm.registroEditar.ultimaActualizacion =  Date();

                                                Capacitandos.prototype$updateAttributes(
                                                {
                                                    id: vm.registroEditar.idAlumno
                                                },{
                                                    idUnidadAdmtva      : vm.registroEditar.idUnidadAdmtva,
                                                    apellidoPaterno     : vm.registroEditar.apellidoPaterno,
                                                    apellidoMaterno     : vm.registroEditar.apellidoMaterno,
                                                    nombre              : vm.registroEditar.nombre,
                                                    sexo                : vm.registroEditar.sexo,
                                                    email               : vm.registroEditar.email,
                                                    diaNacimiento       : vm.registroEditar.diaNacimiento,
                                                    mesNacimiento       : vm.registroEditar.mesNacimiento,
                                                    anioNacimiento      : vm.registroEditar.anioNacimiento,
                                                    edad                : vm.registroEditar.edad,
                                                    telefono            : vm.registroEditar.telefono,
                                                    celular             : vm.registroEditar.celular,
                                                    curp                : vm.registroEditar.curp,
                                                    domicilio           : vm.registroEditar.domicilio,
                                                    colonia             : vm.registroEditar.colonia,
                                                    codigoPostal        : vm.registroEditar.codigoPostal,
                                                    idLocalidad         : vm.registroEditar.idLocalidad,
                                                    idNivelEstudios     : vm.registroEditar.idNivelEstudios,
                                                    estadoCivil         : vm.registroEditar.estadoCivil,
                                                    foto                : vm.registroEditar.foto,
                                                    disVisual           : vm.registroEditar.disVisual,
                                                    disAuditiva         : vm.registroEditar.disAuditiva,
                                                    disLenguaje         : vm.registroEditar.disLenguaje,
                                                    disMotriz           : vm.registroEditar.disMotriz,
                                                    disMental           : vm.registroEditar.disMental,
                                                    enfermedadPadece    : vm.registroEditar.enfermedadPadece,
                                                    enfermedadCual      : vm.registroEditar.enfermedadCual,
                                                    tutorNombre         : vm.registroEditar.tutorNombre,
                                                    tutorCurp           : vm.registroEditar.tutorCurp,
                                                    tutorParentesco     : vm.registroEditar.tutorParentesco,
                                                    tutorDireccion      : vm.registroEditar.tutorDireccion,
                                                    tutorTelefono       : vm.registroEditar.tutorTelefono,
                                                    docActaNacimiento   : vm.registroEditar.docActaNacimiento,
                                                    docCompEstudios     : vm.registroEditar.docCompEstudios,
                                                    docIdentOficial     : vm.registroEditar.docIdentOficial,
                                                    docConstCurp        : vm.registroEditar.docConstCurp,
                                                    docFotografias      : vm.registroEditar.docFotografias,
                                                    docCompMigratorio   : vm.registroEditar.docCompMigratorio,
                                                    docCompDomicilio    : vm.registroEditar.docCompDomicilio,
                                                    docCurpTutor        : vm.registroEditar.docCurpTutor,
                                                    trabajaActualmente  : vm.registroEditar.trabajaActualmente,
                                                    idActividad         : vm.registroEditar.idActividad,
                                                    empresaTrabaja      : vm.registroEditar.empresaTrabaja,
                                                    empresaPuesto       : vm.registroEditar.empresaPuesto,
                                                    empresaAntiguedad   : vm.registroEditar.empresaAntiguedad,
                                                    empresaDireccion    : vm.registroEditar.empresaDireccion,
                                                    empresaTelefono     : vm.registroEditar.empresaTelefono,
                                                    idExperiencia       : vm.registroEditar.idExperiencia,
                                                    idMedio             : vm.registroEditar.idMedio,
                                                    idMotivo            : vm.registroEditar.idMotivo,
                                                    idGrupoPertenece    : vm.registroEditar.idGrupoPertenece,
                                                    gpoJefasFamilia     : vm.registroEditar.gpoJefasFamilia,
                                                    gpoSitViolencia     : vm.registroEditar.gpoSitViolencia,
                                                    gpoAdolCalle        : vm.registroEditar.gpoAdolCalle,
                                                    gpoIndigenas        : vm.registroEditar.gpoIndigenas,
                                                    gpoAdultoMayor      : vm.registroEditar.gpoAdultoMayor,
                                                    gpoLgbttti          : vm.registroEditar.gpoLgbttti,
                                                    gpoDentroCereso     : vm.registroEditar.gpoDentroCereso,
                                                    gpoCapDiferentes    : vm.registroEditar.gpoCapDiferentes,
                                                    gpoMenorReadap      : vm.registroEditar.gpoMenorReadap,
                                                    gpoFueraCereso      : vm.registroEditar.gpoFueraCereso,
                                                    registroRemoto      : vm.registroEditar.registroRemoto,
                                                    fechaRegistro       : vm.registroEditar.ultimaActualizacion,
                                                    ultimaActualizacion : vm.registroEditar.ultimaActualizacion
                                                })
                                                .$promise
                                                .then(function(respuesta) {
                                                      $modalInstance.close();
                                                });

                                            }

                                        });

                                    }

                                });

                        }

                });


            };

    };

})();