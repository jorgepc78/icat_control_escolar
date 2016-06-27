(function () {
    'use strict';

    angular.module('icat_control_escolar', [
        'ui.router',                    // Routing
        'oc.lazyLoad',                  // ocLazyLoad
        'ui.bootstrap',                 // Ui Bootstrap
    	'lbServices',
    	'LocalStorageModule',
    	'ui.event',
    	'oitozero.ngSweetAlert',
        'ui.date',
        'NgSwitchery'
    	/*'templates'*/
    ]);
})();
