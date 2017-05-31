(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .directive('sparkline', sparkline);

    /**
     * sparkline - Directive for Sparkline chart
     */
    function sparkline() {
        /*return {
            restrict: 'A',
            scope: {
                sparkData: '=',
                sparkOptions: '=',
            },
            link: function ($scope, element, attrs) {
                $scope.$watch($scope.sparkData, function () {
                    console.log($scope.sparkData);
                    render();
                });
                $scope.$watch($scope.sparkOptions, function(){
                    render();
                });
                var render = function () {
                    $(element).sparkline($scope.sparkData, $scope.sparkOptions);
                };
            }
        }*/

        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                data: '='
            },
            link: function(scope, element, attrs, ngModel){
                var opts = {};

                opts.type = attrs.type || 'line';

                scope.$watch(attrs.ngModel, function() {
                    render();
                });

                scope.$watch(attrs.opts, function(){
                    render();
                });

                var render = function() {
                    var model;

                    if(attrs.opts) angular.extend(opts, angular.fromJson(attrs.opts));

                    // Trim trailing comma if we are a string
                    angular.isString(ngModel.$viewValue) ? model = ngModel.$viewValue.replace(/(^,)|(,$)/g, "") : model = ngModel.$viewValue;

                    var data;

                    // Make sure we have an array of numbers
                    angular.isArray(model) ? data = model : data = model.split(',');

                    $(element).sparkline(data, opts);
                };
            }
        }

    };




})();