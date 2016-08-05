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
        };
        
        vm.data1 = [];
        vm.data2 = [];

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

                
                CursosOficiales.cursos_mes({
                  anio: vm.anio,
                  meses: '7,8',
                  filter: {
                        order: ['mes ASC']
                  }
                })
                .$promise
                .then(function(resp) {
                    angular.forEach(resp, function(registro) {
                        vm.data1.push([gd(registro.anio, registro.mes, 1), registro.num_cursos]);
                        vm.data2.push([gd(registro.anio, registro.mes, 1), registro.num_personas]);
                    });
                });

        }


        function calculaDatos() {
            
            var condicion_unidad;
            var condicion_trimestre;
            var meses = [];

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
                meses = [1,2,3];
            }
            else if(parseInt(vm.trimestre) == 2)
            {
                var fecha_inicio = new Date(parseInt(vm.anio), 3, 1, 0, 0, 0, 0);
                var fecha_fin    = new Date(parseInt(vm.anio), 5, 30, 23, 59, 59, 999);
                condicion_trimestre = {fechaInicio: {between: [fecha_inicio,fecha_fin]} };
                meses = [4,5,6];
            }
            else if(parseInt(vm.trimestre) == 3)
            {
                var fecha_inicio = new Date(parseInt(vm.anio), 6, 1, 0, 0, 0, 0);
                var fecha_fin    = new Date(parseInt(vm.anio), 8, 30, 23, 59, 59, 999);
                condicion_trimestre = {fechaInicio: {between: [fecha_inicio,fecha_fin]} };
                meses = [7,8,9];
            }
            else if(parseInt(vm.trimestre) == 4)
            {
                var fecha_inicio = new Date(parseInt(vm.anio), 9, 1, 0, 0, 0, 0);
                var fecha_fin    = new Date(parseInt(vm.anio), 11, 31, 23, 59, 59, 999);
                condicion_trimestre = {fechaInicio: {between: [fecha_inicio,fecha_fin]} };
                meses = [10,11,12];
            }
            else if(parseInt(vm.trimestre) >= 11)
            {
                var fecha_inicio = new Date(parseInt(vm.anio), (parseInt(vm.trimestre)-11), 1, 0, 0, 0, 0);

                var numDias = new Date(parseInt(vm.anio), (parseInt(vm.trimestre)-10), 0).getDate();  

                var fecha_fin    = new Date(parseInt(vm.anio), (parseInt(vm.trimestre)-11), numDias, 23, 59, 59, 999);
                condicion_trimestre = {fechaInicio: {between: [fecha_inicio,fecha_fin]} };
                meses = [(fecha_inicio.getMonth()+1)];
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

            
            vm.data3 = [];

            if(parseInt(vm.trimestre) > 0)
            {
                    CursosOficiales.cursos_mes({
                      anio: vm.anio,
                      meses: meses.toString(),
                      filter: {
                            order: ['mes ASC']
                      }
                    })
                    .$promise
                    .then(function(resp) {
                        angular.forEach(resp, function(registro) {
                            vm.data3.push([gd(registro.anio, registro.mes, 1), registro.num_personas]);
                        });
                    });

            }


            var dataset = [
                {
                    label: "Personas inscritas",
                    grow:{stepMode:"linear"},
                    data: vm.data2,
                    color: "#1ab394",
                    bars: {
                        show: true,
                        align: "center",
                        barWidth: 30 * 24 * 60 * 60 * 600,
                        lineWidth: 0
                    }

                },
                {
                    label: "Meses seleccionados",
                    grow:{stepMode:"linear"},
                    data: vm.data3,
                    color: "#FF0000",
                    bars: {
                        show: true,
                        align: "center",
                        barWidth: 30 * 24 * 60 * 60 * 600,
                        lineWidth: 0
                    }

                },
                {
                    label: "Cursos impartidos",
                    grow:{stepMode:"linear"},
                    data: vm.data1,
                    yaxis: 2,
                    color: "#1C84C6",
                    lines: {
                        lineWidth: 1,
                        show: true,
                        fill: true,
                        fillColor: {
                            colors: [
                                {
                                    opacity: 0.2
                                },
                                {
                                    opacity: 0.2
                                }
                            ]
                        }
                    }
                }
            ];


            var options = {
                grid: {
                    hoverable: true,
                    clickable: true,
                    tickColor: "#d5d5d5",
                    borderWidth: 0,
                    color: '#d5d5d5'
                },
                colors: ["#1ab394", "#464f88"],
                tooltip: true,
                xaxis: {
                    mode: "time",
                    timeformat: "%b",
                    tickSize: [1, "month"],
                    monthNames: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
                    tickLength: 0,
                    axisLabel: "Mes",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Arial',
                    axisLabelPadding: 10,
                    color: "#d5d5d5"
                },
                yaxes: [
                    {
                        position: "left",
                        //max: 25,
                        tickDecimals: 0,
                        color: "#d5d5d5",
                        axisLabelUseCanvas: true,
                        axisLabelFontSizePixels: 12,
                        axisLabelFontFamily: 'Arial',
                        axisLabelPadding: 3
                    },
                    {
                        position: "right",
                        tickDecimals: 0,
                        color: "#d5d5d5",
                        axisLabelUseCanvas: true,
                        axisLabelFontSizePixels: 12,
                        axisLabelFontFamily: ' Arial',
                        axisLabelPadding: 67
                    }
                ],
                legend: {
                    noColumns: 1,
                    labelBoxBorderColor: "#d5d5d5",
                    position: "ne",
                    margin: [-170,15]
                }

            };

            /**
             * Definition of variables
             * Flot chart
             */
            vm.flotData = dataset;
            vm.flotOptions = options;
        }


        function gd(year, month, day) {
            return new Date(year, month - 1, day).getTime();
        }


    };

})();