(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ResumenPTCUnidadesController', ResumenPTCUnidadesController);

    ResumenPTCUnidadesController.$inject = ['$scope', '$rootScope', '$modal', '$q', 'tablaDatosService', 'ProgTrimCursos', 'HorasAsignadasUnidad', 'CursosPtc', 'CatalogoUnidadesAdmtvas', 'ControlProcesos', 'Usuario'];

    function ResumenPTCUnidadesController($scope, $rootScope, $modal, $q, tablaDatosService, ProgTrimCursos, HorasAsignadasUnidad, CursosPtc, CatalogoUnidadesAdmtvas, ControlProcesos, Usuario) {

            var vm = this;
            
            vm.muestra_ptcs_ano = muestra_ptcs_ano;

            vm.tablaListaPTCs = {
              totalElementos     : 0,
              paginaActual       : 1,
              registrosPorPagina : 5,
              inicio             : 0,
              fin                : 1,
              condicion          : {},
              filtro_datos       : {},
              fila_seleccionada  : 0
            };

            vm.listaAniosDisp = [];
            vm.anioSeleccionado = {};
            vm.registrosPTCs = [];

            inicia();

            function inicia() {

                  ProgTrimCursos.anios_ptc()
                  .$promise
                  .then(function(resp) {
                        vm.listaAniosDisp = resp;
                  });
            }

            function muestra_ptcs_ano() {
                  ProgTrimCursos.resumen_ptc_unidades({anio:vm.anioSeleccionado.anio})
                  .$promise
                  .then(function(resp) {
                        vm.registrosPTCs = resp;
                  });              
            }
    };

})();