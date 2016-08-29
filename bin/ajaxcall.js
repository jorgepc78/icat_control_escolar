var http = require('http');

http.get({
    host: '127.0.0.1',
    port: 3000,
    path: '/api/Alumnos?filter={"limit":2,"skip":0}&access_token=PGXptBSgE4r3KONJPPFcaNRG5DkzlakEiO7adCIE5yycI6j2wBniEjQzSlgkRmKK'
    //path: '/api/Alumnos/count?access_token=PGXptBSgE4r3KONJPPFcaNRG5DkzlakEiO7adCIE5yycI6j2wBniEjQzSlgkRmKK'
}, function(response) {
    // Continuously update stream with data
    var body = '';
    response.on('data', function(d) {
        body += d;
    });
    response.on('end', function() {

        // Data reception is done, do whatever with it!
        var resultado = JSON.parse(body);
        console.log(resultado[0].nombre_completo);
    });
});