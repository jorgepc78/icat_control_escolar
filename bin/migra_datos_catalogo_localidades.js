var models = require(__dirname + '/../server/server.js').models;

var Promise = require('bluebird');
var http = require('http');

//Creacion de los modelos
var ModeloActualizar = models.CatalogoLocalidades;
var token = 'QsZ6RbI45mArq9okd4AZBbkMGObdG9MeuTJjKOJzTO3TbMnoQGHzGNu0ZANQ003s';
var host = '69.28.92.27';
var port = 80;

console.log("Migrando datos al modelo CatalogoLocalidades");

http.get({
    host: host,
    port: port,
    path: '/api/Ciudades/count?access_token='+token
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
					    path: '/api/Ciudades?filter={"limit":'+num_registros+',"skip":'+inicio+'}&access_token='+token
					}, function(response) {

						    var body = '';
						    response.on('data', function(d) {
						        body += d;
						    });
						    response.on('end', function() {
						        var resultado = JSON.parse(body);

								var datos = [];
								for (var i = 0; i < resultado.length; i++) {

										datos.push(
										{
										  nombre      : resultado[i].nombre,
										  id_anterior : resultado[i].id
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

