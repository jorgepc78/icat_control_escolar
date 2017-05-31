(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('TutorialController', TutorialController);

    TutorialController.$inject = ['$scope', '$stateParams', '$location', '$sce'];

    function TutorialController($scope, $stateParams, $location, $sce) {

            var vm = this;

            vm.titulo = "";
            vm.id_video = 0;
            vm.video = "";

            inicia();

            function inicia() {
                vm.id_video = $stateParams.id_video;
                if(vm.id_video == 1) {
                    vm.video = 'envio_ptc.mp4';
                    vm.titulo = 'Modificación y envío del PTC';
                }
                else if(vm.id_video == 2) {
                    vm.video = 'preapertura_curso_ptc.mp4';
                    vm.titulo = 'Preapertura de un curso programado en el PTC';
                }
                else if(vm.id_video == 3) {
                    vm.video = 'preapertura_curso_fuera_ptc.mp4';
                    vm.titulo = 'Preapertura de un curso fuera del PTC';
                }
                else if(vm.id_video == 4) {
                    vm.video = 'administracion_cursos_activos.mp4';
                    vm.titulo = 'Administración de cursos vigentes';
                }
                else if(vm.id_video == 5) {
                    vm.video = 'registro_inscripcion_pagos.mp4';
                    vm.titulo = 'Registro de inscripción y pagos';
                }
                else if(vm.id_video == 6) {
                    vm.video = 'conclusion_cierre_curso.mp4';
                    vm.titulo = 'Conclusión y cierre del curso';
                }

                vm.config = {
                    preload: "none",
                    sources: [
                        {src: $sce.trustAsResourceUrl($location.protocol() + "://" + $location.host() + ":" + $location.port() + "/assets/videos/" + vm.video), type: "video/mp4"}
                    ],
                    theme: {
                        url: "assets/libs/videogular-themes-default/videogular.css"
                    },
                    plugins: {
                        controls: {
                            autoHide: true,
                            autoHideTime: 5000
                        }
                    }
                };
            }

    };

})();