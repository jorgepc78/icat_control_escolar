(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ModalEditaInstructorController', ModalEditaInstructorController);

        ModalEditaInstructorController.$inject = ['$scope', '$modalInstance', 'registroEditar', 'CatalogoInstructores', 'CatalogoUnidadesAdmtvas', 'CatalogoLocalidades', 'CatalogoEspecialidades', 'CatalogoCursos'];

    function ModalEditaInstructorController($scope, $modalInstance, registroEditar, CatalogoInstructores, CatalogoUnidadesAdmtvas, CatalogoLocalidades, CatalogoEspecialidades, CatalogoCursos) {

            var vm = this;

            vm.guardar = guardar;
            vm.muestraCursosEspecialidad = muestraCursosEspecialidad;
            vm.agregaCurso = agregaCurso;
            vm.eliminaRegistro = eliminaRegistro;

            vm.mostrarSpiner = false;

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
                    idLocalidad        : registroEditar.idLocalidad,
                    localidad          : '',
                    activo             : registroEditar.activo,
                    evaluacion_curso   : [],
                    otras_unidades     : []
            };

            vm.cursos_habilitados = [];
            vm.unidades_checkbox = [];
            
            angular.forEach(registroEditar.evaluacion_curso, function(record) {
                  vm.cursos_habilitados.push({
                      idCatalogoCurso : record.CatalogoCursos.idCatalogoCurso,
                      nombreCurso     : record.CatalogoCursos.nombreCurso,
                      modalidad       : record.CatalogoCursos.modalidad,
                      calificacion    : record.calificacion
                  });
            });


            inicia();

            function inicia() {

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
                                var nombre_txt = registro.nombre + ' (Default)';
                            else
                                var nombre_txt = registro.nombre;

                            if(index >= 0)
                            {
                                vm.unidades_checkbox.push({
                                  idUnidadAdmtva : registro.idUnidadAdmtva,
                                  nombre         : nombre_txt,
                                  seleccionado   : true
                                });
                            }
                            else
                            {
                                vm.unidades_checkbox.push({
                                  idUnidadAdmtva : registro.idUnidadAdmtva,
                                  nombre         : nombre_txt,
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
                vm.muestraCursosEspecialidad();
            };


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
                        idLocalidad        : vm.localidadSeleccionada.idLocalidad,
                        activo             : vm.registroEdicion.activo
                };


                vm.registroEdicion.idUnidadAdmtva = vm.unidadSeleccionada.idUnidadAdmtva;
                vm.registroEdicion.UnidadAdmtva = vm.unidadSeleccionada.nombre;
                vm.registroEdicion.localidad = vm.localidadSeleccionada.nombre;

                CatalogoInstructores.prototype$updateAttributes(
                {
                    id: vm.registroEdicion.idInstructor
                },
                    datos
                )
                .$promise
                .then(function(respuesta) {

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