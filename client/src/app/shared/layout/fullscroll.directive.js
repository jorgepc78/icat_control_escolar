(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .directive('fullScroll', fullScroll)

    function fullScroll($timeout){
        return {
            restrict: 'A',
            link: function(scope, element) {
                $timeout(function(){
                    element.slimscroll({
                        height: '100%',
                        railOpacity: 0.9,
                        alwaysVisible: true
                    });

                });
            }
        };
    }

})();