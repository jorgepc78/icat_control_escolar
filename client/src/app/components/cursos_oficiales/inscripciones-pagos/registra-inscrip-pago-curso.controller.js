(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('RegistroInscripPagoCursoController', RegistroInscripPagoCursoController);

    RegistroInscripPagoCursoController.$inject = ['$scope', '$stateParams', '$modal', 'tablaDatosService', 'CatalogoUnidadesAdmtvas', 'CursosOficiales', 'InscripcionCurso', 'ControlProcesos'];

    function RegistroInscripPagoCursoController($scope, $stateParams, $modal, tablaDatosService, CatalogoUnidadesAdmtvas, CursosOficiales, InscripcionCurso, ControlProcesos ) {

            var vm = this;

            vm.muestraResultadosBusqueda  = muestraResultadosBusqueda;
            vm.limpiaBusqueda             = limpiaBusqueda;

            vm.muestraDatosRegistroActual = muestraDatosRegistroActual;
            vm.cambiarPagina              = cambiarPagina;
            vm.registraInscripcion        = registraInscripcion;
            vm.muestraDocInscripcion      = muestraDocInscripcion;
            vm.registraPago               = registraPago;
            vm.generaFormato              = generaFormato;
            vm.editaNumFactura            = editaNumFactura;
            vm.eliminaInscrito            = eliminaInscrito;

            vm.mostrarbtnLimpiar = false;
            vm.cadena_buscar = '';

            vm.tablaListaCursos = {
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

                  vm.tablaListaCursos.condicion = {
                      and: [
                        {or: [{estatus: 2}, {estatus: 4}]},
                        {idUnidadAdmtva: $scope.currentUser.unidad_pertenece_id}
                      ]
                  };
                  

                  vm.tablaListaCursos.filtro_datos = {
                          filter: {
                              where: vm.tablaListaCursos.condicion,
                              order: ['fechaInicio DESC','nombreCurso ASC'],
                              limit: vm.tablaListaCursos.registrosPorPagina,
                              skip: vm.tablaListaCursos.paginaActual - 1,
                              include: [
                                  {
                                      relation: 'localidad_pertenece',
                                      scope: {
                                        fields: ['nombre']
                                      }
                                  },
                                  {
                                      relation: 'inscripcionesCursos',
                                      scope: {
                                          fields:['id','pagado','idAlumno','fechaInscripcion','fechaPago','numFactura'],
                                          include:{
                                              relation: 'Capacitandos',
                                              scope: {
                                                  fields:['numControl','apellidoPaterno','apellidoMaterno','nombre','curp']
                                              }
                                          }
                                      }
                                  }
                              ]
                          }
                  };

                  vm.client = 1;
                  vm.tablaListaCursos.paginaActual = 1;
                  vm.tablaListaCursos.inicio = 0;
                  vm.tablaListaCursos.fin = 1;

                  vm.listaCursos = {};
                  tablaDatosService.obtiene_datos_tabla(CursosOficiales, vm.tablaListaCursos)
                  .then(function(respuesta) {

                        vm.tablaListaCursos.totalElementos = respuesta.total_registros;
                        vm.tablaListaCursos.inicio = respuesta.inicio;
                        vm.tablaListaCursos.fin = respuesta.fin;

                        if(vm.tablaListaCursos.totalElementos > 0)
                        {
                            vm.listaCursos = respuesta.datos;
                            formateaListado();
                            vm.cursoSeleccionado = vm.listaCursos[0];
                            agregaNombreCompleto();
                            vm.client = 2;
                            vm.tablaListaCursos.fila_seleccionada = 0;
                            muestraDatosRegistroActual(vm.cursoSeleccionado);
                        }
                  });

            }




            function muestraResultadosBusqueda() {

                  vm.client = 1;
                  vm.listaCursos = {};
                  vm.cursoSeleccionado = {};
                  vm.tablaListaCursos.fila_seleccionada = undefined;
                  vm.tablaListaCursos.paginaActual = 1;
                  vm.tablaListaCursos.inicio = 0;
                  vm.tablaListaCursos.fin = 1;

                  var condicion_busqueda = {
                                    nombreCurso: {regexp: '/.*'+ vm.cadena_buscar +'.*/i'}
                                };

                  vm.tablaListaCursos.condicion = {
                      and: [
                        {idUnidadAdmtva: $scope.currentUser.unidad_pertenece_id},
                        {or: [{estatus: 2}, {estatus: 4}]},
                        condicion_busqueda
                      ]
                  };

                  tablaDatosService.obtiene_datos_tabla(CursosOficiales, vm.tablaListaCursos)
                  .then(function(respuesta) {

                        vm.tablaListaCursos.totalElementos = respuesta.total_registros;
                        vm.tablaListaCursos.inicio = respuesta.inicio;
                        vm.tablaListaCursos.fin = respuesta.fin;

                        if(vm.tablaListaCursos.totalElementos > 0)
                        {
                            vm.listaCursos = respuesta.datos;
                            formateaListado();
                            vm.cursoSeleccionado = vm.listaCursos[0];
                            agregaNombreCompleto();
                            vm.client = 2;
                            vm.tablaListaCursos.fila_seleccionada = 0;
                            muestraDatosRegistroActual(vm.cursoSeleccionado);
                        }
                        vm.mostrarbtnLimpiar = true;
                  });

            };


            function limpiaBusqueda() {

                  vm.mostrarbtnLimpiar = false;
                  vm.cadena_buscar = '';
                  vm.client = 1;
                  vm.listaCursos = {};
                  vm.cursoSeleccionado = {};
                  vm.tablaListaCursos.fila_seleccionada = undefined;
                  vm.tablaListaCursos.paginaActual = 1;
                  vm.tablaListaCursos.inicio = 0;
                  vm.tablaListaCursos.fin = 1;

                  vm.tablaListaCursos.condicion = {
                      and: [
                        {idUnidadAdmtva: $scope.currentUser.unidad_pertenece_id},
                        {or: [{estatus: 2}, {estatus: 4}]}
                      ]
                  };

                  tablaDatosService.obtiene_datos_tabla(CursosOficiales, vm.tablaListaCursos)
                  .then(function(respuesta) {

                        vm.tablaListaCursos.totalElementos = respuesta.total_registros;
                        vm.tablaListaCursos.inicio = respuesta.inicio;
                        vm.tablaListaCursos.fin = respuesta.fin;

                        if(vm.tablaListaCursos.totalElementos > 0)
                        {
                            vm.listaCursos = respuesta.datos;
                            formateaListado();
                            vm.cursoSeleccionado = vm.listaCursos[0];
                            agregaNombreCompleto();
                            vm.client = 2;
                            vm.tablaListaCursos.fila_seleccionada = 0;
                            muestraDatosRegistroActual(vm.cursoSeleccionado);
                        }
                  });

            };



            function muestraDatosRegistroActual(seleccion) {

                  var index = vm.listaCursos.indexOf(seleccion);
                  vm.cursoSeleccionado = seleccion;
                  vm.client = 2;
                  vm.tablaListaCursos.fila_seleccionada = index;
            };



            function cambiarPagina() {

                  if(vm.tablaListaCursos.totalElementos > 0)
                  {
                        tablaDatosService.cambia_pagina(CursosOficiales, vm.tablaListaCursos)
                        .then(function(respuesta) {

                            vm.tablaListaCursos.inicio = respuesta.inicio;
                            vm.tablaListaCursos.fin = respuesta.fin;

                            vm.listaCursos = respuesta.datos;
                            formateaListado();
                            vm.cursoSeleccionado = vm.listaCursos[0];
                            agregaNombreCompleto();
                            vm.client = 2;
                            vm.tablaListaCursos.fila_seleccionada = 0;
                            muestraDatosRegistroActual(vm.cursoSeleccionado);
                        });
                  }
            }



            function registraInscripcion(seleccion) {

                    var modalInstance = $modal.open({
                        templateUrl: 'app/components/cursos_oficiales/inscripciones-pagos/modal-agrega-persona.html',
                        windowClass: "animated fadeIn",
                        controller: 'ModalAgregaPersonaController as vm',
                        size: 'lg',
                        resolve: {
                          registroEditar: function () { return seleccion }
                        }

                    });

                    modalInstance.result.then(function (respuesta) {

                          vm.cursoSeleccionado.inscripcionesCursos.push(
                              respuesta
                          );
                          agregaNombreCompleto();


                          CursosOficiales.findById({ 
                              id: seleccion.idCurso,
                              filter: {
                                fields : ['idCurso','minRequeridoInscritos'],
                                include: [
                                    {
                                        relation: 'inscripcionesCursos',
                                        scope: {
                                            fields:['id','idAlumno']
                                        }
                                    }
                                ]
                              }
                          })
                          .$promise
                          .then(function(curso) {

                                if(curso.inscripcionesCursos.length == curso.minRequeridoInscritos)
                                {
                                        ControlProcesos
                                        .create({
                                            proceso         : 'Inscripcion a curso',
                                            accion          : 'ALCANCE MINIMO INSCRITOS',
                                            idDocumento     : curso.idCurso,
                                            idUsuario       : $scope.currentUser.id_usuario,
                                            idUnidadAdmtva  : $scope.currentUser.unidad_pertenece_id
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

                                              });
                                        });
                                }

                          });
                        

                    }, function () {
                    });

            }



            function muestraDocInscripcion(seleccion) {

                    console.log(seleccion.id);
                    /*var link = angular.element('<a href="api/ProgTrimCursos/exporta_doc_ptc/'+seleccion.idPtc+'" target="_blank"></a>');

                    angular.element(document.body).append(link);

                    link[0].click();
                    link.remove();*/

            };



            function registraPago(seleccion) {

                    var modalInstance = $modal.open({
                        templateUrl: 'app/components/cursos_oficiales/inscripciones-pagos/modal-captura-num-factura.html',
                        windowClass: "animated fadeIn",
                        controller: 'ModalCapturaNumFacturaController as vm',
                        resolve: {
                          registroEditar: function () { return {nombreCurso: vm.cursoSeleccionado.nombreCurso ,seleccion: seleccion} }
                        }

                    });

                    modalInstance.result.then(function (respuesta) {
                        
                            var index = vm.cursoSeleccionado.inscripcionesCursos.map(function(instructor) {
                                                                return instructor.id;
                                                              }).indexOf(respuesta.id);

                            vm.cursoSeleccionado.inscripcionesCursos[index].pagado = respuesta.pagado;
                            vm.cursoSeleccionado.inscripcionesCursos[index].numFactura = respuesta.numFactura;

                            CursosOficiales.findById({ 
                                id: seleccion.idCurso,
                                filter: {
                                  fields : ['idCurso','minRequeridoPago'],
                                  include: [
                                      {
                                          relation: 'inscripcionesCursos',
                                          scope: {
                                              fields:['id','pagado','idAlumno']
                                          }
                                      }
                                  ]
                                }
                            })
                            .$promise
                            .then(function(curso) {

                                  var num_pagados = 0;
                                  angular.forEach(curso.inscripcionesCursos, function(registro) {
                                      if(registro.pagado > 0)
                                        num_pagados++;
                                  });

                                  if(num_pagados == curso.minRequeridoPago)
                                  {
                                        CursosOficiales.prototype$updateAttributes(
                                        {
                                            id: seleccion.idCurso
                                        },{
                                            estatus: 4
                                        })
                                        .$promise
                                        .then(function(respuesta) {

                                              vm.cursoSeleccionado.estatus = respuesta.estatus;

                                              ControlProcesos
                                              .create({
                                                  proceso         : 'Inscripcion a curso',
                                                  accion          : 'ALCANCE MINIMO PAGADOS',
                                                  idDocumento     : curso.idCurso,
                                                  idUsuario       : $scope.currentUser.id_usuario,
                                                  idUnidadAdmtva  : $scope.currentUser.unidad_pertenece_id
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

                                                    });
                                              });

                                        });
                                  }

                            });

                    }, function () {
                    });

            }


            function generaFormato(seleccion) {

                    var link = angular.element('<a href="api/Capacitandos/exporta_doc_inscrip/'+seleccion.idCurso+'/'+seleccion.Capacitandos.idAlumno+'" target="_blank"></a>');

                    angular.element(document.body).append(link);

                    link[0].click();
                    link.remove();

            };


            function editaNumFactura(seleccion) {

                    var modalInstance = $modal.open({
                        templateUrl: 'app/components/cursos_oficiales/inscripciones-pagos/modal-captura-num-factura.html',
                        windowClass: "animated fadeIn",
                        controller: 'ModalCapturaNumFacturaController as vm',
                        resolve: {
                          registroEditar: function () { return {nombreCurso: vm.cursoSeleccionado.nombreCurso ,seleccion: seleccion} }
                        }

                    });

                    modalInstance.result.then(function (respuesta) {
                        
                            var index = vm.cursoSeleccionado.inscripcionesCursos.map(function(instructor) {
                                                                return instructor.id;
                                                              }).indexOf(respuesta.id);

                            vm.cursoSeleccionado.inscripcionesCursos[index].pagado = respuesta.pagado;
                            vm.cursoSeleccionado.inscripcionesCursos[index].numFactura = respuesta.numFactura;

                    }, function () {
                    });

            }



            function eliminaInscrito(seleccion) {

                  swal({
                    title: "Confirmar",
                    html: 'La persona <strong>'+ seleccion.Capacitandos.apellidoPaterno + ' ' + seleccion.Capacitandos.apellidoMaterno + ' ' + seleccion.Capacitandos.nombre +'</strong> se eliminar&aacute; de la lista de inscripci&oacute;n, ¿Continuar?',
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#9a0000",
                    confirmButtonText: "Aceptar",
                    cancelButtonText: "Cancelar",
                    closeOnConfirm: false,
                    closeOnCancel: true
                  }, function(){
                          
                            swal.disableButtons();

                            InscripcionCurso
                              .deleteById({ id: seleccion.id })
                              .$promise
                              .then(function() {
                                var index = vm.cursoSeleccionado.inscripcionesCursos.indexOf(seleccion);
                                /*index = vm.listaInstructores.map(function(instructor) {
                                                                    return instructor.idInstructor;
                                                                  }).indexOf(record.idInstructor);*/

                                if(index >= 0)
                                    vm.cursoSeleccionado.inscripcionesCursos.splice(index, 1);

                                swal('Capacitando eliminado', '', 'success');

                                /* cuando se elimina una persona checar si modifica el estatus del curso ya que baja el numero de inscritos pgados*/
                                CursosOficiales.findById({ 
                                    id: seleccion.idCurso,
                                    filter: {
                                      fields : ['idCurso','minRequeridoPago'],
                                      include: [
                                          {
                                              relation: 'inscripcionesCursos',
                                              scope: {
                                                  fields:['id','pagado','idAlumno']
                                              }
                                          }
                                      ]
                                    }
                                })
                                .$promise
                                .then(function(curso) {

                                      var num_pagados = 0;
                                      angular.forEach(curso.inscripcionesCursos, function(registro) {
                                          if(registro.pagado > 0)
                                            num_pagados++;
                                      });

                                      if(num_pagados < curso.minRequeridoPago)
                                      {
                                            CursosOficiales.prototype$updateAttributes(
                                            {
                                                id: seleccion.idCurso
                                            },{
                                                estatus: 2
                                            })
                                            .$promise
                                            .then(function(respuesta) {

                                                  vm.cursoSeleccionado.estatus = respuesta.estatus;

                                                  ControlProcesos
                                                  .create({
                                                      proceso         : 'Inscripcion a curso',
                                                      accion          : 'REVERSION MINIMO PAGADOS',
                                                      idDocumento     : curso.idCurso,
                                                      idUsuario       : $scope.currentUser.id_usuario,
                                                      idUnidadAdmtva  : $scope.currentUser.unidad_pertenece_id
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

                                                        });
                                                  });

                                            });
                                      }

                                });

                            });
                  });

            }


            function agregaNombreCompleto() {
                  
                  angular.forEach(vm.listaCursos, function(curso) {

                        if(curso.inscripcionesCursos !== undefined)
                        {
                            for(var i=0; i < curso.inscripcionesCursos.length; i++)
                            {
                                curso.inscripcionesCursos[i].Capacitandos.nombreCompleto = curso.inscripcionesCursos[i].Capacitandos.apellidoPaterno + ' ' + curso.inscripcionesCursos[i].Capacitandos.apellidoMaterno + ' ' + curso.inscripcionesCursos[i].Capacitandos.nombre;
                            }                    
                        }

                  });
            }


            function formateaListado() {
                  
                  var hoy = new Date();
                  hoy.setHours(0);
                  hoy.setMinutes(0);
                  hoy.setSeconds(0);
                  hoy.setMilliseconds(0);

                  for(var i=0; i < vm.listaCursos.length; i++)
                  {
                      var fecha_inicio = new Date(vm.listaCursos[i].fechaInicio);

                      fecha_inicio.setHours(0);
                      fecha_inicio.setMinutes(0);
                      fecha_inicio.setSeconds(0);
                      fecha_inicio.setMilliseconds(0);

                      var dif = fecha_inicio - hoy;
                      var num_dias_falta = Math.floor(dif / (1000 * 60 * 60 * 24)); 

                      vm.listaCursos[i].diasDif = num_dias_falta;
                  }
            }


    };

})();