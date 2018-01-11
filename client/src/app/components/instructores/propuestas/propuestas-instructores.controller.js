(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('PropuestasInstructoresController', PropuestasInstructoresController);

    PropuestasInstructoresController.$inject = ['$scope', '$modal', 'tablaDatosService', 'CatalogoInstructores', 'CatalogoUnidadesAdmtvas', 'AlmacenDocumentos', 'Usuario', 'DocumentosInstructores', 'ControlProcesos'];

    function PropuestasInstructoresController($scope, $modal, tablaDatosService, CatalogoInstructores, CatalogoUnidadesAdmtvas, AlmacenDocumentos, Usuario, DocumentosInstructores, ControlProcesos ) {

            var vm = this;

            vm.muestraDatosRegistroActual = muestraDatosRegistroActual;
            vm.muestraResultadosBusqueda  = muestraResultadosBusqueda;
            vm.limpiaBusqueda             = limpiaBusqueda;
            vm.cambiarPagina              = cambiarPagina;
            vm.abreDocumento              = abreDocumento;
            vm.eliminaDocumento           = eliminaDocumento;
            vm.edita_datos_registro       = edita_datos_registro;
            vm.edita_documentos_registro  = edita_documentos_registro;
            vm.nuevo_registro             = nuevo_registro;
            vm.elimina_registro           = elimina_registro;
            vm.envia_validacion           = envia_validacion;

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

                  vm.tablaListaRegistros.condicion = {
                      and: [
                        {idUnidadAdmtva: $scope.currentUser.unidad_pertenece_id},
                        {
                          estatus: {lt: 3}
                        }
                      ]
                  };

                  vm.tablaListaRegistros.filtro_datos = {
                          filter: {
                              where: vm.tablaListaRegistros.condicion,
                              //fields: ['idCatalogoCurso','claveCurso','descripcion','idEspecialidad','modalidad','nombreCurso','numeroHoras'],
                              order: ['nombre_completo ASC','idInstructor ASC'],
                              limit: vm.tablaListaRegistros.registrosPorPagina,
                              skip: vm.tablaListaRegistros.paginaActual - 1,
                              include: [
                                'localidad_pertenece',
                                'nivel_estudios',
                                {
                                    relation: 'documentos',
                                    scope: {
                                        fields:['idDocumento','documento','nombreArchivo','tipoArchivo']
                                    }
                                },
                                {
                                    relation: 'evaluacion_curso',
                                    scope: {
                                        fields:['id','idInstructor','idCatalogoCurso','calificacion'],
                                        include:{
                                            relation: 'CatalogoCursos',
                                            scope: {
                                                fields:['idCatalogoCurso','nombreCurso','modalidad','numeroHoras','idEspecialidad'],
                                                order: ['nombreCurso ASC','idCatalogoCurso ASC'],
                                                include:{
                                                    relation: 'especialidad',
                                                    scope: {
                                                        fields:['nombre']
                                                    }
                                                }
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



            function muestraResultadosBusqueda() {

                  vm.registros = {};
                  vm.RegistroSeleccionado = {};
                  vm.tablaListaRegistros.fila_seleccionada = undefined;
                  vm.client = 1;
                  vm.tablaListaRegistros.paginaActual = 1;
                  vm.tablaListaRegistros.inicio = 0;
                  vm.tablaListaRegistros.fin = 1;

                  vm.tablaListaRegistros.condicion = {
                      and: [
                        {idUnidadAdmtva: $scope.currentUser.unidad_pertenece_id},
                        {nombre_completo: {regexp: '/.*'+ vm.cadena_buscar +'.*/i'}},
                        {
                          estatus: {lt: 3}
                        }
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

                  vm.tablaListaRegistros.condicion = {
                      and: [
                        {idUnidadAdmtva: $scope.currentUser.unidad_pertenece_id},
                        {
                          estatus: {lt: 3}
                        }
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


            function eliminaDocumento(seleccion) {

                DocumentosInstructores.deleteById({ id: seleccion.idDocumento })
                .$promise
                .then(function() { 
                        
                        var indice = vm.RegistroSeleccionado.documentos.map(function(registro) {
                                                            return registro.idDocumento;
                                                          }).indexOf(seleccion.idDocumento);

                        vm.RegistroSeleccionado.documentos.splice(indice, 1);

                        AlmacenDocumentos.removeFile({
                            container: 'instructores',
                            file: seleccion.nombreArchivo
                        })
                        .$promise
                        .then(function() {
                        });
                });

            }


            function muestraDatosRegistroActual(seleccion) {

                  var index = vm.registros.indexOf(seleccion);
                  vm.RegistroSeleccionado = seleccion;
                  vm.client = 2;
                  vm.tablaListaRegistros.fila_seleccionada = index;
            };


            function edita_datos_registro(seleccion) {

                    var modalInstance = $modal.open({
                        templateUrl: 'app/components/instructores/propuestas/modal-propuesta-instructor.html',
                        windowClass: "animated fadeIn",
                        controller: 'ModalEditaPropuestaInstructorController as vm',
                        windowClass: 'app-modal-window',
                        resolve: {
                          registroEditar: function () { return seleccion }
                        }

                    });

                    modalInstance.result.then(function (respuesta) {

                        vm.RegistroSeleccionado.curp               = respuesta.curp;
                        vm.RegistroSeleccionado.apellidoPaterno    = respuesta.apellidoPaterno;
                        vm.RegistroSeleccionado.apellidoMaterno    = respuesta.apellidoMaterno;
                        vm.RegistroSeleccionado.nombre             = respuesta.nombre;
                        vm.RegistroSeleccionado.nombre_completo    = respuesta.nombre_completo;
                        vm.RegistroSeleccionado.rfc                = respuesta.rfc;
                        vm.RegistroSeleccionado.conPerfilAcademico = respuesta.conPerfilAcademico;
                        vm.RegistroSeleccionado.escolaridad        = respuesta.escolaridad;
                        vm.RegistroSeleccionado.telefono           = respuesta.telefono;
                        vm.RegistroSeleccionado.email              = respuesta.email;
                        vm.RegistroSeleccionado.certificacion      = respuesta.certificacion;
                        vm.RegistroSeleccionado.idLocalidad        = respuesta.idLocalidad;
                        vm.RegistroSeleccionado.estatus            = 0;
                        vm.RegistroSeleccionado.localidad          = respuesta.localidad;

                        if(vm.RegistroSeleccionado.localidad_pertenece === undefined)
                        {
                            vm.RegistroSeleccionado.localidad_pertenece = {
                                idLocalidad : respuesta.idLocalidad,
                                nombre      : respuesta.localidad
                            };
                        }
                        else
                        {
                            vm.RegistroSeleccionado.localidad_pertenece.idLocalidad = respuesta.idLocalidad;
                            vm.RegistroSeleccionado.localidad_pertenece.nombre      = respuesta.localidad;
                        }

                        if(respuesta.evaluacion_curso.length > 0)
                        {
                              vm.RegistroSeleccionado.evaluacion_curso = [];
                              angular.forEach(respuesta.evaluacion_curso, function(record) {
                                    vm.RegistroSeleccionado.evaluacion_curso.push({
                                        id              : record.id,
                                        idInstructor    : record.idInstructor,
                                        idCatalogoCurso : record.idCatalogoCurso,
                                        CatalogoCursos  : {
                                            idCatalogoCurso : record.CatalogoCursos.idCatalogoCurso,
                                            nombreCurso     : record.CatalogoCursos.nombreCurso,
                                            numeroHoras     : record.CatalogoCursos.numeroHoras,
                                            especialidad    : { nombre: record.CatalogoCursos.especialidad.nombre }
                                        }
                                    });
                              });
                        }

                    }, function () {
                    });
            };


            function edita_documentos_registro(seleccion) {

                    var modalInstance = $modal.open({
                        templateUrl: 'app/components/instructores/propuestas/modal-admin-documentos-instructor.html',
                        windowClass: "animated fadeIn",
                        controller: 'ModalAdminDocumentosInstructorController as vm',
                        windowClass: 'app-modal-window',
                        resolve: {
                          registroEditar: function () { return seleccion }
                        }

                    });

                    modalInstance.result.then(function (respuesta) {

                      vm.RegistroSeleccionado.estatus = respuesta.estatus;
                      vm.RegistroSeleccionado.documentos = [];
                      vm.RegistroSeleccionado.documentos = respuesta.documentos;

                    }, function () {
                    });
            };


            function nuevo_registro() {

                    var modalInstance = $modal.open({
                        templateUrl: 'app/components/instructores/propuestas/modal-propuesta-instructor.html',
                        windowClass: "animated fadeIn",
                        controller: 'ModalNUevaPropuestaInstructorController as vm',
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

                                    angular.forEach(RegistroSeleccionado.documentos, function(record) {
                                          AlmacenDocumentos.removeFile({
                                              container: 'instructores',
                                              file: record.nombreArchivo
                                          })
                                          .$promise
                                          .then(function() {
                                          });
                                    });

                                    CatalogoInstructores.documentos.destroyAll({ id: RegistroSeleccionado.idInstructor })
                                    .$promise
                                    .then(function() { 

                                        CatalogoInstructores.cursos_habilitados.destroyAll({ id: RegistroSeleccionado.idInstructor })
                                        .$promise
                                        .then(function() { 

                                              CatalogoInstructores.otras_unidades.destroyAll({ id: RegistroSeleccionado.idInstructor })
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
                                    });
                            });
                      }
                  });
            };


            function envia_validacion(RegistroSeleccionado) {
  
                if (RegistroSeleccionado.documentos.length == 0) {
                    swal({
                      title: 'Documentos incompletos',
                      html: 'El instructor <strong>'+RegistroSeleccionado.nombre_completo+'</strong> no tiene ning&uacute;n documento',
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
                                html: 'El instructor propuesto <strong>'+ RegistroSeleccionado.nombre_completo +'</strong> ser&aacute; enviado a revisi&oacute;n, ¿Continuar?',
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
                                            id: RegistroSeleccionado.idInstructor
                                        },{
                                            estatus: 1,
                                            fechaEnvioRevision: Date()
                                        })
                                        .$promise
                                        .then(function(respuesta) {

                                              RegistroSeleccionado.estatus            = respuesta.estatus;
                                              RegistroSeleccionado.fechaEnvioRevision = respuesta.fechaEnvioRevision;

                                              ControlProcesos
                                              .create({
                                                  proceso              : 'INSTRUCTORES',
                                                  accion               : 'ENVIO REVISION INSTRUCTOR',
                                                  idDocumento          : RegistroSeleccionado.idInstructor,
                                                  idUsuario            : $scope.currentUser.id_usuario,
                                                  idUnidadAdmtva       : $scope.currentUser.unidad_pertenece_id,
                                                  idUnidadAdmtvaRecibe : 1
                                              })
                                              .$promise
                                              .then(function(resp) {

                                                    ControlProcesos.findById({ 
                                                        id: resp.id,
                                                        filter: {
                                                          fields : ['identificador']
                                                        }
                                                    })
                                                    .$promise
                                                    .then(function(resp_control) {

                                                          swal({
                                                            title: 'Propuesta enviada',
                                                            html: 'La propuesta del instructor a revisi&oacute;n y se gener&oacute; el identificador del proceso <br><strong style="font-size: 13px;">' + resp_control.identificador + '</strong>',
                                                            type: 'success',
                                                            showCancelButton: false,
                                                            confirmButtonColor: "#9a0000",
                                                            confirmButtonText: "Aceptar"
                                                          });

                                                    });
                                              });

                                        });

                              });                  
                }

            }
    };

})();