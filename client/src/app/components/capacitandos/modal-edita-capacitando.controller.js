(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ModalEditaCapacitandoController', ModalEditaCapacitandoController);

        ModalEditaCapacitandoController.$inject = ['$modalInstance', '$timeout', '$rootScope', 'registroEditar', 'Capacitandos', 'CatalogoLocalidades', 'CatalogoNivelEstudios', 'CatalogoActividades', 'CatalogoExperiencias', 'CatalogoMedios', 'CatalogoMotivos'];

    function ModalEditaCapacitandoController($modalInstance, $timeout, $rootScope, registroEditar, Capacitandos, CatalogoLocalidades, CatalogoNivelEstudios, CatalogoActividades, CatalogoExperiencias, CatalogoMedios, CatalogoMotivos) {

            var vm = this;

            vm.calculaNacim = calculaNacim;
            vm.guardar      = guardar;

            vm.mostrarNumControl = true;
            vm.soloLecturaNumControl = false;
            vm.soloLectura = false;
            vm.mostrarSpiner = false;
            vm.mostrar_msg_error = false;
            vm.mensaje = '';
            vm.correoCompartido = false;

            vm.listaLocalidades = [];
            vm.listaNivelEstudios = [];
            vm.listaActividades = [];
            vm.listaExperiencia = [];
            vm.listaMedios = [];
            vm.listaMotivos = [];

            vm.registroEditar = {
                idAlumno            : registroEditar.idAlumno,
                idUnidadAdmtva      : registroEditar.idUnidadAdmtva,
                numControl          : registroEditar.numControl.trim(),
                apellidoPaterno     : registroEditar.apellidoPaterno,
                apellidoMaterno     : registroEditar.apellidoMaterno,
                nombre              : registroEditar.nombre,
                sexo                : registroEditar.sexo,
                email               : registroEditar.email,
                diaNacimiento       : registroEditar.diaNacimiento,
                mesNacimiento       : registroEditar.mesNacimiento,
                anioNacimiento      : registroEditar.anioNacimiento,
                edad                : registroEditar.edad,
                telefono            : registroEditar.telefono,
                celular             : registroEditar.celular,
                curp                : registroEditar.curp,
                domicilio           : registroEditar.domicilio,
                colonia             : registroEditar.colonia,
                codigoPostal        : registroEditar.codigoPostal,
                idLocalidad         : registroEditar.idLocalidad,
                idNivelEstudios     : registroEditar.idNivelEstudios,
                estadoCivil         : registroEditar.estadoCivil,
                foto                : registroEditar.foto,
                disVisual           : registroEditar.disVisual,
                disAuditiva         : registroEditar.disAuditiva,
                disLenguaje         : registroEditar.disLenguaje,
                disMotriz           : registroEditar.disMotriz,
                disMental           : registroEditar.disMental,
                enfermedadPadece    : registroEditar.enfermedadPadece,
                enfermedadCual      : registroEditar.enfermedadCual,
                tutorNombre         : registroEditar.tutorNombre,
                tutorCurp           : registroEditar.tutorCurp,
                tutorParentesco     : registroEditar.tutorParentesco,
                tutorDireccion      : registroEditar.tutorDireccion,
                tutorTelefono       : registroEditar.tutorTelefono,
                docActaNacimiento   : registroEditar.docActaNacimiento,
                docCompEstudios     : registroEditar.docCompEstudios,
                docIdentOficial     : registroEditar.docIdentOficial,
                docConstCurp        : registroEditar.docConstCurp,
                docFotografias      : registroEditar.docFotografias,
                docCompMigratorio   : registroEditar.docCompMigratorio,
                docCompDomicilio    : registroEditar.docCompDomicilio,
                docCurpTutor        : registroEditar.docCurpTutor,
                trabajaActualmente  : registroEditar.trabajaActualmente,
                idActividad         : registroEditar.idActividad,
                empresaTrabaja      : registroEditar.empresaTrabaja,
                empresaPuesto       : registroEditar.empresaPuesto,
                empresaAntiguedad   : registroEditar.empresaAntiguedad,
                empresaDireccion    : registroEditar.empresaDireccion,
                empresaTelefono     : registroEditar.empresaTelefono,
                idExperiencia       : registroEditar.idExperiencia,
                idMedio             : registroEditar.idMedio,
                idMotivo            : registroEditar.idMotivo,
                idGrupoPertenece    : registroEditar.idGrupoPertenece,
                gpoJefasFamilia     : registroEditar.gpoJefasFamilia,
                gpoSitViolencia     : registroEditar.gpoSitViolencia,
                gpoAdolCalle        : registroEditar.gpoAdolCalle,
                gpoIndigenas        : registroEditar.gpoIndigenas,
                gpoAdultoMayor      : registroEditar.gpoAdultoMayor,
                gpoLgbttti          : registroEditar.gpoLgbttti,
                gpoDentroCereso     : registroEditar.gpoDentroCereso,
                gpoCapDiferentes    : registroEditar.gpoCapDiferentes,
                gpoMenorReadap      : registroEditar.gpoMenorReadap,
                gpoFueraCereso      : registroEditar.gpoFueraCereso,
                registroRemoto      : registroEditar.registroRemoto,
                fechaRegistro       : registroEditar.fechaRegistro,
                ultimaActualizacion : registroEditar.ultimaActualizacion
            };

            vm.temp = {};

            inicia();

            function inicia() {

                if($rootScope.currentUser.perfil == 'unidad_inscrip')
                    vm.soloLecturaNumControl = true;

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

                if(vm.registroEditar.curp == undefined)
                    return;

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
                    }, 2000);
                    return;
                }

                Capacitandos.count({
                    where: {
                        and: [
                            {email: vm.registroEditar.email},
                            {idAlumno : {neq: vm.registroEditar.idAlumno}}
                        ]
                    }
                })
                .$promise
                .then(function(resp) {
                    
                        if((resp.count > 0)&&(vm.correoCompartido == false))
                        {
                            vm.mostrarSpiner = false;
                            vm.mostrar_msg_error = true;
                            vm.mensaje = 'El email ya se encuentra registrado';
                            $timeout(function(){
                                 vm.mostrar_msg_error = false;
                                 vm.mensaje = '';
                            }, 2000);
                        }
                        else
                        {
                                Capacitandos.count({
                                    where: {
                                        and: [
                                            {celular: vm.registroEditar.celular},
                                            {celular: {neq: ''}},
                                            {idAlumno : {neq: vm.registroEditar.idAlumno}}
                                        ]
                                    }
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
                                        }, 2000);

                                    }
                                    else
                                    {
                                        Capacitandos.count({
                                            where: {
                                                and: [
                                                    {curp: vm.registroEditar.curp},
                                                    {idAlumno : {neq: vm.registroEditar.idAlumno}}
                                                ]
                                            }
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
                                                }, 2000);

                                            }
                                            else
                                            {

                                                    Capacitandos.count({
                                                        where: {
                                                            and: [
                                                                {numControl: vm.registroEditar.numControl},
                                                                {numControl: {neq: ''}},
                                                                {idAlumno : {neq: vm.registroEditar.idAlumno}}
                                                            ]
                                                        }
                                                    })
                                                    .$promise
                                                    .then(function(resp) {

                                                        if(resp.count > 0)
                                                        {
                                                            vm.mostrarSpiner = false;
                                                            vm.mostrar_msg_error = true;
                                                            vm.mensaje = 'El número de control ya se encuentra asignado a otra persona';
                                                            $timeout(function(){
                                                                 vm.mostrar_msg_error = false;
                                                                 vm.mensaje = '';
                                                            }, 2000);
                                                        }
                                                        else
                                                        {
                                                            vm.registroEditar.ultimaActualizacion =  Date();

                                                            Capacitandos.prototype$updateAttributes(
                                                            {
                                                                id: vm.registroEditar.idAlumno
                                                            },{
                                                                idUnidadAdmtva      : vm.registroEditar.idUnidadAdmtva,
                                                                numControl          : vm.registroEditar.numControl.trim(),
                                                                apellidoPaterno     : vm.registroEditar.apellidoPaterno,
                                                                apellidoMaterno     : vm.registroEditar.apellidoMaterno,
                                                                nombre              : vm.registroEditar.nombre,
                                                                nombreCompleto      : vm.registroEditar.apellidoPaterno + ' ' + vm.registroEditar.apellidoMaterno + ' ' + vm.registroEditar.nombre,
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
                                                                ultimaActualizacion : vm.registroEditar.ultimaActualizacion
                                                            })
                                                            .$promise
                                                            .then(function(respuesta) {
                                                                  $modalInstance.close(vm.registroEditar);
                                                            });

                                                        }

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