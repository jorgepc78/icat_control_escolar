(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ModalEditaEvaluadorController', ModalEditaEvaluadorController);

        ModalEditaEvaluadorController.$inject = ['$q', '$modalInstance', 'registroEditar', 'CatalogoInstructores', 'CatalogoEspecialidades', 'CatalogoEstandares', 'CatalogoCursos', 'RelInstrucEvalCurso', 'RelInstrucEstandar'];

    function ModalEditaEvaluadorController($q, $modalInstance, registroEditar, CatalogoInstructores, CatalogoEspecialidades, CatalogoEstandares, CatalogoCursos, RelInstrucEvalCurso, RelInstrucEstandar) {

            var vm = this;

            vm.guardar                   = guardar;
            
            vm.muestraEvalEspecialidad   = muestraEvalEspecialidad;
            vm.agregaEvaluacion          = agregaEvaluacion;
            vm.eliminaEvaluacion         = eliminaEvaluacion;
            
            vm.agregaEstandar            = agregaEstandar;
            vm.eliminaEstandar           = eliminaEstandar;
            
            vm.mostrarSpiner = false;
            vm.mensaje = '';

            vm.listaEspecialidadesEval = {};
            vm.especialidadEvalSeleccionada = {};
            vm.listaEvalInhabilit = true;
            vm.evaluacionSeleccionada = {};
            vm.listaEvaluaciones = [];
            vm.evaluaciones_habilitadas = [];
            
            vm.estandares_habilitados = [];
            vm.listaEstandares = {};
            vm.estandarSeleccionado = {};

            vm.cambioEvaluaciones = false;
            vm.cambioEstandares = false;

            vm.registroEdicion = {
                    idInstructor             : registroEditar.idInstructor,
                    evaluaciones_habilitadas : registroEditar.evaluaciones_habilitadas,
                    estandares_habilitados   : registroEditar.estandares_habilitados
            };


            inicia();

            function inicia() {

                angular.forEach(registroEditar.evaluaciones_habilitadas, function(record) {
                      vm.evaluaciones_habilitadas.push({
                          idCatalogoCurso : record.idCatalogoCurso,
                          nombreCurso     : record.nombreCurso,
                          especialidad    : record.especialidad.nombre
                      });
                });
    
                angular.forEach(registroEditar.estandares_habilitados, function(record) {
                      vm.estandares_habilitados.push({
                          idEstandar : record.idEstandar,
                          codigo     : record.codigo,
                          nombre     : record.nombre
                      });
                });
    
                CatalogoEspecialidades.find({
                    filter: {
                        fields: ['idEspecialidad','nombre'],
                        order: 'nombre ASC'
                    }
                })
                .$promise
                .then(function(resp) {
                    vm.listaEspecialidadesEval = resp;
                });    

                CatalogoEstandares.find({
                    filter: {
                        fields: ['idEstandar','codigo','nombre'],
                        order: 'nombre ASC'
                    }
                })
                .$promise
                .then(function(resp) {
                    vm.listaEstandares = resp;
                });    
            };



            function muestraEvalEspecialidad() {

                vm.listaEvalInhabilit = true;
                vm.evaluacionSeleccionada = {};
                vm.listaEvaluaciones = [];
                CatalogoCursos.find({
                    filter: {
                        where: {
                            and:[
                                {idEspecialidad: vm.especialidadEvalSeleccionada.idEspecialidad},
                                {activo: true}
                            ]
                        },
                        fields: ['idCatalogoCurso','nombreCurso'],
                        order: 'nombreCurso ASC'
                    }
                })
                .$promise
                .then(function(resp) {
                    vm.listaEvaluaciones = resp;
                    vm.listaEvalInhabilit = false;

                    angular.forEach(vm.evaluaciones_habilitadas, function(record) {
                        
                        var index = vm.listaEvaluaciones.map(function(registro) {
                                                            return registro.idCatalogoCurso;
                                                          }).indexOf(record.idCatalogoCurso);

                        if(index >= 0) 
                            vm.listaEvaluaciones.splice(index, 1);
                    });

                });

            };



            function agregaEvaluacion() {
                vm.cambioEvaluaciones = true;
                vm.evaluaciones_habilitadas.push({
                    idCatalogoCurso : vm.evaluacionSeleccionada.idCatalogoCurso,
                    nombreCurso     : vm.evaluacionSeleccionada.nombreCurso,
                    especialidad    : vm.especialidadEvalSeleccionada.nombre
                });

                vm.evaluacionSeleccionada = {};
                angular.forEach(vm.evaluaciones_habilitadas, function(record) {
                    
                    var index = vm.listaEvaluaciones.map(function(registro) {
                                                        return registro.idCatalogoCurso;
                                                      }).indexOf(record.idCatalogoCurso);

                    if(index >= 0) 
                        vm.listaEvaluaciones.splice(index, 1);
                });
            };


            function eliminaEvaluacion(seleccion) {
                vm.cambioEvaluaciones = true;
                var indice = vm.evaluaciones_habilitadas.indexOf(seleccion);
                vm.evaluaciones_habilitadas.splice(indice, 1);
            };


            function agregaEstandar() {
                vm.cambioEstandares = true;
                vm.estandares_habilitados.push({
                    idEstandar : vm.estandarSeleccionado.idEstandar,
                    codigo     : vm.estandarSeleccionado.codigo,
                    nombre     : vm.estandarSeleccionado.nombre
                });

                vm.estandarSeleccionado = {};
                angular.forEach(vm.estandares_habilitados, function(record) {
                    
                    var index = vm.listaEstandares.map(function(registro) {
                                                        return registro.idEstandar;
                                                      }).indexOf(record.idEstandar);

                    if(index >= 0) 
                        vm.listaEstandares.splice(index, 1);
                });
            };


            function eliminaEstandar(seleccion) {
                vm.cambioEstandares = true;
                var indice = vm.estandares_habilitados.indexOf(seleccion);
                vm.estandares_habilitados.splice(indice, 1);
                vm.listaEstandares.push(seleccion);
            };



            function guardar() {

                vm.mostrarSpiner = true;

                //Promesa que actualiza las evaluaciones habilitadas
                function actualizaEvalHabilitadas(vm) {
                    var deferred = $q.defer();
                    if(vm.cambioEvaluaciones == true)
                    {
                            vm.registroEdicion.evaluaciones_habilitadas = [];
                            CatalogoInstructores.evaluaciones_habilitadas.destroyAll({ id: vm.registroEdicion.idInstructor })
                            .$promise
                            .then(function() { 

                                    if(vm.evaluaciones_habilitadas.length > 0)
                                    {
                                            var totalregistros = 0;
                                            angular.forEach(vm.evaluaciones_habilitadas, function(record) {

                                                    RelInstrucEvalCurso.create({
                                                        idInstructor: vm.registroEdicion.idInstructor,
                                                        idCatalogoCurso: record.idCatalogoCurso
                                                    }) 
                                                    .$promise
                                                    .then(function(resp) {

                                                            var index = vm.evaluaciones_habilitadas.map(function(registro) {
                                                                                                return registro.idCatalogoCurso;
                                                                                              }).indexOf(resp.idCatalogoCurso);

                                                            vm.registroEdicion.evaluaciones_habilitadas.push({
                                                                idCatalogoCurso : resp.idCatalogoCurso,
                                                                nombreCurso     : vm.evaluaciones_habilitadas[index].nombreCurso,
                                                                especialidad    : {
                                                                    nombre: vm.evaluaciones_habilitadas[index].especialidad
                                                                }
                                                            });
                                                            totalregistros++;
                                                            if(totalregistros == vm.evaluaciones_habilitadas.length)
                                                                deferred.resolve();
                                                    });
                                            });
                                    }
                                    else
                                        deferred.resolve();
                            });                        
                    }
                    else
                    {
                        deferred.resolve();
                    }

                    return deferred.promise;
                };
                var promiseActualizaEvalHabilitadas = actualizaEvalHabilitadas(vm);

                //Promesa que actualiza los estandares habilitados
                function actualizaEstandaresHabilitadas(vm) {
                    var deferred = $q.defer();
                    if(vm.cambioEstandares == true)
                    {
                            vm.registroEdicion.estandares_habilitados = [];
                            CatalogoInstructores.estandares_habilitados.destroyAll({ id: vm.registroEdicion.idInstructor })
                            .$promise
                            .then(function() { 

                                    if(vm.estandares_habilitados.length > 0)
                                    {
                                            var totalregistros = 0;
                                            angular.forEach(vm.estandares_habilitados, function(record) {

                                                    RelInstrucEstandar.create({
                                                        idInstructor: vm.registroEdicion.idInstructor,
                                                        idEstandar: record.idEstandar
                                                    }) 
                                                    .$promise
                                                    .then(function(resp) {

                                                            var index = vm.estandares_habilitados.map(function(registro) {
                                                                                                return registro.idEstandar;
                                                                                              }).indexOf(resp.idEstandar);

                                                            vm.registroEdicion.estandares_habilitados.push({
                                                                idEstandar : resp.idEstandar,
                                                                codigo     : vm.estandares_habilitados[index].codigo,
                                                                nombre     : vm.estandares_habilitados[index].nombre
                                                            });
                                                            totalregistros++;
                                                            if(totalregistros == vm.estandares_habilitados.length)
                                                                deferred.resolve();
                                                    });
                                            });
                                    }
                                    else
                                    {
                                        deferred.resolve();
                                    }
                            });                        
                    }
                    else
                    {
                        deferred.resolve();
                    }

                    return deferred.promise;
                };
                var promiseactualizaEstandaresHabilitadas = actualizaEstandaresHabilitadas(vm);

                //Cuando todas las promesas se cumplan termina
                $q.all({
                    promiseActualizaEvalHabilitadas,
                    promiseactualizaEstandaresHabilitadas
                  }).then(function() {
                    //console.log('Both promises have resolved');
                    $modalInstance.close(vm.registroEdicion);
                });
                
            };
    };

})();