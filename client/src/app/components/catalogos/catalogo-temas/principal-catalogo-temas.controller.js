(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('PrincipalCatalogoTemasController', PrincipalCatalogoTemasController);

    PrincipalCatalogoTemasController.$inject = ['$stateParams', '$modal', 'tablaDatosService', 'CatalogoTemas'];

    function PrincipalCatalogoTemasController($stateParams, $modal, tablaDatosService, CatalogoTemas) {

            var vm = this;
            vm.listaRegistros            = [];
            vm.muestraResultadosBusqueda = muestraResultadosBusqueda;
            vm.limpiaBusqueda            = limpiaBusqueda;
            vm.cambiarPagina             = cambiarPagina;
            vm.edita_registro            = edita_registro;
            vm.nuevo_registro            = nuevo_registro;
            vm.elimina_registro          = elimina_registro;

            vm.tablaCatalogo = {
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

                  vm.tablaCatalogo.filtro_datos = {
                          filter: {
                              where: vm.tablaCatalogo.condicion,
                              order: ['nombre ASC'],
                              fields:['idTema','nombre'],
                              limit: vm.tablaCatalogo.registrosPorPagina,
                              skip: vm.tablaCatalogo.paginaActual - 1
                          }
                  };

                  vm.CatalogoMostrar = CatalogoTemas;
                  vm.listaRegistros = {};

                  tablaDatosService.obtiene_datos_tabla(vm.CatalogoMostrar, vm.tablaCatalogo)
                  .then(function(respuesta) {

                        vm.tablaCatalogo.totalElementos = respuesta.total_registros;
                        vm.tablaCatalogo.inicio = respuesta.inicio;
                        vm.tablaCatalogo.fin = respuesta.fin;

                        if(vm.tablaCatalogo.totalElementos > 0)
                        {
                            vm.listaRegistros = respuesta.datos;
                        }
                  });

            }

            function muestraResultadosBusqueda() {

                  vm.listaRegistros = {};
                  vm.tablaCatalogo.paginaActual = 1;
                  vm.tablaCatalogo.inicio = 0;
                  vm.tablaCatalogo.fin = 1;
                  vm.tablaCatalogo.condicion = {
                                    nombre: {regexp: '/.*'+ vm.cadena_buscar +'.*/i'}
                                };

                  tablaDatosService.obtiene_datos_tabla(vm.CatalogoMostrar, vm.tablaCatalogo)
                  .then(function(respuesta) {

                        vm.tablaCatalogo.totalElementos = respuesta.total_registros;
                        vm.tablaCatalogo.inicio = respuesta.inicio;
                        vm.tablaCatalogo.fin = respuesta.fin;

                        if(vm.tablaCatalogo.totalElementos > 0)
                        {
                            vm.listaRegistros = respuesta.datos;
                        }

                        vm.mostrarbtnLimpiar = true;
                  });
            };


            function limpiaBusqueda() {

                  vm.listaRegistros = {};
                  vm.tablaCatalogo.paginaActual = 1;
                  vm.tablaCatalogo.inicio = 0;
                  vm.tablaCatalogo.fin = 1;
                  vm.tablaCatalogo.condicion = {};

                  tablaDatosService.obtiene_datos_tabla(vm.CatalogoMostrar, vm.tablaCatalogo)
                  .then(function(respuesta) {

                        vm.tablaCatalogo.totalElementos = respuesta.total_registros;
                        vm.tablaCatalogo.inicio = respuesta.inicio;
                        vm.tablaCatalogo.fin = respuesta.fin;

                        if(vm.tablaCatalogo.totalElementos > 0)
                        {
                            vm.listaRegistros = respuesta.datos;
                        }

                        vm.mostrarbtnLimpiar = false;
                        vm.cadena_buscar = '';
                  });

            };


            function cambiarPagina() {

                  if(vm.tablaCatalogo.totalElementos > 0)
                  {
                        tablaDatosService.cambia_pagina(vm.CatalogoMostrar, vm.tablaCatalogo)
                        .then(function(respuesta) {

                            vm.tablaCatalogo.inicio = respuesta.inicio;
                            vm.tablaCatalogo.fin = respuesta.fin;
                            vm.listaRegistros = {};
                            vm.listaRegistros = respuesta.datos;

                        });
                  }
            }


            function edita_registro(registroSeleccionado) {

                    vm.RegistroSeleccionado = registroSeleccionado;

                    vm.registroEditar = {
                        idTema : registroSeleccionado.idTema
                    };

                    var modalInstance = $modal.open({
                        templateUrl: 'app/components/catalogos/catalogo-temas/modal-edita-tema.html',
                        windowClass: "animated fadeIn",
                        controller: 'ModalEditaTemaController as vm',
                        size: 'lg',
                        resolve: {
                          registroEditar: function () { return vm.registroEditar }
                        }

                    });

                    modalInstance.result.then(function (respuesta) {
                        vm.RegistroSeleccionado.nombre = respuesta.nombre;
                    }, function () {
                    });
            };


            function nuevo_registro() {

                    var modalInstance = $modal.open({
                        templateUrl: 'app/components/catalogos/catalogo-temas/modal-edita-tema.html',
                        windowClass: "animated fadeIn",
                        controller: 'ModalNuevoTemaController as vm',
                        size: 'lg'
                    });

                    modalInstance.result.then(function () {
                       vm.limpiaBusqueda();
                    }, function () {
                    });
            };


            function elimina_registro(registroSeleccionado) {

                    CatalogoTemas.especialidades.count({ id:registroSeleccionado.idTema })
                    .$promise
                    .then(function(resultado) {
                        if(resultado.count > 0)
                        {
                            swal('No se puede eliminar el registro seleccionado porque tiene especialidades asignadas', '', 'error');
                        }
                        else
                        {
                            swal({
                              title: "Confirmar",
                              html: 'Se eliminar&aacute; el tema <strong>'+ registroSeleccionado.nombre +'</strong>, ¿Continuar?',
                              type: "warning",
                              showCancelButton: true,
                              confirmButtonColor: "#3085d6",
                              confirmButtonText: "Aceptar",
                              cancelButtonText: "Cancelar",
                              closeOnConfirm: false,
                              closeOnCancel: true
                            }, function(){
                                    swal.disableButtons();

                                    vm.CatalogoMostrar.deleteById({ id: registroSeleccionado.idTema })
                                    .$promise
                                    .then(function() { 
                                          vm.limpiaBusqueda();
                                          swal('Registro eliminado', '', 'success');
                                    });
                            });
                        }
                    });
            };
    };

})();