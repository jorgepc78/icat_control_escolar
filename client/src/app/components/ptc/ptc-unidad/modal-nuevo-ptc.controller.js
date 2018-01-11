(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ModalNuevoPTCController', ModalNuevoPTCController);

        ModalNuevoPTCController.$inject = ['$scope', '$modalInstance', 'HorasAsignadasUnidad', 'ProgTrimCursos'];

    function ModalNuevoPTCController($scope, $modalInstance, HorasAsignadasUnidad, ProgTrimCursos) {

            var vm = this;

            vm.muestraTrimestres = muestraTrimestres;
            vm.guardar    = guardar;

            vm.mostrarSpiner = false;
            vm.listaAniosDisp = [];
            vm.listaTrimestres = [];

            vm.registroEdicion = {
                anio             : 0,
                trimestre        : '',
            };

            inicia();

            function inicia() {
                vm.mostrarSpiner = true;
                var fechaHoy = new Date();

                HorasAsignadasUnidad.find({
                    filter: {
                        where: {
                            and: [
                                {idUnidadAdmtva: $scope.currentUser.unidad_pertenece_id},
                                {anio: {gte: fechaHoy.getFullYear()}}
                            ]
                        },
                        fields: ['anio'],
                        order: 'anio ASC'
                    }
                })
                .$promise
                .then(function(resp) {
                    vm.listaAniosDisp = resp;
                    vm.mostrarSpiner = false;
                });

            };


            function muestraTrimestres() {
                vm.mostrarSpiner = true;
                ProgTrimCursos.find({
                    filter: {
                        where: {
                            and: [
                                {idUnidadAdmtva: $scope.currentUser.unidad_pertenece_id},
                                {anio: vm.registroEdicion.anio}
                            ]
                        },
                        fields: ['trimestre'],
                        order: ['trimestre ASC']
                    }
                })
                .$promise
                .then(function(respuesta) {

                    vm.listaTrimestres = [
                        {trimestre: 1, alias: 'PRIMERO (ENERO - MARZO)'},
                        {trimestre: 2, alias: 'SEGUNDO (ABRIL - JUNIO)'},
                        {trimestre: 3, alias: 'TERCERO (JULIO - SEPTIEMBRE)'},
                        {trimestre: 4, alias: 'CUARTO (OCTUBRE - DICIEMBRE)'}
                    ];

                    angular.forEach(respuesta, function(record) {
                          var index = vm.listaTrimestres.map(function(registro) {
                                                              return registro.trimestre;
                                                            }).indexOf(record.trimestre);

                          if(index >= 0)
                            vm.listaTrimestres.splice(index, 1);
                    });
                    vm.mostrarSpiner = false;
                    
                });
            }


            function guardar() {

                ProgTrimCursos
                .create({
                    idUnidadAdmtva   : $scope.currentUser.unidad_pertenece_id,
                    anio             : vm.registroEdicion.anio,
                    trimestre        : parseInt(vm.registroEdicion.trimestre),
                    fechaElaboracion : Date()
                })
                .$promise
                .then(function(respuesta) {
                    $modalInstance.close();
                })
                .catch(function(error) {
                });

            };
    };

})();