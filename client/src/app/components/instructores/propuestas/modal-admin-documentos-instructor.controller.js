(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ModalAdminDocumentosInstructorController', ModalAdminDocumentosInstructorController);

        ModalAdminDocumentosInstructorController.$inject = ['$scope', '$timeout', '$modalInstance', 'FileUploader', 'registroEditar', 'CatalogoInstructores', 'CatalogoUnidadesAdmtvas', 'CatalogoLocalidades', 'CatalogoEspecialidades', 'CatalogoCursos', 'CatalogoDocumentos', 'AlmacenDocumentos','DocumentosInstructores'];

    function ModalAdminDocumentosInstructorController($scope, $timeout, $modalInstance, FileUploader, registroEditar, CatalogoInstructores, CatalogoUnidadesAdmtvas, CatalogoLocalidades, CatalogoEspecialidades, CatalogoCursos, CatalogoDocumentos, AlmacenDocumentos, DocumentosInstructores) {

            var vm = this;

            vm.eliminaDocumento          = eliminaDocumento;
            vm.guardar                   = guardar;

            vm.mostrarSpiner = false;
            vm.mensaje = '';
            vm.mostrar_msg_error = false;

            vm.registroEdicion = {
                    idInstructor : registroEditar.idInstructor,
                    estatus      : registroEditar.estatus,
                    documentos   : []
            };

            angular.forEach(registroEditar.documentos, function(record) {
                  vm.registroEdicion.documentos.push({
                        idDocumento: record.idDocumento,
                        idInstructor: record.idInstructor,
                        nombreArchivo: record.nombreArchivo,
                        tipoArchivo: record.tipoArchivo,
                        documento: record.documento
                  });
            });

            vm.ddSelectOptions = [];
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
                        idDocumento: parseInt(response.idDocumento),
                        idInstructor: response.idInstructor,
                        documento: response.documento,
                        nombreArchivo: response.nombreArchivo,
                        tipoArchivo: response.tipoArchivo
                    });
                    vm.documentos_temp.push({
                        idDocumento: parseInt(response.idDocumento),
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

            };


            function eliminaDocumento(seleccion) {
                
                DocumentosInstructores.deleteById({ id: seleccion.idDocumento })
                .$promise
                .then(function() { 
                        var indice = vm.documentos_temp.indexOf(seleccion);
                        vm.documentos_temp.splice(indice, 1);
                        
                        indice = vm.registroEdicion.documentos.map(function(registro) {
                                                            return registro.idDocumento;
                                                          }).indexOf(seleccion.idDocumento);

                        vm.registroEdicion.documentos.splice(indice, 1);

                        AlmacenDocumentos.removeFile({
                            container: 'instructores',
                            file: seleccion.nombreArchivo
                        })
                        .$promise
                        .then(function() {
                        });
                });

            }


            function guardar() {

                vm.mostrarSpiner = true;
                var totalregistros = 0;
                var pasaRevisionDocumento = true;
                angular.forEach(vm.documentos_temp, function(seleccion) {

                    if(seleccion.documento.value == '') 
                    {
                        pasaRevisionDocumento = false;
                        vm.mostrarSpiner = false;
                        vm.mensaje = 'Es necesario definir el tipo de documento';
                        vm.mostrar_msg_error = true;
                        $timeout(function(){
                             vm.mensaje = '';
                             vm.mostrar_msg_error = false;
                        }, 3000);
                        return;
                    }
                });

                if(pasaRevisionDocumento == true)
                {
                        CatalogoInstructores.prototype$updateAttributes(
                        {
                            id: vm.registroEdicion.idInstructor
                        }, {
                            estatus : 0
                        })
                        .$promise
                        .then(function(respuesta) {
                                vm.registroEdicion.estatus = 0;
                                angular.forEach(vm.documentos_temp, function(seleccion) {

                                    var indice = vm.registroEdicion.documentos.map(function(registro) {
                                                                        return registro.idDocumento;
                                                                      }).indexOf(seleccion.idDocumento);

                                    vm.registroEdicion.documentos[indice].documento = seleccion.documento.value;

                                    DocumentosInstructores.prototype$updateAttributes(
                                        {id: seleccion.idDocumento}, 
                                        {documento : seleccion.documento.value}
                                    )
                                    .$promise.then(function() {
                                        totalregistros++;
                                        if(totalregistros == vm.documentos_temp.length)
                                            $modalInstance.close(vm.registroEdicion);
                                    });

                                });

                        });

                }
            };
    };

})();