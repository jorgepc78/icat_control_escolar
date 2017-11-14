(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ModalNUevaPropuestaInstructorController', ModalNUevaPropuestaInstructorController);

        ModalNUevaPropuestaInstructorController.$inject = ['$scope', '$timeout', '$modalInstance', 'CatalogoInstructores', 'CatalogoLocalidades', 'CatalogoEspecialidades', 'CatalogoCursos'];

    function ModalNUevaPropuestaInstructorController($scope, $timeout, $modalInstance, CatalogoInstructores, CatalogoLocalidades, CatalogoEspecialidades, CatalogoCursos) {

            var vm = this;

            vm.checaCURP                 = checaCURP;
            vm.muestraCursosEspecialidad = muestraCursosEspecialidad;
            vm.agregaCurso               = agregaCurso;
            vm.eliminaRegistro           = eliminaRegistro;
            vm.guardar                   = guardar;

            vm.curpTemp = '';
            vm.mostrar_msg_curp = false;
            vm.color_msg_curp = 'success';
            vm.mensaje_curp = '';

            vm.mostrarSpiner = false;
            vm.mensaje = '';
            vm.mostrar_msg_error = false;

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
                    estatus            : 0
            };

            vm.cursos_habilitados = [];
            vm.unidades_checkbox = [];

            inicia();

            function inicia() {

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
                    CatalogoInstructores.find({
                        filter: {
                            where: {
                                curp: vm.registroEdicion.curp
                            },
                            fields: ['idInstructor','nombre_completo','activo','estatus','idUnidadAdmtva'],
                            include: [
                                {
                                    relation: 'unidad_pertenece',
                                    scope: {
                                        fields:['idUnidadAdmtva','nombre']
                                    }
                                }
                            ]
                        }
                    })
                    .$promise
                    .then(function(resp) {
                        vm.mostrarSpiner = false;
                        if(resp.length > 0)
                        {
                            vm.mensaje_curp = 'La CURP ya se encuentra registrada a nombre de ' + resp[0].nombre_completo + ' registrado en la ' + resp[0].unidad_pertenece.nombre;
                            if(resp.estatus < 3)
                                vm.mensaje_curp += ', el cual se encuentra todavía en proceso de revisión.';
                            else if(resp.activo == false)
                                vm.mensaje_curp += ', el cual no se encuentra activo.';
                            else
                                vm.mensaje_curp += ', si desea registrarlo también en su unidad comuníquese al depto. de programas para que realicen esta asignación.';

                            vm.color_msg_curp = 'danger';
                            vm.mostrar_msg_curp = true;
                        }
                        else
                        {
                            vm.mensaje_curp = 'CURP no repetida';
                            vm.color_msg_curp = 'success';
                            vm.mostrar_msg_curp = true;
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
                        where: {idEspecialidad: vm.especialidadSeleccionada.idEspecialidad},
                        fields: ['idCatalogoCurso','nombreCurso','modalidad','numeroHoras'],
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
                    numeroHoras     : vm.cursoSeleccionado.numeroHoras,
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
            };


            function guardar() {

                vm.mostrarSpiner = true;

                if(vm.cursos_habilitados.length == 0)
                {
                        vm.mostrarSpiner = false;
                        vm.mensaje = 'No se han definido los cursos que el instructor puede impartir';
                        vm.mostrar_msg_error = true;
                        $timeout(function(){
                             vm.mensaje = '';
                             vm.mostrar_msg_error = false;
                        }, 3000);
                }
                else
                {
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
                                    vm.registroEdicion.idLocalidad = vm.localidadSeleccionada.idLocalidad;
                                    vm.registroEdicion.localidad = vm.localidadSeleccionada.nombre;

                                    CatalogoInstructores
                                    .create({
                                        idUnidadAdmtva     : $scope.currentUser.unidad_pertenece_id,
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
                                        activo             : false,
                                        estatus            : 0
                                    })
                                    .$promise
                                    .then(function(respuesta) {

                                            CatalogoInstructores.otras_unidades.link({
                                                id: respuesta.idInstructor,
                                                fk: $scope.currentUser.unidad_pertenece_id
                                            },{}) 
                                            .$promise
                                            .then(function(resp) {
                                            });

                                            if(vm.cursos_habilitados.length > 0)
                                            {
                                                    var totalregistros = 0;
                                                    angular.forEach(vm.cursos_habilitados, function(record) {

                                                            CatalogoInstructores.cursos_habilitados.link({
                                                                id: respuesta.idInstructor,
                                                                fk: record.idCatalogoCurso
                                                            },{
                                                                calificacion: 0.0
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
                }

            };
    };

})();