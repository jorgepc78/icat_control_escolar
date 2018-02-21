(function() {
    'use strict';

    angular
        .module('icat_control_escolar')
        .controller('ModalEditaPropuestaInstructorController', ModalEditaPropuestaInstructorController);

        ModalEditaPropuestaInstructorController.$inject = ['$scope', '$timeout', '$modalInstance', 'FileUploader', 'registroEditar', 'CatalogoInstructores', 'CatalogoUnidadesAdmtvas', 'CatalogoLocalidades', 'CatalogoEspecialidades', 'CatalogoCursos', 'CatalogoDocumentos', 'AlmacenDocumentos','DocumentosInstructores'];

    function ModalEditaPropuestaInstructorController($scope, $timeout, $modalInstance, FileUploader, registroEditar, CatalogoInstructores, CatalogoUnidadesAdmtvas, CatalogoLocalidades, CatalogoEspecialidades, CatalogoCursos, CatalogoDocumentos, AlmacenDocumentos, DocumentosInstructores) {

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
                    idInstructor       : registroEditar.idInstructor,
                    idUnidadAdmtva     : registroEditar.idUnidadAdmtva,
                    curp               : registroEditar.curp,
                    apellidoPaterno    : registroEditar.apellidoPaterno,
                    apellidoMaterno    : registroEditar.apellidoMaterno,
                    nombre             : registroEditar.nombre,
                    rfc                : registroEditar.rfc,
                    conPerfilAcademico : registroEditar.conPerfilAcademico,
                    escolaridad        : registroEditar.escolaridad,
                    telefono           : registroEditar.telefono,
                    email              : registroEditar.email,
                    certificacion      : registroEditar.certificacion,
                    idLocalidad        : registroEditar.idLocalidad,
                    localidad          : '',
                    activo             : registroEditar.activo,
                    calif_evaluacion_curso   : []
            };

            vm.cursos_habilitados = [];
            vm.unidades_checkbox = [];

            inicia();


            function inicia() {

                angular.forEach(registroEditar.calif_evaluacion_curso, function(record) {
                      vm.cursos_habilitados.push({
                          idCatalogoCurso : record.CatalogoCursos.idCatalogoCurso,
                          nombreCurso     : record.CatalogoCursos.nombreCurso,
                          numeroHoras     : record.CatalogoCursos.numeroHoras,
                          especialidad    : record.CatalogoCursos.especialidad.nombre
                      });
                });
    
                CatalogoLocalidades.find({
                    filter: {
                        fields: ['idLocalidad','nombre','municipio'],
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


            function checaCURP() {
                vm.mostrarSpiner = true;
                if( (vm.curpTemp !== vm.registroEdicion.curp) && (vm.registroEdicion.curp !== '') && (vm.registroEdicion.curp !== undefined) )
                {
                    vm.curpTemp = vm.registroEdicion.curp;
                    CatalogoInstructores.find({
                        filter: {
                            where: {
                                and: [
                                    {curp: vm.registroEdicion.curp },
                                    {idInstructor: {neq : vm.registroEdicion.idInstructor}}
                                ]
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
                            vm.mensaje_curp = '';
                            vm.mostrar_msg_curp = false;
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


            function agregaCurso() {
                vm.cursos_habilitados.push({
                    idCatalogoCurso : vm.cursoSeleccionado.idCatalogoCurso,
                    nombreCurso     : vm.cursoSeleccionado.nombreCurso + ' - ' + vm.especialidadSeleccionada.nombre,
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
                //vm.muestraCursosEspecialidad();
            };



            function guardar() {

                vm.mostrarSpiner = true;

                CatalogoInstructores.count({
                      where: {
                        and: [
                            {curp: vm.registroEdicion.curp },
                            {idInstructor: {neq : vm.registroEdicion.idInstructor}}
                        ]
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
                            var datos = {
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
                                    estatus            : 0
                            };


                            vm.registroEdicion.idLocalidad = vm.localidadSeleccionada.idLocalidad;
                            vm.registroEdicion.localidad = vm.localidadSeleccionada.nombre;

                            vm.registroEdicion.nombre_completo = (vm.registroEdicion.apellidoPaterno + ' ' + vm.registroEdicion.apellidoMaterno + ' ' + vm.registroEdicion.nombre);

                            CatalogoInstructores.prototype$updateAttributes(
                            {
                                id: vm.registroEdicion.idInstructor
                            },
                                datos
                            )
                            .$promise
                            .then(function(respuesta) {

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

                                                                        vm.registroEdicion.calif_evaluacion_curso.push({
                                                                            id              : resp.id,
                                                                            idInstructor    : resp.idInstructor,
                                                                            idCatalogoCurso : resp.idCatalogoCurso,
                                                                            CatalogoCursos  : {
                                                                                idCatalogoCurso : resp.idCatalogoCurso,
                                                                                nombreCurso     : vm.cursos_habilitados[index].nombreCurso,
                                                                                numeroHoras     : vm.cursos_habilitados[index].numeroHoras,
                                                                                especialidad    : {
                                                                                    nombre: vm.cursos_habilitados[index].especialidad
                                                                                }
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
                            })
                            .catch(function(error) {
                            });
                    }
                });
                
            };
    };

})();