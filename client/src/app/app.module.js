(function () {
    'use strict';

    angular.module('icat_control_escolar', [
        'ui.router',                    // Routing
        'ui.bootstrap',                 // Ui Bootstrap
    	'lbServices',
    	'LocalStorageModule',
    	'ui.event',
    	'oitozero.ngSweetAlert',
        'ui.date',
        'NgSwitchery',
        'naif.base64',
        'ngDropdowns',
        'ngFileSaver',
        'ngOrderObjectBy'
    	/*'templates'*/
    ]);
})();
