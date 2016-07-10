(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('AdminInstructoresController', AdminInstructoresController);

    AdminInstructoresController.$inject = ['$modal', 'tablaDatosService', 'CatalogoInstructores'];

    function AdminInstructoresController($modal, tablaDatosService, CatalogoInstructores ) {

            var vm = this;
            vm.muestraDatosRegistroActual = muestraDatosRegistroActual;
            vm.muestraResultadosBusqueda  = muestraResultadosBusqueda;
            vm.limpiaBusqueda             = limpiaBusqueda;
            vm.cambiarPagina              = cambiarPagina;
            vm.edita_datos_registro       = edita_datos_registro;
            vm.nuevo_registro             = nuevo_registro;
            vm.elimina_registro           = elimina_registro;

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

                  vm.tablaListaRegistros.filtro_datos = {
                          filter: {
                              where: vm.tablaListaRegistros.condicion,
                              //fields: ['idCatalogoCurso','claveCurso','descripcion','idEspecialidad','modalidad','nombreCurso','numeroHoras'],
                              order: ['apellidoPaterno ASC','apellidoMaterno ASC','nombre ASC'],
                              limit: vm.tablaListaRegistros.registrosPorPagina,
                              skip: vm.tablaListaRegistros.paginaActual - 1,
                              include: [
                                'unidad_pertenece',
                                'localidad_pertenece',
                                {
                                    relation: 'cursos_habilitados',
                                    scope: {
                                        fields:['idCatalogoCurso','nombreCurso','modalidad']
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


            function muestraResultadosBusqueda() {

                  vm.registros = {};
                  vm.RegistroSeleccionado = {};
                  vm.tablaListaRegistros.fila_seleccionada = undefined;
                  vm.client = 1;
                  vm.tablaListaRegistros.paginaActual = 1;
                  vm.tablaListaRegistros.inicio = 0;
                  vm.tablaListaRegistros.fin = 1;
                  vm.tablaListaRegistros.condicion = {
                                    or: [
                                      {apellidoPaterno: {regexp: '/.*'+ vm.cadena_buscar +'.*/i'}},
                                      {apellidoMaterno: {regexp: '/.*'+ vm.cadena_buscar +'.*/i'}},
                                      {nombre: {regexp: '/.*'+ vm.cadena_buscar +'.*/i'}}
                                    ]
                                };

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
                  vm.tablaListaRegistros.condicion = {};

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
                        //size: 'lg',
                        windowClass: 'app-modal-window',
                        resolve: {
                          registroEditar: function () { return seleccion }
                        }

                    });

           /* vm.registroEdicion = {
                    cursos_habilitados : []
            };*/


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
                        vm.RegistroSeleccionado.idLocalidad        = respuesta.idLocalidad;
                        vm.RegistroSeleccionado.activo             = respuesta.activo;

                        vm.RegistroSeleccionado.UnidadAdmtva       = respuesta.UnidadAdmtva;
                        vm.RegistroSeleccionado.localidad          = respuesta.localidad;

                        vm.RegistroSeleccionado.unidad_pertenece.UnidadAdmtva   = respuesta.idUnidadAdmtva;
                        vm.RegistroSeleccionado.unidad_pertenece.nombre         = respuesta.UnidadAdmtva;

                        vm.RegistroSeleccionado.localidad_pertenece.idLocalidad = respuesta.idLocalidad;
                        vm.RegistroSeleccionado.localidad_pertenece.nombre      = respuesta.localidad;

                        if(respuesta.cursos_habilitados.length > 0)
                        {
                              vm.RegistroSeleccionado.cursos_habilitados = [];
                              angular.forEach(respuesta.cursos_habilitados, function(record) {
                                    vm.RegistroSeleccionado.cursos_habilitados.push({

                                        idCatalogoCurso : record.idCatalogoCurso,
                                        nombreCurso     : record.nombreCurso,
                                        modalidad       : record.modalidad
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
                        controller: 'ModalnuevoCatCursoController as vm',
                        windowClass: 'app-modal-window'
                    });

                    modalInstance.result.then(function () {
                        vm.limpiaBusqueda();
                    }, function () {
                    });
            };


            function elimina_registro(RegistroSeleccionado) {

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

                            CatalogoInstructores.temario.destroyAll({ id: RegistroSeleccionado.idCatalogoCurso })
                              .$promise
                              .then(function() { 

                                    CatalogoInstructores.deleteById({ id: RegistroSeleccionado.idCatalogoCurso })
                                    .$promise
                                    .then(function() { 
                                          vm.limpiaBusqueda();
                                          swal('Curso eliminado', '', 'success');
                                    });

                            });

                  });

            };

    };

})();