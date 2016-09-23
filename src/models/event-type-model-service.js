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
    .factory('DSEventType', DSEventTypeFactory)
    .run(function(DSEventType) {});

  DSEventTypeFactory.$inject = ['$log', 'DS'];

  function DSEventTypeFactory($log, DS) {
    
    var staticMethods = {};
    var eventTypeParamTypesId = 0;

    /*
     * DataStore configuration
     */
    var DSEventType = DS.defineResource({

      // API configuration
      endpoint: 'eventtypes',

      // Model configuration
      idAttribute: 'id',
      name: 'eventType',
      relations: {
        belongsTo: {
          deviceClass: {
            localField: 'deviceClass',
            localKey: 'deviceClassId',
            parent: true
          }
        },
        hasMany: {
          eventTypeParamType: {
            localField: 'eventTypeParamTypes',
            foreignKey: 'eventTypeId'
          }
        }
      },

      // Computed properties
      computed: {},

      // Instance methods
      methods: {
        getParamDescriptor: getParamDescriptor
      },

      // Lifecycle hooks
      afterInject: function(resource, attrs) {
        if(angular.isArray(attrs)) {
          var arrayOfAttrs = attrs;
          angular.forEach(arrayOfAttrs, function(attrs) {
            _addUiData(resource, attrs);
            _createEventTypeParamTypes(resource, attrs);
          });
        } else {
          _addUiData(resource, attrs);
          _createEventTypeParamTypes(resource, attrs);
        }
      }

    });

    return DSEventType;


    /*
     * Private method: _addUiData(resource, attrs)
     */
    function _addUiData(resource, attrs) {
      var paramTypes = attrs.paramTypes;
      var phrase = 'When ' + attrs.name;

      // Add phrase for moods
      if(angular.isArray(paramTypes) && paramTypes.length === 0) {
        attrs.phrase = phrase + ' is detected';
      } else {
        attrs.phrase = phrase + ' is detected and parameters are';
      }
    }

    /*
     * Private method:_createEventTypeParamTypes()
     */
    function _createEventTypeParamTypes(resource, attrs) {
      var eventTypeParamTypes = DS.getAll('eventTypeParamType');
      var paramTypes = attrs.paramTypes;
      var eventTypeId = attrs.id;


      // ParamTypes
      angular.forEach(paramTypes, function(paramType) {
        // Create paramType
        var paramTypeInstance = DS.createInstance('paramType', paramType);
        DS.inject('paramType', paramTypeInstance);

        // Filtered eventTypeParamTypes
        var eventTypeParamTypesFiltered = eventTypeParamTypes.filter(function(eventTypeParamType) {
          return eventTypeParamType.eventTypeId === eventTypeId && eventTypeParamType.paramTypeId === paramType.id;
        });

        // Only inject if not already there
        if(angular.isArray(eventTypeParamTypesFiltered) && eventTypeParamTypesFiltered.length === 0) {
          // Create membership (deviceClass <-> paramType)
          eventTypeParamTypesId = eventTypeParamTypesId + 1;
          var eventTypeParamTypeInstance = DS.createInstance('eventTypeParamType', {
            id: eventTypeParamTypesId,
            eventTypeId: eventTypeId,
            paramTypeId: paramType.id
          });
          DS.inject('eventTypeParamType', eventTypeParamTypeInstance);
        }
      });
    }


    /*
     * Public method: getParamDescriptors(paramType, value, operator)
     */
    function getParamDescriptor(paramType, value, operator) {
      var paramDescriptor = {};

      paramDescriptor = {
        name: paramType.name,
        operator: operator,
        value: value
      };

      return paramDescriptor;
    }

  }

}());