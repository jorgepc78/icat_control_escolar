(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ModalEditaPTCController', ModalEditaPTCController);

        ModalEditaPTCController.$inject = ['$scope', '$modalInstance', 'registroEditar', 'HorasAsignadasUnidad', 'ProgTrimCursos'];

    function ModalEditaPTCController($scope, $modalInstance, registroEditar, HorasAsignadasUnidad, ProgTrimCursos) {

            var vm = this;

            vm.muestraTrimestres = muestraTrimestres;
            vm.guardar = guardar;

            vm.registroEdicion = {
                anio              : registroEditar.anio,
                trimestre         : registroEditar.trimestre,
                fechaModificacion : ''
            };


            inicia();

            function inicia() {
   
                   var fechaHoy = new Date();

                   HorasAsignadasUnidad.find({
                    filter: {
                        where: {
                            and: [
                                {idUnidadAdmtva: $scope.currentUser.unidad_pertenece_id},
                                {anio: {gte: vm.registroEdicion.anio}}
                            ]
                        },
                        fields: ['anio'],
                        order: 'anio ASC'
                    }
                })
                .$promise
                .then(function(resp) {
                        vm.listaAniosDisp = resp;

                        ProgTrimCursos.find({
                            filter: {
                                where: {
                                    and: [
                                        {idUnidadAdmtva: $scope.currentUser.unidad_pertenece_id},
                                        {anio: vm.registroEdicion.anio},
                                        {trimestre:{neq:vm.registroEdicion.trimestre}}
                                    ]
                                },
                                fields: ['trimestre'],
                                order: ['trimestre ASC']
                            }
                        })
                        .$promise
                        .then(function(respuesta) {

                            vm.listaTrimestres = [
                                {trimestre: 1, alias: 'PRIMERO'},
                                {trimestre: 2, alias: 'SEGUNDO'},
                                {trimestre: 3, alias: 'TERCERO'},
                                {trimestre: 4, alias: 'CUARTO'}
                            ];

                            angular.forEach(respuesta, function(record) {
                                  var index = vm.listaTrimestres.map(function(registro) {
                                                                      return registro.trimestre;
                                                                    }).indexOf(record.trimestre);

                                  if(index >= 0)
                                    vm.listaTrimestres.splice(index, 1);
                            });                            
                        });

                });

            };


            function muestraTrimestres() {

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
                        {trimestre: 1, alias: 'PRIMERO'},
                        {trimestre: 2, alias: 'SEGUNDO'},
                        {trimestre: 3, alias: 'TERCERO'},
                        {trimestre: 4, alias: 'CUARTO'}
                    ];

                    angular.forEach(respuesta, function(record) {
                          var index = vm.listaTrimestres.map(function(registro) {
                                                              return registro.trimestre;
                                                            }).indexOf(record.trimestre);

                          if(index >= 0)
                            vm.listaTrimestres.splice(index, 1);
                    });
                    
                });
            }


            function guardar() {

                var datos = {
                    anio              : vm.registroEdicion.anio,
                    trimestre         : parseInt(vm.registroEdicion.trimestre),
                    estatus           : 0,
                    fechaModificacion : Date()
                };

                ProgTrimCursos.prototype$updateAttributes(
                {
                    id: registroEditar.idPtc
                },
                    datos
                )
                .$promise
                .then(function(respuesta) {
                      vm.registroEdicion.fechaModificacion = respuesta.fechaModificacion;
                      vm.registroEdicion.estatus = respuesta.estatus;
                      $modalInstance.close(vm.registroEdicion);
                });

            };
    };

})();