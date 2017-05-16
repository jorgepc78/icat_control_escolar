(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('PTCAutorizadosController', PTCAutorizadosController);

    PTCAutorizadosController.$inject = ['$scope', '$modal', '$q', 'tablaDatosService', 'HorasAsignadasUnidad', 'ProgTrimCursos', 'CursosPtc', 'CursosOficiales', 'CatalogoUnidadesAdmtvas', 'ControlProcesos', 'Usuario'];

    function PTCAutorizadosController($scope, $modal, $q, tablaDatosService, HorasAsignadasUnidad, ProgTrimCursos, CursosPtc, CursosOficiales, CatalogoUnidadesAdmtvas, ControlProcesos, Usuario) {

            var vm = this;

            /****** DEFINICION DE FUNCIONES DE LA TABLA PRINCIPAL ******/
            vm.muestra_ptc_unidad      = muestra_ptc_unidad;
            vm.muestra_ptc_unidad_anio = muestra_ptc_unidad_anio;
            
            vm.muestraCursosPTCActual  = muestraCursosPTCActual;
            vm.cambiarPaginaPrincipal  = cambiarPaginaPrincipal;
            vm.cambiarPaginaDetalle    = cambiarPaginaDetalle;
            
            vm.muestraCursoPreapertura = muestraCursoPreapertura;
            vm.abreDocPTC              = abreDocPTC;


            /****** ELEMENTOS DE LA TABLA PRINCIPAL ******/
            vm.tablaListaPTCs = {
              totalElementos     : 0,
              paginaActual       : 1,
              registrosPorPagina : 5,
              inicio             : 0,
              fin                : 1,
              condicion          : {or:[{estatus:2},{estatus:4}]},
              filtro_datos       : {},
              fila_seleccionada  : 0
            };

            vm.tablaListaPTCs.fila_seleccionada = undefined;
            vm.registrosPTCs = {};
            vm.RegistroPTCSeleccionado = {};

            vm.listaAniosDisp = [];
            vm.anioSeleccionado = [];

            vm.listaUnidades = [];
            vm.unidadSeleccionada = undefined;

            /****** ELEMENTOS DE LA TABLA DE CURSOS PROGRAMADOS EN EL PTC******/

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

            vm.registrosCursosPTCs = {};
            vm.icono = '';

            /****** ELEMENTOS DE LA TABLA DE CURSOS PROGRAMADOS EN EL PTC******/

            vm.tablaListaCursosExtra = {
              totalElementos     : 0,
              paginaActual       : 1,
              registrosPorPagina : 5,
              inicio             : 0,
              fin                : 1,
              condicion          : {},
              filtro_datos       : {},
              fila_seleccionada  : 0
            };

            vm.registrosCursosExtras = {};


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
                                {
                                    relation: 'cursos_no_programados',
                                    scope: {
                                      where: {programadoPTC: false},
                                      fields: ['idCurso']
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
                                        fields: ['apellidoPaterno','apellidoMaterno','nombre'],
                                        order: ['apellidoPaterno ASC','apellidoMaterno ASC','nombre ASC']
                                      }
                                  },
                                  {
                                      relation: 'curso_oficial_registrado',
                                      scope: {
                                        where: {estatus: {gt:0}},
                                        fields: ['idCurso','idLocalidad','nombreCurso','claveCurso','modalidad','horario','aulaAsignada','numeroHoras','costo','cupoMaximo','minRequeridoInscritos','minRequeridoPago','fechaInicio','fechaFin','nombreInstructor','observaciones','estatus','publico']
                                      }
                                  }
                              ]
                          }
                  };

                  vm.tablaListaCursosExtra.filtro_datos = {
                          filter: {
                              where: vm.tablaListaCursosExtra.condicion,
                              order: ['nombreCurso ASC'],
                              limit: vm.tablaListaCursosExtra.registrosPorPagina,
                              skip: vm.tablaListaCursosExtra.paginaActual - 1,
                              fields: ['idCurso','idLocalidad','nombreCurso','claveCurso','modalidad','horario','aulaAsignada','numeroHoras','costo','cupoMaximo','minRequeridoInscritos','minRequeridoPago','fechaInicio','fechaFin','nombreInstructor','observaciones','estatus','publico']
                          }
                  };


                  if($scope.currentUser.unidad_pertenece_id > 1) {

                        vm.unidadSeleccionada = {
                            idUnidadAdmtva  : $scope.currentUser.unidad_pertenece_id,
                            nombre          : $scope.currentUser.nombre_unidad
                        };

                        vm.tablaListaPTCs.condicion = {
                            and: [
                              {or:[{estatus:2},{estatus:4}]},
                              {idUnidadAdmtva: $scope.currentUser.unidad_pertenece_id}
                            ]
                        };
                        
                        vm.muestra_ptc_unidad();
                  }
                  else
                  {
                        vm.tablaListaPTCs.condicion = {
                            or: [
                              {estatus: 2},
                              {estatus: 4}
                            ]
                        };

                        CatalogoUnidadesAdmtvas.find({
                            filter: {
                                where: {idUnidadAdmtva: {gt: 1}},
                                order: 'nombre ASC'
                            }
                        })
                        .$promise
                        .then(function(resp) {
                            vm.listaUnidades = resp;
                        });
                  }

            };


            function muestra_ptc_unidad() {

                  vm.registrosPTCs = {};
                  vm.RegistroPTCSeleccionado = {};
                  vm.tablaListaPTCs.fila_seleccionada = undefined;
                  vm.client = 1;
                  vm.tablaListaPTCs.paginaActual = 1;
                  vm.tablaListaPTCs.inicio = 0;
                  vm.tablaListaPTCs.fin = 1;

                  vm.registrosCursosPTCs = {};
                  vm.tablaListaCursos.totalElementos = 0;
                  vm.tablaListaCursos.paginaActual = 1;
                  vm.tablaListaCursos.inicio = -1;
                  vm.tablaListaCursos.fin = 0;

                  vm.anioSeleccionado = [];
                  vm.listaAniosDisp = [];

                  var fechaHoy = new Date();
                  
                  HorasAsignadasUnidad.find({
                      filter: {
                          where: {
                            and: [
                              {idUnidadAdmtva: vm.unidadSeleccionada.idUnidadAdmtva},
                              {anio:{gte: fechaHoy.getFullYear()}}
                            ]
                          },
                          fields: ['id','anio','horasAsignadas'],
                          order: 'anio DESC'
                      }
                  })
                  .$promise
                  .then(function(resp) {

                        vm.listaAniosDisp = resp;
                        
                        if(vm.listaAniosDisp.length > 0)
                        {
                              vm.anioSeleccionado = vm.listaAniosDisp[0];

                              vm.tablaListaPTCs.condicion = {
                                  and: [
                                    {anio: vm.anioSeleccionado.anio},
                                    {idUnidadAdmtva: vm.unidadSeleccionada.idUnidadAdmtva},
                                    {
                                        or: [
                                          {estatus: 2},
                                          {estatus: 4}
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

                              });                          
                        }
                        else
                        {
                              vm.tablaListaPTCs.totalElementos = 0;
                              vm.tablaListaPTCs.inicio = -1;
                              vm.tablaListaPTCs.fin = 0;
                        }

                  });

            };


            function muestra_ptc_unidad_anio() {

                  vm.registrosPTCs = {};
                  vm.RegistroPTCSeleccionado = {};
                  vm.tablaListaPTCs.fila_seleccionada = undefined;
                  vm.client = 1;
                  vm.tablaListaPTCs.paginaActual = 1;
                  vm.tablaListaPTCs.inicio = 0;
                  vm.tablaListaPTCs.fin = 1;

                  vm.registrosCursosPTCs = {};
                  vm.tablaListaCursos.totalElementos = 0;
                  vm.tablaListaCursos.paginaActual = 1;
                  vm.tablaListaCursos.inicio = -1;
                  vm.tablaListaCursos.fin = 0;

                  vm.tablaListaPTCs.condicion = {
                      and: [
                        {anio: vm.anioSeleccionado.anio},
                        {idUnidadAdmtva: vm.unidadSeleccionada.idUnidadAdmtva},
                        {
                            or: [
                              {estatus: 2},
                              {estatus: 4}
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

                  });

            };



            function cambiarPaginaPrincipal() {

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
            }



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
                            vm.icono = '';

                            vm.registrosCursosPTCs = respuesta.datos;
                            
                            /*angular.forEach(respuesta.datos, function(registro) {
                                  vm.registrosCursosPTCs.push({
                                      idCursoPTC              : registro.idCursoPTC,
                                      detalle_curso           : registro.detalle_curso,
                                      horario                 : registro.horario,
                                      aulaAsignada            : registro.aulaAsignada,
                                      capacitandos            : registro.capacitandos,
                                      semanas                 : registro.semanas,
                                      total                   : registro.total,
                                      fechaInicio             : registro.fechaInicio,
                                      fechaFin                :registro.fechaFin,
                                      instructores_propuestos : registro.instructores_propuestos,
                                      observaciones           : registro.observaciones,
                                      showChild               : false,
                                      curso_oficial_registrado: registro.curso_oficial_registrado
                                  });
                            });*/

                        }
                  });

                  vm.tablaListaCursosExtra.condicion = {
                    and: [
                      {idPtc: seleccion.idPtc},
                      {programadoPTC: false},
                      {estatus: {gt:0}}
                    ]
                  };

                  vm.registrosCursosExtras = [];
                  tablaDatosService.obtiene_datos_tabla(CursosOficiales, vm.tablaListaCursosExtra)
                  .then(function(respuesta) {

                        vm.tablaListaCursosExtra.totalElementos = respuesta.total_registros;
                        vm.tablaListaCursosExtra.inicio = respuesta.inicio;
                        vm.tablaListaCursosExtra.fin = respuesta.fin;

                        if(vm.tablaListaCursosExtra.totalElementos > 0)
                        {
                            vm.registrosCursosExtras = respuesta.datos;
                        }
                  });

            };


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


            function muestraCursoPreapertura(registro) {
                registro.showChild =! registro.showChild
                if(registro.showChild == true)
                  vm.icono = '-slash';
                else
                  vm.icono = '';
            }





    };

})();