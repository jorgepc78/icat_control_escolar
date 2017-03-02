(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('PrincipalCatalogoCursosController', PrincipalCatalogoCursosController);

    PrincipalCatalogoCursosController.$inject = ['$modal', 'tablaDatosService', 'CatalogoCursos', 'CatalogoEspecialidades'];

    function PrincipalCatalogoCursosController($modal, tablaDatosService, CatalogoCursos, CatalogoEspecialidades) {

            var vm = this;
            vm.muestraDatosRegistroActual = muestraDatosRegistroActual;
            vm.muestraResultadosBusqueda  = muestraResultadosBusqueda;
            vm.limpiaBusqueda             = limpiaBusqueda;
            vm.cambiarPagina              = cambiarPagina;
            vm.edita_datos_registro       = edita_datos_registro;
            vm.nuevo_registro             = nuevo_registro;
            vm.desactiva_registro         = desactiva_registro;
            vm.activa_registro            = activa_registro;
            vm.elimina_registro           = elimina_registro;

            vm.muestra_cursos_especialidad = muestra_cursos_especialidad;
            vm.muestra_cursos_modalidad    = muestra_cursos_modalidad;

            vm.listaEspecialidades = [];
            vm.especialidadSeleccionada = undefined;
            vm.listaModalidades = [];
            vm.modalidadSeleccionada = undefined;

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

                  CatalogoEspecialidades.find({
                      filter: {
                          order: 'nombre ASC'
                      }
                  })
                  .$promise
                  .then(function(resp) {

                      vm.listaEspecialidades.push({
                          idEspecialidad  : -1,
                          nombre          : 'Todas'
                      });

                      angular.forEach(resp, function(record) {
                            vm.listaEspecialidades.push({
                                idEspecialidad  : record.idEspecialidad,
                                nombre          : record.nombre
                            });
                      });

                      vm.especialidadSeleccionada = vm.listaEspecialidades[0];
                  });

                  vm.listaModalidades = [
                  {modalidad: 't', alias: 'Todas'},
                  {modalidad: 'CAE', alias: 'CAE'},
                  {modalidad: 'Extension', alias: 'Extensión'},
                  {modalidad: 'Regular', alias: 'Regular'}
                  ];

                  vm.modalidadSeleccionada = vm.listaModalidades[0];

                  vm.tablaListaRegistros.filtro_datos = {
                          filter: {
                              where: vm.tablaListaRegistros.condicion,
                              fields: ['idCatalogoCurso','claveCurso','descripcion','perfilEgresado','perfilInstructor','idEspecialidad','modalidad','nombreCurso','numeroHoras','activo'],
                              order: ['nombreCurso ASC'],
                              limit: vm.tablaListaRegistros.registrosPorPagina,
                              skip: vm.tablaListaRegistros.paginaActual - 1,
                              include: [
                                'temario',
                                {
                                    relation: 'especialidad',
                                    scope: {
                                        fields:['idEspecialidad','nombre']
                                    }
                                }
                              ]
                          }
                  };

                  vm.registros = {};
                  vm.RegistroSeleccionado = {};
                  vm.tablaListaRegistros.fila_seleccionada = undefined;
                  vm.client = 1;

                  tablaDatosService.obtiene_datos_tabla(CatalogoCursos, vm.tablaListaRegistros)
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


            function muestra_cursos_especialidad() {
                  vm.registros = {};
                  vm.RegistroSeleccionado = {};
                  vm.tablaListaRegistros.fila_seleccionada = undefined;
                  vm.tablaListaRegistros.paginaActual = 1;
                  vm.tablaListaRegistros.inicio = 0;
                  vm.tablaListaRegistros.fin = 1;
                  vm.client = 1;

                  vm.mostrarbtnLimpiar = false;
                  vm.cadena_buscar = '';

                  if(vm.especialidadSeleccionada.idEspecialidad == -1)
                  {
                        if(vm.modalidadSeleccionada.modalidad == 't')
                            vm.tablaListaRegistros.condicion = {};
                        else
                            vm.tablaListaRegistros.condicion = {modalidad: vm.modalidadSeleccionada.modalidad};
                  }
                  else
                  {
                        if(vm.modalidadSeleccionada.modalidad == 't')
                            vm.tablaListaRegistros.condicion = {idEspecialidad: vm.especialidadSeleccionada.idEspecialidad};
                        else
                        {
                            vm.tablaListaRegistros.condicion = {
                              and: [
                                {idEspecialidad: vm.especialidadSeleccionada.idEspecialidad},
                                {modalidad: vm.modalidadSeleccionada.modalidad}
                              ]
                            };
                        }
                        
                  }

                  tablaDatosService.obtiene_datos_tabla(CatalogoCursos, vm.tablaListaRegistros)
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


            function muestra_cursos_modalidad() {
                  vm.registros = {};
                  vm.RegistroSeleccionado = {};
                  vm.tablaListaRegistros.fila_seleccionada = undefined;
                  vm.tablaListaRegistros.paginaActual = 1;
                  vm.tablaListaRegistros.inicio = 0;
                  vm.tablaListaRegistros.fin = 1;
                  vm.client = 1;

                  vm.mostrarbtnLimpiar = false;
                  vm.cadena_buscar = '';

                  if(vm.modalidadSeleccionada.modalidad == 't')
                  {
                        if(vm.especialidadSeleccionada.idEspecialidad == -1)
                              vm.tablaListaRegistros.condicion = {};
                        else
                              vm.tablaListaRegistros.condicion = {idEspecialidad: vm.especialidadSeleccionada.idEspecialidad};
                  }
                  else
                  {
                        if(vm.especialidadSeleccionada.idEspecialidad == -1)
                              vm.tablaListaRegistros.condicion = {modalidad: vm.modalidadSeleccionada.modalidad};
                        else
                        {
                              vm.tablaListaRegistros.condicion = {
                                and: [
                                  {idEspecialidad: vm.especialidadSeleccionada.idEspecialidad},
                                  {modalidad: vm.modalidadSeleccionada.modalidad}
                                ]
                              };
                        }
                  }

                  tablaDatosService.obtiene_datos_tabla(CatalogoCursos, vm.tablaListaRegistros)
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


            function muestraResultadosBusqueda() {

                  vm.registros = {};
                  vm.RegistroSeleccionado = {};
                  vm.tablaListaRegistros.fila_seleccionada = undefined;
                  vm.client = 1;
                  vm.tablaListaRegistros.paginaActual = 1;
                  vm.tablaListaRegistros.inicio = 0;
                  vm.tablaListaRegistros.fin = 1;

                  vm.especialidadSeleccionada = vm.listaEspecialidades[0];
                  vm.modalidadSeleccionada = vm.listaModalidades[0];

                  vm.tablaListaRegistros.condicion = {
                                    nombreCurso: {regexp: '/.*'+ vm.cadena_buscar +'.*/i'}
                                };

                  tablaDatosService.obtiene_datos_tabla(CatalogoCursos, vm.tablaListaRegistros)
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
                  vm.tablaListaRegistros.condicion = {};

                  vm.especialidadSeleccionada = vm.listaEspecialidades[0];
                  vm.modalidadSeleccionada = vm.listaModalidades[0];

                  tablaDatosService.obtiene_datos_tabla(CatalogoCursos, vm.tablaListaRegistros)
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
                        tablaDatosService.cambia_pagina(CatalogoCursos, vm.tablaListaRegistros)
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
                        templateUrl: 'app/components/catalogos/catalogo-cursos/modal-edita-cat-curso.html',
                        windowClass: "animated fadeIn",
                        controller: 'ModalEditaCatCursoController as vm',
                        //size: 'lg',
                        windowClass: 'app-modal-window',
                        resolve: {
                          registroEditar: function () { return seleccion }
                        }

                    });

                    modalInstance.result.then(function (respuesta) {
                        vm.RegistroSeleccionado.claveCurso                  = respuesta.claveCurso;
                        vm.RegistroSeleccionado.descripcion                 = respuesta.descripcion;
                        vm.RegistroSeleccionado.perfilEgresado              = respuesta.perfilEgresado;
                        vm.RegistroSeleccionado.perfilInstructor            = respuesta.perfilInstructor;
                        vm.RegistroSeleccionado.idEspecialidad              = respuesta.idEspecialidad;
                        vm.RegistroSeleccionado.modalidad                   = respuesta.modalidad;
                        vm.RegistroSeleccionado.nombreCurso                 = respuesta.nombreCurso;
                        vm.RegistroSeleccionado.numeroHoras                 = respuesta.numeroHoras;

                        vm.RegistroSeleccionado.especialidad.idEspecialidad = respuesta.idEspecialidad;
                        vm.RegistroSeleccionado.especialidad.nombre         = respuesta.especialidad;

                        if(respuesta.temario.length > 0)
                        {
                              vm.RegistroSeleccionado.temario = [];
                              angular.forEach(respuesta.temario, function(record) {
                                    vm.RegistroSeleccionado.temario.push({
                                        idTemario       : record.idTemario,
                                        idCatalogoCurso : record.idCatalogoCurso,
                                        tema            : record.tema
                                    });
                              });
                        }

                    }, function () {
                    });
            };


            function nuevo_registro() {

                    var modalInstance = $modal.open({
                        templateUrl: 'app/components/catalogos/catalogo-cursos/modal-edita-cat-curso.html',
                        windowClass: "animated fadeIn",
                        controller: 'ModalnuevoCatCursoController as vm',
                        windowClass: 'app-modal-window'
                    });

                    modalInstance.result.then(function () {
                        vm.limpiaBusqueda();
                    }, function () {
                    });
            };


            function desactiva_registro(RegistroSeleccionado) {

                  swal({
                    title: "Confirmar",
                    html: 'El curso <strong>'+ RegistroSeleccionado.nombreCurso +'</strong> ser&aacute; desactivado y no aparecer&aacute; en la lista de cursos para el armado del PTC, ¿Continuar?',
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#9a0000",
                    confirmButtonText: "Aceptar",
                    cancelButtonText: "Cancelar",
                    closeOnConfirm: false,
                    closeOnCancel: true
                  }, function(){
                          swal.disableButtons();

                            CatalogoCursos.prototype$updateAttributes(
                            {
                                id: RegistroSeleccionado.idCatalogoCurso
                            },{
                                activo: false
                            })
                            .$promise
                            .then(function(respuesta) {
                                  vm.RegistroSeleccionado.activo = respuesta.activo;
                                  swal('Curso desactivado', '', 'success');
                            });

                  });

            }


            function activa_registro(RegistroSeleccionado) {

                  swal({
                    title: "Confirmar",
                    html: 'El curso <strong>'+ RegistroSeleccionado.nombreCurso +'</strong> ser&aacute; activado y podr&aacute; ser visualizado en la lista de cursos para el armado del PTC, ¿Continuar?',
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#9a0000",
                    confirmButtonText: "Aceptar",
                    cancelButtonText: "Cancelar",
                    closeOnConfirm: false,
                    closeOnCancel: true
                  }, function(){
                          swal.disableButtons();

                            CatalogoCursos.prototype$updateAttributes(
                            {
                                id: RegistroSeleccionado.idCatalogoCurso
                            },{
                                activo: true
                            })
                            .$promise
                            .then(function(respuesta) {
                                  vm.RegistroSeleccionado.activo = respuesta.activo;
                                  swal('Curso activado', '', 'success');
                            });

                  });

            }


            function elimina_registro(RegistroSeleccionado) {

                  CatalogoCursos.instructores_habilitados.count({ id: RegistroSeleccionado.idCatalogoCurso })
                  .$promise
                  .then(function(resultado) {
                      if(resultado.count > 0)
                      {
                            swal({
                              title: 'Error',
                              html: 'No se puede eliminar el curso seleccionado porque tiene instructores relacionados',
                              type: 'error',
                              showCancelButton: false,
                              confirmButtonColor: "#9a0000",
                              confirmButtonText: "Aceptar"
                            });
                      }
                      else
                      {
                            CatalogoCursos.cursosPTC_pertenece.count({id: RegistroSeleccionado.idCatalogoCurso})
                            .$promise
                            .then(function(resultado) {
                                  if(resultado.count > 0)
                                  {
                                        swal({
                                          title: 'Error',
                                          html: 'No se puede eliminar el curso seleccionado porque se encuentra registrado en alg&uacute;n PTC',
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
                                          html: 'Se eliminar&aacute; el curso <strong>'+ RegistroSeleccionado.nombreCurso +'</strong>, ¿Continuar?',
                                          type: "warning",
                                          showCancelButton: true,
                                          confirmButtonColor: "#3085d6",
                                          confirmButtonText: "Aceptar",
                                          cancelButtonText: "Cancelar",
                                          closeOnConfirm: false,
                                          closeOnCancel: true
                                        }, function(){
                                                swal.disableButtons();

                                                  CatalogoCursos.temario.destroyAll({ id: RegistroSeleccionado.idCatalogoCurso })
                                                    .$promise
                                                    .then(function() { 

                                                          CatalogoCursos.deleteById({ id: RegistroSeleccionado.idCatalogoCurso })
                                                          .$promise
                                                          .then(function() { 
                                                                vm.limpiaBusqueda();
                                                                swal('Curso eliminado', '', 'success');
                                                          });

                                                  });

                                        });                                    
                                  }
                            });
                      }
                  });


            };

    };

})();