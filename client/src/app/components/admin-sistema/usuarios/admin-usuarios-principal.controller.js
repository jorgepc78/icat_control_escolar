(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('AdminUsuariosPrincipalController', AdminUsuariosPrincipalController);

    AdminUsuariosPrincipalController.$inject = ['$timeout', '$modal', 'tablaDatosService', 'CatalogoUnidadesAdmtvas', 'Usuario'];

    function AdminUsuariosPrincipalController($timeout, $modal, tablaDatosService, CatalogoUnidadesAdmtvas, Usuario ) {

            var vm = this;
            vm.muestraDatosUsuarioActual  = muestraDatosUsuarioActual;
            vm.muestraResultadosBusqueda  = muestraResultadosBusqueda;
            vm.limpiaBusqueda             = limpiaBusqueda;
            vm.cambiarPagina              = cambiarPagina;
            vm.muestra_ptc_unidad         = muestra_ptc_unidad;
            vm.edita_datos_usuario        = edita_datos_usuario;
            vm.nuevo_usuario              = nuevo_usuario;
            vm.elimina_usuario            = elimina_usuario;
            
            vm.enviaCorreoUsuario         = enviaCorreoUsuario;

            vm.listaUnidades = [];
            vm.unidadSeleccionada = undefined;

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

                  CatalogoUnidadesAdmtvas.find({
                      filter: {
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

                  vm.tablaListaUsuarios.filtro_datos = {
                          filter: {
                              where: vm.tablaListaUsuarios.condicion,
                              fields: ['idUsuario','username','email','nombre','puesto','idUnidadAdmtva','activo','avisoEnvioPTC','avisoRevisonPTCProgr','avisoRechazoPTCProgr','avisoRevisonPTCAcad','avisoRechazoPTCAcad','avisoRevisonPTCPlan','avisoRechazoPTCPlan','avisoRevisionPTCGral','avisoRechazoPTCGral','avisoEnvioPreapCurso','avisoRevisionPreapCursoProgr','avisoRechazoPreapCursoProgr','avisoRevisionPreapCursoAcad','avisoRechazoPreapCursoAcad','avisoRevisionPreapCursoPlan','avisoRechazoPreapCursoPlan','avisoRevisionPreapCursoGral','avisoRechazoPreapCursoGral','avisoMinimoInscritosCurso','avisoMinimoPagadosCurso','avisoReversionPagadosCurso','avisoCancelacionCurso','avisoReprogCurso','avisoTerminacionCurso','avisoCierreCurso', 'avisoEnvioEvaluacion','avisoRevisionEvaluacionProgr','avisoRechazoEvaluacionProgr','avisoRevisionEvaluacionAcad','avisoRechazoEvaluacionAcad','avisoRevisionEvaluacionPlan','avisoRechazoEvaluacionPlan','avisoRevisionEvaluacionGral','avisoRechazoEvaluacionGral','avisoCancelacionEvaluacion','avisoCierreEvaluacion'],
                              order: ['idUnidadAdmtva ASC','nombre ASC'],
                              limit: vm.tablaListaUsuarios.registrosPorPagina,
                              skip: vm.tablaListaUsuarios.paginaActual - 1,
                              include: [
                                {
                                    relation: 'unidad_pertenece',
                                    scope: {
                                        fields:['idUnidadAdmtva','nombre']
                                    }
                                },
                                {
                                    relation: 'perfil',
                                    scope: {
                                        fields:['name','description']
                                    }
                                },
                                {
                                    relation: 'unidad_revisa',
                                    scope: {
                                        fields:['idUnidadAdmtva','nombre']
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
                                          regexp: '/.*'+ vm.nombre_buscar +'.*/i'
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
                  //vm.tablaListaUsuarios.condicion = {username: {neq: 'adminsystem'} };
                  vm.unidadSeleccionada = vm.listaUnidades[0];

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


            function muestra_ptc_unidad() {

                  vm.usuarios = {};
                  vm.UsuarioSeleccionado = {};
                  vm.tablaListaUsuarios.fila_seleccionada = undefined;
                  vm.tablaListaUsuarios.paginaActual = 1;
                  vm.tablaListaUsuarios.inicio = 0;
                  vm.tablaListaUsuarios.fin = 1;
                  vm.client = 1;
                  vm.mostrarbtnLimpiar = false;
                  vm.nombre_buscar = '';

                  if(vm.unidadSeleccionada.idUnidadAdmtva == -1)
                  {
                        vm.tablaListaUsuarios.condicion = {username: {neq: 'adminsystem'} };
                  }
                  else
                  {
                        vm.tablaListaUsuarios.condicion = {
                                          and: [
                                            {username: {neq: 'adminsystem'}},
                                            {idUnidadAdmtva: vm.unidadSeleccionada.idUnidadAdmtva}
                                          ]
                                      };
                  }

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
            };

            function muestraDatosUsuarioActual(seleccion) {

                  var index = vm.usuarios.indexOf(seleccion);
                  vm.UsuarioSeleccionado = seleccion;
                  vm.client = 2;
                  vm.tablaListaUsuarios.fila_seleccionada = index;
            };


            function edita_datos_usuario(UsuarioSeleccionado) {

                    var modalInstance = $modal.open({
                        templateUrl: 'app/components/admin-sistema/usuarios/modal-edita-usuario.html',
                        windowClass: "animated fadeIn",
                        controller: 'ModalEditaUsuarioController as vm',
                        size: 'lg',
                        resolve: {
                          usuarioEditar: function () { return UsuarioSeleccionado }
                        }

                    });

                    modalInstance.result.then(function (respuesta) {
                        vm.UsuarioSeleccionado.nombre                          = respuesta.nombre;
                        vm.UsuarioSeleccionado.puesto                          = respuesta.puesto;
                        vm.UsuarioSeleccionado.email                           = respuesta.email;
                        vm.UsuarioSeleccionado.username                        = respuesta.username;
                        vm.UsuarioSeleccionado.unidad_pertenece.idUnidadAdmtva = respuesta.idUnidadAdmtva;
                        vm.UsuarioSeleccionado.unidad_pertenece.nombre         = respuesta.UnidadAdmtva;

                        vm.UsuarioSeleccionado.avisoEnvioPTC                   = respuesta.avisoEnvioPTC,
                        vm.UsuarioSeleccionado.avisoRevisonPTCProgr            = respuesta.avisoRevisonPTCProgr,
                        vm.UsuarioSeleccionado.avisoRechazoPTCProgr            = respuesta.avisoRechazoPTCProgr,
                        vm.UsuarioSeleccionado.avisoRevisonPTCAcad             = respuesta.avisoRevisonPTCAcad,
                        vm.UsuarioSeleccionado.avisoRechazoPTCAcad             = respuesta.avisoRechazoPTCAcad,
                        vm.UsuarioSeleccionado.avisoRevisonPTCPlan             = respuesta.avisoRevisonPTCPlan,
                        vm.UsuarioSeleccionado.avisoRechazoPTCPlan             = respuesta.avisoRechazoPTCPlan,
                        vm.UsuarioSeleccionado.avisoRevisionPTCGral            = respuesta.avisoRevisionPTCGral,
                        vm.UsuarioSeleccionado.avisoRechazoPTCGral             = respuesta.avisoRechazoPTCGral,
                        
                        vm.UsuarioSeleccionado.avisoEnvioPreapCurso            = respuesta.avisoEnvioPreapCurso,
                        vm.UsuarioSeleccionado.avisoRevisionPreapCursoProgr    = respuesta.avisoRevisionPreapCursoProgr,
                        vm.UsuarioSeleccionado.avisoRechazoPreapCursoProgr     = respuesta.avisoRechazoPreapCursoProgr,
                        vm.UsuarioSeleccionado.avisoRevisionPreapCursoAcad     = respuesta.avisoRevisionPreapCursoAcad,
                        vm.UsuarioSeleccionado.avisoRechazoPreapCursoAcad      = respuesta.avisoRechazoPreapCursoAcad,
                        vm.UsuarioSeleccionado.avisoRevisionPreapCursoPlan     = respuesta.avisoRevisionPreapCursoPlan,
                        vm.UsuarioSeleccionado.avisoRechazoPreapCursoPlan      = respuesta.avisoRechazoPreapCursoPlan,
                        vm.UsuarioSeleccionado.avisoRevisionPreapCursoGral     = respuesta.avisoRevisionPreapCursoGral,
                        vm.UsuarioSeleccionado.avisoRechazoPreapCursoGral      = respuesta.avisoRechazoPreapCursoGral,

                        vm.UsuarioSeleccionado.avisoMinimoInscritosCurso       = respuesta.avisoMinimoInscritosCurso;
                        vm.UsuarioSeleccionado.avisoMinimoPagadosCurso         = respuesta.avisoMinimoPagadosCurso;
                        vm.UsuarioSeleccionado.avisoReversionPagadosCurso      = respuesta.avisoReversionPagadosCurso;
                        vm.UsuarioSeleccionado.avisoCancelacionCurso           = respuesta.avisoCancelacionCurso;
                        vm.UsuarioSeleccionado.avisoReprogCurso                = respuesta.avisoReprogCurso;
                        vm.UsuarioSeleccionado.avisoTerminacionCurso           = respuesta.avisoTerminacionCurso;
                        vm.UsuarioSeleccionado.avisoCierreCurso                = respuesta.avisoCierreCurso;
                        
                        vm.UsuarioSeleccionado.avisoEnvioEvaluacion            = respuesta.avisoEnvioEvaluacion;
                        vm.UsuarioSeleccionado.avisoRevisionEvaluacionProgr    = respuesta.avisoRevisionEvaluacionProgr;
                        vm.UsuarioSeleccionado.avisoRechazoEvaluacionProgr     = respuesta.avisoRechazoEvaluacionProgr;
                        vm.UsuarioSeleccionado.avisoRevisionEvaluacionAcad     = respuesta.avisoRevisionEvaluacionAcad;
                        vm.UsuarioSeleccionado.avisoRechazoEvaluacionAcad      = respuesta.avisoRechazoEvaluacionAcad;
                        vm.UsuarioSeleccionado.avisoRevisionEvaluacionPlan     = respuesta.avisoRevisionEvaluacionPlan;
                        vm.UsuarioSeleccionado.avisoRechazoEvaluacionPlan      = respuesta.avisoRechazoEvaluacionPlan;
                        vm.UsuarioSeleccionado.avisoRevisionEvaluacionGral     = respuesta.avisoRevisionEvaluacionGral;
                        vm.UsuarioSeleccionado.avisoRechazoEvaluacionGral      = respuesta.avisoRechazoEvaluacionGral;
                        vm.UsuarioSeleccionado.avisoCancelacionEvaluacion      = respuesta.avisoCancelacionEvaluacion;
                        vm.UsuarioSeleccionado.avisoCierreEvaluacion           = respuesta.avisoCierreEvaluacion;
                        
                        vm.UsuarioSeleccionado.activo                          = respuesta.activo;
                        if(vm.UsuarioSeleccionado.perfil.length > 0)
                        {
                            vm.UsuarioSeleccionado.perfil[0].id                = respuesta.perfil.id;
                            vm.UsuarioSeleccionado.perfil[0].description       = respuesta.perfil.description;
                            vm.UsuarioSeleccionado.perfil[0].name              = respuesta.perfil.name;                          
                        }
                        else
                        {
                            vm.UsuarioSeleccionado.perfil.push({
                                id          : respuesta.perfil.id,
                                description : respuesta.perfil.description,
                                name        : respuesta.perfil.name
                            });
                        }

                        if(respuesta.unidad_revisa.length > 0)
                        {
                              vm.UsuarioSeleccionado.unidad_revisa = [];
                              angular.forEach(respuesta.unidad_revisa, function(record) {
                                    vm.UsuarioSeleccionado.unidad_revisa.push({
                                        idUnidadAdmtva : record.idUnidadAdmtva,
                                        nombre         : record.nombre,
                                    });
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


            function enviaCorreoUsuario(UsuarioSeleccionado) {

                  Usuario.manda_correo_usuario({ idUsuario: UsuarioSeleccionado.idUsuario })
                    .$promise
                    .then(function() { 
                          swal('Correo enviado', '', 'success');
                  });
            };

    };

})();