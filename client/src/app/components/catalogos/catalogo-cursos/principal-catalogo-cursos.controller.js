(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('PrincipalCatalogoCursosController', PrincipalCatalogoCursosController);

    PrincipalCatalogoCursosController.$inject = ['$timeout', '$modal', 'tablaDatosService', 'CatalogoCursos'];

    function PrincipalCatalogoCursosController($timeout, $modal, tablaDatosService, CatalogoCursos ) {

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
                              fields: ['idCatalogoCurso','claveCurso','descripcion','idEspecialidad','modalidad','nombreCurso','numeroHoras'],
                              order: ['nombreCurso ASC'],
                              limit: vm.tablaListaRegistros.registrosPorPagina,
                              skip: vm.tablaListaRegistros.paginaActual - 1,
                              include: [
                                'temario',
                                {
                                    relation: 'especialidad',
                                    scope: {
                                        fields:['idEspecialidad','idTema','nombre']
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


            function muestraResultadosBusqueda() {

                  vm.registros = {};
                  vm.RegistroSeleccionado = {};
                  vm.tablaListaRegistros.fila_seleccionada = undefined;
                  vm.client = 1;
                  vm.tablaListaRegistros.paginaActual = 1;
                  vm.tablaListaRegistros.inicio = 0;
                  vm.tablaListaRegistros.fin = 1;
                  vm.tablaListaRegistros.condicion = {
                                    nombreCurso: {
                                      like: '%' + vm.cadena_buscar + '%',
                                    }
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
                        resolve: {
                          registroEditar: function () { return seleccion }
                        }

                    });

                    modalInstance.result.then(function (respuesta) {
                        vm.RegistroSeleccionado.nombre                          = respuesta.nombre;
                        vm.RegistroSeleccionado.puesto                          = respuesta.puesto;
                        vm.RegistroSeleccionado.email                           = respuesta.email;
                        vm.RegistroSeleccionado.username                        = respuesta.username;
                        vm.RegistroSeleccionado.unidad_pertenece.idUnidadAdmtva = respuesta.idUnidadAdmtva;
                        vm.RegistroSeleccionado.unidad_pertenece.nombre         = respuesta.UnidadAdmtva;
                        vm.RegistroSeleccionado.avisoCurso                      = respuesta.avisoCurso;
                        vm.RegistroSeleccionado.activo                          = respuesta.activo;
                        if(vm.RegistroSeleccionado.perfil.length > 0)
                        {
                            vm.RegistroSeleccionado.perfil[0].id                    = respuesta.perfil.id;
                            vm.RegistroSeleccionado.perfil[0].description           = respuesta.perfil.description;
                            vm.RegistroSeleccionado.perfil[0].name                  = respuesta.perfil.name;                          
                        }
                        else
                        {
                            vm.RegistroSeleccionado.perfil.push({
                                id          : respuesta.perfil.id,
                                description : respuesta.perfil.description,
                                name        : respuesta.perfil.name
                            });
                        }
                    }, function () {
                    });
            };


            function nuevo_registro() {

                    var modalInstance = $modal.open({
                        templateUrl: 'app/components/admin-sistema/usuarios/modal-edita-usuario.html',
                        windowClass: "animated fadeIn",
                        controller: 'ModalNuevoUsuarioController as vm',
                        size: 'lg'
                    });

                    modalInstance.result.then(function () {
                        vm.limpiaBusqueda();
                    }, function () {
                    });
            };


            function elimina_registro(RegistroSeleccionado) {

                  swal({
                    title: "Confirmar",
                    html: 'Se eliminar&aacute; el usuario <strong>'+ RegistroSeleccionado.nombre +'</strong>, ¿Continuar?',
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "Aceptar",
                    cancelButtonText: "Cancelar",
                    closeOnConfirm: false,
                    closeOnCancel: true
                  }, function(){
                          swal.disableButtons();


                            CatalogoCursos.perfil.destroyAll({ id: RegistroSeleccionado.idUsuario })
                              .$promise
                              .then(function() { 

                                    CatalogoCursos.deleteById({ id: RegistroSeleccionado.idUsuario })
                                    .$promise
                                    .then(function() { 
                                          vm.limpiaBusqueda();
                                          swal('CatalogoCursos eliminado', '', 'success');
                                    });

                            });

                  });

            };

    };

})();