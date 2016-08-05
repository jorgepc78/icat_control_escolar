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
        vm.anio_actual = '';
        vm.trimestre = '0';

        vm.listaUnidades = [{
            idUnidadAdmtva  : 0,
            nombre          : 'Todas'
        }];
        vm.unidadSeleccionada = [];
        vm.id_unidad_actual = -1;

        vm.datos = {
            total_capacitandos   : 0,
            cursos_activados     : 0,
            capacitandos_activos : 0
        };
        
        vm.datos2 = {
            capacitandos_inscritos  : 0,
            capacitandos_terminaron : 0,
            eficiencia_terminal     : 0.0
        };
        

        inicia();

        function inicia() {

                var fechaHoy = new Date();
                vm.anio = fechaHoy.getFullYear().toString();

                if($scope.currentUser.unidad_pertenece_id == 1)
                {
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

                        vm.unidadSeleccionada = vm.listaUnidades[0];
                        vm.calculaDatos();
                    });
                }
                else
                {
                    vm.unidadSeleccionada = {
                        idUnidadAdmtva  : $scope.currentUser.unidad_pertenece_id,
                        nombre          : $scope.currentUser.nombre_unidad
                    };

                    vm.calculaDatos();
                }
        }


        function calculaDatos() {
            
            var condicion_unidad;
            var condicion_trimestre;
            var meses = [];

            if(vm.anio_actual != vm.anio) {
                if($scope.currentUser.unidad_pertenece_id == 1)
                    vm.unidadSeleccionada = vm.listaUnidades[0];

                vm.trimestre = 0;

                vm.datos.total_capacitandos = 0;
                vm.datos.cursos_activados = 0;
                vm.datos.capacitandos_activos = 0;

                CursosOficiales.resumen_total({
                  id_unidad: ($scope.currentUser.unidad_pertenece_id > 1 ? $scope.currentUser.unidad_pertenece_id : vm.unidadSeleccionada.idUnidadAdmtva ),
                  anio: vm.anio
                })
                .$promise
                .then(function(resp) {
                    angular.forEach(resp, function(registro) {
                        vm.datos.total_capacitandos     += parseInt(registro.total_inscritos);
                        vm.datos.cursos_activados       += parseInt(registro.num_cursos);
                        vm.datos.capacitandos_activos   += parseInt(registro.num_personas_inscritas);
                    });
                });

            }

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

                

            if( (vm.anio_actual != vm.anio)||(vm.id_unidad_actual != vm.unidadSeleccionada.idUnidadAdmtva) )
            {
                    vm.anio_actual = vm.anio;
                    vm.id_unidad_actual = vm.unidadSeleccionada.idUnidadAdmtva;

                    vm.data_cursos_impartidos = [];
                    vm.data_personas_inscritas = [];
                    vm.data_personas_aprueban = [];

                    vm.datos2.capacitandos_inscritos = 0;
                    vm.datos2.capacitandos_terminaron = 0;
                    vm.datos2.eficiencia_terminal = 0;
                    CursosOficiales.cursos_mes({
                      id_unidad: ($scope.currentUser.unidad_pertenece_id > 1 ? $scope.currentUser.unidad_pertenece_id : vm.unidadSeleccionada.idUnidadAdmtva ),
                      anio: vm.anio,
                      meses: '0',
                      filter: {
                            order: ['mes ASC']
                      }
                    })
                    .$promise
                    .then(function(resp) {
                        angular.forEach(resp, function(registro) {
                            vm.data_cursos_impartidos.push([gd(registro.anio, registro.mes, 1), registro.num_cursos]);
                            vm.data_personas_inscritas.push([gd(registro.anio, registro.mes, 1), registro.num_personas]);
                            vm.data_personas_aprueban.push([gd(registro.anio, registro.mes, 1), registro.num_personas_terminan]);

                            vm.datos2.capacitandos_inscritos += parseInt(registro.num_personas);
                            vm.datos2.capacitandos_terminaron += parseInt(registro.num_personas_terminan);
                        });
                        
                        if(vm.datos2.capacitandos_terminaron == 0)
                            vm.datos2.eficiencia_terminal = 0;
                        else
                            vm.datos2.eficiencia_terminal = (vm.datos2.capacitandos_terminaron / vm.datos2.capacitandos_inscritos) * 100;
                    });


                    vm.flotData = [
                        {
                            label: "Personas inscritas",
                            grow:{stepMode:"linear"},
                            data: vm.data_personas_inscritas,
                            color: "#1ab394",
                            bars: {
                                show: true,
                                align: "center",
                                barWidth: 30 * 24 * 60 * 60 * 600,
                                lineWidth: 0
                            }

                        },{
                            label: "Cursos impartidos",
                            grow:{stepMode:"linear"},
                            data: vm.data_cursos_impartidos,
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

                    vm.flotData2 = [
                        {
                            label: "Personas inscritas",
                            grow:{stepMode:"linear"},
                            data: vm.data_personas_inscritas,
                            color: "#1ab394",
                            bars: {
                                show: true,
                                align: "center",
                                barWidth: 30 * 24 * 60 * 60 * 600,
                                lineWidth: 0
                            }

                        },{
                            label: "Personas aprueban el curso",
                            grow:{stepMode:"linear"},
                            data: vm.data_personas_aprueban,
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


                    vm.flotOptions = {
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
                            },{
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


                    vm.flotOptions2 = {
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
                                tickDecimals: 0,
                                color: "#d5d5d5",
                                axisLabelUseCanvas: true,
                                axisLabelFontSizePixels: 12,
                                axisLabelFontFamily: 'Arial',
                                axisLabelPadding: 3
                            },{
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
                            //margin: [-170,15]
                        }

                    };

            }




            if(parseInt(vm.trimestre) > 0)
            {
                    vm.data_seleccionados = [];
                    CursosOficiales.cursos_mes({
                      id_unidad: ($scope.currentUser.unidad_pertenece_id > 1 ? $scope.currentUser.unidad_pertenece_id : vm.unidadSeleccionada.idUnidadAdmtva ),
                      anio: vm.anio,
                      meses: meses.toString(),
                      filter: {
                            order: ['mes ASC']
                      }
                    })
                    .$promise
                    .then(function(resp) {
    
                            vm.datos2.capacitandos_inscritos = 0;
                            vm.datos2.capacitandos_terminaron = 0;
                            vm.datos2.eficiencia_terminal = 0;

                            angular.forEach(resp, function(registro) {
                                vm.data_seleccionados.push([gd(registro.anio, registro.mes, 1), registro.num_personas]);
                                
                                vm.datos2.capacitandos_inscritos += parseInt(registro.num_personas);
                                vm.datos2.capacitandos_terminaron += parseInt(registro.num_personas_terminan);
                            });
                        
                            if(vm.datos2.capacitandos_terminaron == 0)
                                vm.datos2.eficiencia_terminal = 0;
                            else
                                vm.datos2.eficiencia_terminal = (vm.datos2.capacitandos_terminaron / vm.datos2.capacitandos_inscritos) * 100;

                            vm.flotData = [
                                {
                                    label: "Personas inscritas",
                                    grow:{stepMode:"linear"},
                                    data: vm.data_personas_inscritas,
                                    color: "#1ab394",
                                    bars: {
                                        show: true,
                                        align: "center",
                                        barWidth: 30 * 24 * 60 * 60 * 600,
                                        lineWidth: 0
                                    }

                                },{
                                    label: "Meses seleccionados",
                                    grow:{stepMode:"linear"},
                                    data: vm.data_seleccionados,
                                    color: "#FF0000",
                                    bars: {
                                        show: true,
                                        align: "center",
                                        barWidth: 30 * 24 * 60 * 60 * 600,
                                        lineWidth: 0
                                    }

                                },{
                                    label: "Cursos impartidos",
                                    grow:{stepMode:"linear"},
                                    data: vm.data_cursos_impartidos,
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

                            vm.flotData2 = [
                                {
                                    label: "Personas inscritas",
                                    grow:{stepMode:"linear"},
                                    data: vm.data_personas_inscritas,
                                    color: "#1ab394",
                                    bars: {
                                        show: true,
                                        align: "center",
                                        barWidth: 30 * 24 * 60 * 60 * 600,
                                        lineWidth: 0
                                    }

                                },{
                                    label: "Meses seleccionados",
                                    grow:{stepMode:"linear"},
                                    data: vm.data_seleccionados,
                                    color: "#FF0000",
                                    bars: {
                                        show: true,
                                        align: "center",
                                        barWidth: 30 * 24 * 60 * 60 * 600,
                                        lineWidth: 0
                                    }

                                },{
                                    label: "Personas aprueban el curso",
                                    grow:{stepMode:"linear"},
                                    data: vm.data_personas_aprueban,
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

                    });
            }
            else
            {
                    vm.flotData = [
                        {
                            label: "Personas inscritas",
                            grow:{stepMode:"linear"},
                            data: vm.data_personas_inscritas,
                            color: "#1ab394",
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
                            data: vm.data_cursos_impartidos,
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
     
                    vm.flotData2 = [
                        {
                            label: "Personas inscritas",
                            grow:{stepMode:"linear"},
                            data: vm.data_personas_inscritas,
                            color: "#1ab394",
                            bars: {
                                show: true,
                                align: "center",
                                barWidth: 30 * 24 * 60 * 60 * 600,
                                lineWidth: 0
                            }

                        },{
                            label: "Personas aprueban el curso",
                            grow:{stepMode:"linear"},
                            data: vm.data_personas_aprueban,
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

            }

        }


        function gd(year, month, day) {
            return new Date(year, month - 1, day).getTime();
        }


    };

})();