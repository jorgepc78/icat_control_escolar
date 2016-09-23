(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('AdminInstructoresController', AdminInstructoresController);

    AdminInstructoresController.$inject = ['$scope', '$modal', 'tablaDatosService', 'CatalogoInstructores', 'CatalogoUnidadesAdmtvas'];

    function AdminInstructoresController($scope, $modal, tablaDatosService, CatalogoInstructores, CatalogoUnidadesAdmtvas ) {

            var vm = this;

            vm.muestra_ptc_unidad     = muestra_ptc_unidad;

            vm.muestraDatosRegistroActual = muestraDatosRegistroActual;
            vm.muestraResultadosBusqueda  = muestraResultadosBusqueda;
            vm.limpiaBusqueda             = limpiaBusqueda;
            vm.cambiarPagina              = cambiarPagina;
            vm.edita_datos_registro       = edita_datos_registro;
            vm.nuevo_registro             = nuevo_registro;
            vm.elimina_registro           = elimina_registro;


            vm.listaUnidades = [];
            vm.unidadSeleccionada = undefined;

            vm.tablaListaRegistros = {
              totalElementos     : 0,
              paginaActual       : 1,
              registrosPorPagina : 5,
              inicio             : 0,
              fin                : 1,
              condicion          : {},
              filtro_datos       : {},
              fila_seleccionada  : 0
            };


            inicia();

            function inicia() {

                  if($scope.currentUser.unidad_pertenece_id > 1)
                  {
                      vm.tablaListaRegistros.condicion = {
                          idUnidadAdmtva: $scope.currentUser.unidad_pertenece_id
                      };
                  }
                  else
                  {
                      vm.tablaListaRegistros.condicion = {};
                      CatalogoUnidadesAdmtvas.find({
                          filter: {
                              where: {idUnidadAdmtva: {gt: 1}},
                              order: 'nombre ASC'
                          }
                      })
                      .$promise
                      .then(function(resp) {

                          vm.listaUnidades.push({
                              idUnidadAdmtva  : -1,
                              nombre          : 'Todas'
                          },{
                              idUnidadAdmtva  : 0,
                              nombre          : 'Sin asignar'
                          });

                          angular.forEach(resp, function(unidad) {
                                vm.listaUnidades.push({
                                    idUnidadAdmtva  : unidad.idUnidadAdmtva,
                                    nombre          : unidad.nombre
                                });
                          });

                          vm.unidadSeleccionada = vm.listaUnidades[0];
                      });

                  }


                  vm.tablaListaRegistros.filtro_datos = {
                          filter: {
                              where: vm.tablaListaRegistros.condicion,
                              //fields: ['idCatalogoCurso','claveCurso','descripcion','idEspecialidad','modalidad','nombreCurso','numeroHoras'],
                              order: ['apellidoPaterno ASC','apellidoMaterno ASC','nombre ASC'],
                              limit: vm.tablaListaRegistros.registrosPorPagina,
                              skip: vm.tablaListaRegistros.paginaActual - 1,
                              include: [
                                'localidad_pertenece',
                                'nivel_estudios',
                                {
                                    relation: 'unidad_pertenece',
                                    scope: {
                                        fields:['idUnidadAdmtva','nombre']
                                    }
                                },
                                {
                                    relation: 'otras_unidades',
                                    scope: {
                                        fields:['idUnidadAdmtva','nombre']
                                    }
                                },
                                {
                                    relation: 'evaluacion_curso',
                                    scope: {
                                        fields:['id','idInstructor','idCatalogoCurso','calificacion'],
                                        include:{
                                            relation: 'CatalogoCursos',
                                            scope: {
                                                fields:['idCatalogoCurso','nombreCurso','modalidad'],
                                                order: ['nombreCurso ASC']
                                            }
                                        }
                                    }
                                }
                              ]
                          }
                  };

                  vm.registros = {};
                  vm.RegistroSeleccionado = {};
                  vm.tablaListaRegistros.fila_seleccionada = undefined;
                  vm.client = 1;

                  tablaDatosService.obtiene_datos_tabla(CatalogoInstructores, vm.tablaListaRegistros)
                  .then(function(respuesta) {

                        vm.tablaListaRegistros.totalElementos = respuesta.total_registros;
                        vm.tablaListaRegistros.inicio = respuesta.inicio;
                        vm.tablaListaRegistros.fin = respuesta.fin;

                        if(vm.tablaListaRegistros.totalElementos > 0)
                        {
                            vm.registros = respuesta.datos;
                            vm.RegistroSeleccionado = vm.registros[0];
                            vm.client = 2;
                            vm.tablaListaRegistros.fila_seleccionada = 0;
                            muestraDatosRegistroActual(vm.RegistroSeleccionado);
                        }
                  });

            }


            function muestra_ptc_unidad() {

                  vm.registros = {};
                  vm.RegistroSeleccionado = {};
                  vm.tablaListaRegistros.fila_seleccionada = undefined;
                  vm.tablaListaRegistros.paginaActual = 1;
                  vm.tablaListaRegistros.inicio = 0;
                  vm.tablaListaRegistros.fin = 1;
                  vm.client = 1;
                  vm.mostrarbtnLimpiar = false;
                  vm.cadena_buscar = '';

                  if(vm.unidadSeleccionada.idUnidadAdmtva == -1)
                  {
                        vm.tablaListaRegistros.condicion = {};
                  }
                  else
                  {
                        vm.tablaListaRegistros.condicion = {idUnidadAdmtva: vm.unidadSeleccionada.idUnidadAdmtva};
                  }

                  tablaDatosService.obtiene_datos_tabla(CatalogoInstructores, vm.tablaListaRegistros)
                  .then(function(respuesta) {

                        vm.tablaListaRegistros.totalElementos = respuesta.total_registros;
                        vm.tablaListaRegistros.inicio = respuesta.inicio;
                        vm.tablaListaRegistros.fin = respuesta.fin;

                        if(vm.tablaListaRegistros.totalElementos > 0)
                        {
                            vm.registros = respuesta.datos;
                            vm.RegistroSeleccionado = vm.registros[0];
                            vm.client = 2;
                            vm.tablaListaRegistros.fila_seleccionada = 0;
                            muestraDatosRegistroActual(vm.RegistroSeleccionado);
                        }

                  });
            };


            function muestraResultadosBusqueda() {

                  vm.registros = {};
                  vm.RegistroSeleccionado = {};
                  vm.tablaListaRegistros.fila_seleccionada = undefined;
                  vm.client = 1;
                  vm.tablaListaRegistros.paginaActual = 1;
                  vm.tablaListaRegistros.inicio = 0;
                  vm.tablaListaRegistros.fin = 1;

                  if($scope.currentUser.unidad_pertenece_id > 1)
                  {
                        vm.tablaListaRegistros.condicion = {
                            and: [
                              {idUnidadAdmtva: $scope.currentUser.unidad_pertenece_id},
                              {
                                  or: [
                                    {apellidoPaterno: {regexp: '/.*'+ vm.cadena_buscar +'.*/i'}},
                                    {apellidoMaterno: {regexp: '/.*'+ vm.cadena_buscar +'.*/i'}},
                                    {nombre: {regexp: '/.*'+ vm.cadena_buscar +'.*/i'}}
                                  ]
                              },
                            ]
                        };
                  }
                  else
                  {
                        if(vm.unidadSeleccionada.idUnidadAdmtva == -1)
                        {
                              vm.tablaListaRegistros.condicion = {
                                  or: [
                                    {apellidoPaterno: {regexp: '/.*'+ vm.cadena_buscar +'.*/i'}},
                                    {apellidoMaterno: {regexp: '/.*'+ vm.cadena_buscar +'.*/i'}},
                                    {nombre: {regexp: '/.*'+ vm.cadena_buscar +'.*/i'}}
                                  ]
                              };
                        }
                        else
                        {
                              vm.tablaListaRegistros.condicion = {
                                  and: [
                                    {idUnidadAdmtva: vm.unidadSeleccionada.idUnidadAdmtva},
                                    {
                                        or: [
                                          {apellidoPaterno: {regexp: '/.*'+ vm.cadena_buscar +'.*/i'}},
                                          {apellidoMaterno: {regexp: '/.*'+ vm.cadena_buscar +'.*/i'}},
                                          {nombre: {regexp: '/.*'+ vm.cadena_buscar +'.*/i'}}
                                        ]
                                    },
                                  ]
                              };
                        }
                  }
                  


                  tablaDatosService.obtiene_datos_tabla(CatalogoInstructores, vm.tablaListaRegistros)
                  .then(function(respuesta) {

                        vm.tablaListaRegistros.totalElementos = respuesta.total_registros;
                        vm.tablaListaRegistros.inicio = respuesta.inicio;
                        vm.tablaListaRegistros.fin = respuesta.fin;

                        if(vm.tablaListaRegistros.totalElementos > 0)
                        {
                            vm.registros = respuesta.datos;
                            vm.RegistroSeleccionado = vm.registros[0];
                            vm.client = 2;
                            vm.tablaListaRegistros.fila_seleccionada = 0;
                            muestraDatosRegistroActual(vm.RegistroSeleccionado);
                        }

                        vm.mostrarbtnLimpiar = true;
                  });
            };


            function limpiaBusqueda() {

                  vm.registros = {};
                  vm.RegistroSeleccionado = {};
                  vm.tablaListaRegistros.fila_seleccionada = undefined;
                  vm.client = 1;
                  vm.tablaListaRegistros.paginaActual = 1;
                  vm.tablaListaRegistros.inicio = 0;
                  vm.tablaListaRegistros.fin = 1;

                  if($scope.currentUser.unidad_pertenece_id > 1)
                  {
                        vm.tablaListaRegistros.condicion = {
                            idUnidadAdmtva: $scope.currentUser.unidad_pertenece_id
                        };
                  }
                  else
                  {
                        if(vm.unidadSeleccionada.idUnidadAdmtva == -1)
                        {
                              vm.tablaListaRegistros.condicion = {};
                        }
                        else
                        {
                              vm.tablaListaRegistros.condicion = {idUnidadAdmtva: vm.unidadSeleccionada.idUnidadAdmtva};
                        }
                  }

                  tablaDatosService.obtiene_datos_tabla(CatalogoInstructores, vm.tablaListaRegistros)
                  .then(function(respuesta) {

                        vm.tablaListaRegistros.totalElementos = respuesta.total_registros;
                        vm.tablaListaRegistros.inicio = respuesta.inicio;
                        vm.tablaListaRegistros.fin = respuesta.fin;

                        if(vm.tablaListaRegistros.totalElementos > 0)
                        {
                            vm.registros = respuesta.datos;
                            vm.RegistroSeleccionado = vm.registros[0];
                            vm.client = 2;
                            vm.tablaListaRegistros.fila_seleccionada = 0;
                            muestraDatosRegistroActual(vm.RegistroSeleccionado);
                        }

                        vm.mostrarbtnLimpiar = false;
                        vm.cadena_buscar = '';
                  });

            };


            function cambiarPagina() {

                  if(vm.tablaListaRegistros.totalElementos > 0)
                  {
                        tablaDatosService.cambia_pagina(CatalogoInstructores, vm.tablaListaRegistros)
                        .then(function(respuesta) {

                            vm.tablaListaRegistros.inicio = respuesta.inicio;
                            vm.tablaListaRegistros.fin = respuesta.fin;

                            vm.registros = respuesta.datos;
                            vm.RegistroSeleccionado = vm.registros[0];
                            vm.client = 2;
                            vm.tablaListaRegistros.fila_seleccionada = 0;
                            muestraDatosRegistroActual(vm.RegistroSeleccionado);
                        });
                  }
            }


            function muestraDatosRegistroActual(seleccion) {

                  var index = vm.registros.indexOf(seleccion);
                  vm.RegistroSeleccionado = seleccion;
                  vm.client = 2;
                  vm.tablaListaRegistros.fila_seleccionada = index;
            };


            function edita_datos_registro(seleccion) {

                    var modalInstance = $modal.open({
                        templateUrl: 'app/components/instructores/modal-edita-instructor.html',
                        windowClass: "animated fadeIn",
                        controller: 'ModalEditaInstructorController as vm',
                        windowClass: 'app-modal-window',
                        resolve: {
                          registroEditar: function () { return seleccion }
                        }

                    });

                    modalInstance.result.then(function (respuesta) {

                        vm.RegistroSeleccionado.idUnidadAdmtva     = respuesta.idUnidadAdmtva;
                        vm.RegistroSeleccionado.curp               = respuesta.curp;
                        vm.RegistroSeleccionado.apellidoPaterno    = respuesta.apellidoPaterno;
                        vm.RegistroSeleccionado.apellidoMaterno    = respuesta.apellidoMaterno;
                        vm.RegistroSeleccionado.nombre             = respuesta.nombre;
                        vm.RegistroSeleccionado.rfc                = respuesta.rfc;
                        vm.RegistroSeleccionado.gradoAcademico     = respuesta.gradoAcademico;
                        vm.RegistroSeleccionado.telefono           = respuesta.telefono;
                        vm.RegistroSeleccionado.email              = respuesta.email;
                        vm.RegistroSeleccionado.escolaridad        = respuesta.escolaridad;
                        vm.RegistroSeleccionado.certificacion      = respuesta.certificacion;
                        vm.RegistroSeleccionado.idLocalidad        = respuesta.idLocalidad;
                        vm.RegistroSeleccionado.activo             = respuesta.activo;

                        vm.RegistroSeleccionado.UnidadAdmtva       = respuesta.UnidadAdmtva;
                        vm.RegistroSeleccionado.localidad          = respuesta.localidad;

                        vm.RegistroSeleccionado.unidad_pertenece.UnidadAdmtva   = respuesta.idUnidadAdmtva;
                        vm.RegistroSeleccionado.unidad_pertenece.nombre         = respuesta.UnidadAdmtva;

                        vm.RegistroSeleccionado.localidad_pertenece.idLocalidad = respuesta.idLocalidad;
                        vm.RegistroSeleccionado.localidad_pertenece.nombre      = respuesta.localidad;

                        if(respuesta.otras_unidades.length > 0)
                        {
                              vm.RegistroSeleccionado.otras_unidades = [];
                              angular.forEach(respuesta.otras_unidades, function(record) {
                                    vm.RegistroSeleccionado.otras_unidades.push({
                                        idUnidadAdmtva : record.idUnidadAdmtva,
                                        nombre         : record.nombre,
                                    });
                              });
                        }

                        if(respuesta.evaluacion_curso.length > 0)
                        {
                              vm.RegistroSeleccionado.evaluacion_curso = [];
                              angular.forEach(respuesta.evaluacion_curso, function(record) {
                                    vm.RegistroSeleccionado.evaluacion_curso.push({
                                        id              : record.id,
                                        idInstructor    : record.idInstructor,
                                        idCatalogoCurso : record.idCatalogoCurso,
                                        calificacion    : record.calificacion,
                                        CatalogoCursos  : {
                                            idCatalogoCurso : record.CatalogoCursos.idCatalogoCurso,
                                            nombreCurso     : record.CatalogoCursos.nombreCurso,
                                            modalidad       : record.CatalogoCursos.modalidad
                                        }
                                    });
                              });
                        }

                    }, function () {
                    });
            };


            function nuevo_registro() {

                    var modalInstance = $modal.open({
                        templateUrl: 'app/components/instructores/modal-edita-instructor.html',
                        windowClass: "animated fadeIn",
                        controller: 'ModalNUevoInstructorController as vm',
                        windowClass: 'app-modal-window'
                    });

                    modalInstance.result.then(function () {
                        vm.limpiaBusqueda();
                    }, function () {
                    });
            };


            function elimina_registro(RegistroSeleccionado) {

                  CatalogoInstructores.cursos_propuestos.count({ id: RegistroSeleccionado.idInstructor })
                  .$promise
                  .then(function(resultado) {
                      if(resultado.count > 0)
                      {
                            swal({
                              title: 'Error',
                              html: 'No se puede eliminar el instructor seleccionado porque tiene cursos asignados',
                              type: 'error',
                              showCancelButton: false,
                              confirmButtonColor: "#9a0000",
                              confirmButtonText: "Aceptar"
                            });
                      }
                      else
                      {

                            swal({
                              title: "Confirmar",
                              html: 'Se eliminar&aacute; al instructor <strong>'+ RegistroSeleccionado.apellidoPaterno + ' ' + RegistroSeleccionado.apellidoMaterno + ' ' + RegistroSeleccionado.nombre  +'</strong>, ¿Continuar?',
                              type: "warning",
                              showCancelButton: true,
                              confirmButtonColor: "#9a0000",
                              confirmButtonText: "Aceptar",
                              cancelButtonText: "Cancelar",
                              closeOnConfirm: false,
                              closeOnCancel: true
                            }, function(){
                                    swal.disableButtons();

                                      CatalogoInstructores.cursos_habilitados.destroyAll({ id: RegistroSeleccionado.idInstructor })
                                        .$promise
                                        .then(function() { 

                                              CatalogoInstructores.deleteById({ id: RegistroSeleccionado.idInstructor })
                                              .$promise
                                              .then(function() { 
                                                    vm.limpiaBusqueda();
                                                    swal('Instructor eliminado', '', 'success');
                                              });

                                      });

                            });
                      }
                  });


            };

    };

})();