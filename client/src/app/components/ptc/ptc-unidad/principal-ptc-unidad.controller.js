(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('PrincipalPTCUnidadController', PrincipalPTCUnidadController);

    PrincipalPTCUnidadController.$inject = ['$scope', '$http', '$modal', '$q', 'tablaDatosService', 'HorasAsignadasUnidad', 'ProgTrimCursos', 'CursosPtc', 'ControlProcesos', 'Usuario'];

    function PrincipalPTCUnidadController($scope, $http, $modal, $q, tablaDatosService, HorasAsignadasUnidad, ProgTrimCursos, CursosPtc, ControlProcesos, Usuario) {

            var vm = this;

            /****** DEFINICION DE FUNCIONES DE LA TABLA PRINCIPAL ******/
            vm.muestra_ptc_anio       = muestra_ptc_anio;
            
            vm.muestraCursosPTCActual = muestraCursosPTCActual;
            //vm.cambiarPaginaPrincipal = cambiarPaginaPrincipal;
            vm.cambiarPaginaDetalle   = cambiarPaginaDetalle;
            
            vm.abreDocPTC      = abreDocPTC;
            vm.editaPTC        = editaPTC;
            vm.nuevoPTC        = nuevoPTC;
            vm.eliminaPTC      = eliminaPTC;
            vm.enviaRevisionPTC  = enviaRevisionPTC;

            vm.editaCursoPTC   = editaCursoPTC;
            vm.nuevoCursoPTC   = nuevoCursoPTC;
            vm.eliminaCursoPTC = eliminaCursoPTC;


            vm.listaAniosDisp = [];
            vm.anioSeleccionado = {};
            vm.horas_disponibles = 0;

            /****** ELEMENTOS DE LA TABLA PRINCIPAL ******/
            vm.tablaListaPTCs = {
              totalElementos     : 0,
              paginaActual       : 1,
              registrosPorPagina : 5,
              inicio             : 0,
              fin                : 1,
              condicion          : {},
              filtro_datos       : {},
              fila_seleccionada  : 0
            };

            vm.tablaListaPTCs.fila_seleccionada = undefined;
            vm.registrosPTCs = {};
            vm.RegistroPTCSeleccionado = {};

            /****** ELEMENTOS DE LA TABLA DE CURSOS ******/

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

            vm.registrosCursosPTCs = [];


            inicia();
            

            function inicia() {


                  vm.tablaListaPTCs.filtro_datos = {
                          filter: {
                              where: vm.tablaListaPTCs.condicion,
                              order: ['idUnidadAdmtva ASC', 'anio DESC', 'trimestre DESC'],
                              limit: vm.tablaListaPTCs.registrosPorPagina,
                              skip: vm.tablaListaPTCs.paginaActual - 1,
                              include: [
                                'unidad_pertenece',
                                {
                                    relation: 'cursos_programados',
                                    scope: {
                                      fields: ['idCursoPTC']
                                    }
                                },
                              ]
                          }
                  };

                  vm.tablaListaCursos.filtro_datos = {
                          filter: {
                              where: vm.tablaListaCursos.condicion,
                              order: ['fechaInicio ASC'],
                              limit: vm.tablaListaCursos.registrosPorPagina,
                              skip: vm.tablaListaCursos.paginaActual - 1,
                              include: [
                                  {
                                      relation: 'detalle_curso',
                                      scope: {
                                        fields: ['nombreCurso','modalidad']
                                      }
                                  },
                                  {
                                      relation: 'instructores_propuestos',
                                      scope: {
                                        fields: ['idInstructor','apellidoPaterno','apellidoMaterno','nombre'],
                                        order: ['apellidoPaterno ASC','apellidoMaterno ASC','nombre ASC']
                                      }
                                  }
                              ]
                          }
                  };

                  var fechaHoy = new Date();

                  HorasAsignadasUnidad.find({
                      filter: {
                          where: {
                            and: [
                              {idUnidadAdmtva: $scope.currentUser.unidad_pertenece_id},
                              {anio:{gte: fechaHoy.getFullYear()}}
                            ]
                          },
                          fields: ['id','anio','horasAsignadas'],
                          order: 'anio DESC'
                      }
                  })
                  .$promise
                  .then(function(resp) {
                        if(resp.length > 0)
                        {
                            vm.listaAniosDisp = resp;
                            vm.anioSeleccionado = vm.listaAniosDisp[0];

                            vm.muestra_ptc_anio();                          
                        }

                  });

            }




            /*function cambiarPaginaPrincipal() {

                  if(vm.tablaListaPTCs.totalElementos > 0)
                  {
                        tablaDatosService.cambia_pagina(ProgTrimCursos, vm.tablaListaPTCs)
                        .then(function(respuesta) {

                            vm.tablaListaPTCs.inicio = respuesta.inicio;
                            vm.tablaListaPTCs.fin = respuesta.fin;

                            vm.registrosPTCs = respuesta.datos;
                            vm.RegistroPTCSeleccionado = vm.registrosPTCs[0];
                            vm.client = 2;
                            vm.tablaListaPTCs.fila_seleccionada = 0;
                            muestraCursosPTCActual(vm.RegistroPTCSeleccionado);
                        });
                  }
            }*/



            function cambiarPaginaDetalle() {

                  if(vm.tablaListaCursos.totalElementos > 0)
                  {
                        tablaDatosService.cambia_pagina(CursosPtc, vm.tablaListaCursos)
                        .then(function(respuesta) {

                            vm.tablaListaCursos.inicio = respuesta.inicio;
                            vm.tablaListaCursos.fin = respuesta.fin;

                            vm.registrosCursosPTCs = respuesta.datos;
                        });
                  }
            }



            function muestraCursosPTCActual(seleccion) {

                  var index = vm.registrosPTCs.indexOf(seleccion);
                  vm.RegistroPTCSeleccionado = seleccion;
                  vm.tablaListaPTCs.fila_seleccionada = index;

                  vm.client = 1;
                  vm.tablaListaCursos.paginaActual = 1;
                  vm.tablaListaCursos.inicio = 0;
                  vm.tablaListaCursos.fin = 1;
                  vm.tablaListaCursos.condicion = {idPtc: seleccion.idPtc};

                  vm.registrosCursosPTCs = [];
                  tablaDatosService.obtiene_datos_tabla(CursosPtc, vm.tablaListaCursos)
                  .then(function(respuesta) {

                        vm.tablaListaCursos.totalElementos = respuesta.total_registros;
                        vm.tablaListaCursos.inicio = respuesta.inicio;
                        vm.tablaListaCursos.fin = respuesta.fin;

                        if(vm.tablaListaCursos.totalElementos > 0)
                        {
                            vm.client = 2;
                            vm.registrosCursosPTCs = respuesta.datos;
                        }
                  });

            };




            function muestra_ptc_anio() {

                  vm.registrosPTCs = {};
                  vm.RegistroPTCSeleccionado = {};
                  vm.tablaListaPTCs.fila_seleccionada = undefined;
                  vm.client = 1;
                  vm.tablaListaPTCs.paginaActual = 1;
                  vm.tablaListaPTCs.inicio = 0;
                  vm.tablaListaPTCs.fin = 1;

                  vm.tablaListaPTCs.condicion = {
                      and: [
                        {anio: vm.anioSeleccionado.anio},
                        {idUnidadAdmtva: $scope.currentUser.unidad_pertenece_id},
                        {
                            or: [
                              {estatus: 0},
                              {estatus: 1},
                              {estatus: 3}
                            ]
                        },
                      ]
                  };

                  tablaDatosService.obtiene_datos_tabla(ProgTrimCursos, vm.tablaListaPTCs)
                  .then(function(respuesta) {

                        vm.tablaListaPTCs.totalElementos = respuesta.total_registros;
                        vm.tablaListaPTCs.inicio = respuesta.inicio;
                        vm.tablaListaPTCs.fin = respuesta.fin;

                        if(vm.tablaListaPTCs.totalElementos > 0)
                        {
                            vm.registrosPTCs = respuesta.datos;
                            vm.RegistroPTCSeleccionado = vm.registrosPTCs[0];
                            vm.client = 2;
                            vm.tablaListaPTCs.fila_seleccionada = 0;
                            muestraCursosPTCActual(vm.RegistroPTCSeleccionado);
                        }

                        calcula_horas_disponibles();
                  });
            };




/************ SECCION DE EDICION *****************/

            function abreDocPTC(seleccion) {

                    Usuario.prototype$__get__accessTokens({ 
                        id: $scope.currentUser.id_usuario
                    })
                    .$promise
                    .then(function(resp) {
                        var link = angular.element('<a href="api/ProgTrimCursos/exporta_doc_ptc/'+seleccion.idPtc+'?access_token='+resp[0].id+'" target="_blank"></a>');
                        angular.element(document.body).append(link);
                        link[0].click();
                        link.remove();
                    });
            };


            function editaPTC(seleccion) {

                    var modalInstance = $modal.open({
                        templateUrl: 'app/components/ptc/ptc-unidad/modal-edita-ptc.html',
                        windowClass: "animated fadeIn",
                        controller: 'ModalEditaPTCController as vm',
                        resolve: {
                          registroEditar: function () { return seleccion }
                        }

                    });

                    modalInstance.result.then(function (respuesta) {
                        vm.RegistroPTCSeleccionado.anio      = respuesta.anio;
                        vm.RegistroPTCSeleccionado.trimestre = parseInt(respuesta.trimestre);
                        vm.RegistroPTCSeleccionado.estatus = respuesta.estatus;
                        vm.RegistroPTCSeleccionado.fechaModificacion = respuesta.fechaModificacion;
                    }, function () {
                    });
            };


            function nuevoPTC() {

                    var modalInstance = $modal.open({
                        templateUrl: 'app/components/ptc/ptc-unidad/modal-edita-ptc.html',
                        windowClass: "animated fadeIn",
                        controller: 'ModalNuevoPTCController as vm'
                    });

                    modalInstance.result.then(function () {

                        vm.tablaListaPTCs.paginaActual = 1;
                        vm.tablaListaPTCs.inicio = 0;
                        vm.tablaListaPTCs.fin = 1;
                        vm.tablaListaPTCs.fila_seleccionada = 0;

                        inicia();
                    }, function () {
                    });
            };


            function eliminaPTC(RegistroSeleccionado) {

                  var trimestres = ['PRIMERO','SEGUNDO','TERCERO','CUARTO'];
                  swal({
                    title: "Confirmar",
                    html: 'Se eliminar&aacute; el PTC del Trimestre <strong>'+ trimestres[(RegistroSeleccionado.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ RegistroSeleccionado.anio +'</strong>, ¿Continuar?',
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#9a0000",
                    confirmButtonText: "Aceptar",
                    cancelButtonText: "Cancelar",
                    closeOnConfirm: false,
                    closeOnCancel: true
                  }, function(){
                          swal.disableButtons();

                            function borra_instructores_cursos(registrosCursosPTCs) {

                                var deferred = $q.defer();
                                var total_cursos = registrosCursosPTCs.length;
                                var indice = 0;
                                
                                if(total_cursos == 0)
                                  deferred.resolve();

                                angular.forEach(registrosCursosPTCs, function(curso) {

                                    CursosPtc.instructores_propuestos.destroyAll({ id: curso.idCursoPTC })
                                    .$promise
                                    .then(function() {
                                        indice++;
                                        if(indice == total_cursos)
                                          deferred.resolve();
                                    });

                                });
                                return deferred.promise;
                            }

                            var promise = borra_instructores_cursos(vm.registrosCursosPTCs);
                            
                            promise.then(function() {
    
                                ProgTrimCursos.cursos_programados.destroyAll({ id: RegistroSeleccionado.idPtc })
                                  .$promise
                                  .then(function() { 

                                        ProgTrimCursos.deleteById({ id: RegistroSeleccionado.idPtc })
                                        .$promise
                                        .then(function() { 
                                              vm.tablaListaPTCs.paginaActual = 1;
                                              vm.tablaListaPTCs.inicio = 0;
                                              vm.tablaListaPTCs.fin = 1;
                                              vm.tablaListaPTCs.fila_seleccionada = 0;

                                              inicia();
                                              swal('PTC eliminado', '', 'success');
                                        });

                                });

                            });

                  });

            };


            function enviaRevisionPTC(RegistroSeleccionado) {

                  CursosPtc.find({
                    filter: {
                        where: {idPtc: vm.RegistroPTCSeleccionado.idPtc},
                        fields: ['idCursoPTC','idCatalogoCurso'],
                        order: ['fechaInicio ASC'],
                        include: [
                            {
                                relation: 'detalle_curso',
                                scope: {
                                  fields: ['nombreCurso']
                                }
                            },
                            {
                                relation: 'instructores_propuestos',
                                scope: {
                                  fields: ['idInstructor']
                                }
                            }
                        ]
                    }
                  })
                  .$promise
                  .then(function(listaCursos) {

                        var faltaInstructores = false;
                        var i = 0;

                        for (i = 0; i < listaCursos.length; i++) {
                          if (listaCursos[i].instructores_propuestos.length == 0) {
                            faltaInstructores = true;
                            break;
                          }
                        }
                        
                        if(faltaInstructores == true)
                        {
                              swal({
                                title: 'Datos incompletos',
                                html: 'El curso <strong>'+listaCursos[i].detalle_curso.nombreCurso+'</strong> no tiene instructores propuestos',
                                type: 'warning',
                                showCancelButton: false,
                                confirmButtonColor: "#9a0000",
                                confirmButtonText: "Aceptar"
                              });
                        }
                        else
                        {
                              var trimestres = ['PRIMERO','SEGUNDO','TERCERO','CUARTO'];
                              swal({
                                title: "Confirmar",
                                html: 'El PTC del Trimestre <strong>'+ trimestres[(RegistroSeleccionado.trimestre-1)] +'</strong> del a&ntilde;o <strong>'+ RegistroSeleccionado.anio +'</strong> ser&aacute; enviado a su revisi&oacute;n, ¿Continuar?',
                                type: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#9a0000",
                                confirmButtonText: "Aceptar",
                                cancelButtonText: "Cancelar",
                                closeOnConfirm: false,
                                closeOnCancel: true
                              }, function(){
                                      swal.disableButtons();

                                        ProgTrimCursos.prototype$updateAttributes(
                                        {
                                            id: RegistroSeleccionado.idPtc
                                        },{
                                            estatus: 1,
                                            fechaEnvioRevision: Date()
                                        })
                                        .$promise
                                        .then(function(respuesta) {

                                              vm.RegistroPTCSeleccionado.estatus            = respuesta.estatus;
                                              vm.RegistroPTCSeleccionado.fechaEnvioRevision = respuesta.fechaEnvioRevision;

                                              ControlProcesos
                                              .create({
                                                  proceso              : 'PTC',
                                                  accion               : 'ENVIO REVISION PTC',
                                                  idDocumento          : RegistroSeleccionado.idPtc,
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
                                                            title: 'PTC enviado',
                                                            html: 'se env&iacute;o el PTC a revisi&oacute;n y se gener&oacute; el identificador del proceso <br><strong style="font-size: 13px;">' + resp_control.identificador + '</strong>',
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

                  });

            };




/************* FUNCIONES DE EDICION DE LOS CURSOS DEL PTC *******************/

            function editaCursoPTC(seleccion) {

                    var modalInstance = $modal.open({
                        templateUrl: 'app/components/ptc/ptc-unidad/modal-edita-curso-ptc.html',
                        windowClass: "animated fadeIn",
                        controller: 'ModalEditaCursoPTCController as vm',
                        windowClass: 'app-modal-window',
                        resolve: {
                          registroEditar: function () { return {horas_disponibles: vm.horas_disponibles, horas_usadas: vm.RegistroPTCSeleccionado.horasSeparadas, recordPTC: seleccion} }
                        }

                    });

                    modalInstance.result.then(function (respuesta) {
                        seleccion.idCatalogoCurso           = respuesta.idCatalogoCurso;
                        seleccion.detalle_curso.nombreCurso = respuesta.nombreCurso;
                        seleccion.detalle_curso.modalidad   = respuesta.modalidad;
                        seleccion.horario                   = respuesta.horario;
                        seleccion.aulaAsignada              = respuesta.aulaAsignada;
                        seleccion.capacitandos              = respuesta.capacitandos;
                        seleccion.semanas                   = respuesta.semanas;
                        seleccion.total                     = respuesta.total;
                        seleccion.fechaInicio               = respuesta.fechaInicio;
                        seleccion.fechaFin                  = respuesta.fechaFin;
                        seleccion.observaciones             = respuesta.observaciones;
                        
                        vm.RegistroPTCSeleccionado.estatus           = respuesta.estatusPTC;
                        vm.RegistroPTCSeleccionado.horasSeparadas    = respuesta.horasSeparadas;
                        vm.RegistroPTCSeleccionado.fechaModificacion = respuesta.fechaModificacionPTC;

                        calcula_horas_disponibles();

                        seleccion.instructores_propuestos = [];

                        angular.forEach(respuesta.instructores_propuestos, function(record) {
                            seleccion.instructores_propuestos.push({
                                idInstructor    : record.idInstructor,
                                apellidoPaterno : record.apellidoPaterno,
                                apellidoMaterno : record.apellidoMaterno,
                                nombre          : record.nombre
                            });
                        });

                    }, function () {
                    });
            };



            function nuevoCursoPTC() {

                    var modalInstance = $modal.open({
                        templateUrl: 'app/components/ptc/ptc-unidad/modal-edita-curso-ptc.html',
                        windowClass: "animated fadeIn",
                        controller: 'ModalNuevoCursoPTCController as vm',
                        windowClass: 'app-modal-window',
                        resolve: {
                          registroEditar: function () { return {horas_disponibles: vm.horas_disponibles, horas_usadas: vm.RegistroPTCSeleccionado.horasSeparadas, recordPTC: vm.RegistroPTCSeleccionado} }
                        }
                    });

                    modalInstance.result.then(function (respuesta1) {

                        vm.RegistroPTCSeleccionado.estatus           = respuesta1.estatusPTC;
                        vm.RegistroPTCSeleccionado.horasSeparadas    = respuesta1.horasSeparadas;
                        vm.RegistroPTCSeleccionado.fechaModificacion = respuesta1.fechaModificacionPTC;

                        vm.RegistroPTCSeleccionado.cursos_programados.push({
                            idCursoPTC : respuesta1.idCursoPTC,
                            idPtc   : vm.RegistroPTCSeleccionado.idPtc
                        });

                        calcula_horas_disponibles();

                        muestraCursosPTCActual(vm.RegistroPTCSeleccionado);

                    }, function () {
                    });
            };


            function eliminaCursoPTC(seleccion) {

                  swal({
                    title: "Confirmar",
                    html: 'Se eliminar&aacute; el curso <strong>'+ seleccion.detalle_curso.nombreCurso +'</strong> de la lista de cursos del PTC seleccionado, ¿Continuar?',
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#9a0000",
                    confirmButtonText: "Aceptar",
                    cancelButtonText: "Cancelar",
                    closeOnConfirm: false,
                    closeOnCancel: true
                  }, function(){
                          swal.disableButtons();

                            CursosPtc.instructores_propuestos.destroyAll({ id: seleccion.idCursoPTC })
                              .$promise
                              .then(function() { 

                                    CursosPtc.deleteById({ id: seleccion.idCursoPTC })
                                    .$promise
                                    .then(function() {

                                          var index = vm.RegistroPTCSeleccionado.cursos_programados.map(function(curso) {
                                                                              return curso.idCursoPTC;
                                                                            }).indexOf(seleccion.idCursoPTC);

                                          if(index >= 0)
                                            vm.RegistroPTCSeleccionado.cursos_programados.splice(index, 1);


                                          CursosPtc.find({
                                            filter: {
                                                where: {idPtc: vm.RegistroPTCSeleccionado.idPtc},
                                                fields: ['total']
                                            }
                                          })
                                          .$promise
                                          .then(function(resp) {

                                                  var total_horas_separadas = 0;
                                                  angular.forEach(resp, function(record) {
                                                          total_horas_separadas += record.total;
                                                  });

                                                  ProgTrimCursos.prototype$updateAttributes(
                                                  {
                                                      id: vm.RegistroPTCSeleccionado.idPtc
                                                  },{
                                                      estatus: 0,
                                                      horasSeparadas :total_horas_separadas,
                                                      fechaModificacion : Date()
                                                  })
                                                  .$promise
                                                  .then(function(respuesta) {

                                                          vm.RegistroPTCSeleccionado.estatusPTC = respuesta.estatus;
                                                          vm.RegistroPTCSeleccionado.horasSeparadas = respuesta.horasSeparadas;
                                                          vm.RegistroPTCSeleccionado.fechaModificacionPTC = respuesta.fechaModificacion;
                                                          calcula_horas_disponibles();
                                                  });


                                          });


                                          muestraCursosPTCActual(vm.RegistroPTCSeleccionado);

                                          swal('Curso eliminado', '', 'success');

                                    });

                            });

                  });

            };


            function calcula_horas_disponibles() {

                  ProgTrimCursos.find({
                      filter: {
                          where: {
                            and: [
                                {idUnidadAdmtva: $scope.currentUser.unidad_pertenece_id},
                                {anio: vm.anioSeleccionado.anio},
                                {or: [
                                  {estatus: 2},
                                  {estatus: 4}
                                ]}
                            ]
                          },
                          fields: ['idPtc','horasSeparadas','estatus']
                      }
                  })
                  .$promise
                  .then(function(resp) {

                      var num_horas_separadas = 0;
                      angular.forEach(resp, function(registro) {
                          num_horas_separadas += registro.horasSeparadas;
                      });
                      
                      vm.horas_disponibles = vm.anioSeleccionado.horasAsignadas - num_horas_separadas;

                  });

            }


    };

})();