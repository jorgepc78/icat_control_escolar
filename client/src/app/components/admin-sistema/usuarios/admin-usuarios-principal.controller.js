(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('AdminUsuariosPrincipalController', AdminUsuariosPrincipalController);

    AdminUsuariosPrincipalController.$inject = ['$timeout', '$modal', 'tablaDatosService', 'Usuario'];

    function AdminUsuariosPrincipalController($timeout, $modal, tablaDatosService, Usuario ) {

            var vm = this;
            vm.muestraDatosUsuarioActual  = muestraDatosUsuarioActual;
            vm.muestraResultadosBusqueda  = muestraResultadosBusqueda;
            vm.limpiaBusqueda             = limpiaBusqueda;
            vm.cambiarPagina              = cambiarPagina;
            vm.edita_datos_usuario        = edita_datos_usuario;
            vm.nuevo_usuario              = nuevo_usuario;
            vm.elimina_usuario            = elimina_usuario;

            vm.tablaListaUsuarios = {
              totalElementos     : 0,
              paginaActual       : 1,
              registrosPorPagina : 10,
              inicio             : 0,
              fin                : 1,
              condicion          : { username: {neq: 'adminsystem'} },
              filtro_datos       : {},
              fila_seleccionada  : 0
            };

            inicia();

            function inicia() {

                  vm.tablaListaUsuarios.filtro_datos = {
                          filter: {
                              where: vm.tablaListaUsuarios.condicion,
                              fields: ['idUsuario','username','email','nombre','puesto','idUnidadAdmtva','avisoCurso','activo'],
                              order: ['nombre ASC'],
                              limit: vm.tablaListaUsuarios.registrosPorPagina,
                              skip: vm.tablaListaUsuarios.paginaActual - 1,
                              include: [
                                'unidad_pertenece',
                                {
                                    relation: 'perfil',
                                    scope: {
                                        fields:['name','description']
                                    }
                                }
                              ]
                          }
                  };

                  vm.usuarios = {};
                  vm.UsuarioSeleccionado = {};
                  vm.tablaListaUsuarios.fila_seleccionada = undefined;
                  vm.client = 1;

                  tablaDatosService.obtiene_datos_tabla(Usuario, vm.tablaListaUsuarios)
                  .then(function(respuesta) {

                        vm.tablaListaUsuarios.totalElementos = respuesta.total_registros;
                        vm.tablaListaUsuarios.inicio = respuesta.inicio;
                        vm.tablaListaUsuarios.fin = respuesta.fin;

                        if(vm.tablaListaUsuarios.totalElementos > 0)
                        {
                            vm.usuarios = respuesta.datos;
                            vm.UsuarioSeleccionado = vm.usuarios[0];
                            vm.client = 2;
                            vm.tablaListaUsuarios.fila_seleccionada = 0;
                            muestraDatosUsuarioActual(vm.UsuarioSeleccionado);
                        }
                  });

            }


            function muestraResultadosBusqueda() {

                  vm.usuarios = {};
                  vm.UsuarioSeleccionado = {};
                  vm.tablaListaUsuarios.fila_seleccionada = undefined;
                  vm.client = 1;
                  vm.tablaListaUsuarios.paginaActual = 1;
                  vm.tablaListaUsuarios.inicio = 0;
                  vm.tablaListaUsuarios.fin = 1;
                  vm.tablaListaUsuarios.condicion = {
                                    and: [
                                      {username: {neq: 'adminsystem'}},
                                      {
                                        nombre: {
                                          like: '%' + vm.nombre_buscar + '%',
                                        }
                                      }
                                    ]
                                };

                  tablaDatosService.obtiene_datos_tabla(Usuario, vm.tablaListaUsuarios)
                  .then(function(respuesta) {

                        vm.tablaListaUsuarios.totalElementos = respuesta.total_registros;
                        vm.tablaListaUsuarios.inicio = respuesta.inicio;
                        vm.tablaListaUsuarios.fin = respuesta.fin;

                        if(vm.tablaListaUsuarios.totalElementos > 0)
                        {
                            vm.usuarios = respuesta.datos;
                            vm.UsuarioSeleccionado = vm.usuarios[0];
                            vm.client = 2;
                            vm.tablaListaUsuarios.fila_seleccionada = 0;
                            muestraDatosUsuarioActual(vm.UsuarioSeleccionado);
                        }

                        vm.mostrarbtnLimpiar = true;
                  });
            };


            function limpiaBusqueda() {

                  vm.usuarios = {};
                  vm.UsuarioSeleccionado = {};
                  vm.tablaListaUsuarios.fila_seleccionada = undefined;
                  vm.client = 1;
                  vm.tablaListaUsuarios.paginaActual = 1;
                  vm.tablaListaUsuarios.inicio = 0;
                  vm.tablaListaUsuarios.fin = 1;
                  vm.tablaListaUsuarios.condicion = {username: {neq: 'adminsystem'} };

                  tablaDatosService.obtiene_datos_tabla(Usuario, vm.tablaListaUsuarios)
                  .then(function(respuesta) {

                        vm.tablaListaUsuarios.totalElementos = respuesta.total_registros;
                        vm.tablaListaUsuarios.inicio = respuesta.inicio;
                        vm.tablaListaUsuarios.fin = respuesta.fin;

                        if(vm.tablaListaUsuarios.totalElementos > 0)
                        {
                            vm.usuarios = respuesta.datos;
                            vm.UsuarioSeleccionado = vm.usuarios[0];
                            vm.client = 2;
                            vm.tablaListaUsuarios.fila_seleccionada = 0;
                            muestraDatosUsuarioActual(vm.UsuarioSeleccionado);
                        }

                        vm.mostrarbtnLimpiar = false;
                        vm.nombre_buscar = '';
                  });

            };


            function cambiarPagina() {

                  if(vm.tablaListaUsuarios.totalElementos > 0)
                  {
                        tablaDatosService.cambia_pagina(Usuario, vm.tablaListaUsuarios)
                        .then(function(respuesta) {

                            vm.tablaListaUsuarios.inicio = respuesta.inicio;
                            vm.tablaListaUsuarios.fin = respuesta.fin;

                            vm.usuarios = respuesta.datos;
                            vm.UsuarioSeleccionado = vm.usuarios[0];
                            vm.client = 2;
                            vm.tablaListaUsuarios.fila_seleccionada = 0;
                            muestraDatosUsuarioActual(vm.UsuarioSeleccionado);
                        });
                  }
            }


            function muestraDatosUsuarioActual(seleccion) {

                  var index = vm.usuarios.indexOf(seleccion);
                  vm.UsuarioSeleccionado = seleccion;
                  vm.client = 2;
                  vm.tablaListaUsuarios.fila_seleccionada = index;
            };


            function edita_datos_usuario(UsuarioSeleccionado) {

                    vm.usuarioEditar = {
                        idUsuario      : UsuarioSeleccionado.idUsuario,
                        nombre         : UsuarioSeleccionado.nombre,
                        puesto         : UsuarioSeleccionado.puesto,
                        email          : UsuarioSeleccionado.email,
                        username       : UsuarioSeleccionado.username,
                        idUnidadAdmtva : UsuarioSeleccionado.idUnidadAdmtva,
                        avisoCurso     : UsuarioSeleccionado.avisoCurso,
                        activo         : UsuarioSeleccionado.activo,
                        idPerfil       : (UsuarioSeleccionado.perfil.length > 0 ? UsuarioSeleccionado.perfil[0].id : 0)
                   };

                    var modalInstance = $modal.open({
                        templateUrl: 'app/components/admin-sistema/usuarios/modal-edita-usuario.html',
                        windowClass: "animated fadeIn",
                        controller: 'ModalEditaUsuarioController as vm',
                        //size: 'lg',
                        resolve: {
                          usuarioEditar: function () { return vm.usuarioEditar }
                        }

                    });

                    modalInstance.result.then(function (respuesta) {
                        vm.UsuarioSeleccionado.nombre                          = respuesta.nombre;
                        vm.UsuarioSeleccionado.puesto                          = respuesta.puesto;
                        vm.UsuarioSeleccionado.email                           = respuesta.email;
                        vm.UsuarioSeleccionado.username                        = respuesta.username;
                        vm.UsuarioSeleccionado.unidad_pertenece.idUnidadAdmtva = respuesta.idUnidadAdmtva;
                        vm.UsuarioSeleccionado.unidad_pertenece.nombre         = respuesta.UnidadAdmtva;
                        vm.UsuarioSeleccionado.avisoCurso                      = respuesta.avisoCurso;
                        vm.UsuarioSeleccionado.activo                          = respuesta.activo;
                        if(vm.UsuarioSeleccionado.perfil.length > 0)
                        {
                            vm.UsuarioSeleccionado.perfil[0].id                    = respuesta.perfil.id;
                            vm.UsuarioSeleccionado.perfil[0].description           = respuesta.perfil.description;
                            vm.UsuarioSeleccionado.perfil[0].name                  = respuesta.perfil.name;                          
                        }
                        else
                        {
                            vm.UsuarioSeleccionado.perfil.push({
                                id          : respuesta.perfil.id,
                                description : respuesta.perfil.description,
                                name        : respuesta.perfil.name
                            });
                        }
                    }, function () {
                    });
            };


            function nuevo_usuario() {

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


            function elimina_usuario(UsuarioSeleccionado) {

                  swal({
                    title: "Confirmar",
                    html: 'Se eliminar&aacute; el usuario <strong>'+ UsuarioSeleccionado.nombre +'</strong>, ¿Continuar?',
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "Aceptar",
                    cancelButtonText: "Cancelar",
                    closeOnConfirm: false,
                    closeOnCancel: true
                  }, function(){
                          swal.disableButtons();


                            Usuario.perfil.destroyAll({ id: UsuarioSeleccionado.idUsuario })
                              .$promise
                              .then(function() { 

                                    Usuario.deleteById({ id: UsuarioSeleccionado.idUsuario })
                                    .$promise
                                    .then(function() { 
                                          vm.limpiaBusqueda();
                                          swal('Usuario eliminado', '', 'success');
                                    });

                            });

                  });

            };

    };

})();