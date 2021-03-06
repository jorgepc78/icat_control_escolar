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
        'angularFileUpload',
        'ngOrderObjectBy',
        'angular-flot',
        'ui.select',
        'ngSanitize',
        'com.2fdevs.videogular',
        'com.2fdevs.videogular.plugins.controls',
    	'templates'
    ]);
})();
