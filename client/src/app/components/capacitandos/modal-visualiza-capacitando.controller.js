(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ModalVisualizaCapacitandoController', ModalVisualizaCapacitandoController);

        ModalVisualizaCapacitandoController.$inject = ['$modalInstance', 'registroEditar', 'CatalogoLocalidades', 'CatalogoNivelEstudios', 'CatalogoActividades', 'CatalogoExperiencias', 'CatalogoMedios', 'CatalogoMotivos'];

    function ModalVisualizaCapacitandoController($modalInstance, registroEditar, CatalogoLocalidades, CatalogoNivelEstudios, CatalogoActividades, CatalogoExperiencias, CatalogoMedios, CatalogoMotivos) {

            var vm = this;

            vm.soloLectura = true;
            vm.mostrarNumControl = true;
            vm.soloLecturaNumControl = true;
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
                idAlumno            : registroEditar.idAlumno,
                idUnidadAdmtva      : registroEditar.idUnidadAdmtva,
                numControl          : registroEditar.numControl,
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



    };

})();