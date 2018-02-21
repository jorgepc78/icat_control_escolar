(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('AdminEvaluadoresController', AdminEvaluadoresController);

    AdminEvaluadoresController.$inject = ['$scope', '$modal', 'tablaDatosService', 'CatalogoInstructores', 'CatalogoUnidadesAdmtvas', 'AlmacenDocumentos', 'Usuario'];

    function AdminEvaluadoresController($scope, $modal, tablaDatosService, CatalogoInstructores, CatalogoUnidadesAdmtvas, AlmacenDocumentos, Usuario ) {

            var vm = this;

            vm.muestraDatosRegistroActual = muestraDatosRegistroActual;
            vm.muestraResultadosBusqueda  = muestraResultadosBusqueda;
            vm.limpiaBusqueda             = limpiaBusqueda;
            vm.cambiarPagina              = cambiarPagina;
            vm.muestra_ptc_unidad         = muestra_ptc_unidad;
            vm.abreDocumento              = abreDocumento;
            vm.edita_datos_registro       = edita_datos_registro;
            vm.nuevo_registro             = nuevo_registro;
            vm.elimina_registro           = elimina_registro;


            vm.listaUnidades = [];
            vm.unidadSeleccionada = undefined;

            vm.tablaListaRegistros = {
              totalElementos     : 0,
              paginaActual       : 1,
              registrosPorPagina : 10,
              inicio             : 0,
              fin                : 1,
              condicion          : {},
              filtro_datos       : {},
              fila_seleccionada  : 0
            };


            inicia();

            function inicia() {

                  vm.tablaListaRegistros.condicion = {
                    and: [
                      {activo: true},
                      {estatus: 3},
                      {evaluador: true}
                    ]
                  };

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
                      });

                      angular.forEach(resp, function(unidad) {
                            vm.listaUnidades.push({
                                idUnidadAdmtva  : unidad.idUnidadAdmtva,
                                nombre          : unidad.nombre
                            });
                      });

                      vm.unidadSeleccionada = vm.listaUnidades[0];
                  });


                  vm.tablaListaRegistros.filtro_datos = {
                          filter: {
                              where: vm.tablaListaRegistros.condicion,
                              order: ['nombre_completo ASC','idInstructor ASC'],
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
                                    relation: 'documentos',
                                    scope: {
                                        fields:['idDocumento','documento','nombreArchivo','tipoArchivo']
                                    }
                                },
                                {
                                    relation: 'evaluaciones_habilitadas',
                                    scope: {
                                        fields:['idCatalogoCurso','nombreCurso','idEspecialidad'],
                                        order: ['nombreCurso ASC','idCatalogoCurso ASC'],
                                        include:{
                                            relation: 'especialidad',
                                            scope: {
                                                fields:['nombre']
                                            }
                                        }
                                    }
                                },
                                {
                                    relation: 'estandares_habilitados',
                                    scope: {
                                        fields:['idEstandar','codigo','nombre'],
                                        order: ['nombre ASC']
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
                        vm.tablaListaRegistros.condicion = {
                          and: [
                            {activo: true},
                            {estatus: 3},
                            {evaluador: true}
                          ]
                        };
                  }
                  else
                  {
                        vm.tablaListaRegistros.condicion = {
                          and : [
                            {idUnidadAdmtva: vm.unidadSeleccionada.idUnidadAdmtva},
                            {estatus: 3},
                            {activo: true},
                            {evaluador: true},
                          ]
                        };
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

                  if(vm.unidadSeleccionada.idUnidadAdmtva == -1)
                  {
                        vm.tablaListaRegistros.condicion = {
                            and: [
                              {estatus: 3},
                              {activo: true},
                              {evaluador: true},
                              {nombre_completo: {regexp: '/.*'+ vm.cadena_buscar +'.*/i'}}
                            ]
                        };
                  }
                  else
                  {
                        vm.tablaListaRegistros.condicion = {
                            and: [
                              {idUnidadAdmtva: vm.unidadSeleccionada.idUnidadAdmtva},
                              {estatus: 3},
                              {activo: true},
                              {evaluador: true},
                              {nombre_completo: {regexp: '/.*'+ vm.cadena_buscar +'.*/i'}}
                            ]
                        };
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

                  if(vm.unidadSeleccionada.idUnidadAdmtva == -1)
                  {
                        vm.tablaListaRegistros.condicion = {
                          and: [
                            {estatus: 3},
                            {activo: true},
                            {evaluador: true}
                          ]
                        };
                  }
                  else
                  {
                        vm.tablaListaRegistros.condicion = {
                            and: [
                              {estatus: 3},
                              {activo: true},
                              {evaluador: true},
                              {idUnidadAdmtva: vm.unidadSeleccionada.idUnidadAdmtva}
                            ]
                        };
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


            function abreDocumento(seleccion) {

                    Usuario.prototype$__get__accessTokens({ 
                        id: $scope.currentUser.id_usuario
                    })
                    .$promise
                    .then(function(resp) {
                      var link = angular.element('<a href="api/AlmacenDocumentos/instructores/download/'+seleccion.nombreArchivo+'?access_token='+resp[0].id+'" target="_blank"></a>');
                        angular.element(document.body).append(link);
                        link[0].click();
                        link.remove();
                    });
            }


            function muestraDatosRegistroActual(seleccion) {

                  var index = vm.registros.indexOf(seleccion);
                  vm.RegistroSeleccionado = seleccion;
                  vm.client = 2;
                  vm.tablaListaRegistros.fila_seleccionada = index;
            };


            function edita_datos_registro(seleccion, tipo) {

                    var modalInstance = $modal.open({
                        templateUrl: 'app/components/evaluadores/administracion/modal-edita-evaluador.html',
                        windowClass: "animated fadeIn",
                        controller: 'ModalEditaEvaluadorController as vm',
                        windowClass: 'app-modal-window',
                        resolve: {
                          registroEditar: function () { return seleccion }
                        }

                    });

                    modalInstance.result.then(function (respuesta) {

                        if(tipo == 'n')
                        {
                            vm.limpiaBusqueda();
                        }
                        else
                        {
                            if(respuesta.evaluaciones_habilitadas.length > 0)
                            {
                                  vm.RegistroSeleccionado.evaluaciones_habilitadas = [];
                                  angular.forEach(respuesta.evaluaciones_habilitadas, function(record) {
                                        vm.RegistroSeleccionado.evaluaciones_habilitadas.push({
                                            idCatalogoCurso : record.idCatalogoCurso,
                                            nombreCurso     : record.nombreCurso,
                                            idEspecialidad  : record.especialidad.idEspecialidad,
                                            especialidad    : { 
                                              idEspecialidad  : record.especialidad.idEspecialidad,
                                              nombre          : record.especialidad.nombre 
                                            }
                                        });
                                  });
                            }

                            if(respuesta.estandares_habilitados.length > 0)
                            {
                                  vm.RegistroSeleccionado.estandares_habilitados = [];
                                  angular.forEach(respuesta.estandares_habilitados, function(record) {
                                        vm.RegistroSeleccionado.estandares_habilitados.push({
                                            idEstandar : record.idEstandar,
                                            codigo     : record.codigo,
                                            nombre     : record.nombre
                                        });
                                  });
                            }
                        }


                    }, function () {
                    });
            };


            function nuevo_registro() {

                    var modalInstance = $modal.open({
                        templateUrl: 'app/components/evaluadores/administracion/modal-agrega-evaluador.html',
                        controller: 'ModalAgregaEvaluadorController as vm',
                        windowClass: 'animated fadeIn',
                        size: 'lg'
                    });

                    modalInstance.result.then(function (respuesta) {
                      vm.RegistroSeleccionado = respuesta;
                      console.log(vm.RegistroSeleccionado);
                      vm.edita_datos_registro(vm.RegistroSeleccionado, 'n');
                    }, function () {
                    });
            };


            function elimina_registro(RegistroSeleccionado) {

                swal({
                  title: "Confirmar",
                  html: 'Se dar&aacute; debaja a <strong>'+ RegistroSeleccionado.apellidoPaterno + ' ' + RegistroSeleccionado.apellidoMaterno + ' ' + RegistroSeleccionado.nombre  +'</strong> como evaluador, ¿Continuar?',
                  type: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#9a0000",
                  confirmButtonText: "Aceptar",
                  cancelButtonText: "Cancelar",
                  closeOnConfirm: false,
                  closeOnCancel: true
                }, function(){
                        swal.disableButtons();

                        CatalogoInstructores.prototype$updateAttributes(
                        {
                            id: vm.RegistroSeleccionado.idInstructor
                        },{
                            evaluador: false
                        }) 
                        .$promise
                        .then(function(resp) {
                            CatalogoInstructores.estandares_habilitados.destroyAll({ id: RegistroSeleccionado.idInstructor })
                            .$promise
                            .then(function() { 
                                  CatalogoInstructores.evaluaciones_habilitadas.destroyAll({ id: RegistroSeleccionado.idInstructor })
                                  .$promise
                                  .then(function() { 
                                      vm.limpiaBusqueda();
                                      swal('evaluador eliminado', '', 'success');
                                  });
                            });
                        });

                });

            };
    };

})();