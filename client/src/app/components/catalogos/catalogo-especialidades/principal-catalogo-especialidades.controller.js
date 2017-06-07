(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('PrincipalCatalogoEspecialidadesController', PrincipalCatalogoEspecialidadesController);

    PrincipalCatalogoEspecialidadesController.$inject = ['$stateParams', '$modal', 'tablaDatosService', 'CatalogoEspecialidades'];

    function PrincipalCatalogoEspecialidadesController($stateParams, $modal, tablaDatosService, CatalogoEspecialidades) {

            var vm = this;
            vm.descripcion_catalogo      = '';
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
                              order: ['nombre ASC','idEspecialidad ASC'],
                              fields:['idEspecialidad','idTema','clave','nombre'],
                              limit: vm.tablaCatalogo.registrosPorPagina,
                              skip: vm.tablaCatalogo.paginaActual - 1,
                              include: [
                                {
                                    relation: 'tema_pertenece',
                                    scope: {
                                        fields:['idTema','nombre']
                                    }
                                }
                              ]
                          }
                  };

                  vm.descripcion_catalogo = 'Catálogo de especialidades';
                  vm.CatalogoMostrar = CatalogoEspecialidades;
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
                        idEspecialidad : registroSeleccionado.idEspecialidad,
                        idTema         : registroSeleccionado.idTema,
                        clave          : registroSeleccionado.clave,
                        nombre         : registroSeleccionado.nombre
                    };

                    var modalInstance = $modal.open({
                        templateUrl: 'app/components/catalogos/catalogo-especialidades/modal-edita-especialidad.html',
                        windowClass: "animated fadeIn",
                        controller: 'ModalEditaEspecialidadController as vm',
                        resolve: {
                          registroEditar: function () { return vm.registroEditar }
                        }

                    });

                    modalInstance.result.then(function (respuesta) {
                        vm.RegistroSeleccionado.idTema = respuesta.idTema;
                        vm.RegistroSeleccionado.clave = respuesta.clave;
                        vm.RegistroSeleccionado.nombre = respuesta.nombre;
                        vm.RegistroSeleccionado.tema_pertenece.idTema = respuesta.idTema;
                        vm.RegistroSeleccionado.tema_pertenece.nombre = respuesta.tema;
                    }, function () {
                    });
            };


            function nuevo_registro() {

                    var modalInstance = $modal.open({
                        templateUrl: 'app/components/catalogos/catalogo-especialidades/modal-edita-especialidad.html',
                        windowClass: "animated fadeIn",
                        controller: 'ModalNuevaEspecialidadController as vm'
                    });

                    modalInstance.result.then(function () {
                       vm.limpiaBusqueda();
                    }, function () {
                    });
            };


            function elimina_registro(registroSeleccionado) {

                    CatalogoEspecialidades.RegistroCursos.count({ id:registroSeleccionado.idEspecialidad })
                    .$promise
                    .then(function(resultado) {
                        if(resultado.count > 0)
                        {
                            swal('No se puede eliminar el registro seleccionado porque tiene cursos asignados', '', 'error');
                        }
                        else
                        {
                            swal({
                              title: "Confirmar",
                              html: 'Se eliminar&aacute; la especialidad <strong>'+ registroSeleccionado.nombre +'</strong>, ¿Continuar?',
                              type: "warning",
                              showCancelButton: true,
                              confirmButtonColor: "#3085d6",
                              confirmButtonText: "Aceptar",
                              cancelButtonText: "Cancelar",
                              closeOnConfirm: false,
                              closeOnCancel: true
                            }, function(){
                                    swal.disableButtons();

                                    vm.CatalogoMostrar.deleteById({ id: registroSeleccionado.idEspecialidad })
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