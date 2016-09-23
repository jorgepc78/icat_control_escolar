(function() {
    'use strict';

	angular
	    .module('icat_control_escolar')
	    .service('tablaDatosService', tablaDatosService);

	tablaDatosService.$inject = ['$q'];

	function tablaDatosService($q) {
			
			this.obtiene_datos_tabla = function(modelo, obj_config_tabla)
			{
					var defer = $q.defer();
			       	
			       	var fin = obj_config_tabla.registrosPorPagina;
			       	var inicio = 0;
			       	var total_registros = 0;

			        if(obj_config_tabla.filtro_datos.id !== undefined)
					    var cond = {id: obj_config_tabla.filtro_datos.id};
			        else
					    var cond = {where: obj_config_tabla.condicion};

			        modelo.count(cond)
			        .$promise
			        .then(function(resp) {

							total_registros = resp.count;

							if(fin > total_registros)
								fin = total_registros;

							if(total_registros == 0)
								inicio = -1;

							//Configuracion de los filtros y limits de la consulta de los datos
							obj_config_tabla.filtro_datos.filter.where = obj_config_tabla.condicion;
							obj_config_tabla.filtro_datos.filter.limit = obj_config_tabla.registrosPorPagina;
							obj_config_tabla.filtro_datos.filter.skip  = obj_config_tabla.paginaActual - 1;

					        if(obj_config_tabla.filtro_datos.id !== undefined) 
					        {
								modelo(obj_config_tabla.filtro_datos)
								.$promise
								.then(function(resultado) {
										defer.resolve({
											total_registros : total_registros,
											inicio          : inicio,
											fin             : fin,
											datos 			: resultado
										});
								});
					        }
					        else
					        {
								modelo.find(obj_config_tabla.filtro_datos)
								.$promise
								.then(function(resultado) {
										defer.resolve({
											total_registros : total_registros,
											inicio          : inicio,
											fin             : fin,
											datos 			: resultado
										});
								});
					        }

					});


					return defer.promise;
			}


			this.cambia_pagina = function(modelo, obj_config_tabla)
			{

		            var inicio 	= (obj_config_tabla.paginaActual - 1) * obj_config_tabla.registrosPorPagina;
		            var fin 	= inicio + obj_config_tabla.registrosPorPagina;

		            if(fin > obj_config_tabla.totalElementos)
		            	fin = obj_config_tabla.totalElementos;

					obj_config_tabla.filtro_datos.filter.where = obj_config_tabla.condicion;
					obj_config_tabla.filtro_datos.filter.limit = obj_config_tabla.registrosPorPagina;
					obj_config_tabla.filtro_datos.filter.skip  = inicio;

					var defer = $q.defer();
					modelo.find(obj_config_tabla.filtro_datos)
					.$promise
					.then(function(resultado) {
							defer.resolve({
								inicio : inicio,
								fin    : fin,
								datos  : resultado
							});

					});

					return defer.promise;
			}
	}

})();