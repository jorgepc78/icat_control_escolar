// CommonJS package manager support
if (typeof module !== 'undefined' && typeof exports !== 'undefined' && module.exports === exports) {
  // Export the *name* of this Angular module
  // Sample usage:
  //
  //   import lbServices from './lb-services';
  //   angular.module('app', [lbServices]);
  //
  module.exports = "lbServices";
}

(function(window, angular, undefined) {'use strict';

var urlBase = "/api";
var authHeader = 'authorization';

function getHost(url) {
  var m = url.match(/^(?:https?:)?\/\/([^\/]+)/);
  return m ? m[1] : null;
}

var urlBaseHost = getHost(urlBase) || location.host;

/**
 * @ngdoc overview
 * @name lbServices
 * @module
 * @description
 *
 * The `lbServices` module provides services for interacting with
 * the models exposed by the LoopBack server via the REST API.
 *
 */
var module = angular.module("lbServices", ['ngResource']);

/**
 * @ngdoc object
 * @name lbServices.RoleMapping
 * @header lbServices.RoleMapping
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `RoleMapping` model.
 *
 * **Details**
 *
 * Map principals to roles
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "RoleMapping",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/RoleMappings/:id",
      { 'id': '@id' },
      {

        /**
         * @ngdoc method
         * @name lbServices.RoleMapping#prototype$__get__user
         * @methodOf lbServices.RoleMapping
         *
         * @description
         *
         * Fetches belongsTo relation user.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `refresh` – `{boolean=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `RoleMapping` object.)
         * </em>
         */
        "prototype$__get__user": {
          url: urlBase + "/RoleMappings/:id/user",
          method: "GET"
        },

        // INTERNAL. Use RoleMapping.role() instead.
        "prototype$__get__role": {
          url: urlBase + "/RoleMappings/:id/role",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.RoleMapping#create
         * @methodOf lbServices.RoleMapping
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `RoleMapping` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/RoleMappings",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.RoleMapping#createMany
         * @methodOf lbServices.RoleMapping
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `RoleMapping` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/RoleMappings",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.RoleMapping#upsert
         * @methodOf lbServices.RoleMapping
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `RoleMapping` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/RoleMappings",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.RoleMapping#exists
         * @methodOf lbServices.RoleMapping
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` - 
         */
        "exists": {
          url: urlBase + "/RoleMappings/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.RoleMapping#findById
         * @methodOf lbServices.RoleMapping
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `RoleMapping` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/RoleMappings/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.RoleMapping#find
         * @methodOf lbServices.RoleMapping
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `RoleMapping` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/RoleMappings",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.RoleMapping#findOne
         * @methodOf lbServices.RoleMapping
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `RoleMapping` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/RoleMappings/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.RoleMapping#updateAll
         * @methodOf lbServices.RoleMapping
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        "updateAll": {
          url: urlBase + "/RoleMappings/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.RoleMapping#deleteById
         * @methodOf lbServices.RoleMapping
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `RoleMapping` object.)
         * </em>
         */
        "deleteById": {
          url: urlBase + "/RoleMappings/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.RoleMapping#count
         * @methodOf lbServices.RoleMapping
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        "count": {
          url: urlBase + "/RoleMappings/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.RoleMapping#prototype$updateAttributes
         * @methodOf lbServices.RoleMapping
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `RoleMapping` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/RoleMappings/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.RoleMapping#createChangeStream
         * @methodOf lbServices.RoleMapping
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` - 
         */
        "createChangeStream": {
          url: urlBase + "/RoleMappings/change-stream",
          method: "POST"
        },

        // INTERNAL. Use Role.principals.findById() instead.
        "::findById::Role::principals": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Roles/:id/principals/:fk",
          method: "GET"
        },

        // INTERNAL. Use Role.principals.destroyById() instead.
        "::destroyById::Role::principals": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Roles/:id/principals/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use Role.principals.updateById() instead.
        "::updateById::Role::principals": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Roles/:id/principals/:fk",
          method: "PUT"
        },

        // INTERNAL. Use Role.principals() instead.
        "::get::Role::principals": {
          isArray: true,
          url: urlBase + "/Roles/:id/principals",
          method: "GET"
        },

        // INTERNAL. Use Role.principals.create() instead.
        "::create::Role::principals": {
          url: urlBase + "/Roles/:id/principals",
          method: "POST"
        },

        // INTERNAL. Use Role.principals.createMany() instead.
        "::createMany::Role::principals": {
          isArray: true,
          url: urlBase + "/Roles/:id/principals",
          method: "POST"
        },

        // INTERNAL. Use Role.principals.destroyAll() instead.
        "::delete::Role::principals": {
          url: urlBase + "/Roles/:id/principals",
          method: "DELETE"
        },

        // INTERNAL. Use Role.principals.count() instead.
        "::count::Role::principals": {
          url: urlBase + "/Roles/:id/principals/count",
          method: "GET"
        },
      }
    );



        /**
         * @ngdoc method
         * @name lbServices.RoleMapping#updateOrCreate
         * @methodOf lbServices.RoleMapping
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `RoleMapping` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name lbServices.RoleMapping#update
         * @methodOf lbServices.RoleMapping
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name lbServices.RoleMapping#destroyById
         * @methodOf lbServices.RoleMapping
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `RoleMapping` object.)
         * </em>
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name lbServices.RoleMapping#removeById
         * @methodOf lbServices.RoleMapping
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `RoleMapping` object.)
         * </em>
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name lbServices.RoleMapping#modelName
    * @propertyOf lbServices.RoleMapping
    * @description
    * The name of the model represented by this $resource,
    * i.e. `RoleMapping`.
    */
    R.modelName = "RoleMapping";


        /**
         * @ngdoc method
         * @name lbServices.RoleMapping#role
         * @methodOf lbServices.RoleMapping
         *
         * @description
         *
         * Fetches belongsTo relation role.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `refresh` – `{boolean=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Role` object.)
         * </em>
         */
        R.role = function() {
          var TargetResource = $injector.get("Role");
          var action = TargetResource["::get::RoleMapping::role"];
          return action.apply(R, arguments);
        };

    return R;
  }]);

/**
 * @ngdoc object
 * @name lbServices.Role
 * @header lbServices.Role
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Role` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "Role",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/Roles/:id",
      { 'id': '@id' },
      {

        // INTERNAL. Use Role.principals.findById() instead.
        "prototype$__findById__principals": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Roles/:id/principals/:fk",
          method: "GET"
        },

        // INTERNAL. Use Role.principals.destroyById() instead.
        "prototype$__destroyById__principals": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Roles/:id/principals/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use Role.principals.updateById() instead.
        "prototype$__updateById__principals": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Roles/:id/principals/:fk",
          method: "PUT"
        },

        // INTERNAL. Use Role.principals() instead.
        "prototype$__get__principals": {
          isArray: true,
          url: urlBase + "/Roles/:id/principals",
          method: "GET"
        },

        // INTERNAL. Use Role.principals.create() instead.
        "prototype$__create__principals": {
          url: urlBase + "/Roles/:id/principals",
          method: "POST"
        },

        // INTERNAL. Use Role.principals.destroyAll() instead.
        "prototype$__delete__principals": {
          url: urlBase + "/Roles/:id/principals",
          method: "DELETE"
        },

        // INTERNAL. Use Role.principals.count() instead.
        "prototype$__count__principals": {
          url: urlBase + "/Roles/:id/principals/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Role#create
         * @methodOf lbServices.Role
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Role` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/Roles",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Role#createMany
         * @methodOf lbServices.Role
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Role` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/Roles",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Role#upsert
         * @methodOf lbServices.Role
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Role` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/Roles",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.Role#exists
         * @methodOf lbServices.Role
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` - 
         */
        "exists": {
          url: urlBase + "/Roles/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Role#findById
         * @methodOf lbServices.Role
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Role` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/Roles/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Role#find
         * @methodOf lbServices.Role
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Role` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/Roles",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Role#findOne
         * @methodOf lbServices.Role
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Role` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/Roles/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Role#updateAll
         * @methodOf lbServices.Role
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        "updateAll": {
          url: urlBase + "/Roles/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Role#deleteById
         * @methodOf lbServices.Role
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Role` object.)
         * </em>
         */
        "deleteById": {
          url: urlBase + "/Roles/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.Role#count
         * @methodOf lbServices.Role
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        "count": {
          url: urlBase + "/Roles/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Role#prototype$updateAttributes
         * @methodOf lbServices.Role
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Role` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/Roles/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.Role#createChangeStream
         * @methodOf lbServices.Role
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` - 
         */
        "createChangeStream": {
          url: urlBase + "/Roles/change-stream",
          method: "POST"
        },

        // INTERNAL. Use RoleMapping.role() instead.
        "::get::RoleMapping::role": {
          url: urlBase + "/RoleMappings/:id/role",
          method: "GET"
        },

        // INTERNAL. Use Usuario.perfil.findById() instead.
        "::findById::Usuario::perfil": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Usuarios/:id/perfil/:fk",
          method: "GET"
        },

        // INTERNAL. Use Usuario.perfil.destroyById() instead.
        "::destroyById::Usuario::perfil": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Usuarios/:id/perfil/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use Usuario.perfil.updateById() instead.
        "::updateById::Usuario::perfil": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Usuarios/:id/perfil/:fk",
          method: "PUT"
        },

        // INTERNAL. Use Usuario.perfil.link() instead.
        "::link::Usuario::perfil": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Usuarios/:id/perfil/rel/:fk",
          method: "PUT"
        },

        // INTERNAL. Use Usuario.perfil.unlink() instead.
        "::unlink::Usuario::perfil": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Usuarios/:id/perfil/rel/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use Usuario.perfil.exists() instead.
        "::exists::Usuario::perfil": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Usuarios/:id/perfil/rel/:fk",
          method: "HEAD"
        },

        // INTERNAL. Use Usuario.perfil() instead.
        "::get::Usuario::perfil": {
          isArray: true,
          url: urlBase + "/Usuarios/:id/perfil",
          method: "GET"
        },

        // INTERNAL. Use Usuario.perfil.create() instead.
        "::create::Usuario::perfil": {
          url: urlBase + "/Usuarios/:id/perfil",
          method: "POST"
        },

        // INTERNAL. Use Usuario.perfil.createMany() instead.
        "::createMany::Usuario::perfil": {
          isArray: true,
          url: urlBase + "/Usuarios/:id/perfil",
          method: "POST"
        },

        // INTERNAL. Use Usuario.perfil.destroyAll() instead.
        "::delete::Usuario::perfil": {
          url: urlBase + "/Usuarios/:id/perfil",
          method: "DELETE"
        },

        // INTERNAL. Use Usuario.perfil.count() instead.
        "::count::Usuario::perfil": {
          url: urlBase + "/Usuarios/:id/perfil/count",
          method: "GET"
        },
      }
    );



        /**
         * @ngdoc method
         * @name lbServices.Role#updateOrCreate
         * @methodOf lbServices.Role
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Role` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name lbServices.Role#update
         * @methodOf lbServices.Role
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name lbServices.Role#destroyById
         * @methodOf lbServices.Role
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Role` object.)
         * </em>
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name lbServices.Role#removeById
         * @methodOf lbServices.Role
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Role` object.)
         * </em>
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name lbServices.Role#modelName
    * @propertyOf lbServices.Role
    * @description
    * The name of the model represented by this $resource,
    * i.e. `Role`.
    */
    R.modelName = "Role";

    /**
     * @ngdoc object
     * @name lbServices.Role.principals
     * @header lbServices.Role.principals
     * @object
     * @description
     *
     * The object `Role.principals` groups methods
     * manipulating `RoleMapping` instances related to `Role`.
     *
     * Call {@link lbServices.Role#principals Role.principals()}
     * to query all related instances.
     */


        /**
         * @ngdoc method
         * @name lbServices.Role#principals
         * @methodOf lbServices.Role
         *
         * @description
         *
         * Queries principals of Role.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `filter` – `{object=}` - 
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `RoleMapping` object.)
         * </em>
         */
        R.principals = function() {
          var TargetResource = $injector.get("RoleMapping");
          var action = TargetResource["::get::Role::principals"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Role.principals#count
         * @methodOf lbServices.Role.principals
         *
         * @description
         *
         * Counts principals of Role.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        R.principals.count = function() {
          var TargetResource = $injector.get("RoleMapping");
          var action = TargetResource["::count::Role::principals"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Role.principals#create
         * @methodOf lbServices.Role.principals
         *
         * @description
         *
         * Creates a new instance in principals of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `RoleMapping` object.)
         * </em>
         */
        R.principals.create = function() {
          var TargetResource = $injector.get("RoleMapping");
          var action = TargetResource["::create::Role::principals"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Role.principals#createMany
         * @methodOf lbServices.Role.principals
         *
         * @description
         *
         * Creates a new instance in principals of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `RoleMapping` object.)
         * </em>
         */
        R.principals.createMany = function() {
          var TargetResource = $injector.get("RoleMapping");
          var action = TargetResource["::createMany::Role::principals"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Role.principals#destroyAll
         * @methodOf lbServices.Role.principals
         *
         * @description
         *
         * Deletes all principals of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.principals.destroyAll = function() {
          var TargetResource = $injector.get("RoleMapping");
          var action = TargetResource["::delete::Role::principals"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Role.principals#destroyById
         * @methodOf lbServices.Role.principals
         *
         * @description
         *
         * Delete a related item by id for principals.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for principals
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.principals.destroyById = function() {
          var TargetResource = $injector.get("RoleMapping");
          var action = TargetResource["::destroyById::Role::principals"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Role.principals#findById
         * @methodOf lbServices.Role.principals
         *
         * @description
         *
         * Find a related item by id for principals.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for principals
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `RoleMapping` object.)
         * </em>
         */
        R.principals.findById = function() {
          var TargetResource = $injector.get("RoleMapping");
          var action = TargetResource["::findById::Role::principals"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Role.principals#updateById
         * @methodOf lbServices.Role.principals
         *
         * @description
         *
         * Update a related item by id for principals.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for principals
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `RoleMapping` object.)
         * </em>
         */
        R.principals.updateById = function() {
          var TargetResource = $injector.get("RoleMapping");
          var action = TargetResource["::updateById::Role::principals"];
          return action.apply(R, arguments);
        };

    return R;
  }]);

/**
 * @ngdoc object
 * @name lbServices.Usuario
 * @header lbServices.Usuario
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Usuario` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "Usuario",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/Usuarios/:id",
      { 'id': '@id' },
      {

        /**
         * @ngdoc method
         * @name lbServices.Usuario#prototype$__findById__accessTokens
         * @methodOf lbServices.Usuario
         *
         * @description
         *
         * Find a related item by id for accessTokens.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         *  - `fk` – `{*}` - Foreign key for accessTokens
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Usuario` object.)
         * </em>
         */
        "prototype$__findById__accessTokens": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Usuarios/:id/accessTokens/:fk",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Usuario#prototype$__destroyById__accessTokens
         * @methodOf lbServices.Usuario
         *
         * @description
         *
         * Delete a related item by id for accessTokens.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         *  - `fk` – `{*}` - Foreign key for accessTokens
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "prototype$__destroyById__accessTokens": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Usuarios/:id/accessTokens/:fk",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.Usuario#prototype$__updateById__accessTokens
         * @methodOf lbServices.Usuario
         *
         * @description
         *
         * Update a related item by id for accessTokens.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         *  - `fk` – `{*}` - Foreign key for accessTokens
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Usuario` object.)
         * </em>
         */
        "prototype$__updateById__accessTokens": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Usuarios/:id/accessTokens/:fk",
          method: "PUT"
        },

        // INTERNAL. Use Usuario.perfil.findById() instead.
        "prototype$__findById__perfil": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Usuarios/:id/perfil/:fk",
          method: "GET"
        },

        // INTERNAL. Use Usuario.perfil.destroyById() instead.
        "prototype$__destroyById__perfil": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Usuarios/:id/perfil/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use Usuario.perfil.updateById() instead.
        "prototype$__updateById__perfil": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Usuarios/:id/perfil/:fk",
          method: "PUT"
        },

        // INTERNAL. Use Usuario.perfil.link() instead.
        "prototype$__link__perfil": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Usuarios/:id/perfil/rel/:fk",
          method: "PUT"
        },

        // INTERNAL. Use Usuario.perfil.unlink() instead.
        "prototype$__unlink__perfil": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Usuarios/:id/perfil/rel/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use Usuario.perfil.exists() instead.
        "prototype$__exists__perfil": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/Usuarios/:id/perfil/rel/:fk",
          method: "HEAD"
        },

        // INTERNAL. Use Usuario.unidad_pertenece() instead.
        "prototype$__get__unidad_pertenece": {
          url: urlBase + "/Usuarios/:id/unidad_pertenece",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Usuario#prototype$__get__accessTokens
         * @methodOf lbServices.Usuario
         *
         * @description
         *
         * Queries accessTokens of Usuario.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         *  - `filter` – `{object=}` - 
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Usuario` object.)
         * </em>
         */
        "prototype$__get__accessTokens": {
          isArray: true,
          url: urlBase + "/Usuarios/:id/accessTokens",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Usuario#prototype$__create__accessTokens
         * @methodOf lbServices.Usuario
         *
         * @description
         *
         * Creates a new instance in accessTokens of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Usuario` object.)
         * </em>
         */
        "prototype$__create__accessTokens": {
          url: urlBase + "/Usuarios/:id/accessTokens",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Usuario#prototype$__delete__accessTokens
         * @methodOf lbServices.Usuario
         *
         * @description
         *
         * Deletes all accessTokens of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "prototype$__delete__accessTokens": {
          url: urlBase + "/Usuarios/:id/accessTokens",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.Usuario#prototype$__count__accessTokens
         * @methodOf lbServices.Usuario
         *
         * @description
         *
         * Counts accessTokens of Usuario.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        "prototype$__count__accessTokens": {
          url: urlBase + "/Usuarios/:id/accessTokens/count",
          method: "GET"
        },

        // INTERNAL. Use Usuario.perfil() instead.
        "prototype$__get__perfil": {
          isArray: true,
          url: urlBase + "/Usuarios/:id/perfil",
          method: "GET"
        },

        // INTERNAL. Use Usuario.perfil.create() instead.
        "prototype$__create__perfil": {
          url: urlBase + "/Usuarios/:id/perfil",
          method: "POST"
        },

        // INTERNAL. Use Usuario.perfil.destroyAll() instead.
        "prototype$__delete__perfil": {
          url: urlBase + "/Usuarios/:id/perfil",
          method: "DELETE"
        },

        // INTERNAL. Use Usuario.perfil.count() instead.
        "prototype$__count__perfil": {
          url: urlBase + "/Usuarios/:id/perfil/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Usuario#create
         * @methodOf lbServices.Usuario
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Usuario` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/Usuarios",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Usuario#createMany
         * @methodOf lbServices.Usuario
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Usuario` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/Usuarios",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Usuario#upsert
         * @methodOf lbServices.Usuario
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Usuario` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/Usuarios",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.Usuario#exists
         * @methodOf lbServices.Usuario
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` - 
         */
        "exists": {
          url: urlBase + "/Usuarios/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Usuario#findById
         * @methodOf lbServices.Usuario
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Usuario` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/Usuarios/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Usuario#find
         * @methodOf lbServices.Usuario
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Usuario` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/Usuarios",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Usuario#findOne
         * @methodOf lbServices.Usuario
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Usuario` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/Usuarios/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Usuario#updateAll
         * @methodOf lbServices.Usuario
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        "updateAll": {
          url: urlBase + "/Usuarios/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Usuario#deleteById
         * @methodOf lbServices.Usuario
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Usuario` object.)
         * </em>
         */
        "deleteById": {
          url: urlBase + "/Usuarios/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.Usuario#count
         * @methodOf lbServices.Usuario
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        "count": {
          url: urlBase + "/Usuarios/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Usuario#prototype$updateAttributes
         * @methodOf lbServices.Usuario
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Usuario` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/Usuarios/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.Usuario#createChangeStream
         * @methodOf lbServices.Usuario
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` - 
         */
        "createChangeStream": {
          url: urlBase + "/Usuarios/change-stream",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Usuario#login
         * @methodOf lbServices.Usuario
         *
         * @description
         *
         * Login a user with username/email and password.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `include` – `{string=}` - Related objects to include in the response. See the description of return value for more details.
         *   Default value: `user`.
         *
         *  - `rememberMe` - `boolean` - Whether the authentication credentials
         *     should be remembered in localStorage across app/browser restarts.
         *     Default: `true`.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The response body contains properties of the AccessToken created on login.
         * Depending on the value of `include` parameter, the body may contain additional properties:
         * 
         *   - `user` - `{User}` - Data of the currently logged in user. (`include=user`)
         * 
         *
         */
        "login": {
          params: {
            include: "user"
          },
          interceptor: {
            response: function(response) {
              var accessToken = response.data;
              LoopBackAuth.setUser(accessToken.id, accessToken.userId, accessToken.user);
              LoopBackAuth.rememberMe = response.config.params.rememberMe !== false;
              LoopBackAuth.save();
              return response.resource;
            }
          },
          url: urlBase + "/Usuarios/login",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Usuario#logout
         * @methodOf lbServices.Usuario
         *
         * @description
         *
         * Logout a user with access token.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `access_token` – `{string}` - Do not supply this argument, it is automatically extracted from request headers.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "logout": {
          interceptor: {
            response: function(response) {
              LoopBackAuth.clearUser();
              LoopBackAuth.clearStorage();
              return response.resource;
            }
          },
          url: urlBase + "/Usuarios/logout",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Usuario#confirm
         * @methodOf lbServices.Usuario
         *
         * @description
         *
         * Confirm a user registration with email verification token.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `uid` – `{string}` - 
         *
         *  - `token` – `{string}` - 
         *
         *  - `redirect` – `{string=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "confirm": {
          url: urlBase + "/Usuarios/confirm",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.Usuario#resetPassword
         * @methodOf lbServices.Usuario
         *
         * @description
         *
         * Reset password for a user with email.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "resetPassword": {
          url: urlBase + "/Usuarios/reset",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.Usuario#getCurrent
         * @methodOf lbServices.Usuario
         *
         * @description
         *
         * Get data of the currently logged user. Fail with HTTP result 401
         * when there is no user logged in.
         *
         * @param {function(Object,Object)=} successCb
         *    Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *    `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         */
        "getCurrent": {
           url: urlBase + "/Usuarios" + "/:id",
           method: "GET",
           params: {
             id: function() {
              var id = LoopBackAuth.currentUserId;
              if (id == null) id = '__anonymous__';
              return id;
            },
          },
          interceptor: {
            response: function(response) {
              LoopBackAuth.currentUserData = response.data;
              return response.resource;
            }
          },
          __isGetCurrentUser__ : true
        }
      }
    );



        /**
         * @ngdoc method
         * @name lbServices.Usuario#updateOrCreate
         * @methodOf lbServices.Usuario
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Usuario` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name lbServices.Usuario#update
         * @methodOf lbServices.Usuario
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name lbServices.Usuario#destroyById
         * @methodOf lbServices.Usuario
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Usuario` object.)
         * </em>
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name lbServices.Usuario#removeById
         * @methodOf lbServices.Usuario
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Usuario` object.)
         * </em>
         */
        R["removeById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name lbServices.Usuario#getCachedCurrent
         * @methodOf lbServices.Usuario
         *
         * @description
         *
         * Get data of the currently logged user that was returned by the last
         * call to {@link lbServices.Usuario#login} or
         * {@link lbServices.Usuario#getCurrent}. Return null when there
         * is no user logged in or the data of the current user were not fetched
         * yet.
         *
         * @returns {Object} A Usuario instance.
         */
        R.getCachedCurrent = function() {
          var data = LoopBackAuth.currentUserData;
          return data ? new R(data) : null;
        };

        /**
         * @ngdoc method
         * @name lbServices.Usuario#isAuthenticated
         * @methodOf lbServices.Usuario
         *
         * @returns {boolean} True if the current user is authenticated (logged in).
         */
        R.isAuthenticated = function() {
          return this.getCurrentId() != null;
        };

        /**
         * @ngdoc method
         * @name lbServices.Usuario#getCurrentId
         * @methodOf lbServices.Usuario
         *
         * @returns {Object} Id of the currently logged-in user or null.
         */
        R.getCurrentId = function() {
          return LoopBackAuth.currentUserId;
        };

    /**
    * @ngdoc property
    * @name lbServices.Usuario#modelName
    * @propertyOf lbServices.Usuario
    * @description
    * The name of the model represented by this $resource,
    * i.e. `Usuario`.
    */
    R.modelName = "Usuario";

    /**
     * @ngdoc object
     * @name lbServices.Usuario.perfil
     * @header lbServices.Usuario.perfil
     * @object
     * @description
     *
     * The object `Usuario.perfil` groups methods
     * manipulating `Role` instances related to `Usuario`.
     *
     * Call {@link lbServices.Usuario#perfil Usuario.perfil()}
     * to query all related instances.
     */


        /**
         * @ngdoc method
         * @name lbServices.Usuario#perfil
         * @methodOf lbServices.Usuario
         *
         * @description
         *
         * Queries perfil of Usuario.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         *  - `filter` – `{object=}` - 
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Role` object.)
         * </em>
         */
        R.perfil = function() {
          var TargetResource = $injector.get("Role");
          var action = TargetResource["::get::Usuario::perfil"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Usuario.perfil#count
         * @methodOf lbServices.Usuario.perfil
         *
         * @description
         *
         * Counts perfil of Usuario.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        R.perfil.count = function() {
          var TargetResource = $injector.get("Role");
          var action = TargetResource["::count::Usuario::perfil"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Usuario.perfil#create
         * @methodOf lbServices.Usuario.perfil
         *
         * @description
         *
         * Creates a new instance in perfil of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Role` object.)
         * </em>
         */
        R.perfil.create = function() {
          var TargetResource = $injector.get("Role");
          var action = TargetResource["::create::Usuario::perfil"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Usuario.perfil#createMany
         * @methodOf lbServices.Usuario.perfil
         *
         * @description
         *
         * Creates a new instance in perfil of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Role` object.)
         * </em>
         */
        R.perfil.createMany = function() {
          var TargetResource = $injector.get("Role");
          var action = TargetResource["::createMany::Usuario::perfil"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Usuario.perfil#destroyAll
         * @methodOf lbServices.Usuario.perfil
         *
         * @description
         *
         * Deletes all perfil of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.perfil.destroyAll = function() {
          var TargetResource = $injector.get("Role");
          var action = TargetResource["::delete::Usuario::perfil"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Usuario.perfil#destroyById
         * @methodOf lbServices.Usuario.perfil
         *
         * @description
         *
         * Delete a related item by id for perfil.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         *  - `fk` – `{*}` - Foreign key for perfil
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.perfil.destroyById = function() {
          var TargetResource = $injector.get("Role");
          var action = TargetResource["::destroyById::Usuario::perfil"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Usuario.perfil#exists
         * @methodOf lbServices.Usuario.perfil
         *
         * @description
         *
         * Check the existence of perfil relation to an item by id.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         *  - `fk` – `{*}` - Foreign key for perfil
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Role` object.)
         * </em>
         */
        R.perfil.exists = function() {
          var TargetResource = $injector.get("Role");
          var action = TargetResource["::exists::Usuario::perfil"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Usuario.perfil#findById
         * @methodOf lbServices.Usuario.perfil
         *
         * @description
         *
         * Find a related item by id for perfil.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         *  - `fk` – `{*}` - Foreign key for perfil
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Role` object.)
         * </em>
         */
        R.perfil.findById = function() {
          var TargetResource = $injector.get("Role");
          var action = TargetResource["::findById::Usuario::perfil"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Usuario.perfil#link
         * @methodOf lbServices.Usuario.perfil
         *
         * @description
         *
         * Add a related item by id for perfil.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         *  - `fk` – `{*}` - Foreign key for perfil
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Role` object.)
         * </em>
         */
        R.perfil.link = function() {
          var TargetResource = $injector.get("Role");
          var action = TargetResource["::link::Usuario::perfil"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Usuario.perfil#unlink
         * @methodOf lbServices.Usuario.perfil
         *
         * @description
         *
         * Remove the perfil relation to an item by id.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         *  - `fk` – `{*}` - Foreign key for perfil
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.perfil.unlink = function() {
          var TargetResource = $injector.get("Role");
          var action = TargetResource["::unlink::Usuario::perfil"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Usuario.perfil#updateById
         * @methodOf lbServices.Usuario.perfil
         *
         * @description
         *
         * Update a related item by id for perfil.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         *  - `fk` – `{*}` - Foreign key for perfil
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Role` object.)
         * </em>
         */
        R.perfil.updateById = function() {
          var TargetResource = $injector.get("Role");
          var action = TargetResource["::updateById::Usuario::perfil"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.Usuario#unidad_pertenece
         * @methodOf lbServices.Usuario
         *
         * @description
         *
         * Fetches belongsTo relation unidad_pertenece.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - User id
         *
         *  - `refresh` – `{boolean=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoUnidadesAdmtvas` object.)
         * </em>
         */
        R.unidad_pertenece = function() {
          var TargetResource = $injector.get("CatalogoUnidadesAdmtvas");
          var action = TargetResource["::get::Usuario::unidad_pertenece"];
          return action.apply(R, arguments);
        };

    return R;
  }]);

/**
 * @ngdoc object
 * @name lbServices.CatalogoUnidadesAdmtvas
 * @header lbServices.CatalogoUnidadesAdmtvas
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `CatalogoUnidadesAdmtvas` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "CatalogoUnidadesAdmtvas",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/CatalogoUnidadesAdmtvas/:id",
      { 'id': '@id' },
      {

        /**
         * @ngdoc method
         * @name lbServices.CatalogoUnidadesAdmtvas#create
         * @methodOf lbServices.CatalogoUnidadesAdmtvas
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoUnidadesAdmtvas` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/CatalogoUnidadesAdmtvas",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoUnidadesAdmtvas#createMany
         * @methodOf lbServices.CatalogoUnidadesAdmtvas
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoUnidadesAdmtvas` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/CatalogoUnidadesAdmtvas",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoUnidadesAdmtvas#upsert
         * @methodOf lbServices.CatalogoUnidadesAdmtvas
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoUnidadesAdmtvas` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/CatalogoUnidadesAdmtvas",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoUnidadesAdmtvas#exists
         * @methodOf lbServices.CatalogoUnidadesAdmtvas
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` - 
         */
        "exists": {
          url: urlBase + "/CatalogoUnidadesAdmtvas/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoUnidadesAdmtvas#findById
         * @methodOf lbServices.CatalogoUnidadesAdmtvas
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoUnidadesAdmtvas` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/CatalogoUnidadesAdmtvas/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoUnidadesAdmtvas#find
         * @methodOf lbServices.CatalogoUnidadesAdmtvas
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoUnidadesAdmtvas` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/CatalogoUnidadesAdmtvas",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoUnidadesAdmtvas#findOne
         * @methodOf lbServices.CatalogoUnidadesAdmtvas
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoUnidadesAdmtvas` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/CatalogoUnidadesAdmtvas/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoUnidadesAdmtvas#updateAll
         * @methodOf lbServices.CatalogoUnidadesAdmtvas
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        "updateAll": {
          url: urlBase + "/CatalogoUnidadesAdmtvas/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoUnidadesAdmtvas#deleteById
         * @methodOf lbServices.CatalogoUnidadesAdmtvas
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoUnidadesAdmtvas` object.)
         * </em>
         */
        "deleteById": {
          url: urlBase + "/CatalogoUnidadesAdmtvas/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoUnidadesAdmtvas#count
         * @methodOf lbServices.CatalogoUnidadesAdmtvas
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        "count": {
          url: urlBase + "/CatalogoUnidadesAdmtvas/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoUnidadesAdmtvas#prototype$updateAttributes
         * @methodOf lbServices.CatalogoUnidadesAdmtvas
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoUnidadesAdmtvas` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/CatalogoUnidadesAdmtvas/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoUnidadesAdmtvas#createChangeStream
         * @methodOf lbServices.CatalogoUnidadesAdmtvas
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` - 
         */
        "createChangeStream": {
          url: urlBase + "/CatalogoUnidadesAdmtvas/change-stream",
          method: "POST"
        },

        // INTERNAL. Use Usuario.unidad_pertenece() instead.
        "::get::Usuario::unidad_pertenece": {
          url: urlBase + "/Usuarios/:id/unidad_pertenece",
          method: "GET"
        },

        // INTERNAL. Use ProgTrimCursos.unidad_pertenece() instead.
        "::get::ProgTrimCursos::unidad_pertenece": {
          url: urlBase + "/ProgTrimCursos/:id/unidad_pertenece",
          method: "GET"
        },

        // INTERNAL. Use CatalogoInstructores.unidad_pertenece() instead.
        "::get::CatalogoInstructores::unidad_pertenece": {
          url: urlBase + "/CatalogoInstructores/:id/unidad_pertenece",
          method: "GET"
        },

        // INTERNAL. Use CursosOficiales.unidad_pertenece() instead.
        "::get::CursosOficiales::unidad_pertenece": {
          url: urlBase + "/CursosOficiales/:id/unidad_pertenece",
          method: "GET"
        },
      }
    );



        /**
         * @ngdoc method
         * @name lbServices.CatalogoUnidadesAdmtvas#updateOrCreate
         * @methodOf lbServices.CatalogoUnidadesAdmtvas
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoUnidadesAdmtvas` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name lbServices.CatalogoUnidadesAdmtvas#update
         * @methodOf lbServices.CatalogoUnidadesAdmtvas
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name lbServices.CatalogoUnidadesAdmtvas#destroyById
         * @methodOf lbServices.CatalogoUnidadesAdmtvas
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoUnidadesAdmtvas` object.)
         * </em>
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name lbServices.CatalogoUnidadesAdmtvas#removeById
         * @methodOf lbServices.CatalogoUnidadesAdmtvas
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoUnidadesAdmtvas` object.)
         * </em>
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name lbServices.CatalogoUnidadesAdmtvas#modelName
    * @propertyOf lbServices.CatalogoUnidadesAdmtvas
    * @description
    * The name of the model represented by this $resource,
    * i.e. `CatalogoUnidadesAdmtvas`.
    */
    R.modelName = "CatalogoUnidadesAdmtvas";


    return R;
  }]);

/**
 * @ngdoc object
 * @name lbServices.CatalogoTemas
 * @header lbServices.CatalogoTemas
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `CatalogoTemas` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "CatalogoTemas",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/CatalogoTemas/:id",
      { 'id': '@id' },
      {

        // INTERNAL. Use CatalogoTemas.especialidades.findById() instead.
        "prototype$__findById__especialidades": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/CatalogoTemas/:id/especialidades/:fk",
          method: "GET"
        },

        // INTERNAL. Use CatalogoTemas.especialidades.destroyById() instead.
        "prototype$__destroyById__especialidades": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/CatalogoTemas/:id/especialidades/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use CatalogoTemas.especialidades.updateById() instead.
        "prototype$__updateById__especialidades": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/CatalogoTemas/:id/especialidades/:fk",
          method: "PUT"
        },

        // INTERNAL. Use CatalogoTemas.especialidades() instead.
        "prototype$__get__especialidades": {
          isArray: true,
          url: urlBase + "/CatalogoTemas/:id/especialidades",
          method: "GET"
        },

        // INTERNAL. Use CatalogoTemas.especialidades.create() instead.
        "prototype$__create__especialidades": {
          url: urlBase + "/CatalogoTemas/:id/especialidades",
          method: "POST"
        },

        // INTERNAL. Use CatalogoTemas.especialidades.destroyAll() instead.
        "prototype$__delete__especialidades": {
          url: urlBase + "/CatalogoTemas/:id/especialidades",
          method: "DELETE"
        },

        // INTERNAL. Use CatalogoTemas.especialidades.count() instead.
        "prototype$__count__especialidades": {
          url: urlBase + "/CatalogoTemas/:id/especialidades/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoTemas#create
         * @methodOf lbServices.CatalogoTemas
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoTemas` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/CatalogoTemas",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoTemas#createMany
         * @methodOf lbServices.CatalogoTemas
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoTemas` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/CatalogoTemas",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoTemas#upsert
         * @methodOf lbServices.CatalogoTemas
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoTemas` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/CatalogoTemas",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoTemas#exists
         * @methodOf lbServices.CatalogoTemas
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` - 
         */
        "exists": {
          url: urlBase + "/CatalogoTemas/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoTemas#findById
         * @methodOf lbServices.CatalogoTemas
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoTemas` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/CatalogoTemas/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoTemas#find
         * @methodOf lbServices.CatalogoTemas
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoTemas` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/CatalogoTemas",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoTemas#findOne
         * @methodOf lbServices.CatalogoTemas
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoTemas` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/CatalogoTemas/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoTemas#updateAll
         * @methodOf lbServices.CatalogoTemas
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        "updateAll": {
          url: urlBase + "/CatalogoTemas/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoTemas#deleteById
         * @methodOf lbServices.CatalogoTemas
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoTemas` object.)
         * </em>
         */
        "deleteById": {
          url: urlBase + "/CatalogoTemas/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoTemas#count
         * @methodOf lbServices.CatalogoTemas
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        "count": {
          url: urlBase + "/CatalogoTemas/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoTemas#prototype$updateAttributes
         * @methodOf lbServices.CatalogoTemas
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoTemas` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/CatalogoTemas/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoTemas#createChangeStream
         * @methodOf lbServices.CatalogoTemas
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` - 
         */
        "createChangeStream": {
          url: urlBase + "/CatalogoTemas/change-stream",
          method: "POST"
        },

        // INTERNAL. Use CatalogoEspecialidades.tema_pertenece() instead.
        "::get::CatalogoEspecialidades::tema_pertenece": {
          url: urlBase + "/CatalogoEspecialidades/:id/tema_pertenece",
          method: "GET"
        },
      }
    );



        /**
         * @ngdoc method
         * @name lbServices.CatalogoTemas#updateOrCreate
         * @methodOf lbServices.CatalogoTemas
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoTemas` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name lbServices.CatalogoTemas#update
         * @methodOf lbServices.CatalogoTemas
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name lbServices.CatalogoTemas#destroyById
         * @methodOf lbServices.CatalogoTemas
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoTemas` object.)
         * </em>
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name lbServices.CatalogoTemas#removeById
         * @methodOf lbServices.CatalogoTemas
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoTemas` object.)
         * </em>
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name lbServices.CatalogoTemas#modelName
    * @propertyOf lbServices.CatalogoTemas
    * @description
    * The name of the model represented by this $resource,
    * i.e. `CatalogoTemas`.
    */
    R.modelName = "CatalogoTemas";

    /**
     * @ngdoc object
     * @name lbServices.CatalogoTemas.especialidades
     * @header lbServices.CatalogoTemas.especialidades
     * @object
     * @description
     *
     * The object `CatalogoTemas.especialidades` groups methods
     * manipulating `CatalogoEspecialidades` instances related to `CatalogoTemas`.
     *
     * Call {@link lbServices.CatalogoTemas#especialidades CatalogoTemas.especialidades()}
     * to query all related instances.
     */


        /**
         * @ngdoc method
         * @name lbServices.CatalogoTemas#especialidades
         * @methodOf lbServices.CatalogoTemas
         *
         * @description
         *
         * Queries especialidades of CatalogoTemas.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `filter` – `{object=}` - 
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoEspecialidades` object.)
         * </em>
         */
        R.especialidades = function() {
          var TargetResource = $injector.get("CatalogoEspecialidades");
          var action = TargetResource["::get::CatalogoTemas::especialidades"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.CatalogoTemas.especialidades#count
         * @methodOf lbServices.CatalogoTemas.especialidades
         *
         * @description
         *
         * Counts especialidades of CatalogoTemas.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        R.especialidades.count = function() {
          var TargetResource = $injector.get("CatalogoEspecialidades");
          var action = TargetResource["::count::CatalogoTemas::especialidades"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.CatalogoTemas.especialidades#create
         * @methodOf lbServices.CatalogoTemas.especialidades
         *
         * @description
         *
         * Creates a new instance in especialidades of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoEspecialidades` object.)
         * </em>
         */
        R.especialidades.create = function() {
          var TargetResource = $injector.get("CatalogoEspecialidades");
          var action = TargetResource["::create::CatalogoTemas::especialidades"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.CatalogoTemas.especialidades#createMany
         * @methodOf lbServices.CatalogoTemas.especialidades
         *
         * @description
         *
         * Creates a new instance in especialidades of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoEspecialidades` object.)
         * </em>
         */
        R.especialidades.createMany = function() {
          var TargetResource = $injector.get("CatalogoEspecialidades");
          var action = TargetResource["::createMany::CatalogoTemas::especialidades"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.CatalogoTemas.especialidades#destroyAll
         * @methodOf lbServices.CatalogoTemas.especialidades
         *
         * @description
         *
         * Deletes all especialidades of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.especialidades.destroyAll = function() {
          var TargetResource = $injector.get("CatalogoEspecialidades");
          var action = TargetResource["::delete::CatalogoTemas::especialidades"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.CatalogoTemas.especialidades#destroyById
         * @methodOf lbServices.CatalogoTemas.especialidades
         *
         * @description
         *
         * Delete a related item by id for especialidades.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for especialidades
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.especialidades.destroyById = function() {
          var TargetResource = $injector.get("CatalogoEspecialidades");
          var action = TargetResource["::destroyById::CatalogoTemas::especialidades"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.CatalogoTemas.especialidades#findById
         * @methodOf lbServices.CatalogoTemas.especialidades
         *
         * @description
         *
         * Find a related item by id for especialidades.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for especialidades
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoEspecialidades` object.)
         * </em>
         */
        R.especialidades.findById = function() {
          var TargetResource = $injector.get("CatalogoEspecialidades");
          var action = TargetResource["::findById::CatalogoTemas::especialidades"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.CatalogoTemas.especialidades#updateById
         * @methodOf lbServices.CatalogoTemas.especialidades
         *
         * @description
         *
         * Update a related item by id for especialidades.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for especialidades
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoEspecialidades` object.)
         * </em>
         */
        R.especialidades.updateById = function() {
          var TargetResource = $injector.get("CatalogoEspecialidades");
          var action = TargetResource["::updateById::CatalogoTemas::especialidades"];
          return action.apply(R, arguments);
        };

    return R;
  }]);

/**
 * @ngdoc object
 * @name lbServices.CatalogoTemarioCursos
 * @header lbServices.CatalogoTemarioCursos
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `CatalogoTemarioCursos` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "CatalogoTemarioCursos",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/CatalogoTemarioCursos/:id",
      { 'id': '@id' },
      {

        /**
         * @ngdoc method
         * @name lbServices.CatalogoTemarioCursos#create
         * @methodOf lbServices.CatalogoTemarioCursos
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoTemarioCursos` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/CatalogoTemarioCursos",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoTemarioCursos#createMany
         * @methodOf lbServices.CatalogoTemarioCursos
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoTemarioCursos` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/CatalogoTemarioCursos",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoTemarioCursos#upsert
         * @methodOf lbServices.CatalogoTemarioCursos
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoTemarioCursos` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/CatalogoTemarioCursos",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoTemarioCursos#exists
         * @methodOf lbServices.CatalogoTemarioCursos
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` - 
         */
        "exists": {
          url: urlBase + "/CatalogoTemarioCursos/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoTemarioCursos#findById
         * @methodOf lbServices.CatalogoTemarioCursos
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoTemarioCursos` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/CatalogoTemarioCursos/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoTemarioCursos#find
         * @methodOf lbServices.CatalogoTemarioCursos
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoTemarioCursos` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/CatalogoTemarioCursos",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoTemarioCursos#findOne
         * @methodOf lbServices.CatalogoTemarioCursos
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoTemarioCursos` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/CatalogoTemarioCursos/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoTemarioCursos#updateAll
         * @methodOf lbServices.CatalogoTemarioCursos
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        "updateAll": {
          url: urlBase + "/CatalogoTemarioCursos/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoTemarioCursos#deleteById
         * @methodOf lbServices.CatalogoTemarioCursos
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoTemarioCursos` object.)
         * </em>
         */
        "deleteById": {
          url: urlBase + "/CatalogoTemarioCursos/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoTemarioCursos#count
         * @methodOf lbServices.CatalogoTemarioCursos
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        "count": {
          url: urlBase + "/CatalogoTemarioCursos/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoTemarioCursos#prototype$updateAttributes
         * @methodOf lbServices.CatalogoTemarioCursos
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoTemarioCursos` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/CatalogoTemarioCursos/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoTemarioCursos#createChangeStream
         * @methodOf lbServices.CatalogoTemarioCursos
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` - 
         */
        "createChangeStream": {
          url: urlBase + "/CatalogoTemarioCursos/change-stream",
          method: "POST"
        },

        // INTERNAL. Use CatalogoCursos.temario.findById() instead.
        "::findById::CatalogoCursos::temario": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/CatalogoCursos/:id/temario/:fk",
          method: "GET"
        },

        // INTERNAL. Use CatalogoCursos.temario.destroyById() instead.
        "::destroyById::CatalogoCursos::temario": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/CatalogoCursos/:id/temario/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use CatalogoCursos.temario.updateById() instead.
        "::updateById::CatalogoCursos::temario": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/CatalogoCursos/:id/temario/:fk",
          method: "PUT"
        },

        // INTERNAL. Use CatalogoCursos.temario() instead.
        "::get::CatalogoCursos::temario": {
          isArray: true,
          url: urlBase + "/CatalogoCursos/:id/temario",
          method: "GET"
        },

        // INTERNAL. Use CatalogoCursos.temario.create() instead.
        "::create::CatalogoCursos::temario": {
          url: urlBase + "/CatalogoCursos/:id/temario",
          method: "POST"
        },

        // INTERNAL. Use CatalogoCursos.temario.createMany() instead.
        "::createMany::CatalogoCursos::temario": {
          isArray: true,
          url: urlBase + "/CatalogoCursos/:id/temario",
          method: "POST"
        },

        // INTERNAL. Use CatalogoCursos.temario.destroyAll() instead.
        "::delete::CatalogoCursos::temario": {
          url: urlBase + "/CatalogoCursos/:id/temario",
          method: "DELETE"
        },

        // INTERNAL. Use CatalogoCursos.temario.count() instead.
        "::count::CatalogoCursos::temario": {
          url: urlBase + "/CatalogoCursos/:id/temario/count",
          method: "GET"
        },
      }
    );



        /**
         * @ngdoc method
         * @name lbServices.CatalogoTemarioCursos#updateOrCreate
         * @methodOf lbServices.CatalogoTemarioCursos
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoTemarioCursos` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name lbServices.CatalogoTemarioCursos#update
         * @methodOf lbServices.CatalogoTemarioCursos
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name lbServices.CatalogoTemarioCursos#destroyById
         * @methodOf lbServices.CatalogoTemarioCursos
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoTemarioCursos` object.)
         * </em>
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name lbServices.CatalogoTemarioCursos#removeById
         * @methodOf lbServices.CatalogoTemarioCursos
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoTemarioCursos` object.)
         * </em>
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name lbServices.CatalogoTemarioCursos#modelName
    * @propertyOf lbServices.CatalogoTemarioCursos
    * @description
    * The name of the model represented by this $resource,
    * i.e. `CatalogoTemarioCursos`.
    */
    R.modelName = "CatalogoTemarioCursos";


    return R;
  }]);

/**
 * @ngdoc object
 * @name lbServices.CatalogoEspecialidades
 * @header lbServices.CatalogoEspecialidades
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `CatalogoEspecialidades` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "CatalogoEspecialidades",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/CatalogoEspecialidades/:id",
      { 'id': '@id' },
      {

        // INTERNAL. Use CatalogoEspecialidades.tema_pertenece() instead.
        "prototype$__get__tema_pertenece": {
          url: urlBase + "/CatalogoEspecialidades/:id/tema_pertenece",
          method: "GET"
        },

        // INTERNAL. Use CatalogoEspecialidades.RegistroCursos.findById() instead.
        "prototype$__findById__RegistroCursos": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/CatalogoEspecialidades/:id/RegistroCursos/:fk",
          method: "GET"
        },

        // INTERNAL. Use CatalogoEspecialidades.RegistroCursos.destroyById() instead.
        "prototype$__destroyById__RegistroCursos": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/CatalogoEspecialidades/:id/RegistroCursos/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use CatalogoEspecialidades.RegistroCursos.updateById() instead.
        "prototype$__updateById__RegistroCursos": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/CatalogoEspecialidades/:id/RegistroCursos/:fk",
          method: "PUT"
        },

        // INTERNAL. Use CatalogoEspecialidades.RegistroCursos() instead.
        "prototype$__get__RegistroCursos": {
          isArray: true,
          url: urlBase + "/CatalogoEspecialidades/:id/RegistroCursos",
          method: "GET"
        },

        // INTERNAL. Use CatalogoEspecialidades.RegistroCursos.create() instead.
        "prototype$__create__RegistroCursos": {
          url: urlBase + "/CatalogoEspecialidades/:id/RegistroCursos",
          method: "POST"
        },

        // INTERNAL. Use CatalogoEspecialidades.RegistroCursos.destroyAll() instead.
        "prototype$__delete__RegistroCursos": {
          url: urlBase + "/CatalogoEspecialidades/:id/RegistroCursos",
          method: "DELETE"
        },

        // INTERNAL. Use CatalogoEspecialidades.RegistroCursos.count() instead.
        "prototype$__count__RegistroCursos": {
          url: urlBase + "/CatalogoEspecialidades/:id/RegistroCursos/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoEspecialidades#create
         * @methodOf lbServices.CatalogoEspecialidades
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoEspecialidades` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/CatalogoEspecialidades",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoEspecialidades#createMany
         * @methodOf lbServices.CatalogoEspecialidades
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoEspecialidades` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/CatalogoEspecialidades",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoEspecialidades#upsert
         * @methodOf lbServices.CatalogoEspecialidades
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoEspecialidades` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/CatalogoEspecialidades",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoEspecialidades#exists
         * @methodOf lbServices.CatalogoEspecialidades
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` - 
         */
        "exists": {
          url: urlBase + "/CatalogoEspecialidades/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoEspecialidades#findById
         * @methodOf lbServices.CatalogoEspecialidades
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoEspecialidades` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/CatalogoEspecialidades/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoEspecialidades#find
         * @methodOf lbServices.CatalogoEspecialidades
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoEspecialidades` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/CatalogoEspecialidades",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoEspecialidades#findOne
         * @methodOf lbServices.CatalogoEspecialidades
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoEspecialidades` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/CatalogoEspecialidades/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoEspecialidades#updateAll
         * @methodOf lbServices.CatalogoEspecialidades
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        "updateAll": {
          url: urlBase + "/CatalogoEspecialidades/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoEspecialidades#deleteById
         * @methodOf lbServices.CatalogoEspecialidades
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoEspecialidades` object.)
         * </em>
         */
        "deleteById": {
          url: urlBase + "/CatalogoEspecialidades/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoEspecialidades#count
         * @methodOf lbServices.CatalogoEspecialidades
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        "count": {
          url: urlBase + "/CatalogoEspecialidades/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoEspecialidades#prototype$updateAttributes
         * @methodOf lbServices.CatalogoEspecialidades
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoEspecialidades` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/CatalogoEspecialidades/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoEspecialidades#createChangeStream
         * @methodOf lbServices.CatalogoEspecialidades
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` - 
         */
        "createChangeStream": {
          url: urlBase + "/CatalogoEspecialidades/change-stream",
          method: "POST"
        },

        // INTERNAL. Use CatalogoTemas.especialidades.findById() instead.
        "::findById::CatalogoTemas::especialidades": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/CatalogoTemas/:id/especialidades/:fk",
          method: "GET"
        },

        // INTERNAL. Use CatalogoTemas.especialidades.destroyById() instead.
        "::destroyById::CatalogoTemas::especialidades": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/CatalogoTemas/:id/especialidades/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use CatalogoTemas.especialidades.updateById() instead.
        "::updateById::CatalogoTemas::especialidades": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/CatalogoTemas/:id/especialidades/:fk",
          method: "PUT"
        },

        // INTERNAL. Use CatalogoTemas.especialidades() instead.
        "::get::CatalogoTemas::especialidades": {
          isArray: true,
          url: urlBase + "/CatalogoTemas/:id/especialidades",
          method: "GET"
        },

        // INTERNAL. Use CatalogoTemas.especialidades.create() instead.
        "::create::CatalogoTemas::especialidades": {
          url: urlBase + "/CatalogoTemas/:id/especialidades",
          method: "POST"
        },

        // INTERNAL. Use CatalogoTemas.especialidades.createMany() instead.
        "::createMany::CatalogoTemas::especialidades": {
          isArray: true,
          url: urlBase + "/CatalogoTemas/:id/especialidades",
          method: "POST"
        },

        // INTERNAL. Use CatalogoTemas.especialidades.destroyAll() instead.
        "::delete::CatalogoTemas::especialidades": {
          url: urlBase + "/CatalogoTemas/:id/especialidades",
          method: "DELETE"
        },

        // INTERNAL. Use CatalogoTemas.especialidades.count() instead.
        "::count::CatalogoTemas::especialidades": {
          url: urlBase + "/CatalogoTemas/:id/especialidades/count",
          method: "GET"
        },

        // INTERNAL. Use CatalogoCursos.especialidad() instead.
        "::get::CatalogoCursos::especialidad": {
          url: urlBase + "/CatalogoCursos/:id/especialidad",
          method: "GET"
        },
      }
    );



        /**
         * @ngdoc method
         * @name lbServices.CatalogoEspecialidades#updateOrCreate
         * @methodOf lbServices.CatalogoEspecialidades
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoEspecialidades` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name lbServices.CatalogoEspecialidades#update
         * @methodOf lbServices.CatalogoEspecialidades
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name lbServices.CatalogoEspecialidades#destroyById
         * @methodOf lbServices.CatalogoEspecialidades
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoEspecialidades` object.)
         * </em>
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name lbServices.CatalogoEspecialidades#removeById
         * @methodOf lbServices.CatalogoEspecialidades
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoEspecialidades` object.)
         * </em>
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name lbServices.CatalogoEspecialidades#modelName
    * @propertyOf lbServices.CatalogoEspecialidades
    * @description
    * The name of the model represented by this $resource,
    * i.e. `CatalogoEspecialidades`.
    */
    R.modelName = "CatalogoEspecialidades";


        /**
         * @ngdoc method
         * @name lbServices.CatalogoEspecialidades#tema_pertenece
         * @methodOf lbServices.CatalogoEspecialidades
         *
         * @description
         *
         * Fetches belongsTo relation tema_pertenece.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `refresh` – `{boolean=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoTemas` object.)
         * </em>
         */
        R.tema_pertenece = function() {
          var TargetResource = $injector.get("CatalogoTemas");
          var action = TargetResource["::get::CatalogoEspecialidades::tema_pertenece"];
          return action.apply(R, arguments);
        };
    /**
     * @ngdoc object
     * @name lbServices.CatalogoEspecialidades.RegistroCursos
     * @header lbServices.CatalogoEspecialidades.RegistroCursos
     * @object
     * @description
     *
     * The object `CatalogoEspecialidades.RegistroCursos` groups methods
     * manipulating `CatalogoCursos` instances related to `CatalogoEspecialidades`.
     *
     * Call {@link lbServices.CatalogoEspecialidades#RegistroCursos CatalogoEspecialidades.RegistroCursos()}
     * to query all related instances.
     */


        /**
         * @ngdoc method
         * @name lbServices.CatalogoEspecialidades#RegistroCursos
         * @methodOf lbServices.CatalogoEspecialidades
         *
         * @description
         *
         * Queries RegistroCursos of CatalogoEspecialidades.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `filter` – `{object=}` - 
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoCursos` object.)
         * </em>
         */
        R.RegistroCursos = function() {
          var TargetResource = $injector.get("CatalogoCursos");
          var action = TargetResource["::get::CatalogoEspecialidades::RegistroCursos"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.CatalogoEspecialidades.RegistroCursos#count
         * @methodOf lbServices.CatalogoEspecialidades.RegistroCursos
         *
         * @description
         *
         * Counts RegistroCursos of CatalogoEspecialidades.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        R.RegistroCursos.count = function() {
          var TargetResource = $injector.get("CatalogoCursos");
          var action = TargetResource["::count::CatalogoEspecialidades::RegistroCursos"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.CatalogoEspecialidades.RegistroCursos#create
         * @methodOf lbServices.CatalogoEspecialidades.RegistroCursos
         *
         * @description
         *
         * Creates a new instance in RegistroCursos of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoCursos` object.)
         * </em>
         */
        R.RegistroCursos.create = function() {
          var TargetResource = $injector.get("CatalogoCursos");
          var action = TargetResource["::create::CatalogoEspecialidades::RegistroCursos"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.CatalogoEspecialidades.RegistroCursos#createMany
         * @methodOf lbServices.CatalogoEspecialidades.RegistroCursos
         *
         * @description
         *
         * Creates a new instance in RegistroCursos of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoCursos` object.)
         * </em>
         */
        R.RegistroCursos.createMany = function() {
          var TargetResource = $injector.get("CatalogoCursos");
          var action = TargetResource["::createMany::CatalogoEspecialidades::RegistroCursos"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.CatalogoEspecialidades.RegistroCursos#destroyAll
         * @methodOf lbServices.CatalogoEspecialidades.RegistroCursos
         *
         * @description
         *
         * Deletes all RegistroCursos of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.RegistroCursos.destroyAll = function() {
          var TargetResource = $injector.get("CatalogoCursos");
          var action = TargetResource["::delete::CatalogoEspecialidades::RegistroCursos"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.CatalogoEspecialidades.RegistroCursos#destroyById
         * @methodOf lbServices.CatalogoEspecialidades.RegistroCursos
         *
         * @description
         *
         * Delete a related item by id for RegistroCursos.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for RegistroCursos
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.RegistroCursos.destroyById = function() {
          var TargetResource = $injector.get("CatalogoCursos");
          var action = TargetResource["::destroyById::CatalogoEspecialidades::RegistroCursos"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.CatalogoEspecialidades.RegistroCursos#findById
         * @methodOf lbServices.CatalogoEspecialidades.RegistroCursos
         *
         * @description
         *
         * Find a related item by id for RegistroCursos.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for RegistroCursos
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoCursos` object.)
         * </em>
         */
        R.RegistroCursos.findById = function() {
          var TargetResource = $injector.get("CatalogoCursos");
          var action = TargetResource["::findById::CatalogoEspecialidades::RegistroCursos"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.CatalogoEspecialidades.RegistroCursos#updateById
         * @methodOf lbServices.CatalogoEspecialidades.RegistroCursos
         *
         * @description
         *
         * Update a related item by id for RegistroCursos.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for RegistroCursos
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoCursos` object.)
         * </em>
         */
        R.RegistroCursos.updateById = function() {
          var TargetResource = $injector.get("CatalogoCursos");
          var action = TargetResource["::updateById::CatalogoEspecialidades::RegistroCursos"];
          return action.apply(R, arguments);
        };

    return R;
  }]);

/**
 * @ngdoc object
 * @name lbServices.CatalogoLocalidades
 * @header lbServices.CatalogoLocalidades
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `CatalogoLocalidades` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "CatalogoLocalidades",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/CatalogoLocalidades/:id",
      { 'id': '@id' },
      {

        /**
         * @ngdoc method
         * @name lbServices.CatalogoLocalidades#create
         * @methodOf lbServices.CatalogoLocalidades
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoLocalidades` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/CatalogoLocalidades",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoLocalidades#createMany
         * @methodOf lbServices.CatalogoLocalidades
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoLocalidades` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/CatalogoLocalidades",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoLocalidades#upsert
         * @methodOf lbServices.CatalogoLocalidades
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoLocalidades` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/CatalogoLocalidades",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoLocalidades#exists
         * @methodOf lbServices.CatalogoLocalidades
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` - 
         */
        "exists": {
          url: urlBase + "/CatalogoLocalidades/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoLocalidades#findById
         * @methodOf lbServices.CatalogoLocalidades
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoLocalidades` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/CatalogoLocalidades/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoLocalidades#find
         * @methodOf lbServices.CatalogoLocalidades
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoLocalidades` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/CatalogoLocalidades",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoLocalidades#findOne
         * @methodOf lbServices.CatalogoLocalidades
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoLocalidades` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/CatalogoLocalidades/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoLocalidades#updateAll
         * @methodOf lbServices.CatalogoLocalidades
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        "updateAll": {
          url: urlBase + "/CatalogoLocalidades/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoLocalidades#deleteById
         * @methodOf lbServices.CatalogoLocalidades
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoLocalidades` object.)
         * </em>
         */
        "deleteById": {
          url: urlBase + "/CatalogoLocalidades/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoLocalidades#count
         * @methodOf lbServices.CatalogoLocalidades
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        "count": {
          url: urlBase + "/CatalogoLocalidades/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoLocalidades#prototype$updateAttributes
         * @methodOf lbServices.CatalogoLocalidades
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoLocalidades` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/CatalogoLocalidades/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoLocalidades#createChangeStream
         * @methodOf lbServices.CatalogoLocalidades
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` - 
         */
        "createChangeStream": {
          url: urlBase + "/CatalogoLocalidades/change-stream",
          method: "POST"
        },

        // INTERNAL. Use CatalogoInstructores.localidad_pertenece() instead.
        "::get::CatalogoInstructores::localidad_pertenece": {
          url: urlBase + "/CatalogoInstructores/:id/localidad_pertenece",
          method: "GET"
        },

        // INTERNAL. Use CursosOficiales.localidad_pertenece() instead.
        "::get::CursosOficiales::localidad_pertenece": {
          url: urlBase + "/CursosOficiales/:id/localidad_pertenece",
          method: "GET"
        },
      }
    );



        /**
         * @ngdoc method
         * @name lbServices.CatalogoLocalidades#updateOrCreate
         * @methodOf lbServices.CatalogoLocalidades
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoLocalidades` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name lbServices.CatalogoLocalidades#update
         * @methodOf lbServices.CatalogoLocalidades
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name lbServices.CatalogoLocalidades#destroyById
         * @methodOf lbServices.CatalogoLocalidades
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoLocalidades` object.)
         * </em>
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name lbServices.CatalogoLocalidades#removeById
         * @methodOf lbServices.CatalogoLocalidades
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoLocalidades` object.)
         * </em>
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name lbServices.CatalogoLocalidades#modelName
    * @propertyOf lbServices.CatalogoLocalidades
    * @description
    * The name of the model represented by this $resource,
    * i.e. `CatalogoLocalidades`.
    */
    R.modelName = "CatalogoLocalidades";


    return R;
  }]);

/**
 * @ngdoc object
 * @name lbServices.CatalogoCursos
 * @header lbServices.CatalogoCursos
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `CatalogoCursos` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "CatalogoCursos",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/CatalogoCursos/:id",
      { 'id': '@id' },
      {

        // INTERNAL. Use CatalogoCursos.especialidad() instead.
        "prototype$__get__especialidad": {
          url: urlBase + "/CatalogoCursos/:id/especialidad",
          method: "GET"
        },

        // INTERNAL. Use CatalogoCursos.temario.findById() instead.
        "prototype$__findById__temario": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/CatalogoCursos/:id/temario/:fk",
          method: "GET"
        },

        // INTERNAL. Use CatalogoCursos.temario.destroyById() instead.
        "prototype$__destroyById__temario": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/CatalogoCursos/:id/temario/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use CatalogoCursos.temario.updateById() instead.
        "prototype$__updateById__temario": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/CatalogoCursos/:id/temario/:fk",
          method: "PUT"
        },

        // INTERNAL. Use CatalogoCursos.instructores_habilitados.findById() instead.
        "prototype$__findById__instructores_habilitados": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/CatalogoCursos/:id/instructores_habilitados/:fk",
          method: "GET"
        },

        // INTERNAL. Use CatalogoCursos.instructores_habilitados.destroyById() instead.
        "prototype$__destroyById__instructores_habilitados": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/CatalogoCursos/:id/instructores_habilitados/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use CatalogoCursos.instructores_habilitados.updateById() instead.
        "prototype$__updateById__instructores_habilitados": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/CatalogoCursos/:id/instructores_habilitados/:fk",
          method: "PUT"
        },

        // INTERNAL. Use CatalogoCursos.instructores_habilitados.link() instead.
        "prototype$__link__instructores_habilitados": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/CatalogoCursos/:id/instructores_habilitados/rel/:fk",
          method: "PUT"
        },

        // INTERNAL. Use CatalogoCursos.instructores_habilitados.unlink() instead.
        "prototype$__unlink__instructores_habilitados": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/CatalogoCursos/:id/instructores_habilitados/rel/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use CatalogoCursos.instructores_habilitados.exists() instead.
        "prototype$__exists__instructores_habilitados": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/CatalogoCursos/:id/instructores_habilitados/rel/:fk",
          method: "HEAD"
        },

        // INTERNAL. Use CatalogoCursos.temario() instead.
        "prototype$__get__temario": {
          isArray: true,
          url: urlBase + "/CatalogoCursos/:id/temario",
          method: "GET"
        },

        // INTERNAL. Use CatalogoCursos.temario.create() instead.
        "prototype$__create__temario": {
          url: urlBase + "/CatalogoCursos/:id/temario",
          method: "POST"
        },

        // INTERNAL. Use CatalogoCursos.temario.destroyAll() instead.
        "prototype$__delete__temario": {
          url: urlBase + "/CatalogoCursos/:id/temario",
          method: "DELETE"
        },

        // INTERNAL. Use CatalogoCursos.temario.count() instead.
        "prototype$__count__temario": {
          url: urlBase + "/CatalogoCursos/:id/temario/count",
          method: "GET"
        },

        // INTERNAL. Use CatalogoCursos.instructores_habilitados() instead.
        "prototype$__get__instructores_habilitados": {
          isArray: true,
          url: urlBase + "/CatalogoCursos/:id/instructores_habilitados",
          method: "GET"
        },

        // INTERNAL. Use CatalogoCursos.instructores_habilitados.create() instead.
        "prototype$__create__instructores_habilitados": {
          url: urlBase + "/CatalogoCursos/:id/instructores_habilitados",
          method: "POST"
        },

        // INTERNAL. Use CatalogoCursos.instructores_habilitados.destroyAll() instead.
        "prototype$__delete__instructores_habilitados": {
          url: urlBase + "/CatalogoCursos/:id/instructores_habilitados",
          method: "DELETE"
        },

        // INTERNAL. Use CatalogoCursos.instructores_habilitados.count() instead.
        "prototype$__count__instructores_habilitados": {
          url: urlBase + "/CatalogoCursos/:id/instructores_habilitados/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoCursos#create
         * @methodOf lbServices.CatalogoCursos
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoCursos` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/CatalogoCursos",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoCursos#createMany
         * @methodOf lbServices.CatalogoCursos
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoCursos` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/CatalogoCursos",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoCursos#upsert
         * @methodOf lbServices.CatalogoCursos
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoCursos` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/CatalogoCursos",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoCursos#exists
         * @methodOf lbServices.CatalogoCursos
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` - 
         */
        "exists": {
          url: urlBase + "/CatalogoCursos/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoCursos#findById
         * @methodOf lbServices.CatalogoCursos
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoCursos` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/CatalogoCursos/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoCursos#find
         * @methodOf lbServices.CatalogoCursos
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoCursos` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/CatalogoCursos",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoCursos#findOne
         * @methodOf lbServices.CatalogoCursos
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoCursos` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/CatalogoCursos/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoCursos#updateAll
         * @methodOf lbServices.CatalogoCursos
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        "updateAll": {
          url: urlBase + "/CatalogoCursos/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoCursos#deleteById
         * @methodOf lbServices.CatalogoCursos
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoCursos` object.)
         * </em>
         */
        "deleteById": {
          url: urlBase + "/CatalogoCursos/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoCursos#count
         * @methodOf lbServices.CatalogoCursos
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        "count": {
          url: urlBase + "/CatalogoCursos/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoCursos#prototype$updateAttributes
         * @methodOf lbServices.CatalogoCursos
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoCursos` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/CatalogoCursos/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoCursos#createChangeStream
         * @methodOf lbServices.CatalogoCursos
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` - 
         */
        "createChangeStream": {
          url: urlBase + "/CatalogoCursos/change-stream",
          method: "POST"
        },

        // INTERNAL. Use CatalogoEspecialidades.RegistroCursos.findById() instead.
        "::findById::CatalogoEspecialidades::RegistroCursos": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/CatalogoEspecialidades/:id/RegistroCursos/:fk",
          method: "GET"
        },

        // INTERNAL. Use CatalogoEspecialidades.RegistroCursos.destroyById() instead.
        "::destroyById::CatalogoEspecialidades::RegistroCursos": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/CatalogoEspecialidades/:id/RegistroCursos/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use CatalogoEspecialidades.RegistroCursos.updateById() instead.
        "::updateById::CatalogoEspecialidades::RegistroCursos": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/CatalogoEspecialidades/:id/RegistroCursos/:fk",
          method: "PUT"
        },

        // INTERNAL. Use CatalogoEspecialidades.RegistroCursos() instead.
        "::get::CatalogoEspecialidades::RegistroCursos": {
          isArray: true,
          url: urlBase + "/CatalogoEspecialidades/:id/RegistroCursos",
          method: "GET"
        },

        // INTERNAL. Use CatalogoEspecialidades.RegistroCursos.create() instead.
        "::create::CatalogoEspecialidades::RegistroCursos": {
          url: urlBase + "/CatalogoEspecialidades/:id/RegistroCursos",
          method: "POST"
        },

        // INTERNAL. Use CatalogoEspecialidades.RegistroCursos.createMany() instead.
        "::createMany::CatalogoEspecialidades::RegistroCursos": {
          isArray: true,
          url: urlBase + "/CatalogoEspecialidades/:id/RegistroCursos",
          method: "POST"
        },

        // INTERNAL. Use CatalogoEspecialidades.RegistroCursos.destroyAll() instead.
        "::delete::CatalogoEspecialidades::RegistroCursos": {
          url: urlBase + "/CatalogoEspecialidades/:id/RegistroCursos",
          method: "DELETE"
        },

        // INTERNAL. Use CatalogoEspecialidades.RegistroCursos.count() instead.
        "::count::CatalogoEspecialidades::RegistroCursos": {
          url: urlBase + "/CatalogoEspecialidades/:id/RegistroCursos/count",
          method: "GET"
        },

        // INTERNAL. Use CursosPtc.detalle_curso() instead.
        "::get::CursosPtc::detalle_curso": {
          url: urlBase + "/CursosPtcs/:id/detalle_curso",
          method: "GET"
        },

        // INTERNAL. Use CatalogoInstructores.cursos_habilitados.findById() instead.
        "::findById::CatalogoInstructores::cursos_habilitados": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/CatalogoInstructores/:id/cursos_habilitados/:fk",
          method: "GET"
        },

        // INTERNAL. Use CatalogoInstructores.cursos_habilitados.destroyById() instead.
        "::destroyById::CatalogoInstructores::cursos_habilitados": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/CatalogoInstructores/:id/cursos_habilitados/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use CatalogoInstructores.cursos_habilitados.updateById() instead.
        "::updateById::CatalogoInstructores::cursos_habilitados": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/CatalogoInstructores/:id/cursos_habilitados/:fk",
          method: "PUT"
        },

        // INTERNAL. Use CatalogoInstructores.cursos_habilitados.link() instead.
        "::link::CatalogoInstructores::cursos_habilitados": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/CatalogoInstructores/:id/cursos_habilitados/rel/:fk",
          method: "PUT"
        },

        // INTERNAL. Use CatalogoInstructores.cursos_habilitados.unlink() instead.
        "::unlink::CatalogoInstructores::cursos_habilitados": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/CatalogoInstructores/:id/cursos_habilitados/rel/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use CatalogoInstructores.cursos_habilitados.exists() instead.
        "::exists::CatalogoInstructores::cursos_habilitados": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/CatalogoInstructores/:id/cursos_habilitados/rel/:fk",
          method: "HEAD"
        },

        // INTERNAL. Use CatalogoInstructores.cursos_habilitados() instead.
        "::get::CatalogoInstructores::cursos_habilitados": {
          isArray: true,
          url: urlBase + "/CatalogoInstructores/:id/cursos_habilitados",
          method: "GET"
        },

        // INTERNAL. Use CatalogoInstructores.cursos_habilitados.create() instead.
        "::create::CatalogoInstructores::cursos_habilitados": {
          url: urlBase + "/CatalogoInstructores/:id/cursos_habilitados",
          method: "POST"
        },

        // INTERNAL. Use CatalogoInstructores.cursos_habilitados.createMany() instead.
        "::createMany::CatalogoInstructores::cursos_habilitados": {
          isArray: true,
          url: urlBase + "/CatalogoInstructores/:id/cursos_habilitados",
          method: "POST"
        },

        // INTERNAL. Use CatalogoInstructores.cursos_habilitados.destroyAll() instead.
        "::delete::CatalogoInstructores::cursos_habilitados": {
          url: urlBase + "/CatalogoInstructores/:id/cursos_habilitados",
          method: "DELETE"
        },

        // INTERNAL. Use CatalogoInstructores.cursos_habilitados.count() instead.
        "::count::CatalogoInstructores::cursos_habilitados": {
          url: urlBase + "/CatalogoInstructores/:id/cursos_habilitados/count",
          method: "GET"
        },

        // INTERNAL. Use RelInstrucCatCurso.CatalogoCursos() instead.
        "::get::RelInstrucCatCurso::CatalogoCursos": {
          url: urlBase + "/RelInstrucCatCursos/:id/CatalogoCursos",
          method: "GET"
        },
      }
    );



        /**
         * @ngdoc method
         * @name lbServices.CatalogoCursos#updateOrCreate
         * @methodOf lbServices.CatalogoCursos
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoCursos` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name lbServices.CatalogoCursos#update
         * @methodOf lbServices.CatalogoCursos
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name lbServices.CatalogoCursos#destroyById
         * @methodOf lbServices.CatalogoCursos
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoCursos` object.)
         * </em>
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name lbServices.CatalogoCursos#removeById
         * @methodOf lbServices.CatalogoCursos
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoCursos` object.)
         * </em>
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name lbServices.CatalogoCursos#modelName
    * @propertyOf lbServices.CatalogoCursos
    * @description
    * The name of the model represented by this $resource,
    * i.e. `CatalogoCursos`.
    */
    R.modelName = "CatalogoCursos";


        /**
         * @ngdoc method
         * @name lbServices.CatalogoCursos#especialidad
         * @methodOf lbServices.CatalogoCursos
         *
         * @description
         *
         * Fetches belongsTo relation especialidad.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `refresh` – `{boolean=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoEspecialidades` object.)
         * </em>
         */
        R.especialidad = function() {
          var TargetResource = $injector.get("CatalogoEspecialidades");
          var action = TargetResource["::get::CatalogoCursos::especialidad"];
          return action.apply(R, arguments);
        };
    /**
     * @ngdoc object
     * @name lbServices.CatalogoCursos.temario
     * @header lbServices.CatalogoCursos.temario
     * @object
     * @description
     *
     * The object `CatalogoCursos.temario` groups methods
     * manipulating `CatalogoTemarioCursos` instances related to `CatalogoCursos`.
     *
     * Call {@link lbServices.CatalogoCursos#temario CatalogoCursos.temario()}
     * to query all related instances.
     */


        /**
         * @ngdoc method
         * @name lbServices.CatalogoCursos#temario
         * @methodOf lbServices.CatalogoCursos
         *
         * @description
         *
         * Queries temario of CatalogoCursos.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `filter` – `{object=}` - 
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoTemarioCursos` object.)
         * </em>
         */
        R.temario = function() {
          var TargetResource = $injector.get("CatalogoTemarioCursos");
          var action = TargetResource["::get::CatalogoCursos::temario"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.CatalogoCursos.temario#count
         * @methodOf lbServices.CatalogoCursos.temario
         *
         * @description
         *
         * Counts temario of CatalogoCursos.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        R.temario.count = function() {
          var TargetResource = $injector.get("CatalogoTemarioCursos");
          var action = TargetResource["::count::CatalogoCursos::temario"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.CatalogoCursos.temario#create
         * @methodOf lbServices.CatalogoCursos.temario
         *
         * @description
         *
         * Creates a new instance in temario of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoTemarioCursos` object.)
         * </em>
         */
        R.temario.create = function() {
          var TargetResource = $injector.get("CatalogoTemarioCursos");
          var action = TargetResource["::create::CatalogoCursos::temario"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.CatalogoCursos.temario#createMany
         * @methodOf lbServices.CatalogoCursos.temario
         *
         * @description
         *
         * Creates a new instance in temario of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoTemarioCursos` object.)
         * </em>
         */
        R.temario.createMany = function() {
          var TargetResource = $injector.get("CatalogoTemarioCursos");
          var action = TargetResource["::createMany::CatalogoCursos::temario"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.CatalogoCursos.temario#destroyAll
         * @methodOf lbServices.CatalogoCursos.temario
         *
         * @description
         *
         * Deletes all temario of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.temario.destroyAll = function() {
          var TargetResource = $injector.get("CatalogoTemarioCursos");
          var action = TargetResource["::delete::CatalogoCursos::temario"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.CatalogoCursos.temario#destroyById
         * @methodOf lbServices.CatalogoCursos.temario
         *
         * @description
         *
         * Delete a related item by id for temario.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for temario
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.temario.destroyById = function() {
          var TargetResource = $injector.get("CatalogoTemarioCursos");
          var action = TargetResource["::destroyById::CatalogoCursos::temario"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.CatalogoCursos.temario#findById
         * @methodOf lbServices.CatalogoCursos.temario
         *
         * @description
         *
         * Find a related item by id for temario.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for temario
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoTemarioCursos` object.)
         * </em>
         */
        R.temario.findById = function() {
          var TargetResource = $injector.get("CatalogoTemarioCursos");
          var action = TargetResource["::findById::CatalogoCursos::temario"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.CatalogoCursos.temario#updateById
         * @methodOf lbServices.CatalogoCursos.temario
         *
         * @description
         *
         * Update a related item by id for temario.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for temario
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoTemarioCursos` object.)
         * </em>
         */
        R.temario.updateById = function() {
          var TargetResource = $injector.get("CatalogoTemarioCursos");
          var action = TargetResource["::updateById::CatalogoCursos::temario"];
          return action.apply(R, arguments);
        };
    /**
     * @ngdoc object
     * @name lbServices.CatalogoCursos.instructores_habilitados
     * @header lbServices.CatalogoCursos.instructores_habilitados
     * @object
     * @description
     *
     * The object `CatalogoCursos.instructores_habilitados` groups methods
     * manipulating `CatalogoInstructores` instances related to `CatalogoCursos`.
     *
     * Call {@link lbServices.CatalogoCursos#instructores_habilitados CatalogoCursos.instructores_habilitados()}
     * to query all related instances.
     */


        /**
         * @ngdoc method
         * @name lbServices.CatalogoCursos#instructores_habilitados
         * @methodOf lbServices.CatalogoCursos
         *
         * @description
         *
         * Queries instructores_habilitados of CatalogoCursos.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `filter` – `{object=}` - 
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoInstructores` object.)
         * </em>
         */
        R.instructores_habilitados = function() {
          var TargetResource = $injector.get("CatalogoInstructores");
          var action = TargetResource["::get::CatalogoCursos::instructores_habilitados"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.CatalogoCursos.instructores_habilitados#count
         * @methodOf lbServices.CatalogoCursos.instructores_habilitados
         *
         * @description
         *
         * Counts instructores_habilitados of CatalogoCursos.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        R.instructores_habilitados.count = function() {
          var TargetResource = $injector.get("CatalogoInstructores");
          var action = TargetResource["::count::CatalogoCursos::instructores_habilitados"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.CatalogoCursos.instructores_habilitados#create
         * @methodOf lbServices.CatalogoCursos.instructores_habilitados
         *
         * @description
         *
         * Creates a new instance in instructores_habilitados of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoInstructores` object.)
         * </em>
         */
        R.instructores_habilitados.create = function() {
          var TargetResource = $injector.get("CatalogoInstructores");
          var action = TargetResource["::create::CatalogoCursos::instructores_habilitados"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.CatalogoCursos.instructores_habilitados#createMany
         * @methodOf lbServices.CatalogoCursos.instructores_habilitados
         *
         * @description
         *
         * Creates a new instance in instructores_habilitados of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoInstructores` object.)
         * </em>
         */
        R.instructores_habilitados.createMany = function() {
          var TargetResource = $injector.get("CatalogoInstructores");
          var action = TargetResource["::createMany::CatalogoCursos::instructores_habilitados"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.CatalogoCursos.instructores_habilitados#destroyAll
         * @methodOf lbServices.CatalogoCursos.instructores_habilitados
         *
         * @description
         *
         * Deletes all instructores_habilitados of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.instructores_habilitados.destroyAll = function() {
          var TargetResource = $injector.get("CatalogoInstructores");
          var action = TargetResource["::delete::CatalogoCursos::instructores_habilitados"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.CatalogoCursos.instructores_habilitados#destroyById
         * @methodOf lbServices.CatalogoCursos.instructores_habilitados
         *
         * @description
         *
         * Delete a related item by id for instructores_habilitados.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for instructores_habilitados
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.instructores_habilitados.destroyById = function() {
          var TargetResource = $injector.get("CatalogoInstructores");
          var action = TargetResource["::destroyById::CatalogoCursos::instructores_habilitados"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.CatalogoCursos.instructores_habilitados#exists
         * @methodOf lbServices.CatalogoCursos.instructores_habilitados
         *
         * @description
         *
         * Check the existence of instructores_habilitados relation to an item by id.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for instructores_habilitados
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoInstructores` object.)
         * </em>
         */
        R.instructores_habilitados.exists = function() {
          var TargetResource = $injector.get("CatalogoInstructores");
          var action = TargetResource["::exists::CatalogoCursos::instructores_habilitados"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.CatalogoCursos.instructores_habilitados#findById
         * @methodOf lbServices.CatalogoCursos.instructores_habilitados
         *
         * @description
         *
         * Find a related item by id for instructores_habilitados.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for instructores_habilitados
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoInstructores` object.)
         * </em>
         */
        R.instructores_habilitados.findById = function() {
          var TargetResource = $injector.get("CatalogoInstructores");
          var action = TargetResource["::findById::CatalogoCursos::instructores_habilitados"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.CatalogoCursos.instructores_habilitados#link
         * @methodOf lbServices.CatalogoCursos.instructores_habilitados
         *
         * @description
         *
         * Add a related item by id for instructores_habilitados.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for instructores_habilitados
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoInstructores` object.)
         * </em>
         */
        R.instructores_habilitados.link = function() {
          var TargetResource = $injector.get("CatalogoInstructores");
          var action = TargetResource["::link::CatalogoCursos::instructores_habilitados"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.CatalogoCursos.instructores_habilitados#unlink
         * @methodOf lbServices.CatalogoCursos.instructores_habilitados
         *
         * @description
         *
         * Remove the instructores_habilitados relation to an item by id.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for instructores_habilitados
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.instructores_habilitados.unlink = function() {
          var TargetResource = $injector.get("CatalogoInstructores");
          var action = TargetResource["::unlink::CatalogoCursos::instructores_habilitados"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.CatalogoCursos.instructores_habilitados#updateById
         * @methodOf lbServices.CatalogoCursos.instructores_habilitados
         *
         * @description
         *
         * Update a related item by id for instructores_habilitados.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for instructores_habilitados
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoInstructores` object.)
         * </em>
         */
        R.instructores_habilitados.updateById = function() {
          var TargetResource = $injector.get("CatalogoInstructores");
          var action = TargetResource["::updateById::CatalogoCursos::instructores_habilitados"];
          return action.apply(R, arguments);
        };

    return R;
  }]);

/**
 * @ngdoc object
 * @name lbServices.ProgTrimCursos
 * @header lbServices.ProgTrimCursos
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `ProgTrimCursos` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "ProgTrimCursos",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/ProgTrimCursos/:id",
      { 'id': '@id' },
      {

        // INTERNAL. Use ProgTrimCursos.unidad_pertenece() instead.
        "prototype$__get__unidad_pertenece": {
          url: urlBase + "/ProgTrimCursos/:id/unidad_pertenece",
          method: "GET"
        },

        // INTERNAL. Use ProgTrimCursos.cursos_programados.findById() instead.
        "prototype$__findById__cursos_programados": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/ProgTrimCursos/:id/cursos_programados/:fk",
          method: "GET"
        },

        // INTERNAL. Use ProgTrimCursos.cursos_programados.destroyById() instead.
        "prototype$__destroyById__cursos_programados": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/ProgTrimCursos/:id/cursos_programados/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use ProgTrimCursos.cursos_programados.updateById() instead.
        "prototype$__updateById__cursos_programados": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/ProgTrimCursos/:id/cursos_programados/:fk",
          method: "PUT"
        },

        // INTERNAL. Use ProgTrimCursos.cursos_programados() instead.
        "prototype$__get__cursos_programados": {
          isArray: true,
          url: urlBase + "/ProgTrimCursos/:id/cursos_programados",
          method: "GET"
        },

        // INTERNAL. Use ProgTrimCursos.cursos_programados.create() instead.
        "prototype$__create__cursos_programados": {
          url: urlBase + "/ProgTrimCursos/:id/cursos_programados",
          method: "POST"
        },

        // INTERNAL. Use ProgTrimCursos.cursos_programados.destroyAll() instead.
        "prototype$__delete__cursos_programados": {
          url: urlBase + "/ProgTrimCursos/:id/cursos_programados",
          method: "DELETE"
        },

        // INTERNAL. Use ProgTrimCursos.cursos_programados.count() instead.
        "prototype$__count__cursos_programados": {
          url: urlBase + "/ProgTrimCursos/:id/cursos_programados/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.ProgTrimCursos#create
         * @methodOf lbServices.ProgTrimCursos
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ProgTrimCursos` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/ProgTrimCursos",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.ProgTrimCursos#createMany
         * @methodOf lbServices.ProgTrimCursos
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ProgTrimCursos` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/ProgTrimCursos",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.ProgTrimCursos#upsert
         * @methodOf lbServices.ProgTrimCursos
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ProgTrimCursos` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/ProgTrimCursos",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.ProgTrimCursos#exists
         * @methodOf lbServices.ProgTrimCursos
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` - 
         */
        "exists": {
          url: urlBase + "/ProgTrimCursos/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.ProgTrimCursos#findById
         * @methodOf lbServices.ProgTrimCursos
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ProgTrimCursos` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/ProgTrimCursos/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.ProgTrimCursos#find
         * @methodOf lbServices.ProgTrimCursos
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ProgTrimCursos` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/ProgTrimCursos",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.ProgTrimCursos#findOne
         * @methodOf lbServices.ProgTrimCursos
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ProgTrimCursos` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/ProgTrimCursos/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.ProgTrimCursos#updateAll
         * @methodOf lbServices.ProgTrimCursos
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        "updateAll": {
          url: urlBase + "/ProgTrimCursos/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.ProgTrimCursos#deleteById
         * @methodOf lbServices.ProgTrimCursos
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ProgTrimCursos` object.)
         * </em>
         */
        "deleteById": {
          url: urlBase + "/ProgTrimCursos/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.ProgTrimCursos#count
         * @methodOf lbServices.ProgTrimCursos
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        "count": {
          url: urlBase + "/ProgTrimCursos/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.ProgTrimCursos#prototype$updateAttributes
         * @methodOf lbServices.ProgTrimCursos
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ProgTrimCursos` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/ProgTrimCursos/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.ProgTrimCursos#createChangeStream
         * @methodOf lbServices.ProgTrimCursos
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` - 
         */
        "createChangeStream": {
          url: urlBase + "/ProgTrimCursos/change-stream",
          method: "POST"
        },
      }
    );



        /**
         * @ngdoc method
         * @name lbServices.ProgTrimCursos#updateOrCreate
         * @methodOf lbServices.ProgTrimCursos
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ProgTrimCursos` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name lbServices.ProgTrimCursos#update
         * @methodOf lbServices.ProgTrimCursos
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name lbServices.ProgTrimCursos#destroyById
         * @methodOf lbServices.ProgTrimCursos
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ProgTrimCursos` object.)
         * </em>
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name lbServices.ProgTrimCursos#removeById
         * @methodOf lbServices.ProgTrimCursos
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ProgTrimCursos` object.)
         * </em>
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name lbServices.ProgTrimCursos#modelName
    * @propertyOf lbServices.ProgTrimCursos
    * @description
    * The name of the model represented by this $resource,
    * i.e. `ProgTrimCursos`.
    */
    R.modelName = "ProgTrimCursos";


        /**
         * @ngdoc method
         * @name lbServices.ProgTrimCursos#unidad_pertenece
         * @methodOf lbServices.ProgTrimCursos
         *
         * @description
         *
         * Fetches belongsTo relation unidad_pertenece.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `refresh` – `{boolean=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoUnidadesAdmtvas` object.)
         * </em>
         */
        R.unidad_pertenece = function() {
          var TargetResource = $injector.get("CatalogoUnidadesAdmtvas");
          var action = TargetResource["::get::ProgTrimCursos::unidad_pertenece"];
          return action.apply(R, arguments);
        };
    /**
     * @ngdoc object
     * @name lbServices.ProgTrimCursos.cursos_programados
     * @header lbServices.ProgTrimCursos.cursos_programados
     * @object
     * @description
     *
     * The object `ProgTrimCursos.cursos_programados` groups methods
     * manipulating `CursosPtc` instances related to `ProgTrimCursos`.
     *
     * Call {@link lbServices.ProgTrimCursos#cursos_programados ProgTrimCursos.cursos_programados()}
     * to query all related instances.
     */


        /**
         * @ngdoc method
         * @name lbServices.ProgTrimCursos#cursos_programados
         * @methodOf lbServices.ProgTrimCursos
         *
         * @description
         *
         * Queries cursos_programados of ProgTrimCursos.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `filter` – `{object=}` - 
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CursosPtc` object.)
         * </em>
         */
        R.cursos_programados = function() {
          var TargetResource = $injector.get("CursosPtc");
          var action = TargetResource["::get::ProgTrimCursos::cursos_programados"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.ProgTrimCursos.cursos_programados#count
         * @methodOf lbServices.ProgTrimCursos.cursos_programados
         *
         * @description
         *
         * Counts cursos_programados of ProgTrimCursos.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        R.cursos_programados.count = function() {
          var TargetResource = $injector.get("CursosPtc");
          var action = TargetResource["::count::ProgTrimCursos::cursos_programados"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.ProgTrimCursos.cursos_programados#create
         * @methodOf lbServices.ProgTrimCursos.cursos_programados
         *
         * @description
         *
         * Creates a new instance in cursos_programados of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CursosPtc` object.)
         * </em>
         */
        R.cursos_programados.create = function() {
          var TargetResource = $injector.get("CursosPtc");
          var action = TargetResource["::create::ProgTrimCursos::cursos_programados"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.ProgTrimCursos.cursos_programados#createMany
         * @methodOf lbServices.ProgTrimCursos.cursos_programados
         *
         * @description
         *
         * Creates a new instance in cursos_programados of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CursosPtc` object.)
         * </em>
         */
        R.cursos_programados.createMany = function() {
          var TargetResource = $injector.get("CursosPtc");
          var action = TargetResource["::createMany::ProgTrimCursos::cursos_programados"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.ProgTrimCursos.cursos_programados#destroyAll
         * @methodOf lbServices.ProgTrimCursos.cursos_programados
         *
         * @description
         *
         * Deletes all cursos_programados of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.cursos_programados.destroyAll = function() {
          var TargetResource = $injector.get("CursosPtc");
          var action = TargetResource["::delete::ProgTrimCursos::cursos_programados"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.ProgTrimCursos.cursos_programados#destroyById
         * @methodOf lbServices.ProgTrimCursos.cursos_programados
         *
         * @description
         *
         * Delete a related item by id for cursos_programados.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for cursos_programados
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.cursos_programados.destroyById = function() {
          var TargetResource = $injector.get("CursosPtc");
          var action = TargetResource["::destroyById::ProgTrimCursos::cursos_programados"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.ProgTrimCursos.cursos_programados#findById
         * @methodOf lbServices.ProgTrimCursos.cursos_programados
         *
         * @description
         *
         * Find a related item by id for cursos_programados.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for cursos_programados
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CursosPtc` object.)
         * </em>
         */
        R.cursos_programados.findById = function() {
          var TargetResource = $injector.get("CursosPtc");
          var action = TargetResource["::findById::ProgTrimCursos::cursos_programados"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.ProgTrimCursos.cursos_programados#updateById
         * @methodOf lbServices.ProgTrimCursos.cursos_programados
         *
         * @description
         *
         * Update a related item by id for cursos_programados.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for cursos_programados
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CursosPtc` object.)
         * </em>
         */
        R.cursos_programados.updateById = function() {
          var TargetResource = $injector.get("CursosPtc");
          var action = TargetResource["::updateById::ProgTrimCursos::cursos_programados"];
          return action.apply(R, arguments);
        };

    return R;
  }]);

/**
 * @ngdoc object
 * @name lbServices.CursosPtc
 * @header lbServices.CursosPtc
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `CursosPtc` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "CursosPtc",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/CursosPtcs/:id",
      { 'id': '@id' },
      {

        // INTERNAL. Use CursosPtc.detalle_curso() instead.
        "prototype$__get__detalle_curso": {
          url: urlBase + "/CursosPtcs/:id/detalle_curso",
          method: "GET"
        },

        // INTERNAL. Use CursosPtc.instructores_propuestos.findById() instead.
        "prototype$__findById__instructores_propuestos": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/CursosPtcs/:id/instructores_propuestos/:fk",
          method: "GET"
        },

        // INTERNAL. Use CursosPtc.instructores_propuestos.destroyById() instead.
        "prototype$__destroyById__instructores_propuestos": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/CursosPtcs/:id/instructores_propuestos/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use CursosPtc.instructores_propuestos.updateById() instead.
        "prototype$__updateById__instructores_propuestos": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/CursosPtcs/:id/instructores_propuestos/:fk",
          method: "PUT"
        },

        // INTERNAL. Use CursosPtc.instructores_propuestos.link() instead.
        "prototype$__link__instructores_propuestos": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/CursosPtcs/:id/instructores_propuestos/rel/:fk",
          method: "PUT"
        },

        // INTERNAL. Use CursosPtc.instructores_propuestos.unlink() instead.
        "prototype$__unlink__instructores_propuestos": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/CursosPtcs/:id/instructores_propuestos/rel/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use CursosPtc.instructores_propuestos.exists() instead.
        "prototype$__exists__instructores_propuestos": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/CursosPtcs/:id/instructores_propuestos/rel/:fk",
          method: "HEAD"
        },

        // INTERNAL. Use CursosPtc.instructores_propuestos() instead.
        "prototype$__get__instructores_propuestos": {
          isArray: true,
          url: urlBase + "/CursosPtcs/:id/instructores_propuestos",
          method: "GET"
        },

        // INTERNAL. Use CursosPtc.instructores_propuestos.create() instead.
        "prototype$__create__instructores_propuestos": {
          url: urlBase + "/CursosPtcs/:id/instructores_propuestos",
          method: "POST"
        },

        // INTERNAL. Use CursosPtc.instructores_propuestos.destroyAll() instead.
        "prototype$__delete__instructores_propuestos": {
          url: urlBase + "/CursosPtcs/:id/instructores_propuestos",
          method: "DELETE"
        },

        // INTERNAL. Use CursosPtc.instructores_propuestos.count() instead.
        "prototype$__count__instructores_propuestos": {
          url: urlBase + "/CursosPtcs/:id/instructores_propuestos/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.CursosPtc#create
         * @methodOf lbServices.CursosPtc
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CursosPtc` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/CursosPtcs",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.CursosPtc#createMany
         * @methodOf lbServices.CursosPtc
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CursosPtc` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/CursosPtcs",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.CursosPtc#upsert
         * @methodOf lbServices.CursosPtc
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CursosPtc` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/CursosPtcs",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.CursosPtc#exists
         * @methodOf lbServices.CursosPtc
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` - 
         */
        "exists": {
          url: urlBase + "/CursosPtcs/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.CursosPtc#findById
         * @methodOf lbServices.CursosPtc
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CursosPtc` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/CursosPtcs/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.CursosPtc#find
         * @methodOf lbServices.CursosPtc
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CursosPtc` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/CursosPtcs",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.CursosPtc#findOne
         * @methodOf lbServices.CursosPtc
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CursosPtc` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/CursosPtcs/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.CursosPtc#updateAll
         * @methodOf lbServices.CursosPtc
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        "updateAll": {
          url: urlBase + "/CursosPtcs/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.CursosPtc#deleteById
         * @methodOf lbServices.CursosPtc
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CursosPtc` object.)
         * </em>
         */
        "deleteById": {
          url: urlBase + "/CursosPtcs/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.CursosPtc#count
         * @methodOf lbServices.CursosPtc
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        "count": {
          url: urlBase + "/CursosPtcs/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.CursosPtc#prototype$updateAttributes
         * @methodOf lbServices.CursosPtc
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CursosPtc` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/CursosPtcs/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.CursosPtc#createChangeStream
         * @methodOf lbServices.CursosPtc
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` - 
         */
        "createChangeStream": {
          url: urlBase + "/CursosPtcs/change-stream",
          method: "POST"
        },

        // INTERNAL. Use ProgTrimCursos.cursos_programados.findById() instead.
        "::findById::ProgTrimCursos::cursos_programados": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/ProgTrimCursos/:id/cursos_programados/:fk",
          method: "GET"
        },

        // INTERNAL. Use ProgTrimCursos.cursos_programados.destroyById() instead.
        "::destroyById::ProgTrimCursos::cursos_programados": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/ProgTrimCursos/:id/cursos_programados/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use ProgTrimCursos.cursos_programados.updateById() instead.
        "::updateById::ProgTrimCursos::cursos_programados": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/ProgTrimCursos/:id/cursos_programados/:fk",
          method: "PUT"
        },

        // INTERNAL. Use ProgTrimCursos.cursos_programados() instead.
        "::get::ProgTrimCursos::cursos_programados": {
          isArray: true,
          url: urlBase + "/ProgTrimCursos/:id/cursos_programados",
          method: "GET"
        },

        // INTERNAL. Use ProgTrimCursos.cursos_programados.create() instead.
        "::create::ProgTrimCursos::cursos_programados": {
          url: urlBase + "/ProgTrimCursos/:id/cursos_programados",
          method: "POST"
        },

        // INTERNAL. Use ProgTrimCursos.cursos_programados.createMany() instead.
        "::createMany::ProgTrimCursos::cursos_programados": {
          isArray: true,
          url: urlBase + "/ProgTrimCursos/:id/cursos_programados",
          method: "POST"
        },

        // INTERNAL. Use ProgTrimCursos.cursos_programados.destroyAll() instead.
        "::delete::ProgTrimCursos::cursos_programados": {
          url: urlBase + "/ProgTrimCursos/:id/cursos_programados",
          method: "DELETE"
        },

        // INTERNAL. Use ProgTrimCursos.cursos_programados.count() instead.
        "::count::ProgTrimCursos::cursos_programados": {
          url: urlBase + "/ProgTrimCursos/:id/cursos_programados/count",
          method: "GET"
        },

        // INTERNAL. Use CatalogoInstructores.cursos_propuestos.findById() instead.
        "::findById::CatalogoInstructores::cursos_propuestos": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/CatalogoInstructores/:id/cursos_propuestos/:fk",
          method: "GET"
        },

        // INTERNAL. Use CatalogoInstructores.cursos_propuestos.destroyById() instead.
        "::destroyById::CatalogoInstructores::cursos_propuestos": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/CatalogoInstructores/:id/cursos_propuestos/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use CatalogoInstructores.cursos_propuestos.updateById() instead.
        "::updateById::CatalogoInstructores::cursos_propuestos": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/CatalogoInstructores/:id/cursos_propuestos/:fk",
          method: "PUT"
        },

        // INTERNAL. Use CatalogoInstructores.cursos_propuestos.link() instead.
        "::link::CatalogoInstructores::cursos_propuestos": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/CatalogoInstructores/:id/cursos_propuestos/rel/:fk",
          method: "PUT"
        },

        // INTERNAL. Use CatalogoInstructores.cursos_propuestos.unlink() instead.
        "::unlink::CatalogoInstructores::cursos_propuestos": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/CatalogoInstructores/:id/cursos_propuestos/rel/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use CatalogoInstructores.cursos_propuestos.exists() instead.
        "::exists::CatalogoInstructores::cursos_propuestos": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/CatalogoInstructores/:id/cursos_propuestos/rel/:fk",
          method: "HEAD"
        },

        // INTERNAL. Use CatalogoInstructores.cursos_propuestos() instead.
        "::get::CatalogoInstructores::cursos_propuestos": {
          isArray: true,
          url: urlBase + "/CatalogoInstructores/:id/cursos_propuestos",
          method: "GET"
        },

        // INTERNAL. Use CatalogoInstructores.cursos_propuestos.create() instead.
        "::create::CatalogoInstructores::cursos_propuestos": {
          url: urlBase + "/CatalogoInstructores/:id/cursos_propuestos",
          method: "POST"
        },

        // INTERNAL. Use CatalogoInstructores.cursos_propuestos.createMany() instead.
        "::createMany::CatalogoInstructores::cursos_propuestos": {
          isArray: true,
          url: urlBase + "/CatalogoInstructores/:id/cursos_propuestos",
          method: "POST"
        },

        // INTERNAL. Use CatalogoInstructores.cursos_propuestos.destroyAll() instead.
        "::delete::CatalogoInstructores::cursos_propuestos": {
          url: urlBase + "/CatalogoInstructores/:id/cursos_propuestos",
          method: "DELETE"
        },

        // INTERNAL. Use CatalogoInstructores.cursos_propuestos.count() instead.
        "::count::CatalogoInstructores::cursos_propuestos": {
          url: urlBase + "/CatalogoInstructores/:id/cursos_propuestos/count",
          method: "GET"
        },

        // INTERNAL. Use RelInstrucPtc.CursosPtc() instead.
        "::get::RelInstrucPtc::CursosPtc": {
          url: urlBase + "/RelInstrucPtcs/:id/CursosPtc",
          method: "GET"
        },

        // INTERNAL. Use CursosOficiales.curso_ptc_pertenece() instead.
        "::get::CursosOficiales::curso_ptc_pertenece": {
          url: urlBase + "/CursosOficiales/:id/curso_ptc_pertenece",
          method: "GET"
        },
      }
    );



        /**
         * @ngdoc method
         * @name lbServices.CursosPtc#updateOrCreate
         * @methodOf lbServices.CursosPtc
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CursosPtc` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name lbServices.CursosPtc#update
         * @methodOf lbServices.CursosPtc
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name lbServices.CursosPtc#destroyById
         * @methodOf lbServices.CursosPtc
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CursosPtc` object.)
         * </em>
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name lbServices.CursosPtc#removeById
         * @methodOf lbServices.CursosPtc
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CursosPtc` object.)
         * </em>
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name lbServices.CursosPtc#modelName
    * @propertyOf lbServices.CursosPtc
    * @description
    * The name of the model represented by this $resource,
    * i.e. `CursosPtc`.
    */
    R.modelName = "CursosPtc";


        /**
         * @ngdoc method
         * @name lbServices.CursosPtc#detalle_curso
         * @methodOf lbServices.CursosPtc
         *
         * @description
         *
         * Fetches belongsTo relation detalle_curso.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `refresh` – `{boolean=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoCursos` object.)
         * </em>
         */
        R.detalle_curso = function() {
          var TargetResource = $injector.get("CatalogoCursos");
          var action = TargetResource["::get::CursosPtc::detalle_curso"];
          return action.apply(R, arguments);
        };
    /**
     * @ngdoc object
     * @name lbServices.CursosPtc.instructores_propuestos
     * @header lbServices.CursosPtc.instructores_propuestos
     * @object
     * @description
     *
     * The object `CursosPtc.instructores_propuestos` groups methods
     * manipulating `CatalogoInstructores` instances related to `CursosPtc`.
     *
     * Call {@link lbServices.CursosPtc#instructores_propuestos CursosPtc.instructores_propuestos()}
     * to query all related instances.
     */


        /**
         * @ngdoc method
         * @name lbServices.CursosPtc#instructores_propuestos
         * @methodOf lbServices.CursosPtc
         *
         * @description
         *
         * Queries instructores_propuestos of CursosPtc.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `filter` – `{object=}` - 
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoInstructores` object.)
         * </em>
         */
        R.instructores_propuestos = function() {
          var TargetResource = $injector.get("CatalogoInstructores");
          var action = TargetResource["::get::CursosPtc::instructores_propuestos"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.CursosPtc.instructores_propuestos#count
         * @methodOf lbServices.CursosPtc.instructores_propuestos
         *
         * @description
         *
         * Counts instructores_propuestos of CursosPtc.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        R.instructores_propuestos.count = function() {
          var TargetResource = $injector.get("CatalogoInstructores");
          var action = TargetResource["::count::CursosPtc::instructores_propuestos"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.CursosPtc.instructores_propuestos#create
         * @methodOf lbServices.CursosPtc.instructores_propuestos
         *
         * @description
         *
         * Creates a new instance in instructores_propuestos of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoInstructores` object.)
         * </em>
         */
        R.instructores_propuestos.create = function() {
          var TargetResource = $injector.get("CatalogoInstructores");
          var action = TargetResource["::create::CursosPtc::instructores_propuestos"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.CursosPtc.instructores_propuestos#createMany
         * @methodOf lbServices.CursosPtc.instructores_propuestos
         *
         * @description
         *
         * Creates a new instance in instructores_propuestos of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoInstructores` object.)
         * </em>
         */
        R.instructores_propuestos.createMany = function() {
          var TargetResource = $injector.get("CatalogoInstructores");
          var action = TargetResource["::createMany::CursosPtc::instructores_propuestos"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.CursosPtc.instructores_propuestos#destroyAll
         * @methodOf lbServices.CursosPtc.instructores_propuestos
         *
         * @description
         *
         * Deletes all instructores_propuestos of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.instructores_propuestos.destroyAll = function() {
          var TargetResource = $injector.get("CatalogoInstructores");
          var action = TargetResource["::delete::CursosPtc::instructores_propuestos"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.CursosPtc.instructores_propuestos#destroyById
         * @methodOf lbServices.CursosPtc.instructores_propuestos
         *
         * @description
         *
         * Delete a related item by id for instructores_propuestos.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for instructores_propuestos
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.instructores_propuestos.destroyById = function() {
          var TargetResource = $injector.get("CatalogoInstructores");
          var action = TargetResource["::destroyById::CursosPtc::instructores_propuestos"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.CursosPtc.instructores_propuestos#exists
         * @methodOf lbServices.CursosPtc.instructores_propuestos
         *
         * @description
         *
         * Check the existence of instructores_propuestos relation to an item by id.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for instructores_propuestos
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoInstructores` object.)
         * </em>
         */
        R.instructores_propuestos.exists = function() {
          var TargetResource = $injector.get("CatalogoInstructores");
          var action = TargetResource["::exists::CursosPtc::instructores_propuestos"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.CursosPtc.instructores_propuestos#findById
         * @methodOf lbServices.CursosPtc.instructores_propuestos
         *
         * @description
         *
         * Find a related item by id for instructores_propuestos.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for instructores_propuestos
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoInstructores` object.)
         * </em>
         */
        R.instructores_propuestos.findById = function() {
          var TargetResource = $injector.get("CatalogoInstructores");
          var action = TargetResource["::findById::CursosPtc::instructores_propuestos"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.CursosPtc.instructores_propuestos#link
         * @methodOf lbServices.CursosPtc.instructores_propuestos
         *
         * @description
         *
         * Add a related item by id for instructores_propuestos.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for instructores_propuestos
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoInstructores` object.)
         * </em>
         */
        R.instructores_propuestos.link = function() {
          var TargetResource = $injector.get("CatalogoInstructores");
          var action = TargetResource["::link::CursosPtc::instructores_propuestos"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.CursosPtc.instructores_propuestos#unlink
         * @methodOf lbServices.CursosPtc.instructores_propuestos
         *
         * @description
         *
         * Remove the instructores_propuestos relation to an item by id.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for instructores_propuestos
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.instructores_propuestos.unlink = function() {
          var TargetResource = $injector.get("CatalogoInstructores");
          var action = TargetResource["::unlink::CursosPtc::instructores_propuestos"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.CursosPtc.instructores_propuestos#updateById
         * @methodOf lbServices.CursosPtc.instructores_propuestos
         *
         * @description
         *
         * Update a related item by id for instructores_propuestos.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for instructores_propuestos
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoInstructores` object.)
         * </em>
         */
        R.instructores_propuestos.updateById = function() {
          var TargetResource = $injector.get("CatalogoInstructores");
          var action = TargetResource["::updateById::CursosPtc::instructores_propuestos"];
          return action.apply(R, arguments);
        };

    return R;
  }]);

/**
 * @ngdoc object
 * @name lbServices.CatalogoInstructores
 * @header lbServices.CatalogoInstructores
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `CatalogoInstructores` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "CatalogoInstructores",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/CatalogoInstructores/:id",
      { 'id': '@id' },
      {

        // INTERNAL. Use CatalogoInstructores.unidad_pertenece() instead.
        "prototype$__get__unidad_pertenece": {
          url: urlBase + "/CatalogoInstructores/:id/unidad_pertenece",
          method: "GET"
        },

        // INTERNAL. Use CatalogoInstructores.localidad_pertenece() instead.
        "prototype$__get__localidad_pertenece": {
          url: urlBase + "/CatalogoInstructores/:id/localidad_pertenece",
          method: "GET"
        },

        // INTERNAL. Use CatalogoInstructores.cursos_propuestos.findById() instead.
        "prototype$__findById__cursos_propuestos": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/CatalogoInstructores/:id/cursos_propuestos/:fk",
          method: "GET"
        },

        // INTERNAL. Use CatalogoInstructores.cursos_propuestos.destroyById() instead.
        "prototype$__destroyById__cursos_propuestos": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/CatalogoInstructores/:id/cursos_propuestos/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use CatalogoInstructores.cursos_propuestos.updateById() instead.
        "prototype$__updateById__cursos_propuestos": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/CatalogoInstructores/:id/cursos_propuestos/:fk",
          method: "PUT"
        },

        // INTERNAL. Use CatalogoInstructores.cursos_propuestos.link() instead.
        "prototype$__link__cursos_propuestos": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/CatalogoInstructores/:id/cursos_propuestos/rel/:fk",
          method: "PUT"
        },

        // INTERNAL. Use CatalogoInstructores.cursos_propuestos.unlink() instead.
        "prototype$__unlink__cursos_propuestos": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/CatalogoInstructores/:id/cursos_propuestos/rel/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use CatalogoInstructores.cursos_propuestos.exists() instead.
        "prototype$__exists__cursos_propuestos": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/CatalogoInstructores/:id/cursos_propuestos/rel/:fk",
          method: "HEAD"
        },

        // INTERNAL. Use CatalogoInstructores.cursos_habilitados.findById() instead.
        "prototype$__findById__cursos_habilitados": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/CatalogoInstructores/:id/cursos_habilitados/:fk",
          method: "GET"
        },

        // INTERNAL. Use CatalogoInstructores.cursos_habilitados.destroyById() instead.
        "prototype$__destroyById__cursos_habilitados": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/CatalogoInstructores/:id/cursos_habilitados/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use CatalogoInstructores.cursos_habilitados.updateById() instead.
        "prototype$__updateById__cursos_habilitados": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/CatalogoInstructores/:id/cursos_habilitados/:fk",
          method: "PUT"
        },

        // INTERNAL. Use CatalogoInstructores.cursos_habilitados.link() instead.
        "prototype$__link__cursos_habilitados": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/CatalogoInstructores/:id/cursos_habilitados/rel/:fk",
          method: "PUT"
        },

        // INTERNAL. Use CatalogoInstructores.cursos_habilitados.unlink() instead.
        "prototype$__unlink__cursos_habilitados": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/CatalogoInstructores/:id/cursos_habilitados/rel/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use CatalogoInstructores.cursos_habilitados.exists() instead.
        "prototype$__exists__cursos_habilitados": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/CatalogoInstructores/:id/cursos_habilitados/rel/:fk",
          method: "HEAD"
        },

        // INTERNAL. Use CatalogoInstructores.cursos_propuestos() instead.
        "prototype$__get__cursos_propuestos": {
          isArray: true,
          url: urlBase + "/CatalogoInstructores/:id/cursos_propuestos",
          method: "GET"
        },

        // INTERNAL. Use CatalogoInstructores.cursos_propuestos.create() instead.
        "prototype$__create__cursos_propuestos": {
          url: urlBase + "/CatalogoInstructores/:id/cursos_propuestos",
          method: "POST"
        },

        // INTERNAL. Use CatalogoInstructores.cursos_propuestos.destroyAll() instead.
        "prototype$__delete__cursos_propuestos": {
          url: urlBase + "/CatalogoInstructores/:id/cursos_propuestos",
          method: "DELETE"
        },

        // INTERNAL. Use CatalogoInstructores.cursos_propuestos.count() instead.
        "prototype$__count__cursos_propuestos": {
          url: urlBase + "/CatalogoInstructores/:id/cursos_propuestos/count",
          method: "GET"
        },

        // INTERNAL. Use CatalogoInstructores.cursos_habilitados() instead.
        "prototype$__get__cursos_habilitados": {
          isArray: true,
          url: urlBase + "/CatalogoInstructores/:id/cursos_habilitados",
          method: "GET"
        },

        // INTERNAL. Use CatalogoInstructores.cursos_habilitados.create() instead.
        "prototype$__create__cursos_habilitados": {
          url: urlBase + "/CatalogoInstructores/:id/cursos_habilitados",
          method: "POST"
        },

        // INTERNAL. Use CatalogoInstructores.cursos_habilitados.destroyAll() instead.
        "prototype$__delete__cursos_habilitados": {
          url: urlBase + "/CatalogoInstructores/:id/cursos_habilitados",
          method: "DELETE"
        },

        // INTERNAL. Use CatalogoInstructores.cursos_habilitados.count() instead.
        "prototype$__count__cursos_habilitados": {
          url: urlBase + "/CatalogoInstructores/:id/cursos_habilitados/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoInstructores#create
         * @methodOf lbServices.CatalogoInstructores
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoInstructores` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/CatalogoInstructores",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoInstructores#createMany
         * @methodOf lbServices.CatalogoInstructores
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoInstructores` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/CatalogoInstructores",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoInstructores#upsert
         * @methodOf lbServices.CatalogoInstructores
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoInstructores` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/CatalogoInstructores",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoInstructores#exists
         * @methodOf lbServices.CatalogoInstructores
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` - 
         */
        "exists": {
          url: urlBase + "/CatalogoInstructores/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoInstructores#findById
         * @methodOf lbServices.CatalogoInstructores
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoInstructores` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/CatalogoInstructores/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoInstructores#find
         * @methodOf lbServices.CatalogoInstructores
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoInstructores` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/CatalogoInstructores",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoInstructores#findOne
         * @methodOf lbServices.CatalogoInstructores
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoInstructores` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/CatalogoInstructores/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoInstructores#updateAll
         * @methodOf lbServices.CatalogoInstructores
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        "updateAll": {
          url: urlBase + "/CatalogoInstructores/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoInstructores#deleteById
         * @methodOf lbServices.CatalogoInstructores
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoInstructores` object.)
         * </em>
         */
        "deleteById": {
          url: urlBase + "/CatalogoInstructores/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoInstructores#count
         * @methodOf lbServices.CatalogoInstructores
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        "count": {
          url: urlBase + "/CatalogoInstructores/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoInstructores#prototype$updateAttributes
         * @methodOf lbServices.CatalogoInstructores
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoInstructores` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/CatalogoInstructores/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.CatalogoInstructores#createChangeStream
         * @methodOf lbServices.CatalogoInstructores
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` - 
         */
        "createChangeStream": {
          url: urlBase + "/CatalogoInstructores/change-stream",
          method: "POST"
        },

        // INTERNAL. Use CatalogoCursos.instructores_habilitados.findById() instead.
        "::findById::CatalogoCursos::instructores_habilitados": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/CatalogoCursos/:id/instructores_habilitados/:fk",
          method: "GET"
        },

        // INTERNAL. Use CatalogoCursos.instructores_habilitados.destroyById() instead.
        "::destroyById::CatalogoCursos::instructores_habilitados": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/CatalogoCursos/:id/instructores_habilitados/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use CatalogoCursos.instructores_habilitados.updateById() instead.
        "::updateById::CatalogoCursos::instructores_habilitados": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/CatalogoCursos/:id/instructores_habilitados/:fk",
          method: "PUT"
        },

        // INTERNAL. Use CatalogoCursos.instructores_habilitados.link() instead.
        "::link::CatalogoCursos::instructores_habilitados": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/CatalogoCursos/:id/instructores_habilitados/rel/:fk",
          method: "PUT"
        },

        // INTERNAL. Use CatalogoCursos.instructores_habilitados.unlink() instead.
        "::unlink::CatalogoCursos::instructores_habilitados": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/CatalogoCursos/:id/instructores_habilitados/rel/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use CatalogoCursos.instructores_habilitados.exists() instead.
        "::exists::CatalogoCursos::instructores_habilitados": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/CatalogoCursos/:id/instructores_habilitados/rel/:fk",
          method: "HEAD"
        },

        // INTERNAL. Use CatalogoCursos.instructores_habilitados() instead.
        "::get::CatalogoCursos::instructores_habilitados": {
          isArray: true,
          url: urlBase + "/CatalogoCursos/:id/instructores_habilitados",
          method: "GET"
        },

        // INTERNAL. Use CatalogoCursos.instructores_habilitados.create() instead.
        "::create::CatalogoCursos::instructores_habilitados": {
          url: urlBase + "/CatalogoCursos/:id/instructores_habilitados",
          method: "POST"
        },

        // INTERNAL. Use CatalogoCursos.instructores_habilitados.createMany() instead.
        "::createMany::CatalogoCursos::instructores_habilitados": {
          isArray: true,
          url: urlBase + "/CatalogoCursos/:id/instructores_habilitados",
          method: "POST"
        },

        // INTERNAL. Use CatalogoCursos.instructores_habilitados.destroyAll() instead.
        "::delete::CatalogoCursos::instructores_habilitados": {
          url: urlBase + "/CatalogoCursos/:id/instructores_habilitados",
          method: "DELETE"
        },

        // INTERNAL. Use CatalogoCursos.instructores_habilitados.count() instead.
        "::count::CatalogoCursos::instructores_habilitados": {
          url: urlBase + "/CatalogoCursos/:id/instructores_habilitados/count",
          method: "GET"
        },

        // INTERNAL. Use CursosPtc.instructores_propuestos.findById() instead.
        "::findById::CursosPtc::instructores_propuestos": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/CursosPtcs/:id/instructores_propuestos/:fk",
          method: "GET"
        },

        // INTERNAL. Use CursosPtc.instructores_propuestos.destroyById() instead.
        "::destroyById::CursosPtc::instructores_propuestos": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/CursosPtcs/:id/instructores_propuestos/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use CursosPtc.instructores_propuestos.updateById() instead.
        "::updateById::CursosPtc::instructores_propuestos": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/CursosPtcs/:id/instructores_propuestos/:fk",
          method: "PUT"
        },

        // INTERNAL. Use CursosPtc.instructores_propuestos.link() instead.
        "::link::CursosPtc::instructores_propuestos": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/CursosPtcs/:id/instructores_propuestos/rel/:fk",
          method: "PUT"
        },

        // INTERNAL. Use CursosPtc.instructores_propuestos.unlink() instead.
        "::unlink::CursosPtc::instructores_propuestos": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/CursosPtcs/:id/instructores_propuestos/rel/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use CursosPtc.instructores_propuestos.exists() instead.
        "::exists::CursosPtc::instructores_propuestos": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/CursosPtcs/:id/instructores_propuestos/rel/:fk",
          method: "HEAD"
        },

        // INTERNAL. Use CursosPtc.instructores_propuestos() instead.
        "::get::CursosPtc::instructores_propuestos": {
          isArray: true,
          url: urlBase + "/CursosPtcs/:id/instructores_propuestos",
          method: "GET"
        },

        // INTERNAL. Use CursosPtc.instructores_propuestos.create() instead.
        "::create::CursosPtc::instructores_propuestos": {
          url: urlBase + "/CursosPtcs/:id/instructores_propuestos",
          method: "POST"
        },

        // INTERNAL. Use CursosPtc.instructores_propuestos.createMany() instead.
        "::createMany::CursosPtc::instructores_propuestos": {
          isArray: true,
          url: urlBase + "/CursosPtcs/:id/instructores_propuestos",
          method: "POST"
        },

        // INTERNAL. Use CursosPtc.instructores_propuestos.destroyAll() instead.
        "::delete::CursosPtc::instructores_propuestos": {
          url: urlBase + "/CursosPtcs/:id/instructores_propuestos",
          method: "DELETE"
        },

        // INTERNAL. Use CursosPtc.instructores_propuestos.count() instead.
        "::count::CursosPtc::instructores_propuestos": {
          url: urlBase + "/CursosPtcs/:id/instructores_propuestos/count",
          method: "GET"
        },

        // INTERNAL. Use RelInstrucPtc.CatalogoInstructores() instead.
        "::get::RelInstrucPtc::CatalogoInstructores": {
          url: urlBase + "/RelInstrucPtcs/:id/CatalogoInstructores",
          method: "GET"
        },

        // INTERNAL. Use RelInstrucCatCurso.CatalogoInstructores() instead.
        "::get::RelInstrucCatCurso::CatalogoInstructores": {
          url: urlBase + "/RelInstrucCatCursos/:id/CatalogoInstructores",
          method: "GET"
        },
      }
    );



        /**
         * @ngdoc method
         * @name lbServices.CatalogoInstructores#updateOrCreate
         * @methodOf lbServices.CatalogoInstructores
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoInstructores` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name lbServices.CatalogoInstructores#update
         * @methodOf lbServices.CatalogoInstructores
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name lbServices.CatalogoInstructores#destroyById
         * @methodOf lbServices.CatalogoInstructores
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoInstructores` object.)
         * </em>
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name lbServices.CatalogoInstructores#removeById
         * @methodOf lbServices.CatalogoInstructores
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoInstructores` object.)
         * </em>
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name lbServices.CatalogoInstructores#modelName
    * @propertyOf lbServices.CatalogoInstructores
    * @description
    * The name of the model represented by this $resource,
    * i.e. `CatalogoInstructores`.
    */
    R.modelName = "CatalogoInstructores";


        /**
         * @ngdoc method
         * @name lbServices.CatalogoInstructores#unidad_pertenece
         * @methodOf lbServices.CatalogoInstructores
         *
         * @description
         *
         * Fetches belongsTo relation unidad_pertenece.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `refresh` – `{boolean=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoUnidadesAdmtvas` object.)
         * </em>
         */
        R.unidad_pertenece = function() {
          var TargetResource = $injector.get("CatalogoUnidadesAdmtvas");
          var action = TargetResource["::get::CatalogoInstructores::unidad_pertenece"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.CatalogoInstructores#localidad_pertenece
         * @methodOf lbServices.CatalogoInstructores
         *
         * @description
         *
         * Fetches belongsTo relation localidad_pertenece.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `refresh` – `{boolean=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoLocalidades` object.)
         * </em>
         */
        R.localidad_pertenece = function() {
          var TargetResource = $injector.get("CatalogoLocalidades");
          var action = TargetResource["::get::CatalogoInstructores::localidad_pertenece"];
          return action.apply(R, arguments);
        };
    /**
     * @ngdoc object
     * @name lbServices.CatalogoInstructores.cursos_propuestos
     * @header lbServices.CatalogoInstructores.cursos_propuestos
     * @object
     * @description
     *
     * The object `CatalogoInstructores.cursos_propuestos` groups methods
     * manipulating `CursosPtc` instances related to `CatalogoInstructores`.
     *
     * Call {@link lbServices.CatalogoInstructores#cursos_propuestos CatalogoInstructores.cursos_propuestos()}
     * to query all related instances.
     */


        /**
         * @ngdoc method
         * @name lbServices.CatalogoInstructores#cursos_propuestos
         * @methodOf lbServices.CatalogoInstructores
         *
         * @description
         *
         * Queries cursos_propuestos of CatalogoInstructores.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `filter` – `{object=}` - 
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CursosPtc` object.)
         * </em>
         */
        R.cursos_propuestos = function() {
          var TargetResource = $injector.get("CursosPtc");
          var action = TargetResource["::get::CatalogoInstructores::cursos_propuestos"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.CatalogoInstructores.cursos_propuestos#count
         * @methodOf lbServices.CatalogoInstructores.cursos_propuestos
         *
         * @description
         *
         * Counts cursos_propuestos of CatalogoInstructores.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        R.cursos_propuestos.count = function() {
          var TargetResource = $injector.get("CursosPtc");
          var action = TargetResource["::count::CatalogoInstructores::cursos_propuestos"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.CatalogoInstructores.cursos_propuestos#create
         * @methodOf lbServices.CatalogoInstructores.cursos_propuestos
         *
         * @description
         *
         * Creates a new instance in cursos_propuestos of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CursosPtc` object.)
         * </em>
         */
        R.cursos_propuestos.create = function() {
          var TargetResource = $injector.get("CursosPtc");
          var action = TargetResource["::create::CatalogoInstructores::cursos_propuestos"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.CatalogoInstructores.cursos_propuestos#createMany
         * @methodOf lbServices.CatalogoInstructores.cursos_propuestos
         *
         * @description
         *
         * Creates a new instance in cursos_propuestos of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CursosPtc` object.)
         * </em>
         */
        R.cursos_propuestos.createMany = function() {
          var TargetResource = $injector.get("CursosPtc");
          var action = TargetResource["::createMany::CatalogoInstructores::cursos_propuestos"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.CatalogoInstructores.cursos_propuestos#destroyAll
         * @methodOf lbServices.CatalogoInstructores.cursos_propuestos
         *
         * @description
         *
         * Deletes all cursos_propuestos of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.cursos_propuestos.destroyAll = function() {
          var TargetResource = $injector.get("CursosPtc");
          var action = TargetResource["::delete::CatalogoInstructores::cursos_propuestos"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.CatalogoInstructores.cursos_propuestos#destroyById
         * @methodOf lbServices.CatalogoInstructores.cursos_propuestos
         *
         * @description
         *
         * Delete a related item by id for cursos_propuestos.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for cursos_propuestos
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.cursos_propuestos.destroyById = function() {
          var TargetResource = $injector.get("CursosPtc");
          var action = TargetResource["::destroyById::CatalogoInstructores::cursos_propuestos"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.CatalogoInstructores.cursos_propuestos#exists
         * @methodOf lbServices.CatalogoInstructores.cursos_propuestos
         *
         * @description
         *
         * Check the existence of cursos_propuestos relation to an item by id.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for cursos_propuestos
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CursosPtc` object.)
         * </em>
         */
        R.cursos_propuestos.exists = function() {
          var TargetResource = $injector.get("CursosPtc");
          var action = TargetResource["::exists::CatalogoInstructores::cursos_propuestos"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.CatalogoInstructores.cursos_propuestos#findById
         * @methodOf lbServices.CatalogoInstructores.cursos_propuestos
         *
         * @description
         *
         * Find a related item by id for cursos_propuestos.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for cursos_propuestos
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CursosPtc` object.)
         * </em>
         */
        R.cursos_propuestos.findById = function() {
          var TargetResource = $injector.get("CursosPtc");
          var action = TargetResource["::findById::CatalogoInstructores::cursos_propuestos"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.CatalogoInstructores.cursos_propuestos#link
         * @methodOf lbServices.CatalogoInstructores.cursos_propuestos
         *
         * @description
         *
         * Add a related item by id for cursos_propuestos.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for cursos_propuestos
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CursosPtc` object.)
         * </em>
         */
        R.cursos_propuestos.link = function() {
          var TargetResource = $injector.get("CursosPtc");
          var action = TargetResource["::link::CatalogoInstructores::cursos_propuestos"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.CatalogoInstructores.cursos_propuestos#unlink
         * @methodOf lbServices.CatalogoInstructores.cursos_propuestos
         *
         * @description
         *
         * Remove the cursos_propuestos relation to an item by id.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for cursos_propuestos
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.cursos_propuestos.unlink = function() {
          var TargetResource = $injector.get("CursosPtc");
          var action = TargetResource["::unlink::CatalogoInstructores::cursos_propuestos"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.CatalogoInstructores.cursos_propuestos#updateById
         * @methodOf lbServices.CatalogoInstructores.cursos_propuestos
         *
         * @description
         *
         * Update a related item by id for cursos_propuestos.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for cursos_propuestos
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CursosPtc` object.)
         * </em>
         */
        R.cursos_propuestos.updateById = function() {
          var TargetResource = $injector.get("CursosPtc");
          var action = TargetResource["::updateById::CatalogoInstructores::cursos_propuestos"];
          return action.apply(R, arguments);
        };
    /**
     * @ngdoc object
     * @name lbServices.CatalogoInstructores.cursos_habilitados
     * @header lbServices.CatalogoInstructores.cursos_habilitados
     * @object
     * @description
     *
     * The object `CatalogoInstructores.cursos_habilitados` groups methods
     * manipulating `CatalogoCursos` instances related to `CatalogoInstructores`.
     *
     * Call {@link lbServices.CatalogoInstructores#cursos_habilitados CatalogoInstructores.cursos_habilitados()}
     * to query all related instances.
     */


        /**
         * @ngdoc method
         * @name lbServices.CatalogoInstructores#cursos_habilitados
         * @methodOf lbServices.CatalogoInstructores
         *
         * @description
         *
         * Queries cursos_habilitados of CatalogoInstructores.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `filter` – `{object=}` - 
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoCursos` object.)
         * </em>
         */
        R.cursos_habilitados = function() {
          var TargetResource = $injector.get("CatalogoCursos");
          var action = TargetResource["::get::CatalogoInstructores::cursos_habilitados"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.CatalogoInstructores.cursos_habilitados#count
         * @methodOf lbServices.CatalogoInstructores.cursos_habilitados
         *
         * @description
         *
         * Counts cursos_habilitados of CatalogoInstructores.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        R.cursos_habilitados.count = function() {
          var TargetResource = $injector.get("CatalogoCursos");
          var action = TargetResource["::count::CatalogoInstructores::cursos_habilitados"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.CatalogoInstructores.cursos_habilitados#create
         * @methodOf lbServices.CatalogoInstructores.cursos_habilitados
         *
         * @description
         *
         * Creates a new instance in cursos_habilitados of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoCursos` object.)
         * </em>
         */
        R.cursos_habilitados.create = function() {
          var TargetResource = $injector.get("CatalogoCursos");
          var action = TargetResource["::create::CatalogoInstructores::cursos_habilitados"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.CatalogoInstructores.cursos_habilitados#createMany
         * @methodOf lbServices.CatalogoInstructores.cursos_habilitados
         *
         * @description
         *
         * Creates a new instance in cursos_habilitados of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoCursos` object.)
         * </em>
         */
        R.cursos_habilitados.createMany = function() {
          var TargetResource = $injector.get("CatalogoCursos");
          var action = TargetResource["::createMany::CatalogoInstructores::cursos_habilitados"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.CatalogoInstructores.cursos_habilitados#destroyAll
         * @methodOf lbServices.CatalogoInstructores.cursos_habilitados
         *
         * @description
         *
         * Deletes all cursos_habilitados of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.cursos_habilitados.destroyAll = function() {
          var TargetResource = $injector.get("CatalogoCursos");
          var action = TargetResource["::delete::CatalogoInstructores::cursos_habilitados"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.CatalogoInstructores.cursos_habilitados#destroyById
         * @methodOf lbServices.CatalogoInstructores.cursos_habilitados
         *
         * @description
         *
         * Delete a related item by id for cursos_habilitados.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for cursos_habilitados
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.cursos_habilitados.destroyById = function() {
          var TargetResource = $injector.get("CatalogoCursos");
          var action = TargetResource["::destroyById::CatalogoInstructores::cursos_habilitados"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.CatalogoInstructores.cursos_habilitados#exists
         * @methodOf lbServices.CatalogoInstructores.cursos_habilitados
         *
         * @description
         *
         * Check the existence of cursos_habilitados relation to an item by id.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for cursos_habilitados
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoCursos` object.)
         * </em>
         */
        R.cursos_habilitados.exists = function() {
          var TargetResource = $injector.get("CatalogoCursos");
          var action = TargetResource["::exists::CatalogoInstructores::cursos_habilitados"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.CatalogoInstructores.cursos_habilitados#findById
         * @methodOf lbServices.CatalogoInstructores.cursos_habilitados
         *
         * @description
         *
         * Find a related item by id for cursos_habilitados.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for cursos_habilitados
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoCursos` object.)
         * </em>
         */
        R.cursos_habilitados.findById = function() {
          var TargetResource = $injector.get("CatalogoCursos");
          var action = TargetResource["::findById::CatalogoInstructores::cursos_habilitados"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.CatalogoInstructores.cursos_habilitados#link
         * @methodOf lbServices.CatalogoInstructores.cursos_habilitados
         *
         * @description
         *
         * Add a related item by id for cursos_habilitados.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for cursos_habilitados
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoCursos` object.)
         * </em>
         */
        R.cursos_habilitados.link = function() {
          var TargetResource = $injector.get("CatalogoCursos");
          var action = TargetResource["::link::CatalogoInstructores::cursos_habilitados"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.CatalogoInstructores.cursos_habilitados#unlink
         * @methodOf lbServices.CatalogoInstructores.cursos_habilitados
         *
         * @description
         *
         * Remove the cursos_habilitados relation to an item by id.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for cursos_habilitados
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        R.cursos_habilitados.unlink = function() {
          var TargetResource = $injector.get("CatalogoCursos");
          var action = TargetResource["::unlink::CatalogoInstructores::cursos_habilitados"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.CatalogoInstructores.cursos_habilitados#updateById
         * @methodOf lbServices.CatalogoInstructores.cursos_habilitados
         *
         * @description
         *
         * Update a related item by id for cursos_habilitados.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `fk` – `{*}` - Foreign key for cursos_habilitados
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoCursos` object.)
         * </em>
         */
        R.cursos_habilitados.updateById = function() {
          var TargetResource = $injector.get("CatalogoCursos");
          var action = TargetResource["::updateById::CatalogoInstructores::cursos_habilitados"];
          return action.apply(R, arguments);
        };

    return R;
  }]);

/**
 * @ngdoc object
 * @name lbServices.RelInstrucPtc
 * @header lbServices.RelInstrucPtc
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `RelInstrucPtc` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "RelInstrucPtc",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/RelInstrucPtcs/:id",
      { 'id': '@id' },
      {

        // INTERNAL. Use RelInstrucPtc.CursosPtc() instead.
        "prototype$__get__CursosPtc": {
          url: urlBase + "/RelInstrucPtcs/:id/CursosPtc",
          method: "GET"
        },

        // INTERNAL. Use RelInstrucPtc.CatalogoInstructores() instead.
        "prototype$__get__CatalogoInstructores": {
          url: urlBase + "/RelInstrucPtcs/:id/CatalogoInstructores",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.RelInstrucPtc#create
         * @methodOf lbServices.RelInstrucPtc
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `RelInstrucPtc` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/RelInstrucPtcs",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.RelInstrucPtc#createMany
         * @methodOf lbServices.RelInstrucPtc
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `RelInstrucPtc` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/RelInstrucPtcs",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.RelInstrucPtc#upsert
         * @methodOf lbServices.RelInstrucPtc
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `RelInstrucPtc` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/RelInstrucPtcs",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.RelInstrucPtc#exists
         * @methodOf lbServices.RelInstrucPtc
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` - 
         */
        "exists": {
          url: urlBase + "/RelInstrucPtcs/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.RelInstrucPtc#findById
         * @methodOf lbServices.RelInstrucPtc
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `RelInstrucPtc` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/RelInstrucPtcs/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.RelInstrucPtc#find
         * @methodOf lbServices.RelInstrucPtc
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `RelInstrucPtc` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/RelInstrucPtcs",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.RelInstrucPtc#findOne
         * @methodOf lbServices.RelInstrucPtc
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `RelInstrucPtc` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/RelInstrucPtcs/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.RelInstrucPtc#updateAll
         * @methodOf lbServices.RelInstrucPtc
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        "updateAll": {
          url: urlBase + "/RelInstrucPtcs/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.RelInstrucPtc#deleteById
         * @methodOf lbServices.RelInstrucPtc
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `RelInstrucPtc` object.)
         * </em>
         */
        "deleteById": {
          url: urlBase + "/RelInstrucPtcs/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.RelInstrucPtc#count
         * @methodOf lbServices.RelInstrucPtc
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        "count": {
          url: urlBase + "/RelInstrucPtcs/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.RelInstrucPtc#prototype$updateAttributes
         * @methodOf lbServices.RelInstrucPtc
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `RelInstrucPtc` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/RelInstrucPtcs/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.RelInstrucPtc#createChangeStream
         * @methodOf lbServices.RelInstrucPtc
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` - 
         */
        "createChangeStream": {
          url: urlBase + "/RelInstrucPtcs/change-stream",
          method: "POST"
        },
      }
    );



        /**
         * @ngdoc method
         * @name lbServices.RelInstrucPtc#updateOrCreate
         * @methodOf lbServices.RelInstrucPtc
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `RelInstrucPtc` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name lbServices.RelInstrucPtc#update
         * @methodOf lbServices.RelInstrucPtc
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name lbServices.RelInstrucPtc#destroyById
         * @methodOf lbServices.RelInstrucPtc
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `RelInstrucPtc` object.)
         * </em>
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name lbServices.RelInstrucPtc#removeById
         * @methodOf lbServices.RelInstrucPtc
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `RelInstrucPtc` object.)
         * </em>
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name lbServices.RelInstrucPtc#modelName
    * @propertyOf lbServices.RelInstrucPtc
    * @description
    * The name of the model represented by this $resource,
    * i.e. `RelInstrucPtc`.
    */
    R.modelName = "RelInstrucPtc";


        /**
         * @ngdoc method
         * @name lbServices.RelInstrucPtc#CursosPtc
         * @methodOf lbServices.RelInstrucPtc
         *
         * @description
         *
         * Fetches belongsTo relation CursosPtc.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `refresh` – `{boolean=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CursosPtc` object.)
         * </em>
         */
        R.CursosPtc = function() {
          var TargetResource = $injector.get("CursosPtc");
          var action = TargetResource["::get::RelInstrucPtc::CursosPtc"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.RelInstrucPtc#CatalogoInstructores
         * @methodOf lbServices.RelInstrucPtc
         *
         * @description
         *
         * Fetches belongsTo relation CatalogoInstructores.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `refresh` – `{boolean=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoInstructores` object.)
         * </em>
         */
        R.CatalogoInstructores = function() {
          var TargetResource = $injector.get("CatalogoInstructores");
          var action = TargetResource["::get::RelInstrucPtc::CatalogoInstructores"];
          return action.apply(R, arguments);
        };

    return R;
  }]);

/**
 * @ngdoc object
 * @name lbServices.ControlProcesos
 * @header lbServices.ControlProcesos
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `ControlProcesos` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "ControlProcesos",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/ControlProcesos/:id",
      { 'id': '@id' },
      {

        /**
         * @ngdoc method
         * @name lbServices.ControlProcesos#create
         * @methodOf lbServices.ControlProcesos
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ControlProcesos` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/ControlProcesos",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.ControlProcesos#createMany
         * @methodOf lbServices.ControlProcesos
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ControlProcesos` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/ControlProcesos",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.ControlProcesos#upsert
         * @methodOf lbServices.ControlProcesos
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ControlProcesos` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/ControlProcesos",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.ControlProcesos#exists
         * @methodOf lbServices.ControlProcesos
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` - 
         */
        "exists": {
          url: urlBase + "/ControlProcesos/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.ControlProcesos#findById
         * @methodOf lbServices.ControlProcesos
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ControlProcesos` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/ControlProcesos/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.ControlProcesos#find
         * @methodOf lbServices.ControlProcesos
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ControlProcesos` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/ControlProcesos",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.ControlProcesos#findOne
         * @methodOf lbServices.ControlProcesos
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ControlProcesos` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/ControlProcesos/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.ControlProcesos#updateAll
         * @methodOf lbServices.ControlProcesos
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        "updateAll": {
          url: urlBase + "/ControlProcesos/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.ControlProcesos#deleteById
         * @methodOf lbServices.ControlProcesos
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ControlProcesos` object.)
         * </em>
         */
        "deleteById": {
          url: urlBase + "/ControlProcesos/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.ControlProcesos#count
         * @methodOf lbServices.ControlProcesos
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        "count": {
          url: urlBase + "/ControlProcesos/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.ControlProcesos#prototype$updateAttributes
         * @methodOf lbServices.ControlProcesos
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ControlProcesos` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/ControlProcesos/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.ControlProcesos#createChangeStream
         * @methodOf lbServices.ControlProcesos
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` - 
         */
        "createChangeStream": {
          url: urlBase + "/ControlProcesos/change-stream",
          method: "POST"
        },
      }
    );



        /**
         * @ngdoc method
         * @name lbServices.ControlProcesos#updateOrCreate
         * @methodOf lbServices.ControlProcesos
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ControlProcesos` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name lbServices.ControlProcesos#update
         * @methodOf lbServices.ControlProcesos
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name lbServices.ControlProcesos#destroyById
         * @methodOf lbServices.ControlProcesos
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ControlProcesos` object.)
         * </em>
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name lbServices.ControlProcesos#removeById
         * @methodOf lbServices.ControlProcesos
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ControlProcesos` object.)
         * </em>
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name lbServices.ControlProcesos#modelName
    * @propertyOf lbServices.ControlProcesos
    * @description
    * The name of the model represented by this $resource,
    * i.e. `ControlProcesos`.
    */
    R.modelName = "ControlProcesos";


    return R;
  }]);

/**
 * @ngdoc object
 * @name lbServices.RelInstrucCatCurso
 * @header lbServices.RelInstrucCatCurso
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `RelInstrucCatCurso` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "RelInstrucCatCurso",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/RelInstrucCatCursos/:id",
      { 'id': '@id' },
      {

        // INTERNAL. Use RelInstrucCatCurso.CatalogoInstructores() instead.
        "prototype$__get__CatalogoInstructores": {
          url: urlBase + "/RelInstrucCatCursos/:id/CatalogoInstructores",
          method: "GET"
        },

        // INTERNAL. Use RelInstrucCatCurso.CatalogoCursos() instead.
        "prototype$__get__CatalogoCursos": {
          url: urlBase + "/RelInstrucCatCursos/:id/CatalogoCursos",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.RelInstrucCatCurso#create
         * @methodOf lbServices.RelInstrucCatCurso
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `RelInstrucCatCurso` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/RelInstrucCatCursos",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.RelInstrucCatCurso#createMany
         * @methodOf lbServices.RelInstrucCatCurso
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `RelInstrucCatCurso` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/RelInstrucCatCursos",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.RelInstrucCatCurso#upsert
         * @methodOf lbServices.RelInstrucCatCurso
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `RelInstrucCatCurso` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/RelInstrucCatCursos",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.RelInstrucCatCurso#exists
         * @methodOf lbServices.RelInstrucCatCurso
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` - 
         */
        "exists": {
          url: urlBase + "/RelInstrucCatCursos/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.RelInstrucCatCurso#findById
         * @methodOf lbServices.RelInstrucCatCurso
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `RelInstrucCatCurso` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/RelInstrucCatCursos/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.RelInstrucCatCurso#find
         * @methodOf lbServices.RelInstrucCatCurso
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `RelInstrucCatCurso` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/RelInstrucCatCursos",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.RelInstrucCatCurso#findOne
         * @methodOf lbServices.RelInstrucCatCurso
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `RelInstrucCatCurso` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/RelInstrucCatCursos/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.RelInstrucCatCurso#updateAll
         * @methodOf lbServices.RelInstrucCatCurso
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        "updateAll": {
          url: urlBase + "/RelInstrucCatCursos/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.RelInstrucCatCurso#deleteById
         * @methodOf lbServices.RelInstrucCatCurso
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `RelInstrucCatCurso` object.)
         * </em>
         */
        "deleteById": {
          url: urlBase + "/RelInstrucCatCursos/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.RelInstrucCatCurso#count
         * @methodOf lbServices.RelInstrucCatCurso
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        "count": {
          url: urlBase + "/RelInstrucCatCursos/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.RelInstrucCatCurso#prototype$updateAttributes
         * @methodOf lbServices.RelInstrucCatCurso
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `RelInstrucCatCurso` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/RelInstrucCatCursos/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.RelInstrucCatCurso#createChangeStream
         * @methodOf lbServices.RelInstrucCatCurso
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` - 
         */
        "createChangeStream": {
          url: urlBase + "/RelInstrucCatCursos/change-stream",
          method: "POST"
        },
      }
    );



        /**
         * @ngdoc method
         * @name lbServices.RelInstrucCatCurso#updateOrCreate
         * @methodOf lbServices.RelInstrucCatCurso
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `RelInstrucCatCurso` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name lbServices.RelInstrucCatCurso#update
         * @methodOf lbServices.RelInstrucCatCurso
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name lbServices.RelInstrucCatCurso#destroyById
         * @methodOf lbServices.RelInstrucCatCurso
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `RelInstrucCatCurso` object.)
         * </em>
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name lbServices.RelInstrucCatCurso#removeById
         * @methodOf lbServices.RelInstrucCatCurso
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `RelInstrucCatCurso` object.)
         * </em>
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name lbServices.RelInstrucCatCurso#modelName
    * @propertyOf lbServices.RelInstrucCatCurso
    * @description
    * The name of the model represented by this $resource,
    * i.e. `RelInstrucCatCurso`.
    */
    R.modelName = "RelInstrucCatCurso";


        /**
         * @ngdoc method
         * @name lbServices.RelInstrucCatCurso#CatalogoInstructores
         * @methodOf lbServices.RelInstrucCatCurso
         *
         * @description
         *
         * Fetches belongsTo relation CatalogoInstructores.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `refresh` – `{boolean=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoInstructores` object.)
         * </em>
         */
        R.CatalogoInstructores = function() {
          var TargetResource = $injector.get("CatalogoInstructores");
          var action = TargetResource["::get::RelInstrucCatCurso::CatalogoInstructores"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.RelInstrucCatCurso#CatalogoCursos
         * @methodOf lbServices.RelInstrucCatCurso
         *
         * @description
         *
         * Fetches belongsTo relation CatalogoCursos.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `refresh` – `{boolean=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoCursos` object.)
         * </em>
         */
        R.CatalogoCursos = function() {
          var TargetResource = $injector.get("CatalogoCursos");
          var action = TargetResource["::get::RelInstrucCatCurso::CatalogoCursos"];
          return action.apply(R, arguments);
        };

    return R;
  }]);

/**
 * @ngdoc object
 * @name lbServices.CursosOficiales
 * @header lbServices.CursosOficiales
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `CursosOficiales` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "CursosOficiales",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/CursosOficiales/:id",
      { 'id': '@id' },
      {

        // INTERNAL. Use CursosOficiales.unidad_pertenece() instead.
        "prototype$__get__unidad_pertenece": {
          url: urlBase + "/CursosOficiales/:id/unidad_pertenece",
          method: "GET"
        },

        // INTERNAL. Use CursosOficiales.curso_ptc_pertenece() instead.
        "prototype$__get__curso_ptc_pertenece": {
          url: urlBase + "/CursosOficiales/:id/curso_ptc_pertenece",
          method: "GET"
        },

        // INTERNAL. Use CursosOficiales.localidad_pertenece() instead.
        "prototype$__get__localidad_pertenece": {
          url: urlBase + "/CursosOficiales/:id/localidad_pertenece",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.CursosOficiales#create
         * @methodOf lbServices.CursosOficiales
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CursosOficiales` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/CursosOficiales",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.CursosOficiales#createMany
         * @methodOf lbServices.CursosOficiales
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CursosOficiales` object.)
         * </em>
         */
        "createMany": {
          isArray: true,
          url: urlBase + "/CursosOficiales",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.CursosOficiales#upsert
         * @methodOf lbServices.CursosOficiales
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CursosOficiales` object.)
         * </em>
         */
        "upsert": {
          url: urlBase + "/CursosOficiales",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.CursosOficiales#exists
         * @methodOf lbServices.CursosOficiales
         *
         * @description
         *
         * Check whether a model instance exists in the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{boolean=}` - 
         */
        "exists": {
          url: urlBase + "/CursosOficiales/:id/exists",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.CursosOficiales#findById
         * @methodOf lbServices.CursosOficiales
         *
         * @description
         *
         * Find a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         *  - `filter` – `{object=}` - Filter defining fields and include
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CursosOficiales` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/CursosOficiales/:id",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.CursosOficiales#find
         * @methodOf lbServices.CursosOficiales
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CursosOficiales` object.)
         * </em>
         */
        "find": {
          isArray: true,
          url: urlBase + "/CursosOficiales",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.CursosOficiales#findOne
         * @methodOf lbServices.CursosOficiales
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CursosOficiales` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/CursosOficiales/findOne",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.CursosOficiales#updateAll
         * @methodOf lbServices.CursosOficiales
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        "updateAll": {
          url: urlBase + "/CursosOficiales/update",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name lbServices.CursosOficiales#deleteById
         * @methodOf lbServices.CursosOficiales
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CursosOficiales` object.)
         * </em>
         */
        "deleteById": {
          url: urlBase + "/CursosOficiales/:id",
          method: "DELETE"
        },

        /**
         * @ngdoc method
         * @name lbServices.CursosOficiales#count
         * @methodOf lbServices.CursosOficiales
         *
         * @description
         *
         * Count instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        "count": {
          url: urlBase + "/CursosOficiales/count",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name lbServices.CursosOficiales#prototype$updateAttributes
         * @methodOf lbServices.CursosOficiales
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CursosOficiales` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/CursosOficiales/:id",
          method: "PUT"
        },

        /**
         * @ngdoc method
         * @name lbServices.CursosOficiales#createChangeStream
         * @methodOf lbServices.CursosOficiales
         *
         * @description
         *
         * Create a change stream.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `options` – `{object=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `changes` – `{ReadableStream=}` - 
         */
        "createChangeStream": {
          url: urlBase + "/CursosOficiales/change-stream",
          method: "POST"
        },
      }
    );



        /**
         * @ngdoc method
         * @name lbServices.CursosOficiales#updateOrCreate
         * @methodOf lbServices.CursosOficiales
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CursosOficiales` object.)
         * </em>
         */
        R["updateOrCreate"] = R["upsert"];

        /**
         * @ngdoc method
         * @name lbServices.CursosOficiales#update
         * @methodOf lbServices.CursosOficiales
         *
         * @description
         *
         * Update instances of the model matched by where from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The number of instances updated
         */
        R["update"] = R["updateAll"];

        /**
         * @ngdoc method
         * @name lbServices.CursosOficiales#destroyById
         * @methodOf lbServices.CursosOficiales
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CursosOficiales` object.)
         * </em>
         */
        R["destroyById"] = R["deleteById"];

        /**
         * @ngdoc method
         * @name lbServices.CursosOficiales#removeById
         * @methodOf lbServices.CursosOficiales
         *
         * @description
         *
         * Delete a model instance by id from the data source.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CursosOficiales` object.)
         * </em>
         */
        R["removeById"] = R["deleteById"];


    /**
    * @ngdoc property
    * @name lbServices.CursosOficiales#modelName
    * @propertyOf lbServices.CursosOficiales
    * @description
    * The name of the model represented by this $resource,
    * i.e. `CursosOficiales`.
    */
    R.modelName = "CursosOficiales";


        /**
         * @ngdoc method
         * @name lbServices.CursosOficiales#unidad_pertenece
         * @methodOf lbServices.CursosOficiales
         *
         * @description
         *
         * Fetches belongsTo relation unidad_pertenece.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `refresh` – `{boolean=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoUnidadesAdmtvas` object.)
         * </em>
         */
        R.unidad_pertenece = function() {
          var TargetResource = $injector.get("CatalogoUnidadesAdmtvas");
          var action = TargetResource["::get::CursosOficiales::unidad_pertenece"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.CursosOficiales#curso_ptc_pertenece
         * @methodOf lbServices.CursosOficiales
         *
         * @description
         *
         * Fetches belongsTo relation curso_ptc_pertenece.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `refresh` – `{boolean=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CursosPtc` object.)
         * </em>
         */
        R.curso_ptc_pertenece = function() {
          var TargetResource = $injector.get("CursosPtc");
          var action = TargetResource["::get::CursosOficiales::curso_ptc_pertenece"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.CursosOficiales#localidad_pertenece
         * @methodOf lbServices.CursosOficiales
         *
         * @description
         *
         * Fetches belongsTo relation localidad_pertenece.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - PersistedModel id
         *
         *  - `refresh` – `{boolean=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `CatalogoLocalidades` object.)
         * </em>
         */
        R.localidad_pertenece = function() {
          var TargetResource = $injector.get("CatalogoLocalidades");
          var action = TargetResource["::get::CursosOficiales::localidad_pertenece"];
          return action.apply(R, arguments);
        };

    return R;
  }]);


module
  .factory('LoopBackAuth', function() {
    var props = ['accessTokenId', 'currentUserId', 'rememberMe'];
    var propsPrefix = '$LoopBack$';

    function LoopBackAuth() {
      var self = this;
      props.forEach(function(name) {
        self[name] = load(name);
      });
      this.currentUserData = null;
    }

    LoopBackAuth.prototype.save = function() {
      var self = this;
      var storage = this.rememberMe ? localStorage : sessionStorage;
      props.forEach(function(name) {
        save(storage, name, self[name]);
      });
    };

    LoopBackAuth.prototype.setUser = function(accessTokenId, userId, userData) {
      this.accessTokenId = accessTokenId;
      this.currentUserId = userId;
      this.currentUserData = userData;
    }

    LoopBackAuth.prototype.clearUser = function() {
      this.accessTokenId = null;
      this.currentUserId = null;
      this.currentUserData = null;
    }

    LoopBackAuth.prototype.clearStorage = function() {
      props.forEach(function(name) {
        save(sessionStorage, name, null);
        save(localStorage, name, null);
      });
    };

    return new LoopBackAuth();

    // Note: LocalStorage converts the value to string
    // We are using empty string as a marker for null/undefined values.
    function save(storage, name, value) {
      try {
        var key = propsPrefix + name;
        if (value == null) value = '';
        storage[key] = value;
      } catch(err) {
        console.log('Cannot access local/session storage:', err);
      }
    }

    function load(name) {
      var key = propsPrefix + name;
      return localStorage[key] || sessionStorage[key] || null;
    }
  })
  .config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('LoopBackAuthRequestInterceptor');
  }])
  .factory('LoopBackAuthRequestInterceptor', [ '$q', 'LoopBackAuth',
    function($q, LoopBackAuth) {
      return {
        'request': function(config) {

          // filter out external requests
          var host = getHost(config.url);
          if (host && host !== urlBaseHost) {
            return config;
          }

          if (LoopBackAuth.accessTokenId) {
            config.headers[authHeader] = LoopBackAuth.accessTokenId;
          } else if (config.__isGetCurrentUser__) {
            // Return a stub 401 error for User.getCurrent() when
            // there is no user logged in
            var res = {
              body: { error: { status: 401 } },
              status: 401,
              config: config,
              headers: function() { return undefined; }
            };
            return $q.reject(res);
          }
          return config || $q.when(config);
        }
      }
    }])

  /**
   * @ngdoc object
   * @name lbServices.LoopBackResourceProvider
   * @header lbServices.LoopBackResourceProvider
   * @description
   * Use `LoopBackResourceProvider` to change the global configuration
   * settings used by all models. Note that the provider is available
   * to Configuration Blocks only, see
   * {@link https://docs.angularjs.org/guide/module#module-loading-dependencies Module Loading & Dependencies}
   * for more details.
   *
   * ## Example
   *
   * ```js
   * angular.module('app')
   *  .config(function(LoopBackResourceProvider) {
   *     LoopBackResourceProvider.setAuthHeader('X-Access-Token');
   *  });
   * ```
   */
  .provider('LoopBackResource', function LoopBackResourceProvider() {
    /**
     * @ngdoc method
     * @name lbServices.LoopBackResourceProvider#setAuthHeader
     * @methodOf lbServices.LoopBackResourceProvider
     * @param {string} header The header name to use, e.g. `X-Access-Token`
     * @description
     * Configure the REST transport to use a different header for sending
     * the authentication token. It is sent in the `Authorization` header
     * by default.
     */
    this.setAuthHeader = function(header) {
      authHeader = header;
    };

    /**
     * @ngdoc method
     * @name lbServices.LoopBackResourceProvider#setUrlBase
     * @methodOf lbServices.LoopBackResourceProvider
     * @param {string} url The URL to use, e.g. `/api` or `//example.com/api`.
     * @description
     * Change the URL of the REST API server. By default, the URL provided
     * to the code generator (`lb-ng` or `grunt-loopback-sdk-angular`) is used.
     */
    this.setUrlBase = function(url) {
      urlBase = url;
      urlBaseHost = getHost(urlBase) || location.host;
    };

    /**
     * @ngdoc method
     * @name lbServices.LoopBackResourceProvider#getUrlBase
     * @methodOf lbServices.LoopBackResourceProvider
     * @description
     * Get the URL of the REST API server. The URL provided
     * to the code generator (`lb-ng` or `grunt-loopback-sdk-angular`) is used.
     */
    this.getUrlBase = function() {
      return urlBase;
    };

    this.$get = ['$resource', function($resource) {
      return function(url, params, actions) {
        var resource = $resource(url, params, actions);

        // Angular always calls POST on $save()
        // This hack is based on
        // http://kirkbushell.me/angular-js-using-ng-resource-in-a-more-restful-manner/
        resource.prototype.$save = function(success, error) {
          // Fortunately, LoopBack provides a convenient `upsert` method
          // that exactly fits our needs.
          var result = resource.upsert.call(this, {}, this, success, error);
          return result.$promise || result;
        };
        return resource;
      };
    }];
  });

})(window, window.angular);
