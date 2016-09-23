var models = require(__dirname + '/../server/server.js').models;

var Promise = require('bluebird');
var http = require('http');

//Creacion de los modelos
var ModeloActualizar = models.Capacitandos;
var token = 'C5wg8WgFaIqGfs59n1q25Js96gNj4wYtDkNR9eQG8jl1yhaRFGKqv0XrvLCJwAk3';
var host = '69.28.92.27';
var port = 80;

console.log("Migrando los datos del modelo de alumnos a capacitandos");

http.get({
    host: host,
    port: port,
    path: '/api/Alumnos/count?access_token='+token
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
					    path: '/api/Alumnos?filter={"limit":'+num_registros+',"skip":'+inicio+'}&access_token='+token
					}, function(response) {

						    var body = '';
						    response.on('data', function(d) {
						        body += d;
						    });
						    response.on('end', function() {
						        var resultado = JSON.parse(body);

								var datos = [];
								for (var i = 0; i < resultado.length; i++) {
									
										var posicion = resultado[i].apellidos.indexOf(" ");
										if(posicion < 0)
										{
											var paterno = resultado[i].apellidos;
											var materno = '';
										}
										else
										{											
											var paterno = resultado[i].apellidos.substr(0, posicion);
											var materno = resultado[i].apellidos.substr( (posicion+1), resultado[i].apellidos.length);
										}
										var telefono = (resultado[i].telefono.length > 10 ? resultado[i].telefono.substr( (resultado[i].telefono.length-10), resultado[i].telefono.length) : resultado[i].telefono);
										
										if(resultado[i].curp == undefined)
											var curp = '';
										else
											var curp = (resultado[i].curp.length > 22 ? resultado[i].curp.substr( 0, 22) : resultado[i].curp);

										
										if(resultado[i].empresa_telefono == undefined)
											var empresa_telefono = '';
										else
											var empresa_telefono = (resultado[i].empresa_telefono.length > 10 ? resultado[i].empresa_telefono.substr( (resultado[i].empresa_telefono.length-10), resultado[i].empresa_telefono.length) : resultado[i].empresa_telefono);

										json_fechaNac = calculaNacim(resultado[i].curp);

										datos.push(
										{
										  idUnidadAdmtva      : 0,
										  apellidoPaterno     : paterno,
										  apellidoMaterno     : materno,
										  nombre              : resultado[i].nombre,
										  sexo                : resultado[i].sexo,
										  email               : resultado[i].email,
										  diaNacimiento       : json_fechaNac.dia,
										  mesNacimiento       : json_fechaNac.mes,
										  anioNacimiento      : json_fechaNac.anio,
										  edad                : resultado[i].edad,
										  telefono            : telefono,
										  celular             : '',
										  curp                : curp,
										  domicilio           : resultado[i].direccion,
										  colonia             : resultado[i].colonia,
										  codigoPostal        : resultado[i].codigo_postal,
										  idLocalidad         : 0,
										  idNivelEstudios     : 0,
										  estadoCivil         : resultado[i].estado_civil,
										  foto                : resultado[i].foto,
										  disVisual           : resultado[i].dis_visual,
										  disAuditiva         : resultado[i].dis_auditiva,
										  disLenguaje         : resultado[i].dis_lenguaje,
										  disMotriz           : resultado[i].dis_motriz,
										  disMental           : resultado[i].dis_mental,
										  enfermedadPadece    : resultado[i].enfermedad,
										  enfermedadCual      : resultado[i].enfermedad_cual,
										  tutorNombre         : resultado[i].tutor_nombre,
										  tutorCurp           : resultado[i].tutor_curp,
										  tutorParentesco     : resultado[i].tutor_parentesco,
										  tutorDireccion      : resultado[i].tutor_direccion,
										  tutorTelefono       : resultado[i].tutor_telefono,
										  docActaNacimiento   : resultado[i].acta_nacimiento,
										  docCompEstudios     : resultado[i].comp_estudios,
										  docIdentOficial     : resultado[i].ident_oficial,
										  docConstCurp        : resultado[i].const_curp,
										  docFotografias      : resultado[i].fotografias,
										  docCompMigratorio   : resultado[i].comp_migratorio,
										  docCompDomicilio    : resultado[i].comp_domicilio,
										  docCurpTutor        : resultado[i].curp_tutor,
										  trabajaActualmente  : (resultado[i].empresa_trabaja == '' || resultado[i].empresa_trabaja == undefined ? 'no' : 'si'),
										  idActividad         : 0,
										  empresaTrabaja      : resultado[i].empresa_trabaja,
										  empresaPuesto       : resultado[i].empresa_puesto,
										  empresaAntiguedad   : resultado[i].empresa_antiguedad,
										  empresaDireccion    : resultado[i].empresa_direccion,
										  empresaTelefono     : empresa_telefono,
										  idExperiencia       : 0,
										  idMedio             : 0,
										  idMotivo            : 0,
										  idGrupoPertenece    : 0,
										  gpoJefasFamilia     : false,
										  gpoSitViolencia     : false,
										  gpoAdolCalle        : false,
										  gpoIndigenas        : false,
										  gpoAdultoMayor      : false,
										  gpoLgbttti          : false,
										  gpoDentroCereso     : false,
										  gpoCapDiferentes    : false,
										  gpoMenorReadap      : false,
										  gpoFueraCereso      : false,
										  registroRemoto      : resultado[i].registro_remoto,
										  fechaRegistro       : resultado[i].fecha_registro,
										  ultimaActualizacion : Date(),
										  idAnterior          : resultado[i].id,
										  localidad_ant       : resultado[i].localidad,
										  estudios_ant        : resultado[i].estudios,
										  actividad_ant       : resultado[i].actividad,
										  experiencia_ant     : resultado[i].experiencia,
										  motivos_ant         : resultado[i].motivos
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




function calculaNacim(curp) {

    var json_datos = {
    	edad: 0,
    	dia: '',
    	mes: '',
    	anio: ''
    };
    if(curp == undefined)
        return json_datos;

    if(curp.length >= 10)
    {
            var error_fecha = false;

            if( isNaN(Number(curp.substr(4,2))))
                error_fecha = true;
            else if( isNaN(Number(curp.substr(6,2))) )
                error_fecha = true;
            else if(isNaN(Number(curp.substr(8,2))) )
                error_fecha = true;

            if(error_fecha == true)
            {
                return json_datos;
            }
            else
            {
                var fechaHoy = new Date();
                var anioHoy = fechaHoy.getFullYear();

                var anio = parseInt(curp.substr(4,2)) + 2000;
                if( (anioHoy - anio) < 0)
                    var anio = parseInt(curp.substr(4,2)) + 1900;

                var mes = parseInt(curp.substr(6,2));
                var dia = parseInt(curp.substr(8,2));

                var fechaNacimiento = new Date(anio,(mes-1),dia);
                
                var edad = fechaHoy.getFullYear()- fechaNacimiento.getFullYear() - 1; 
                
                if(fechaHoy.getMonth() + 1 - mes > 0) 
                    edad++;

                if( (fechaHoy.getDate() - dia >= 0) && (fechaHoy.getMonth() + 1 - mes == 0) ) 
                    edad++;

                json_datos.edad = edad;
                json_datos.anio = anio.toString();
                json_datos.mes  = curp.substr(6,2);
                json_datos.dia  = curp.substr(8,2);
            	return json_datos;
            }
    }
    else
    	return json_datos;
}















/*
var https = require('https');
var optionsget = {
    host : 'graph.facebook.com', // here only the domain name
    // (no http/https !)
    port : 443,
    path : '/youscada', // the rest of the url with parameters if needed
    method : 'GET' // do GET
};
 
console.info('Options prepared:');
console.info(optionsget);
console.info('Do the GET call');
 
// do the GET request
var reqGet = https.request(optionsget, function(res) {
    console.log("statusCode: ", res.statusCode);
    // uncomment it for header details
//  console.log("headers: ", res.headers);
 
 
    res.on('data', function(d) {
        console.info('GET result:\n');
        process.stdout.write(d);
        console.info('\n\nCall completed');
    });
 
});
 
reqGet.end();
reqGet.on('error', function(e) {
    console.error(e);
});
 */