(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ParticipanteCursoController', ParticipanteCursoController);

    ParticipanteCursoController.$inject = ['$scope', '$timeout', '$stateParams', 'CursosOficiales','ParticipanteCurso'];

    function ParticipanteCursoController($scope, $timeout, $stateParams, CursosOficiales, ParticipanteCurso) {

          var vm = this;

          vm.muestraListaAlumnos = muestraListaAlumnos;
          vm.activaEncuesta      = activaEncuesta;
          vm.guardaEncuesta      = guardaEncuesta;

          vm.sort_by = sort_by;
          
          vm.listaCursos = [];
          vm.listaAlumnos = [];
          
          vm.cursoSeleccionado = {};
          vm.alumnoSeleccionado = {};
          vm.soloLectura = true;
          vm.mostrar_msg = false;

          vm.encuesta = {};


          inicia();

          function inicia() {

                CursosOficiales.find({
                      filter: {
                          where: {
                            and: [
                              {idUnidadAdmtva: $scope.currentUser.unidad_pertenece_id},
                              {estatus: 5}
                            ]
                          },
                          fields:['idCurso','nombreCurso','nombreInstructor','idLocalidad','idUnidadAdmtva','horario','fechaInicio','fechaFin'],
                          order: ['fechaInicio DESC','nombreCurso ASC','idCurso ASC'],
                          include: [
                              {
                                  relation: 'localidad_pertenece',
                                  scope: {
                                    fields: ['nombre']
                                  }
                              },
                              {
                                  relation: 'unidad_pertenece',
                                  scope: {
                                    fields: ['nombre']
                                  }
                              },
                              {
                                  relation: 'inscripcionesCursos',
                                  scope: {
                                      fields:['id','idAlumno'],
                                      include: [
                                          {
                                              relation: 'Capacitandos',
                                              scope: {
                                                  fields:['numControl','apellidoPaterno','apellidoMaterno','nombre','curp'],
                                                  order: ['apellidoPaterno ASC','apellidoMaterno ASC','nombre ASC','idAlumno ASC']
                                              }
                                          },
                                          'encuesta_satisfacion'
                                      ]
                                  }
                              }
                          ]
                      }
                })
                .$promise
                .then(function(resp) {

                      angular.forEach(resp, function(record) {
                            
                            vm.listaCursos.push({
                                idCurso             : record.idCurso,
                                idLocalidad         : record.idLocalidad,
                                idUnidadAdmtva      : record.idUnidadAdmtva,
                                nombreCurso         : record.nombreCurso,
                                nombreInstructor    : record.nombreInstructor,
                                inscripcionesCursos : record.inscripcionesCursos,
                                localidad_pertenece : record.localidad_pertenece,
                                unidad_pertenece    : record.unidad_pertenece
                            });
                      });

                });
          
          }


          function muestraListaAlumnos() {
              
              vm.listaAlumnos = [];

                angular.forEach(vm.cursoSeleccionado.inscripcionesCursos, function(record) {
                      
                      var encuesta_satisfacion = {};
                      if(record.encuesta_satisfacion !== undefined)
                        encuesta_satisfacion = record.encuesta_satisfacion;
                      
                      vm.listaAlumnos.push({
                          idAlumno             : record.Capacitandos.idAlumno,
                          nombreAlumno         : record.Capacitandos.apellidoPaterno + ' ' + record.Capacitandos.apellidoMaterno + ' ' + record.Capacitandos.nombre,
                          encuesta_satisfacion : encuesta_satisfacion
                      });
                });

                vm.listaAlumnos.sort(sort_by('nombreAlumno', false, function(a){return a.toUpperCase()}));
          }


          function activaEncuesta() {
                

                if(vm.alumnoSeleccionado.encuesta_satisfacion.preg1 !== undefined) {
                    vm.encuesta = vm.alumnoSeleccionado.encuesta_satisfacion;
                    vm.soloLectura = true;
    
                    vm.mostrar_msg = true;
                }
                else
                {
                    vm.encuesta = {};
                    vm.soloLectura = false;
                    vm.mostrar_msg = false;
                }
          }


          function guardaEncuesta() {

                var indice_cursos = vm.listaCursos.map(function(registro) {
                                                        return registro.idCurso;
                                                      }).indexOf(vm.cursoSeleccionado.idCurso);

                var indice_alumno = vm.listaCursos[indice_cursos].inscripcionesCursos.map(function(registro) {
                                                        return registro.idAlumno;
                                                      }).indexOf(vm.alumnoSeleccionado.idAlumno);

                ParticipanteCurso
                .create({
                    idInscripcionCurso : vm.listaCursos[indice_cursos].inscripcionesCursos[indice_alumno].id,
                    preg1              : vm.encuesta.preg1,
                    preg2              : vm.encuesta.preg2,
                    preg3              : vm.encuesta.preg3,
                    preg4              : vm.encuesta.preg4,
                    preg5              : vm.encuesta.preg5,
                    preg6              : vm.encuesta.preg6,
                    preg7              : vm.encuesta.preg7,
                    preg8              : vm.encuesta.preg8,
                    preg9              : vm.encuesta.preg9,
                    preg10             : vm.encuesta.preg10,
                    preg11             : vm.encuesta.preg11,
                    preg12             : vm.encuesta.preg12,
                    preg13             : vm.encuesta.preg13,
                    preg14             : (vm.encuesta.preg14 === undefined ? '' : vm.encuesta.preg14),
                    comentarios        : (vm.encuesta.comentarios === undefined ? '' : vm.encuesta.comentarios)
                })
                .$promise
                .then(function(respuesta) {

                       vm.listaCursos[indice_cursos].inscripcionesCursos.splice(indice_alumno, 1);

                      console.log(vm.alumnoSeleccionado);

                      indice_alumno = vm.listaAlumnos.map(function(registro) {
                                                            return registro.idAlumno;
                                                          }).indexOf(vm.alumnoSeleccionado.idAlumno);

                      vm.listaAlumnos.splice(indice_alumno, 1);
                      swal({
                        title: 'Encuesta guardada',
                        html: 'Gracias por tu respuesta, esto nos servir&aacute; para mejorar nuestro servicio',
                        type: 'success',
                        showCancelButton: false,
                        confirmButtonColor: "#9a0000",
                        confirmButtonText: "Aceptar"
                      });
                      vm.alumnoSeleccionado = {};
                      vm.encuesta = {};
                      vm.soloLectura = true;
                  
                });

          }


          function sort_by(field, reverse, primer) {
              var key = primer ? 
                 function(x) {return primer(x[field])} : 
                 function(x) {return x[field]};

              reverse = !reverse ? 1 : -1;

              return function (a, b) {
                 return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
              }                 
          }


    };

})();