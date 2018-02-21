module.exports = function(Evaluacion) {

    Evaluacion.exporta_doc_valida_evaluacion = function(idEvaluacion, res, callback) {

            var fs = require('fs');
            var Docxtemplater = require('docxtemplater');


            Evaluacion.find({ 
                        where: {idEvaluacion: idEvaluacion },
                        include: [
                            {
                                relation: 'unidad_pertenece',
                                scope: {
                                  fields:['idUnidadAdmtva','nombre','nombreDirector']
                                }
                            },
                            {
                                relation: 'alumnos_inscritos',
                                scope: {
                                  fields: ['idAlumno','nombreCompleto','sexo','edad','idNivelEstudios'],
                                }
                            },
                            {
                                relation: 'inscripcionesEvaluaciones',
                                scope: {
                                  fields: ['id', 'idAlumno', 'pagado', 'fechaPago','numFactura','calificacion','numDocAcreditacion']
                                }
                            }
                        ]
                    },
                    function(err, resultado) {

                            var EvaluacionEncontrada = JSON.parse( JSON.stringify( resultado[0] ) );
                            //console.log(EvaluacionEncontrada);

                            var nombre_evaluacion = (EvaluacionEncontrada.tipoEvaluacion == 1 ? EvaluacionEncontrada.nombreCurso : EvaluacionEncontrada.nombreEstandar);
                            var tipo_evaluacion = (EvaluacionEncontrada.tipoEvaluacion == 1 ? 'ROCO' : 'Estándar de competencia');

                            var nombre_archivo = 'oficio_validacion_evaluacion_' + EvaluacionEncontrada.unidad_pertenece.nombre + '_' + EvaluacionEncontrada.nombreCurso;

                            var meses_nombre = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
                            var meses = ['01','02','03','04','05','06','07','08','09','10','11','12'];
                            //set the templateVariables
                            var fechaElaboracion = new Date();
                            var fechaEvaluacion = new Date(EvaluacionEncontrada.fechaEvaluacion);

                            var codigo = {
                                "anio"                 : fechaElaboracion.getUTCFullYear(),
                                "fecha_elaboracion"    : fechaElaboracion.getDate() +' de '+ meses_nombre[fechaElaboracion.getMonth()] +' de '+ fechaElaboracion.getUTCFullYear(),
                                "nombre_director"      : EvaluacionEncontrada.unidad_pertenece.nombreDirector.toUpperCase(),
                                "nombre_unidad"        : EvaluacionEncontrada.unidad_pertenece.nombre.toUpperCase(),
                                "nombre_evaluacion"    : nombre_evaluacion,
                                "tipo_evaluacion"      : tipo_evaluacion,
                                "hora_evaluacion"      : EvaluacionEncontrada.horaEvaluacion,
                                "lugar_evaluacion"     : EvaluacionEncontrada.aulaAsignada,
                                "nombre_persona"       : EvaluacionEncontrada.alumnos_inscritos[0].nombreCompleto,
                                "nomenclatura_contrato": EvaluacionEncontrada.nomenclaturaContrato,
                                "evaluador"            : EvaluacionEncontrada.nombreInstructor,
                                "fecha_plan_evaluacion": fechaEvaluacion.getDate() +'/'+ meses_nombre[fechaEvaluacion.getMonth()] +'/'+ fechaEvaluacion.getUTCFullYear(),
                                "costo"                : EvaluacionEncontrada.costo,
                                "num_factura"          : EvaluacionEncontrada.inscripcionesEvaluaciones[0].numFactura,
                                "pago_evaluador"       : EvaluacionEncontrada.cantidadPagoEvaluador,
                                "sexo"                 : EvaluacionEncontrada.alumnos_inscritos[0].sexo,
                                "edad"                 : EvaluacionEncontrada.alumnos_inscritos[0].edad,
                                "escolaridad"          : EvaluacionEncontrada.alumnos_inscritos[0].idNivelEstudios,
                                "observaciones"        : EvaluacionEncontrada.observaciones
                            };

                            //console.log(codigo);
                            //console.log(idCatalogoCurso);
                            //console.log("**********************************************************************************************************");
                            //console.log(EvaluacionEncontrada.instructor);
                            //console.log(EvaluacionEncontrada.instructor.evaluacion_curso);
                            //Load the docx file as a binary
                            var content = fs.readFileSync(__dirname + "/../../templates/oficio_autorizacion_evaluacion.docx", "binary");
                            var doc = new Docxtemplater(content);
                            doc.setData(codigo);
                            doc.render();
                            var buf = doc.getZip().generate({type:"nodebuffer"});

                            var datetime = new Date();
                            res.set('Expires', 'Tue, 03 Jul 2001 06:00:00 GMT');
                            res.set('Cache-Control', 'max-age=0, no-cache, must-revalidate, proxy-revalidate');
                            res.set('Last-Modified', datetime +'GMT');
                            res.set('Content-Type','application/force-download');
                            res.set('Content-Type','application/octet-stream');
                            res.set('Content-Type','application/download');
                            res.set('Content-Disposition','attachment;filename='+nombre_archivo+'.docx');
                            res.set('Content-Transfer-Encoding','binary');
                            res.send(buf);
                    });

    };

    Evaluacion.remoteMethod(
    'exporta_doc_valida_evaluacion',
    {
      accepts: [
        {arg: 'idEvaluacion', type: 'string', required: true },
        {arg: 'res', type: 'object', 'http': {source: 'res'}}
      ],
      returns: {},
      http: {path: '/exporta_doc_valida_evaluacion/:idEvaluacion', verb: 'get'}
    });


};
