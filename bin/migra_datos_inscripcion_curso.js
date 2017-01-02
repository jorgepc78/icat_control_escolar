var models = require(__dirname + '/../server/server.js').models;

var Promise = require('bluebird');
var http = require('http');

//Creacion de los modelos
var ModeloActualizar = models.InscripcionCurso;
var token = 'QsZ6RbI45mArq9okd4AZBbkMGObdG9MeuTJjKOJzTO3TbMnoQGHzGNu0ZANQ003s';
var host = '69.28.92.27';
var port = 80;

console.log("Migrando los datos del modelo de InscripcionesCursos a InscripcionCurso");

http.get({
    host: host,
    port: port,
    path: '/api/InscripcionesCursos/count?access_token='+token
}, function(response) {
    var body = '';
    response.on('data', function(d) {
        body += d;
    });
    response.on('end', function() {

       var resultado = JSON.parse(body);

		console.log("Total de registros: " + resultado.count);
		var num_registros = 20;
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
					    path: '/api/InscripcionesCursos?filter={"limit":'+num_registros+',"skip":'+inicio+'}&access_token='+token
					}, function(response) {

						    var body = '';
						    response.on('data', function(d) {
						        body += d;
						    });
						    response.on('end', function() {
						        var resultado = JSON.parse(body);

								var datos = [];
								for (var i = 0; i < resultado.length; i++) {

										if(resultado[i].num_factura == undefined)
											var num_factura = '';
										else
											var num_factura = (resultado[i].num_factura.length > 22 ? resultado[i].num_factura.substr( (resultado[i].num_factura.length-22), resultado[i].num_factura.length) : resultado[i].num_factura);

										datos.push(
										{
										  idAlumno           : 0,
										  idCurso            : 0,
										  fechaInscripcion   : resultado[i].fecha_inscripcion,
										  pagado             : (resultado[i].pagado == true ? 1 : 0),
										  fechaPago          : resultado[i].fecha_pago,
										  numFactura         : num_factura,
										  calificacion       : resultado[i].calificacion,
										  numDocAcreditacion : resultado[i].num_doc_acreditacion,
										  alumno_id		     : resultado[i].alumnoId,
										  curso_id	         : resultado[i].cursoId
										});

								}

								ModeloActualizar.create(datos,function(err, resultado) {
									if(err)
									{
										console.log(err);
										console.log(datos);
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

