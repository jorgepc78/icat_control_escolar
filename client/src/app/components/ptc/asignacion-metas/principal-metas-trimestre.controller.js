(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('PrincipalMetasTrimestreController', PrincipalMetasTrimestreController);

    PrincipalMetasTrimestreController.$inject = ['$modal', 'tablaDatosService', 'CatalogoUnidadesAdmtvas', 'MetasCapacUnidad', 'ProgTrimCursos'];

    function PrincipalMetasTrimestreController($modal, tablaDatosService, CatalogoUnidadesAdmtvas, MetasCapacUnidad, ProgTrimCursos ) {

            var vm = this;
            vm.muestraDatosRegistroActual = muestraDatosRegistroActual;
            vm.cambiarPagina              = cambiarPagina;
            vm.nuevo_registro             = nuevo_registro;
            vm.edita_datos_registro       = edita_datos_registro;
            vm.elimina_registro           = elimina_registro;

            vm.indexUltimo = 0;
            vm.registros = [];
            vm.RegistroSeleccionado = [];
            vm.historial = [];

            vm.tablaListaRegistros = {
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

                  vm.tablaListaRegistros.condicion = {
                      idUnidadAdmtva: {gt: 1}
                  };

                  vm.tablaListaRegistros.filtro_datos = {
                          filter: {
                              where: vm.tablaListaRegistros.condicion,
                              order: ['nombre ASC'],
                              limit: vm.tablaListaRegistros.registrosPorPagina,
                              skip: vm.tablaListaRegistros.paginaActual - 1,
                              include: [
                                {
                                    relation: 'metas_asignadas',
                                    scope: {
                                      order: ['anio DESC']
                                    }
                                }
                              ]
                          }
                  };

                  vm.registros = {};
                  vm.RegistroSeleccionado = {};
                  vm.tablaListaRegistros.fila_seleccionada = undefined;

                  tablaDatosService.obtiene_datos_tabla(CatalogoUnidadesAdmtvas, vm.tablaListaRegistros)
                  .then(function(respuesta) {

                        vm.tablaListaRegistros.totalElementos = respuesta.total_registros;
                        vm.tablaListaRegistros.inicio = respuesta.inicio;
                        vm.tablaListaRegistros.fin = respuesta.fin;

                        if(vm.tablaListaRegistros.totalElementos > 0)
                        {
                            vm.registros = respuesta.datos;
                            vm.RegistroSeleccionado = vm.registros[0];
                            vm.tablaListaRegistros.fila_seleccionada = 0;
                            muestraDatosRegistroActual(vm.RegistroSeleccionado);
                        }
                  });

            }


            function cambiarPagina() {

                  if(vm.tablaListaRegistros.totalElementos > 0)
                  {
                        tablaDatosService.cambia_pagina(CatalogoUnidadesAdmtvas, vm.tablaListaRegistros)
                        .then(function(respuesta) {

                            vm.tablaListaRegistros.inicio = respuesta.inicio;
                            vm.tablaListaRegistros.fin = respuesta.fin;

                            vm.registros = respuesta.datos;
                            vm.RegistroSeleccionado = vm.registros[0];
                            vm.tablaListaRegistros.fila_seleccionada = 0;
                            muestraDatosRegistroActual(vm.RegistroSeleccionado);
                        });
                  }
            }


            function muestraDatosRegistroActual(seleccion) {

                  var index = vm.registros.indexOf(seleccion);
                  vm.RegistroSeleccionado = seleccion;
                  
                  vm.historial = [];
                  for(var i=0; i < vm.RegistroSeleccionado.metas_asignadas.length; i++ )
                  {
                        vm.RegistroSeleccionado.metas_asignadas[i].regTotalTrim  = vm.RegistroSeleccionado.metas_asignadas[i].reg1Trim + vm.RegistroSeleccionado.metas_asignadas[i].reg2Trim + vm.RegistroSeleccionado.metas_asignadas[i].reg3Trim + vm.RegistroSeleccionado.metas_asignadas[i].reg4Trim;
                        vm.RegistroSeleccionado.metas_asignadas[i].extTotalTrim  = vm.RegistroSeleccionado.metas_asignadas[i].ext1Trim + vm.RegistroSeleccionado.metas_asignadas[i].ext2Trim + vm.RegistroSeleccionado.metas_asignadas[i].ext3Trim + vm.RegistroSeleccionado.metas_asignadas[i].ext4Trim;
                        vm.RegistroSeleccionado.metas_asignadas[i].rocoTotalTrim = vm.RegistroSeleccionado.metas_asignadas[i].roco1Trim + vm.RegistroSeleccionado.metas_asignadas[i].roco2Trim + vm.RegistroSeleccionado.metas_asignadas[i].roco3Trim + vm.RegistroSeleccionado.metas_asignadas[i].roco4Trim;
                        vm.RegistroSeleccionado.metas_asignadas[i].eclTotalTrim  = vm.RegistroSeleccionado.metas_asignadas[i].ecl1Trim + vm.RegistroSeleccionado.metas_asignadas[i].ecl2Trim + vm.RegistroSeleccionado.metas_asignadas[i].ecl3Trim + vm.RegistroSeleccionado.metas_asignadas[i].ecl4Trim;
                        vm.RegistroSeleccionado.metas_asignadas[i].caeTotalTrim  = vm.RegistroSeleccionado.metas_asignadas[i].cae1Trim + vm.RegistroSeleccionado.metas_asignadas[i].cae2Trim + vm.RegistroSeleccionado.metas_asignadas[i].cae3Trim + vm.RegistroSeleccionado.metas_asignadas[i].cae4Trim;

                        if(i > 0)
                        {
                            vm.historial.push({
                                id             : vm.RegistroSeleccionado.metas_asignadas[i].id,
                                idUnidadAdmtva : vm.RegistroSeleccionado.idUnidadAdmtva,
                                anio           : vm.RegistroSeleccionado.metas_asignadas[i].anio,

                                reg1Trim       : vm.RegistroSeleccionado.metas_asignadas[i].reg1Trim,
                                ext1Trim       : vm.RegistroSeleccionado.metas_asignadas[i].ext1Trim,
                                roco1Trim      : vm.RegistroSeleccionado.metas_asignadas[i].roco1Trim,
                                ecl1Trim       : vm.RegistroSeleccionado.metas_asignadas[i].ecl1Trim,
                                cae1Trim       : vm.RegistroSeleccionado.metas_asignadas[i].cae1Trim,

                                reg2Trim       : vm.RegistroSeleccionado.metas_asignadas[i].reg2Trim,
                                ext2Trim       : vm.RegistroSeleccionado.metas_asignadas[i].ext2Trim,
                                roco2Trim      : vm.RegistroSeleccionado.metas_asignadas[i].roco2Trim,
                                ecl2Trim       : vm.RegistroSeleccionado.metas_asignadas[i].ecl2Trim,
                                cae2Trim       : vm.RegistroSeleccionado.metas_asignadas[i].cae2Trim,

                                reg3Trim       : vm.RegistroSeleccionado.metas_asignadas[i].reg3Trim,
                                ext3Trim       : vm.RegistroSeleccionado.metas_asignadas[i].ext3Trim,
                                roco3Trim      : vm.RegistroSeleccionado.metas_asignadas[i].roco3Trim,
                                ecl3Trim       : vm.RegistroSeleccionado.metas_asignadas[i].ecl3Trim,
                                cae3Trim       : vm.RegistroSeleccionado.metas_asignadas[i].cae3Trim,

                                reg4Trim       : vm.RegistroSeleccionado.metas_asignadas[i].reg4Trim,
                                ext4Trim       : vm.RegistroSeleccionado.metas_asignadas[i].ext4Trim,
                                roco4Trim      : vm.RegistroSeleccionado.metas_asignadas[i].roco4Trim,
                                ecl4Trim       : vm.RegistroSeleccionado.metas_asignadas[i].ecl4Trim,
                                cae4Trim       : vm.RegistroSeleccionado.metas_asignadas[i].cae4Trim,

                                regTotalTrim  : vm.RegistroSeleccionado.metas_asignadas[i].regTotalTrim,
                                extTotalTrim  : vm.RegistroSeleccionado.metas_asignadas[i].extTotalTrim,
                                rocoTotalTrim : vm.RegistroSeleccionado.metas_asignadas[i].rocoTotalTrim,
                                eclTotalTrim  : vm.RegistroSeleccionado.metas_asignadas[i].eclTotalTrim,
                                caeTotalTrim  : vm.RegistroSeleccionado.metas_asignadas[i].caeTotalTrim
                            });
                        }
                  }

                  vm.tablaListaRegistros.fila_seleccionada = index;
            };


            function nuevo_registro(seleccion) {

                    var modalInstance = $modal.open({
                        templateUrl: 'app/components/ptc/asignacion-metas/modal-captura-metas-trimestre.html',
                        windowClass: "animated fadeIn",
                        controller: 'ModalCapturaMetasController as vm',
                        size: 'lg',
                        resolve: {
                          registroEditar: function () { return seleccion }
                        }
                    });

                    modalInstance.result.then(function (respuesta) {
                        
                          vm.RegistroSeleccionado.metas_asignadas.unshift({
                              id             : respuesta.id,
                              idUnidadAdmtva : vm.RegistroSeleccionado.idUnidadAdmtva,
                              anio           : respuesta.anio,

                              reg1Trim       : respuesta.reg1Trim,
                              ext1Trim       : respuesta.ext1Trim,
                              roco1Trim      : respuesta.roco1Trim,
                              ecl1Trim       : respuesta.ecl1Trim,
                              cae1Trim       : respuesta.cae1Trim,

                              reg2Trim       : respuesta.reg2Trim,
                              ext2Trim       : respuesta.ext2Trim,
                              roco2Trim      : respuesta.roco2Trim,
                              ecl2Trim       : respuesta.ecl2Trim,
                              cae2Trim       : respuesta.cae2Trim,

                              reg3Trim       : respuesta.reg3Trim,
                              ext3Trim       : respuesta.ext3Trim,
                              roco3Trim      : respuesta.roco3Trim,
                              ecl3Trim       : respuesta.ecl3Trim,
                              cae3Trim       : respuesta.cae3Trim,

                              reg4Trim       : respuesta.reg4Trim,
                              ext4Trim       : respuesta.ext4Trim,
                              roco4Trim      : respuesta.roco4Trim,
                              ecl4Trim       : respuesta.ecl4Trim,
                              cae4Trim       : respuesta.cae4Trim,

                              regTotalTrim  : respuesta.reg1Trim + respuesta.reg2Trim + respuesta.reg3Trim + respuesta.reg4Trim,
                              extTotalTrim  : respuesta.ext1Trim + respuesta.ext2Trim + respuesta.ext3Trim + respuesta.ext4Trim,
                              rocoTotalTrim : respuesta.roco1Trim + respuesta.roco2Trim + respuesta.roco3Trim + respuesta.roco4Trim,
                              eclTotalTrim  : respuesta.ecl1Trim + respuesta.ecl2Trim + respuesta.ecl3Trim + respuesta.ecl4Trim,
                              caeTotalTrim  : respuesta.cae1Trim + respuesta.cae2Trim + respuesta.cae3Trim + respuesta.cae4Trim
                          });
                          vm.historial = [];
                          for(var i=1; i < vm.RegistroSeleccionado.metas_asignadas.length; i++ )
                          {
                                vm.historial.push({
                                    id             : vm.RegistroSeleccionado.metas_asignadas[i].id,
                                    idUnidadAdmtva : vm.RegistroSeleccionado.idUnidadAdmtva,
                                    anio           : vm.RegistroSeleccionado.metas_asignadas[i].anio,

                                    reg1Trim       : vm.RegistroSeleccionado.metas_asignadas[i].reg1Trim,
                                    ext1Trim       : vm.RegistroSeleccionado.metas_asignadas[i].ext1Trim,
                                    roco1Trim      : vm.RegistroSeleccionado.metas_asignadas[i].roco1Trim,
                                    ecl1Trim       : vm.RegistroSeleccionado.metas_asignadas[i].ecl1Trim,
                                    cae1Trim       : vm.RegistroSeleccionado.metas_asignadas[i].cae1Trim,

                                    reg2Trim       : vm.RegistroSeleccionado.metas_asignadas[i].reg2Trim,
                                    ext2Trim       : vm.RegistroSeleccionado.metas_asignadas[i].ext2Trim,
                                    roco2Trim      : vm.RegistroSeleccionado.metas_asignadas[i].roco2Trim,
                                    ecl2Trim       : vm.RegistroSeleccionado.metas_asignadas[i].ecl2Trim,
                                    cae2Trim       : vm.RegistroSeleccionado.metas_asignadas[i].cae2Trim,

                                    reg3Trim       : vm.RegistroSeleccionado.metas_asignadas[i].reg3Trim,
                                    ext3Trim       : vm.RegistroSeleccionado.metas_asignadas[i].ext3Trim,
                                    roco3Trim      : vm.RegistroSeleccionado.metas_asignadas[i].roco3Trim,
                                    ecl3Trim       : vm.RegistroSeleccionado.metas_asignadas[i].ecl3Trim,
                                    cae3Trim       : vm.RegistroSeleccionado.metas_asignadas[i].cae3Trim,

                                    reg4Trim       : vm.RegistroSeleccionado.metas_asignadas[i].reg4Trim,
                                    ext4Trim       : vm.RegistroSeleccionado.metas_asignadas[i].ext4Trim,
                                    roco4Trim      : vm.RegistroSeleccionado.metas_asignadas[i].roco4Trim,
                                    ecl4Trim       : vm.RegistroSeleccionado.metas_asignadas[i].ecl4Trim,
                                    cae4Trim       : vm.RegistroSeleccionado.metas_asignadas[i].cae4Trim,

                                    regTotalTrim  : vm.RegistroSeleccionado.metas_asignadas[i].reg1Trim + vm.RegistroSeleccionado.metas_asignadas[i].reg2Trim + vm.RegistroSeleccionado.metas_asignadas[i].reg3Trim + vm.RegistroSeleccionado.metas_asignadas[i].reg4Trim,
                                    extTotalTrim  : vm.RegistroSeleccionado.metas_asignadas[i].ext1Trim + vm.RegistroSeleccionado.metas_asignadas[i].ext2Trim + vm.RegistroSeleccionado.metas_asignadas[i].ext3Trim + vm.RegistroSeleccionado.metas_asignadas[i].ext4Trim,
                                    rocoTotalTrim : vm.RegistroSeleccionado.metas_asignadas[i].roco1Trim + vm.RegistroSeleccionado.metas_asignadas[i].roco2Trim + vm.RegistroSeleccionado.metas_asignadas[i].roco3Trim + vm.RegistroSeleccionado.metas_asignadas[i].roco4Trim,
                                    eclTotalTrim  : vm.RegistroSeleccionado.metas_asignadas[i].ecl1Trim + vm.RegistroSeleccionado.metas_asignadas[i].ecl2Trim + vm.RegistroSeleccionado.metas_asignadas[i].ecl3Trim + vm.RegistroSeleccionado.metas_asignadas[i].ecl4Trim,
                                    caeTotalTrim  : vm.RegistroSeleccionado.metas_asignadas[i].cae1Trim + vm.RegistroSeleccionado.metas_asignadas[i].cae2Trim + vm.RegistroSeleccionado.metas_asignadas[i].cae3Trim + vm.RegistroSeleccionado.metas_asignadas[i].cae4Trim
                                });
                          }

                    }, function () {
                    });
            };


            function edita_datos_registro(seleccion) {

                    var modalInstance = $modal.open({
                        templateUrl: 'app/components/ptc/asignacion-metas/modal-captura-metas-trimestre.html',
                        windowClass: "animated fadeIn",
                        controller: 'ModalEditaMetasController as vm',
                        size: 'lg',
                        resolve: {
                          registroEditar: function () { return seleccion }
                        }
                    });

                    modalInstance.result.then(function (respuesta) {
                        
                          vm.RegistroSeleccionado.metas_asignadas[0].reg1Trim       = respuesta.reg1Trim,
                          vm.RegistroSeleccionado.metas_asignadas[0].ext1Trim       = respuesta.ext1Trim,
                          vm.RegistroSeleccionado.metas_asignadas[0].roco1Trim      = respuesta.roco1Trim,
                          vm.RegistroSeleccionado.metas_asignadas[0].ecl1Trim       = respuesta.ecl1Trim,
                          vm.RegistroSeleccionado.metas_asignadas[0].cae1Trim       = respuesta.cae1Trim,

                          vm.RegistroSeleccionado.metas_asignadas[0].reg2Trim       = respuesta.reg2Trim,
                          vm.RegistroSeleccionado.metas_asignadas[0].ext2Trim       = respuesta.ext2Trim,
                          vm.RegistroSeleccionado.metas_asignadas[0].roco2Trim      = respuesta.roco2Trim,
                          vm.RegistroSeleccionado.metas_asignadas[0].ecl2Trim       = respuesta.ecl2Trim,
                          vm.RegistroSeleccionado.metas_asignadas[0].cae2Trim       = respuesta.cae2Trim,

                          vm.RegistroSeleccionado.metas_asignadas[0].reg3Trim       = respuesta.reg3Trim,
                          vm.RegistroSeleccionado.metas_asignadas[0].ext3Trim       = respuesta.ext3Trim,
                          vm.RegistroSeleccionado.metas_asignadas[0].roco3Trim      = respuesta.roco3Trim,
                          vm.RegistroSeleccionado.metas_asignadas[0].ecl3Trim       = respuesta.ecl3Trim,
                          vm.RegistroSeleccionado.metas_asignadas[0].cae3Trim       = respuesta.cae3Trim,

                          vm.RegistroSeleccionado.metas_asignadas[0].reg4Trim       = respuesta.reg4Trim,
                          vm.RegistroSeleccionado.metas_asignadas[0].ext4Trim       = respuesta.ext4Trim,
                          vm.RegistroSeleccionado.metas_asignadas[0].roco4Trim      = respuesta.roco4Trim,
                          vm.RegistroSeleccionado.metas_asignadas[0].ecl4Trim       = respuesta.ecl4Trim,
                          vm.RegistroSeleccionado.metas_asignadas[0].cae4Trim       = respuesta.cae4Trim,

                          vm.RegistroSeleccionado.metas_asignadas[0].regTotalTrim  = respuesta.reg1Trim + respuesta.reg2Trim + respuesta.reg3Trim + respuesta.reg4Trim,
                          vm.RegistroSeleccionado.metas_asignadas[0].extTotalTrim  = respuesta.ext1Trim + respuesta.ext2Trim + respuesta.ext3Trim + respuesta.ext4Trim,
                          vm.RegistroSeleccionado.metas_asignadas[0].rocoTotalTrim = respuesta.roco1Trim + respuesta.roco2Trim + respuesta.roco3Trim + respuesta.roco4Trim,
                          vm.RegistroSeleccionado.metas_asignadas[0].eclTotalTrim  = respuesta.ecl1Trim + respuesta.ecl2Trim + respuesta.ecl3Trim + respuesta.ecl4Trim,
                          vm.RegistroSeleccionado.metas_asignadas[0].caeTotalTrim  = respuesta.cae1Trim + respuesta.cae2Trim + respuesta.cae3Trim + respuesta.cae4Trim

                    }, function () {
                    });
            };



            function elimina_registro(seleccion) {

                    swal({
                      title: "Confirmar",
                      html: 'Se eliminar&aacute; el a&ntilde;o <strong>'+ seleccion.metas_asignadas[0].anio +'</strong> con sus metas asignadas, ¿Continuar?',
                      type: "warning",
                      showCancelButton: true,
                      confirmButtonColor: "#3085d6",
                      confirmButtonText: "Aceptar",
                      cancelButtonText: "Cancelar",
                      closeOnConfirm: false,
                      closeOnCancel: true
                    }, function(){
                            swal.disableButtons();

                            MetasCapacUnidad.deleteById({ id: seleccion.metas_asignadas[0].id })
                            .$promise
                            .then(function() { 

                                  vm.RegistroSeleccionado.metas_asignadas.splice(0,1);
                                  vm.historial.splice(0,1);
                                  swal('Registro eliminado', '', 'success');
                            });

                    });

            };

    };

})();