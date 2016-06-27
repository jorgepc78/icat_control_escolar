(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .directive('sideNavigation', sideNavigation)

    function sideNavigation($timeout) {
        return {
            restrict: 'A',
            link: function(scope, element) {
     
                // Call the metsiMenu plugin and plug it to sidebar navigation
                $timeout(function(){
                    element.metisMenu();
                });
     
                // Enable initial fixed sidebar
                var sidebar = element.parent();
                sidebar.slimScroll({
                    height: '100%',
                    railOpacity: 0.9,
                });
            }
        };
    };

})();