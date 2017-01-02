var models = require(__dirname + '/../server/server.js').models;

var Promise = require('bluebird');
var http = require('http');

//Creacion de los modelos
var ModeloActualizar = models.CursosOficiales;
var token = 'QsZ6RbI45mArq9okd4AZBbkMGObdG9MeuTJjKOJzTO3TbMnoQGHzGNu0ZANQ003s';
var host = '69.28.92.27';
var port = 80;

console.log("Migrando los datos del modelo de cursos a Cursos oficiales");

http.get({
    host: host,
    port: port,
    path: '/api/Cursos/count?access_token='+token
}, function(response) {
    var body = '';
    response.on('data', function(d) {
        body += d;
    });
    response.on('end', function() {

        var resultado = JSON.parse(body);

		console.log("Total de registros: " + resultado.count);
		var num_registros = 10;
		var num_vueltas = Math.round(resultado.count / num_registros);
		var index = 0;

		promiseWhile(function() {
		    // Condition for stopping
		    return index <= num_vueltas;
		}, function() {
		    // The function to run, should return a promise
		    return new Promise(function(resolve, reject) {
		        // Arbitrary 250ms async method to simulate async process
					inicio 	= index * num_registros;
					
					http.get({
					    host: host,
					    port: port,
					    path: '/api/Cursos?filter={"limit":'+num_registros+',"skip":'+inicio+'}&access_token='+token
					}, function(response) {

						    var body = '';
						    response.on('data', function(d) {
						        body += d;
						    });
						    response.on('end', function() {
						        var resultado = JSON.parse(body);

								var datos = [];
								for (var i = 0; i < resultado.length; i++) {

										var estatus = 0;
										if(resultado[i].estatus == 0)
											estatus = 2;
										else if(resultado[i].estatus == 1)
											estatus = 4;
										else if(resultado[i].estatus == 2)
											estatus = 6;
										else if(resultado[i].estatus == 3)
											estatus = 7;
										else if(resultado[i].estatus == 4)
											estatus = 7;

										datos.push(
										{
										  idUnidadAdmtva        : 0,
										  idCursoPTC            : 0,
										  idPtc                 : 0,
										  idLocalidad           : 0,
										  idCatalogoCurso       : 0,
										  nombreCurso           : resultado[i].nombre_curso,
										  claveCurso            : resultado[i].clave_curso,
										  descripcionCurso      : resultado[i].descripcion,
										  modalidad             : '',
										  horario               : resultado[i].horario,
										  aulaAsignada          : '',
										  horasSemana           : 0,
										  numeroHoras           : resultado[i].numero_horas,
										  costo                 : resultado[i].costo,
										  cupoMaximo            : resultado[i].cupo_maximo,
										  minRequeridoInscritos : resultado[i].min_requerido_inscritos,
										  minRequeridoPago      : resultado[i].min_requerido_pago,
										  fechaInicio           : resultado[i].fecha_inicio,
										  fechaFin              : resultado[i].fecha_fin,
										  idInstructor          : 0,
										  curpInstructor        : '',
										  nombreInstructor      : resultado[i].instructor,
										  observaciones         : resultado[i].observaciones,
										  estatus               : estatus,
										  publico               : (resultado[i].publico == 0 ? false : true),
										  programadoPTC         : false,
										  aprobadoAcademica     : true,
										  aprobadoPlaneacion    : true,
										  aprobadoDireccionGral : true,
										  id_anterior			: resultado[i].id,
										  catalogo_curso_id		: resultado[i].catalogo_cursoId,
										  ciudad_pertenece_id	: resultado[i].ciudad_perteneceId,
										  unidad_pertenece_id	: resultado[i].unidad_perteneceId
										});

								}

								ModeloActualizar.create(datos,function(err, resultado) {
									if(err)
									{
										console.log(err);
										//console.log(datos);
										index = num_vueltas;
										resolve();
									}
									else{
							            index++;
							            console.log("Porcentaje de avance: " + ((index / (num_vueltas+1)) * 100).toFixed(2) + "%, registros escritos: "+ resultado.length);
							            resolve();
									}
								});
						    });
					});

		    });
		}).then(function() {
		    // Notice we can chain it because it's a Promise, this will run after completion of the promiseWhile Promise!
		    console.log("Terminado");
		    process.exit();
		});


    });
});





var promiseWhile = function(condition, action) {
    var resolver = Promise.defer();

    var loop = function() {
        if (!condition()) return resolver.resolve();
        return Promise.cast(action())
            .then(loop)
            .catch(resolver.reject);
    };

    process.nextTick(loop);

    return resolver.promise;
};

