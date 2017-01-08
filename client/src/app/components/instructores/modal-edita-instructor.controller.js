(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ModalEditaInstructorController', ModalEditaInstructorController);

        ModalEditaInstructorController.$inject = ['$scope', '$timeout', '$modalInstance', 'FileUploader', 'registroEditar', 'CatalogoInstructores', 'CatalogoUnidadesAdmtvas', 'CatalogoLocalidades', 'CatalogoEspecialidades', 'CatalogoCursos', 'CatalogoDocumentos', 'AlmacenDocumentos','DocumentosInstructores'];

    function ModalEditaInstructorController($scope, $timeout, $modalInstance, FileUploader, registroEditar, CatalogoInstructores, CatalogoUnidadesAdmtvas, CatalogoLocalidades, CatalogoEspecialidades, CatalogoCursos, CatalogoDocumentos, AlmacenDocumentos, DocumentosInstructores) {

            var vm = this;

            vm.guardar                   = guardar;
            vm.muestraCursosEspecialidad = muestraCursosEspecialidad;
            vm.ocultaUnidadCheckbox      = ocultaUnidadCheckbox;
            vm.agregaCurso               = agregaCurso;
            vm.eliminaRegistro           = eliminaRegistro;
            vm.eliminaDocumento          = eliminaDocumento;

            vm.mostrarSpiner = false;
            vm.mensaje = '';
            vm.mostrar_msg_error = false;

            vm.listaUnidades = {};
            vm.unidadSeleccionada = {};

            vm.listaLocalidades = {};
            vm.localidadSeleccionada = {};

            vm.listaEspecialidades = {};
            vm.especialidadSeleccionada = {};

            vm.listaCursosInhabilit = true;
            vm.cursoSeleccionado = {};
            vm.listaCursos = [];

            vm.registroEdicion = {
                    idInstructor       : registroEditar.idInstructor,
                    idUnidadAdmtva     : registroEditar.idUnidadAdmtva,
                    UnidadAdmtva       : '',
                    curp               : registroEditar.curp,
                    apellidoPaterno    : registroEditar.apellidoPaterno,
                    apellidoMaterno    : registroEditar.apellidoMaterno,
                    nombre             : registroEditar.nombre,
                    rfc                : registroEditar.rfc,
                    gradoAcademico     : registroEditar.gradoAcademico,
                    telefono           : registroEditar.telefono,
                    email              : registroEditar.email,
                    escolaridad        : registroEditar.escolaridad,
                    certificacion      : registroEditar.certificacion,
                    idLocalidad        : registroEditar.idLocalidad,
                    localidad          : '',
                    activo             : registroEditar.activo,
                    evaluacion_curso   : [],
                    otras_unidades     : [],
                    documentos         : registroEditar.documentos
            };

            vm.tablaListaDocumentos = {
              totalElementos     : 0,
              paginaActual       : 1,
              registrosPorPagina : 5,
              inicio             : 0,
              fin                : 1,
              condicion          : {},
              filtro_datos       : {},
              fila_seleccionada  : 0
            };

            vm.ddSelectOptions = [];

            vm.cursos_habilitados = [];
            vm.unidades_checkbox = [];
            vm.documentos_temp = [];
            
            vm.uploader = new FileUploader({
              scope: vm,
              url: '/api/AlmacenDocumentos/instructores/upload',
              formData: [
                { key: 'value' }
              ]
            });

            // ADDING FILTERS
            vm.uploader.filters.push({
                name: 'imageFilter',
                fn: function(item /*{File|FileLikeObject}*/, options) {
                    var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                    return '|jpg|png|jpeg|pdf|'.indexOf(type) !== -1;
                }
            });


            // REGISTER HANDLERS
            // --------------------
            vm.uploader.onAfterAddingFile = function(item) {
              //console.info('After adding a file', item);
            };
            // --------------------
            vm.uploader.onAfterAddingAll = function(items) {
              //console.info('After adding all files', items);
            };
            // --------------------
            vm.uploader.onWhenAddingFileFailed = function(item, filter, options) {

                vm.mostrarSpiner = false;
                vm.mensaje = 'Tipo de archivo no permitido, solo se permite .jpg, .jpeg, .png, .pdf';
                vm.mostrar_msg_error = true;
                $timeout(function(){
                     vm.mensaje = '';
                     vm.mostrar_msg_error = false;
                }, 4000);
            };
            // --------------------
            vm.uploader.onBeforeUploadItem = function(item) {
               item.file.name = vm.registroEdicion.idInstructor + '_' + item.file.name;
            };
            // --------------------
            vm.uploader.onProgressItem = function(item, progress) {
              //console.info('Progress: ' + progress, item);
            };
            // --------------------
            vm.uploader.onProgressAll = function(progress) {
              //console.info('Total progress: ' + progress);
            };
            // --------------------
            vm.uploader.onSuccessItem = function(item, response, status, headers) {
              //console.info('Success', response, status, headers);

                CatalogoInstructores.documentos.create({
                    id: vm.registroEdicion.idInstructor
                },{
                    documento: '',
                    nombreArchivo: item.file.name,
                    tipoArchivo: item.file.type,
                    tamanio: item.file.size
                }) 
                .$promise
                .then(function(response) {
                    vm.registroEdicion.documentos.push({
                        idDocumento: response.idDocumento,
                        idInstructor: response.idInstructor,
                        documento: response.documento,
                        nombreArchivo: response.nombreArchivo,
                        tipoArchivo: response.tipoArchivo
                    });
                    vm.documentos_temp.push({
                        idDocumento: response.idDocumento,
                        idInstructor: response.idInstructor,
                        documento: {text: "Seleccione", value: ''},
                        nombreArchivo: response.nombreArchivo,
                        tipoArchivo: response.tipoArchivo
                    });
                    $scope.$broadcast('uploadCompleted', item);
                });

            };
            // --------------------
            vm.uploader.onErrorItem = function(item, response, status, headers) {
              //console.info('Error', response, status, headers);
            };
            // --------------------
            vm.uploader.onCancelItem = function(item, response, status, headers) {
              //console.info('Cancel', response, status);
            };
            // --------------------
            vm.uploader.onCompleteItem = function(item, response, status, headers) {
              //console.info('Complete', response, status, headers);
            };
            // --------------------
            vm.uploader.onCompleteAll = function() {
              //console.info('Complete all');
            };
            // --------------------




            inicia();

            function inicia() {

                angular.forEach(registroEditar.evaluacion_curso, function(record) {
                      vm.cursos_habilitados.push({
                          idCatalogoCurso : record.CatalogoCursos.idCatalogoCurso,
                          nombreCurso     : record.CatalogoCursos.nombreCurso,
                          modalidad       : record.CatalogoCursos.modalidad,
                          calificacion    : record.calificacion
                      });
                });

                angular.forEach(registroEditar.documentos, function(record) {

                      if(record.documento === undefined || record.documento == '')
                        var seleccion = {text: "Seleccione", value: ''};
                      else
                        var seleccion = {text: record.documento, value: record.documento};

                      vm.documentos_temp.push({
                            idDocumento: record.idDocumento,
                            idInstructor: record.idInstructor,
                            documento: seleccion,
                            nombreArchivo: record.nombreArchivo,
                            tipoArchivo: record.tipoArchivo
                      });
                });

                vm.tablaListaDocumentos.paginaActual = 1;
                vm.tablaListaDocumentos.inicio = 0;
                vm.tablaListaDocumentos.fin = 1;
                vm.tablaListaDocumentos.totalElementos = vm.documentos_temp.length;
                if(vm.tablaListaDocumentos.totalElementos <= vm.tablaListaDocumentos.registrosPorPagina)
                    vm.tablaListaDocumentos.fin = vm.tablaListaDocumentos.totalElementos;
                else
                    vm.tablaListaDocumentos.fin = vm.tablaListaDocumentos.registrosPorPagina;
                    
                if(vm.tablaListaDocumentos.totalElementos == 0) {
                    vm.tablaListaDocumentos.inicio = -1;
                    vm.tablaListaDocumentos.fin = 0;
                }

                CatalogoDocumentos.find({
                    filter: {
                        order: 'nombreDocumento ASC'
                    }
                })
                .$promise
                .then(function(resp) {
                        angular.forEach(resp, function(record) {
                              vm.ddSelectOptions.push({
                                  text  : record.nombreDocumento,
                                  value : record.nombreDocumento
                              });
                        });
                });


                CatalogoUnidadesAdmtvas.find({
                    filter: {
                        where: {idUnidadAdmtva : {gt: 1}},
                        fields: ['idUnidadAdmtva','nombre'],
                        order: 'nombre ASC'
                    }
                })
                .$promise
                .then(function(resp) {
                    vm.listaUnidades = resp;

                    var index = vm.listaUnidades.map(function(record) {
                                                        return record.idUnidadAdmtva;
                                                      }).indexOf(vm.registroEdicion.idUnidadAdmtva);

                    vm.unidadSeleccionada = vm.listaUnidades[index];

                    
                    angular.forEach(vm.listaUnidades, function(registro) {

                            var index = registroEditar.otras_unidades.map(function(record) {
                                                            return record.idUnidadAdmtva;
                                                          }).indexOf(registro.idUnidadAdmtva);
                            
                            if(registro.idUnidadAdmtva == vm.registroEdicion.idUnidadAdmtva)
                                var mostrar = false;
                            else
                                var mostrar = true;

                            if(index >= 0)
                            {
                                vm.unidades_checkbox.push({
                                  idUnidadAdmtva : registro.idUnidadAdmtva,
                                  nombre         : registro.nombre,
                                  mostrar        : mostrar,
                                  seleccionado   : true
                                });
                            }
                            else
                            {
                                vm.unidades_checkbox.push({
                                  idUnidadAdmtva : registro.idUnidadAdmtva,
                                  nombre         : registro.nombre,
                                  mostrar        : mostrar,
                                  seleccionado   : false
                                });
                            }
                    });

                });
    
                CatalogoLocalidades.find({
                    filter: {
                        fields: ['idLocalidad','nombre'],
                        order: 'nombre ASC'
                    }
                })
                .$promise
                .then(function(resp) {
                    vm.listaLocalidades = resp;

                    var index = vm.listaLocalidades.map(function(record) {
                                                        return record.idLocalidad;
                                                      }).indexOf(vm.registroEdicion.idLocalidad);

                    if(index >= 0)
                        vm.localidadSeleccionada = vm.listaLocalidades[index];
                });
    
                CatalogoEspecialidades.find({
                    filter: {
                        fields: ['idEspecialidad','nombre'],
                        order: 'nombre ASC'
                    }
                })
                .$promise
                .then(function(resp) {
                    vm.listaEspecialidades = resp;
                });
    
            };


            function muestraCursosEspecialidad() {

                vm.listaCursosInhabilit = true;
                vm.cursoSeleccionado = {};
                vm.listaCursos = [];
                CatalogoCursos.find({
                    filter: {
                        where: {idEspecialidad: vm.especialidadSeleccionada.idEspecialidad},
                        fields: ['idCatalogoCurso','nombreCurso','modalidad'],
                        order: 'nombreCurso ASC'
                    }
                })
                .$promise
                .then(function(resp) {
                    vm.listaCursos = resp;
                    vm.listaCursosInhabilit = false;

                    angular.forEach(vm.registroEdicion.cursos_habilitados, function(record) {
                        
                        var index = vm.listaCursos.map(function(registro) {
                                                            return registro.idCatalogoCurso;
                                                          }).indexOf(record.idCatalogoCurso);

                        if(index >= 0) 
                            vm.listaCursos.splice(index, 1);
                    });

                });

            };


            function ocultaUnidadCheckbox(){

                angular.forEach(vm.unidades_checkbox, function(registro) {
                    if(registro.idUnidadAdmtva == vm.unidadSeleccionada.idUnidadAdmtva) {
                        registro.mostrar = false;
                    }
                    else
                        registro.mostrar = true;
                });

            };


            function agregaCurso() {
                vm.cursos_habilitados.push({
                    idCatalogoCurso : vm.cursoSeleccionado.idCatalogoCurso,
                    nombreCurso     : vm.cursoSeleccionado.nombreCurso,
                    modalidad       : vm.cursoSeleccionado.modalidad,
                    calificacion    : 0
                });

                vm.cursoSeleccionado = {};
                angular.forEach(vm.cursos_habilitados, function(record) {
                    
                    var index = vm.listaCursos.map(function(registro) {
                                                        return registro.idCatalogoCurso;
                                                      }).indexOf(record.idCatalogoCurso);

                    if(index >= 0) 
                        vm.listaCursos.splice(index, 1);
                });
            };


            function eliminaRegistro(seleccion) {
                var indice = vm.cursos_habilitados.indexOf(seleccion);
                vm.cursos_habilitados.splice(indice, 1);
                vm.especialidadSeleccionada = undefined;
                //vm.muestraCursosEspecialidad();
            };


            function eliminaDocumento(seleccion) {
                
                AlmacenDocumentos.removeFile({
                    container: 'instructores',
                    file: seleccion.nombreArchivo
                })
                .$promise
                .then(function() {
                        DocumentosInstructores.deleteById({ id: seleccion.idDocumento })
                        .$promise
                        .then(function() { 
                                var indice = vm.documentos_temp.indexOf(seleccion);
                                vm.documentos_temp.splice(indice, 1);
                                
                                indice = vm.registroEdicion.documentos.map(function(registro) {
                                                                    return registro.idDocumento;
                                                                  }).indexOf(seleccion.idDocumento);

                                vm.registroEdicion.documentos.splice(indice, 1);

                                vm.tablaListaDocumentos.paginaActual = 1;
                                vm.tablaListaDocumentos.inicio = 0;
                                vm.tablaListaDocumentos.fin = 1;
                                vm.tablaListaDocumentos.totalElementos = vm.registroEdicion.documentos.length;
                                if(vm.tablaListaDocumentos.totalElementos <= vm.tablaListaDocumentos.registrosPorPagina)
                                    vm.tablaListaDocumentos.fin = vm.tablaListaDocumentos.totalElementos;
                                else
                                    vm.tablaListaDocumentos.fin = vm.tablaListaDocumentos.registrosPorPagina;
                                if(vm.tablaListaDocumentos.totalElementos == 0) {
                                    vm.tablaListaDocumentos.inicio = -1;
                                    vm.tablaListaDocumentos.fin = 0;
                                }
                        });
                });
            }


            function guardar() {

                vm.mostrarSpiner = true;
                
                var datos = {
                        idUnidadAdmtva     : vm.unidadSeleccionada.idUnidadAdmtva,
                        curp               : vm.registroEdicion.curp,
                        apellidoPaterno    : vm.registroEdicion.apellidoPaterno,
                        apellidoMaterno    : vm.registroEdicion.apellidoMaterno,
                        nombre             : vm.registroEdicion.nombre,
                        rfc                : vm.registroEdicion.rfc,
                        gradoAcademico     : vm.registroEdicion.gradoAcademico,
                        telefono           : vm.registroEdicion.telefono,
                        email              : vm.registroEdicion.email,
                        escolaridad        : vm.registroEdicion.escolaridad,
                        certificacion      : vm.registroEdicion.certificacion,
                        idLocalidad        : vm.localidadSeleccionada.idLocalidad,
                        idLocalidad        : vm.localidadSeleccionada.idLocalidad,
                        activo             : vm.registroEdicion.activo
                };


                vm.registroEdicion.idUnidadAdmtva = vm.unidadSeleccionada.idUnidadAdmtva;
                vm.registroEdicion.UnidadAdmtva = vm.unidadSeleccionada.nombre;
                vm.registroEdicion.idLocalidad = vm.localidadSeleccionada.idLocalidad;
                vm.registroEdicion.localidad = vm.localidadSeleccionada.nombre;

                CatalogoInstructores.prototype$updateAttributes(
                {
                    id: vm.registroEdicion.idInstructor
                },
                    datos
                )
                .$promise
                .then(function(respuesta) {

                            angular.forEach(vm.documentos_temp, function(seleccion) {

                                if(seleccion.documento.value != '')
                                {
                                    var indice = vm.registroEdicion.documentos.map(function(registro) {
                                                                        return registro.idDocumento;
                                                                      }).indexOf(seleccion.idDocumento);

                                    vm.registroEdicion.documentos[indice].documento = seleccion.documento.value;

                                    DocumentosInstructores.prototype$updateAttributes(
                                        {id: seleccion.idDocumento }, 
                                        {documento : seleccion.documento.value}
                                    )
                                    .$promise.then(function() {
                                    });
                                }
                            });

                            CatalogoInstructores.otras_unidades.destroyAll({ id: vm.registroEdicion.idInstructor })
                            .$promise
                            .then(function() {

                                for(var i=0; i < vm.unidades_checkbox.length; i++)
                                {
                                    if( (vm.unidades_checkbox[i].seleccionado == true) || (vm.unidades_checkbox[i].idUnidadAdmtva == vm.unidadSeleccionada.idUnidadAdmtva) )
                                    {
                                            vm.registroEdicion.otras_unidades.push({
                                              idUnidadAdmtva : vm.unidades_checkbox[i].idUnidadAdmtva,
                                              nombre         : vm.unidades_checkbox[i].nombre
                                            });
                                    }
                                }

                                angular.forEach(vm.registroEdicion.otras_unidades, function(registro) {

                                        CatalogoInstructores.otras_unidades.link({
                                            id: vm.registroEdicion.idInstructor,
                                            fk: registro.idUnidadAdmtva
                                        },{}) 
                                        .$promise
                                        .then(function(resp) {
                                        });

                                });

                                CatalogoInstructores.cursos_habilitados.destroyAll({ id: vm.registroEdicion.idInstructor })
                                .$promise
                                .then(function() { 

                                        if(vm.cursos_habilitados.length > 0)
                                        {
                                                var totalregistros = 0;
                                                angular.forEach(vm.cursos_habilitados, function(record) {

                                                        CatalogoInstructores.cursos_habilitados.link({
                                                            id: vm.registroEdicion.idInstructor,
                                                            fk: record.idCatalogoCurso
                                                        },{
                                                            calificacion: record.calificacion
                                                        }) 
                                                        .$promise
                                                        .then(function(resp) {

                                                                var index = vm.cursos_habilitados.map(function(registro) {
                                                                                                    return registro.idCatalogoCurso;
                                                                                                  }).indexOf(resp.idCatalogoCurso);

                                                                vm.registroEdicion.evaluacion_curso.push({
                                                                    id              : resp.id,
                                                                    idInstructor    : resp.idInstructor,
                                                                    idCatalogoCurso : resp.idCatalogoCurso,
                                                                    calificacion    : resp.calificacion,
                                                                    CatalogoCursos  : {
                                                                        idCatalogoCurso : resp.idCatalogoCurso,
                                                                        nombreCurso     : vm.cursos_habilitados[index].nombreCurso,
                                                                        modalidad       : vm.cursos_habilitados[index].modalidad
                                                                    }
                                                                });
                                                                totalregistros++;
                                                                if(totalregistros == vm.cursos_habilitados.length)
                                                                    $modalInstance.close(vm.registroEdicion);

                                                        });
                                                });
                                                
                                        }
                                        else
                                            $modalInstance.close(vm.registroEdicion);

                                });
                            });

                })
                .catch(function(error) {
                });
            };
    };

})();