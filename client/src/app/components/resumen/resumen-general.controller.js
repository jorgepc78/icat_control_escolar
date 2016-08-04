(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ResumenGeneralController', ResumenGeneralController)

    ResumenGeneralController.$inject = ['$scope','CatalogoUnidadesAdmtvas', 'Capacitandos', 'CursosOficiales'];

    function ResumenGeneralController($scope, CatalogoUnidadesAdmtvas, Capacitandos, CursosOficiales) {

        var vm = this;

        vm.calculaDatos = calculaDatos;

        vm.anio = '';
        vm.trimestre = '0';

        vm.listaUnidades = [{
            idUnidadAdmtva  : 0,
            nombre          : 'Todas'
        }];
        vm.unidadSeleccionada = [];

        vm.datos = {
            total_capacitandos   : 0,
            cursos_activados     : 0,
            capacitandos_activos : 0
        }
        

        inicia();

        function inicia() {

                var fechaHoy = new Date();
                vm.anio = fechaHoy.getFullYear().toString();
                vm.unidadSeleccionada = vm.listaUnidades[0];

                CatalogoUnidadesAdmtvas.find({
                    filter: {
                      where: {idUnidadAdmtva: {gt: 1}},
                      fields:['idUnidadAdmtva','nombre'],
                      order: 'nombre ASC'
                    }
                })
                .$promise
                .then(function(resp) {
                    
                    angular.forEach(resp, function(registro) {
                        vm.listaUnidades.push({
                            idUnidadAdmtva  : registro.idUnidadAdmtva,
                            nombre          : registro.nombre
                        });
                    });

                    vm.calculaDatos();
                });
        }


        function calculaDatos() {
            
            var condicion_unidad;
            var condicion_trimestre;

            if(vm.unidadSeleccionada.idUnidadAdmtva == 0)
                condicion_unidad = {idUnidadAdmtva : {gt:1}};
            else
                condicion_unidad = {idUnidadAdmtva: vm.unidadSeleccionada.idUnidadAdmtva};

            if(parseInt(vm.trimestre) == 0)
            {
                var fecha_inicio = new Date(parseInt(vm.anio), 0, 1, 0, 0, 0, 0);
                var fecha_fin    = new Date(parseInt(vm.anio), 11, 31, 23, 59, 59, 999);
                condicion_trimestre = {fechaInicio: {between: [fecha_inicio,fecha_fin]} };                
            }
            else if(parseInt(vm.trimestre) == 1)
            {
                var fecha_inicio = new Date(parseInt(vm.anio), 0, 1, 0, 0, 0, 0);
                var fecha_fin    = new Date(parseInt(vm.anio), 2, 31, 23, 59, 59, 999);
                condicion_trimestre = {fechaInicio: {between: [fecha_inicio,fecha_fin]} };
            }
            else if(parseInt(vm.trimestre) == 2)
            {
                var fecha_inicio = new Date(parseInt(vm.anio), 3, 1, 0, 0, 0, 0);
                var fecha_fin    = new Date(parseInt(vm.anio), 5, 30, 23, 59, 59, 999);
                condicion_trimestre = {fechaInicio: {between: [fecha_inicio,fecha_fin]} };
            }
            else if(parseInt(vm.trimestre) == 3)
            {
                var fecha_inicio = new Date(parseInt(vm.anio), 6, 1, 0, 0, 0, 0);
                var fecha_fin    = new Date(parseInt(vm.anio), 8, 30, 23, 59, 59, 999);
                condicion_trimestre = {fechaInicio: {between: [fecha_inicio,fecha_fin]} };
            }
            else if(parseInt(vm.trimestre) == 4)
            {
                var fecha_inicio = new Date(parseInt(vm.anio), 9, 1, 0, 0, 0, 0);
                var fecha_fin    = new Date(parseInt(vm.anio), 11, 31, 23, 59, 59, 999);
                condicion_trimestre = {fechaInicio: {between: [fecha_inicio,fecha_fin]} };
            }
            else if(parseInt(vm.trimestre) >= 11)
            {
                var fecha_inicio = new Date(parseInt(vm.anio), (parseInt(vm.trimestre)-11), 1, 0, 0, 0, 0);

                var numDias = new Date(parseInt(vm.anio), (parseInt(vm.trimestre)-10), 0).getDate();  

                var fecha_fin    = new Date(parseInt(vm.anio), (parseInt(vm.trimestre)-11), numDias, 23, 59, 59, 999);
                condicion_trimestre = {fechaInicio: {between: [fecha_inicio,fecha_fin]} };
            }

            Capacitandos.count({
                where: condicion_unidad
            })
            .$promise
            .then(function(resp) {
                vm.datos.total_capacitandos = resp.count;
            });

            CursosOficiales.count({
                where: {
                    and: [
                        condicion_unidad,
                        condicion_trimestre,
                        {
                            or:[
                                {estatus: 2},
                                {estatus: 4},
                                {estatus: 5},
                                {estatus: 6}
                            ]
                        }
                    ]
                }
            })
            .$promise
            .then(function(resp) {
                vm.datos.cursos_activados = resp.count;
            });

                
            CursosOficiales.find({
                  filter: {
                        where: {
                            and: [
                                condicion_unidad,
                                condicion_trimestre,
                                {
                                    or:[
                                        {estatus: 2},
                                        {estatus: 4},
                                        {estatus: 5},
                                        {estatus: 6}
                                    ]
                                }
                            ]
                        },
                        fields:['idCurso','fechaInicio'],
                        include: {
                          relation: 'inscripcionesCursos',
                          scope: {
                              fields:['idAlumno','pagado']
                          }
                        }
                  }
            })
            .$promise
            .then(function(resp) {

                    var total = 0;
                    angular.forEach(resp, function(curso) {
                          
                          angular.forEach(curso.inscripcionesCursos, function(inscripcion) {
                                
                                if(inscripcion.pagado == true)
                                    total++;
                          });
                    });
                    vm.datos.capacitandos_activos = total;
                
            });


        }

    };

})();