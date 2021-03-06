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
    .factory('DSDevice', DSDeviceFactory)
    .run(function(DSDevice) {});

  DSDeviceFactory.$inject = ['$log', '$httpParamSerializer', 'DS', 'libs', 'app', 'websocketService'];

  function DSDeviceFactory($log, $httpParamSerializer, DS, libs, app, websocketService) {
    
    var staticMethods = {};

    /*
     * DataStore configuration
     */
    var DSDevice = DS.defineResource({

      // API configuration
      endpoint: 'devices',

      // Model configuration
      idAttribute: 'id',
      name: 'device',
      relations: {
        belongsTo: {
          deviceClass: {
            localField: 'deviceClass',
            localKey: 'deviceClassId'
          }
        }

        // Not working (error: "Doh! You just changed the primary key of an object!") because states are injected before the state primary keys are generated

        // hasMany: {
        //   state: {
        //     localField: 'states',
        //     foreignKey: 'deviceId'
        //   }
        // }
      },

      // Computed properties
      computed: {},

      // Instance methods
      methods: {
        // Websocket
        subscribe: subscribe,
        unsubscribe: unsubscribe,
        
        // API
        executeAction: executeAction,
        remove: remove,
        getDescription: getDescription,
        getEventDescriptor: getEventDescriptor,
        getStateDescriptor: getStateDescriptor,
        getAction: getAction
      },

      // Lifecycle hooks
      afterInject: function(resource, attrs) {
        if(angular.isArray(attrs)) {
          var arrayOfAttrs = attrs;
          angular.forEach(arrayOfAttrs, function(attrs) {
            _createStates(resource, attrs);
          });
        } else {
          _createStates(resource, attrs);
        }
      },

      afterEject: function(resource, attrs) {
        if(angular.isArray(attrs)) {
          var arrayOfAttrs = attrs;
          angular.forEach(arrayOfAttrs, function(attrs) {
            _removeStates(resource, attrs);
          });
        } else {
          _removeStates(resource, attrs);
        }
      }

    });

    angular.extend(DSDevice, {
      add: add,
      edit: edit,
      pair: pair,
      confirmPairing: confirmPairing
    });

    return DSDevice;
    

    /*
     * Private method: _createStates(resource, attrs);
     */
    function _createStates(resource, attrs) {
      var deviceId = attrs.id;
      var states = attrs.states;

      angular.forEach(states, function(state, index) {
        state.deviceId = deviceId;

        var stateInstance = DS.createInstance('state', state);
        DS.inject('state', stateInstance);

        if(angular.isUndefined(attrs.states)) {
          attrs.states = [];
        }
        attrs.states[index] = DS.get('state', '' + deviceId + '_' + state.stateTypeId);
      });
    }

    /*
     * Private method: _removeStates(resource, attrs)
     */
    function _removeStates(resource, attrs) {
      var deviceId = attrs.id;
      var states = attrs.states;

      angular.forEach(states, function(state, index) {
        var ejectedItem = DS.eject('state', '' + deviceId + '_' + state.stateTypeId);
        $log.log('ejected state', ejectedItem);
      });
    }


    /*
     * Public method: getDescription(delimiter)
     */
    function getDescription(delimiter) {
      /* jshint validthis: true */
      var self = this;
      var vendorName = self.deviceClass.vendor.name;
      var deviceClassName = self.deviceClass.name || '';

      delimiter = delimiter || '-';

      return (vendorName === deviceClassName) ? deviceClassName : (vendorName + delimiter + deviceClassName);
    }

    /*
     * Public method: subscribe(cb)
     */
    function subscribe(cb) {
      /* jshint validthis: true */
      var self = this;

      return websocketService.subscribe(self.id, cb);
    }

    /*
     * Public method: unsubscribe()
     */
    function unsubscribe() {
      /* jshint validthis: true */
      var self = this;

      return websocketService.unsubscribe(self.id);
    }

    /*
     * Public method: pair(deviceClassId, deviceDescriptorId, deviceParams, name)
     */
    function pair(deviceClassId, deviceDescriptorId, deviceParams, name) {
      var options = {};

      options.deviceClassId = deviceClassId || '';

      if(angular.isDefined(deviceDescriptorId) && deviceDescriptorId !== '') {
        options.deviceDescriptorId = deviceDescriptorId;
      } else {
        options.deviceParams = deviceParams || [];
      }

      if(angular.isDefined(name)) {
        options.name = name;
      }

      return DS
        .adapters
        .http
        .POST(app.apiUrl + '/devices/pair', options);
    }

    /*
     * Public method: confirmPairing(pairingTransactionId, secret)
     */
    function confirmPairing(pairingTransactionId, secret) {
      var options = {};
      
      options.pairingTransactionId = pairingTransactionId;

      if(secret) {
        options.secret = secret;
      }

      return DS
        .adapters
        .http
        .POST(app.apiUrl + '/devices/confirmpairing', options);      
    }

    /*
     * Public method: add(deviceClassId, deviceDescriptorId, deviceParams, name)
     */
    function add(deviceClassId, deviceDescriptorId, deviceParams, name) {
      var device = {};

      // name
      if(angular.isDefined(name) && name !== '') {
        device.name = name;
      }

      // deviceClassId
      if(angular.isDefined(deviceClassId) && deviceClassId  !== '') {
        device.deviceClassId = deviceClassId;
      }

      // deviceDescriptorId or deviceParams
      if(angular.isDefined(deviceDescriptorId) && deviceDescriptorId !== '') {
        device.deviceDescriptorId = deviceDescriptorId;
      } else if(angular.isDefined(deviceParams) && deviceParams !== []) {
        device.deviceParams = deviceParams;
      }

      return DSDevice.create(device, {
        cacheResponse: false
      });
    }

    /*
     * Public method: edit(deviceId, deviceData)
     */
    function edit(deviceId, deviceData) {
      var device = {};
      deviceData = deviceData || {};

      device.deviceDescriptorId = deviceData.id || '';

      device.deviceParams = [];
      angular.forEach(deviceData.deviceParamTypes, function(deviceParamType) {
        var deviceParam = {};

        deviceParam.name = deviceParamType.name;
        deviceParam.value = deviceParamType.value;

        device.deviceParams.push(deviceParam);
      });

      return DSDevice.update(deviceId, {device: device});
    }

    /*
     * Public method: executeAction()
     */
    function executeAction(actionType, params) {
      /* jshint validthis: true */
      var self = this;
      var options = {};

      // options.params = actionType.getParams();
      options.params = params;

      // return DS
      //   .adapters
      //   .http
      //   .POST(app.apiUrl + '/devices/' + self.id + '/actions/' + actionType.id + '/execute.json', options);

      return DS
        .adapters
        .http
        .POST(app.apiUrl + '/devices/' + self.id + '/execute/' + actionType.id, options);
    }

    /*
     * Public method: remove()
     */
    function remove(params) {
      /* jshint validthis: true */
      var self = this;
      var options = {};

      if(angular.isDefined(params) && params !== {}) {
        options.params = {
          params: params
        };
        options.paramSerializer = function(params) {
          return $httpParamSerializer(params).replace(/%5B/g, '[').replace(/%5D/g, ']');
        };
      }

      return DSDevice.destroy(self.id, options);
    }

    /*
     * Public method: getEventDescriptor(eventType, paramDescriptors)
     */
    function getEventDescriptor(eventType, paramDescriptors) {
      /* jshint validthis: true */
      var self = this;
      var eventDescriptor = {};

      eventDescriptor.deviceId = self.id;
      eventDescriptor.eventTypeId = eventType.id;

      if(angular.isDefined(paramDescriptors) && paramDescriptors.length > 0) {
        eventDescriptor.paramDescriptors = paramDescriptors;
      }

      return eventDescriptor;     
    }

    /*
     * Public method: getStateDescriptor(stateType, paramDescriptor)
     */
    function getStateDescriptor(stateType, paramDescriptor) {
      /* jshint validthis: true */
      var self = this;
      var stateDescriptor = {};

      stateDescriptor.deviceId = self.id;
      stateDescriptor.operator = paramDescriptor.operator;
      stateDescriptor.stateTypeId = stateType.id;
      stateDescriptor.value = paramDescriptor.value;
      
      return stateDescriptor;
    }


    /*
     * Public method: getAction(actionType, params)
     */
    function getAction(actionType, params) {
      /* jshint validthis: true */
      var self = this;
      var action = {};
      var ruleActionParams = [];

      ruleActionParams = actionType.getRuleActionParams(params);
      if(ruleActionParams.length > 0) {
        action.ruleActionParams = ruleActionParams;
      }

      action.actionTypeId = actionType.id;
      action.deviceId = self.id;

      return action;
    }

  }

}());