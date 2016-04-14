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
    .factory('DSState', DSStateFactory)
    .run(function(DSState) {});

  DSStateFactory.$inject = ['$log', '$q', 'DS', 'websocketService'];

  function DSStateFactory($log, $q, DS, websocketService) {
    
    var staticMethods = {};

    /*
     * DataStore configuration
     */
    var DSState = DS.defineResource({

      // API configuration
      endpoint: 'states',

      // Model configuration
      // idAttribute: 'stateTypeId',
      idAttribute: 'compoundId',
      name: 'state',
      relations: {
        belongsTo: {
          device: {
            localField: 'device',
            localKey: 'deviceId',
            parent: true
          }
        },
        hasOne: {
          stateType: {
            localField: 'stateType',
            localKey: 'stateTypeId'
          }
        }
      },

      // Computed properties
      computed: {
        compoundId: ['deviceId', 'stateTypeId', 'value', function (deviceId, stateTypeId, value) {
          return '' + deviceId + '_' + stateTypeId;
        }]
      },

      // Instance methods
      methods: {}

    });

    angular.extend(DSState, {
      load: load
    });

    return DSState;


    function load(deviceId) {
      return websocketService
        .send({
          method: 'Devices.GetStateValues',
          params: {
            deviceId: deviceId
          }
        })
        .then(function(data) {
          var states = data.values.map(function(state) {
            state.deviceId = deviceId;
            return state;
          });
          DSState.inject(states);
          return DSState.getAll();
        });
    }

  }

}());