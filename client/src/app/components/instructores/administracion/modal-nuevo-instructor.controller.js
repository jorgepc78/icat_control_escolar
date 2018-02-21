(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ModalNUevoInstructorController', ModalNUevoInstructorController);

        ModalNUevoInstructorController.$inject = ['$scope', '$timeout', '$modalInstance', 'FileUploader', 'CatalogoInstructores', 'CatalogoUnidadesAdmtvas', 'CatalogoLocalidades', 'CatalogoEspecialidades', 'CatalogoCursos', 'CatalogoDocumentos', 'AlmacenDocumentos','DocumentosInstructores'];

    function ModalNUevoInstructorController($scope, $timeout, $modalInstance, FileUploader, CatalogoInstructores, CatalogoUnidadesAdmtvas, CatalogoLocalidades, CatalogoEspecialidades, CatalogoCursos, CatalogoDocumentos, AlmacenDocumentos, DocumentosInstructores) {

            var vm = this;

            vm.checaCURP                 = checaCURP;
            vm.guardar                   = guardar;
            vm.muestraCursosEspecialidad = muestraCursosEspecialidad;
            vm.ocultaUnidadCheckbox      = ocultaUnidadCheckbox;
            vm.agregaCurso               = agregaCurso;
            vm.eliminaRegistro           = eliminaRegistro;
            vm.eliminaDocumento          = eliminaDocumento;

            vm.curpTemp = '';

            vm.mostrarSpiner = false;
            vm.mensaje = '';
            vm.mostrar_msg_error = false;
            vm.mostrar_pestana = false;

            vm.listaUnidades = {};
            vm.unidadSeleccionada = undefined;

            vm.listaLocalidades = {};
            vm.localidadSeleccionada = undefined;

            vm.listaEspecialidades = {};
            vm.especialidadSeleccionada = {};

            vm.listaCursosInhabilit = true;
            vm.cursoSeleccionado = {};
            vm.listaCursos = [];

            vm.registroEdicion = {
                    idInstructor       : 0,
                    idUnidadAdmtva     : 0,
                    curp               : '',
                    apellidoPaterno    : '',
                    apellidoMaterno    : '',
                    nombre             : '',
                    rfc                : '',
                    conPerfilAcademico : false,
                    escolaridad        : '',
                    telefono           : '',
                    email              : '',
                    certificacion      : '',
                    idLocalidad        : 0,
                    activo             : true,
                    calif_evaluacion_curso   : [],
                    otras_unidades     : [],
                    documentos         : []
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

            vm.uploader.onWhenAddingFileFailed = function(item, filter, options) {

                vm.mostrarSpiner = false;
                vm.mensaje = 'Tipo de archivo no permitido, solo se permite .jpg, .jpeg, .png, .pdf';
                vm.mostrar_msg_error = true;
                $timeout(function(){
                     vm.mensaje = '';
                     vm.mostrar_msg_error = false;
                }, 4000);
            };

            vm.uploader.onBeforeUploadItem = function(item) {
               item.file.name = vm.registroEdicion.idInstructor + '_' + item.file.name;
            };

            vm.uploader.onSuccessItem = function(item, response, status, headers) {

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


            inicia();

            function inicia() {

                vm.tablaListaDocumentos.paginaActual = 1;
                vm.tablaListaDocumentos.inicio = 0;
                vm.tablaListaDocumentos.fin = 1;
                vm.tablaListaDocumentos.totalElementos = vm.documentos_temp.length;
                if(vm.tablaListaDocumentos.totalElementos <= vm.tablaListaDocumentos.registrosPorPagina)
                    vm.tablaListaDocumentos.fin = vm.tablaListaDocumentos.totalElementos;
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

                    if($scope.currentUser.unidad_pertenece_id > 1)
                    {
                        var index = vm.listaUnidades.map(function(record) {
                                                            return record.idUnidadAdmtva;
                                                          }).indexOf($scope.currentUser.unidad_pertenece_id);

                        vm.unidadSeleccionada = vm.listaUnidades[index];                        
                    }

                    angular.forEach(vm.listaUnidades, function(registro) {

                        vm.unidades_checkbox.push({
                          idUnidadAdmtva : registro.idUnidadAdmtva,
                          nombre         : registro.nombre,
                          mostrar        : true,
                          seleccionado   : false
                        });
                    });
                });
    

                CatalogoLocalidades.find({
                    filter: {
                        fields: ['idLocalidad','nombre', 'municipio'],
                        order: 'nombre ASC'
                    }
                })
                .$promise
                .then(function(resp) {
                    vm.listaLocalidades = resp;
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


            function checaCURP() {
                vm.mostrarSpiner = true;
                if( (vm.curpTemp !== vm.registroEdicion.curp) && (vm.registroEdicion.curp !== '') && (vm.registroEdicion.curp !== undefined) )
                {
                    vm.curpTemp = vm.registroEdicion.curp;
                    CatalogoInstructores.count({
                          where: {
                                curp: vm.registroEdicion.curp
                          } 
                    })
                    .$promise
                    .then(function(resp) {
                        vm.mostrarSpiner = false;
                        if(resp.count > 0)
                        {
                            vm.mensaje = 'El CURP ya se encuentra registrado';
                            vm.mostrar_msg_error = true;
                            $timeout(function(){
                                 vm.mensaje = '';
                                 vm.mostrar_msg_error = false;
                            }, 3000);
                        }
                    });
                }
                else
                {
                    vm.mostrarSpiner = false;
                }
            }


            function muestraCursosEspecialidad() {

                vm.listaCursosInhabilit = true;
                vm.cursoSeleccionado = {};
                vm.listaCursos = [];
                CatalogoCursos.find({
                    filter: {
                        where: {
                            and:[
                                {idEspecialidad: vm.especialidadSeleccionada.idEspecialidad},
                                {activo: true}
                            ]
                        },
                        fields: ['idCatalogoCurso','nombreCurso','numeroHoras','activo'],
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
                    numeroHoras     : vm.cursoSeleccionado.numeroHoras,
                    calificacion    : 0,
                    activo          : vm.cursoSeleccionado.activo,
                    especialidad    : vm.especialidadSeleccionada.nombre
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
                                if(vm.tablaListaDocumentos.totalElementos == 0) {
                                    vm.tablaListaDocumentos.inicio = -1;
                                    vm.tablaListaDocumentos.fin = 0;
                                }
                        });
                });
            }


            function guardar() {

                vm.mostrarSpiner = true;

                CatalogoInstructores.count({
                      where: {
                            curp: vm.registroEdicion.curp
                      } 
                })
                .$promise
                .then(function(resp) {
                    vm.mostrarSpiner = false;
                    if(resp.count > 0)
                    {
                        vm.mensaje = 'El CURP ya se encuentra registrado';
                        vm.mostrar_msg_error = true;
                        $timeout(function(){
                             vm.mensaje = '';
                             vm.mostrar_msg_error = false;
                        }, 3000);
                    }
                    else
                    {
                            vm.registroEdicion.UnidadAdmtva = vm.unidadSeleccionada.nombre;
                            vm.registroEdicion.idLocalidad = vm.localidadSeleccionada.idLocalidad;
                            vm.registroEdicion.localidad = vm.localidadSeleccionada.nombre;

                            CatalogoInstructores
                            .create({
                                idUnidadAdmtva     : vm.unidadSeleccionada.idUnidadAdmtva,
                                curp               : vm.registroEdicion.curp,
                                apellidoPaterno    : vm.registroEdicion.apellidoPaterno,
                                apellidoMaterno    : vm.registroEdicion.apellidoMaterno,
                                nombre             : vm.registroEdicion.nombre,
                                nombre_completo    : (vm.registroEdicion.apellidoPaterno + ' ' + vm.registroEdicion.apellidoMaterno + ' ' + vm.registroEdicion.nombre),
                                rfc                : vm.registroEdicion.rfc,
                                conPerfilAcademico : vm.registroEdicion.conPerfilAcademico,
                                escolaridad        : vm.registroEdicion.escolaridad,
                                telefono           : vm.registroEdicion.telefono,
                                email              : vm.registroEdicion.email,
                                certificacion      : vm.registroEdicion.certificacion,
                                idLocalidad        : vm.localidadSeleccionada.idLocalidad,
                                activo             : vm.registroEdicion.activo,
                                estatus            : 3
                            })
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
                                                id: respuesta.idInstructor,
                                                fk: registro.idUnidadAdmtva
                                            },{}) 
                                            .$promise
                                            .then(function(resp) {
                                            });

                                    });

                                    if(vm.cursos_habilitados.length > 0)
                                    {
                                            var totalregistros = 0;
                                            angular.forEach(vm.cursos_habilitados, function(record) {

                                                    CatalogoInstructores.cursos_habilitados.link({
                                                        id: respuesta.idInstructor,
                                                        fk: record.idCatalogoCurso
                                                    },{
                                                        calificacion: record.calificacion
                                                    }) 
                                                    .$promise
                                                    .then(function() {
                                                        totalregistros++;
                                                        if(totalregistros == vm.cursos_habilitados.length)
                                                            $modalInstance.close();
                                                    });
                                            });
                                            
                                    }
                                    else
                                    {
                                            $modalInstance.close();
                                    }

                            })
                            .catch(function(error) {
                            });

                    }
                });



            };
    };

})();