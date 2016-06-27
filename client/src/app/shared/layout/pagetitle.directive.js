(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .directive('pageTitle', pageTitle)

    function pageTitle($rootScope, $timeout) {
        return {
            link: function(scope, element) {
                var listener = function(event, toState, toParams, fromState, fromParams) {
                    // Default title - load on Dashboard 1
                    var title = 'ICAT Control Escolar';
                    // Create your own title pattern
                    if (toState.data && toState.data.pageTitle) title = 'SEDUVI | ' + toState.data.pageTitle;
                    $timeout(function() {
                        element.text(title);
                    });
                };
                $rootScope.$on('$stateChangeStart', listener);
            }
        }
    }

})();