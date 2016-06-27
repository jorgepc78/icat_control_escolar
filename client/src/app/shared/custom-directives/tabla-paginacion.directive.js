(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .directive('tablaPaginacion', tablaPaginacion);

    function tablaPaginacion(){
        return {
            restrict: 'AE',
            scope: {
                tabla: '=config',
                paginar: '&'
            },
            template: '<div class="row"><div class="col-md-5"><span class="pull-left medium text-muted" style="margin-top:22px;">Mostrando registros del {{(tabla.inicio+1)}} al {{tabla.fin}} de un total de {{tabla.totalElementos}} registros</span></div>' +
                      '<div class="col-md-7"><pagination total-items="tabla.totalElementos" ng-model="tabla.paginaActual" previous-text="Anterior" next-text="Siguiente" first-text="Primero" last-text="&Uacute;ltimo" max-size="5" boundary-links="true" ng-change="paginar()" items-per-page="tabla.registrosPorPagina" class="pagination-sm pull-right" rotate="false"></pagination></div></div>'
        };
    }

})();