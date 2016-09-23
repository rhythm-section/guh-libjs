/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                                     *
 * Copyright (C) 2015 Lukas Mayerhofer <lukas.mayerhofer@guh.guru>                     *
 *                                                                                     *
 * Permission is hereby granted, free of charge, to any person obtaining a copy        *
 * of this software and associated documentation files (the "Software"), to deal       *
 * in the Software without restriction, including without limitation the rights        *
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell           *
 * copies of the Software, and to permit persons to whom the Software is               *
 * furnished to do so, subject to the following conditions:                            *
 *                                                                                     *
 * The above copyright notice and this permission notice shall be included in all      *
 * copies or substantial portions of the Software.                                     *
 *                                                                                     *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR          *
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,            *
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE         *
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER              *
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,       *
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE       *
 * SOFTWARE.                                                                           *
 *                                                                                     *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

(function() {
  'use strict';

  angular
    .module('guh.models')
    .factory('DSPlugin', DSPluginFactory)
    .run(function(DSPlugin) {});

  DSPluginFactory.$inject = ['$log', '$q', 'DS', 'apiService'];

  function DSPluginFactory($log, $q, DS, apiService) {
    
    var staticMethods = {};
    var pluginParamTypesId = 0;

    /*
     * DataStore configuration
     */
    var DSPlugin = DS.defineResource({

      // API configuration
      endpoint: 'plugins',

      // Model configuration
      idAttribute: 'id',
      name: 'plugin',
      relations: {
        hasMany: {
          pluginParamType: {
            localField: 'pluginParamTypes',
            foreignKey: 'pluginId'
          }
        }
      },

      // Computed properties
      computed: {},

      // Instance methods
      methods: {},

      // Lifecycle hooks
      afterInject: function(resource, attrs) {
        if(angular.isArray(attrs)) {
          var arrayOfAttrs = attrs;
          angular.forEach(arrayOfAttrs, function(attrs) {
            _createPluginParamTypes(resource, attrs);
          });
        } else {
          _createPluginParamTypes(resource, attrs);
        }
      }

    });

    angular.extend(DSPlugin, {
      load: load
    });

    return DSPlugin;


    /*
     * Private method: _createPluginParamTypes()
     */
    function _createPluginParamTypes(resource, attrs) {
      var pluginParamTypes = DS.getAll('pluginParamType');
      var paramTypes = attrs.paramTypes;
      var pluginId = attrs.id;


      // ParamTypes
      angular.forEach(paramTypes, function(paramType) {
        // Create paramType
        var paramTypeInstance = DS.createInstance('paramType', paramType);
        DS.inject('paramType', paramTypeInstance);

        // Filtered actionTypeParamTypes
        var pluginParamTypesFiltered = pluginParamTypes.filter(function(pluginParamType) {
          return pluginParamType.pluginId === pluginId && pluginParamType.paramTypeId === paramType.id;
        });

        // Only inject if not already there
        if(angular.isArray(pluginParamTypesFiltered) && pluginParamTypesFiltered.length === 0) {
          // Create membership (plugin <-> paramType)
          pluginParamTypesId = pluginParamTypesId + 1;
          var pluginParamTypeInstance = DS.createInstance('pluginParamType', {
            id: pluginParamTypesId,
            pluginId: pluginId,
            paramTypeId: paramType.id
          });
          DS.inject('pluginParamType', pluginParamTypeInstance);
        }
      });
    }


    function load() {
      return apiService
        .send({
          method: 'Devices.GetPlugins'
        })
        .then(function(data) {
          DSPlugin.inject(data.plugins);
          return DSPlugin.getAll();
        });
    }

  }

}());