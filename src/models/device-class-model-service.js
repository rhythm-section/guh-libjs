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
    .factory('DSDeviceClass', DSDeviceClassFactory)
    .run(function(DSDeviceClass) {});

  DSDeviceClassFactory.$inject = ['$log', '$q', 'DS', '_', 'websocketService', 'modelsHelper', 'DSDeviceClassActionType', 'DSDeviceClassEventType', 'DSDeviceClassStateType'];

  function DSDeviceClassFactory($log, $q, DS, _, websocketService, modelsHelper, DSDeviceClassActionType, DSDeviceClassEventType, DSDeviceClassStateType) {
    
    var staticMethods = {};
    var deviceClassActionTypesId = 0;
    var deviceClassEventTypesId = 0;
    var deviceClassStateTypesId = 0;

    /*
     * DataStore configuration
     */
    var DSDeviceClass = DS.defineResource({

      // API configuration
      endpoint: 'deviceclasses',

      // Model configuration
      idAttribute: 'id',
      name: 'deviceClass',
      relations: {
        belongsTo: {
          vendor: {
            localField: 'vendor',
            localKey: 'vendorId',
            // parent: true
          }
        },
        hasMany: {
          deviceClassActionType: {
            localField: 'deviceClassActionTypes',
            foreignKey: 'deviceClassId'
          },
          deviceClassEventType: {
            localField: 'deviceClassEventTypes',
            foreignKey: 'deviceClassId'
          },
          deviceClassStateType: {
            localField: 'deviceClassStateTypes',
            foreignKey: 'deviceClassId'
          }
        }
      },

      // Computed properties
      computed: {
        templateUrl: ['name', _addUiTemplate]
      },

      // Instance methods
      methods: {
        discover: discover,
        getCreateMethod: getCreateMethod,
        getSetupMethod: getSetupMethod
      },

      // Lifecycle hooks
      afterInject: function(resource, attrs) {
        if(angular.isArray(attrs)) {
          var arrayOfAttrs = attrs;
          angular.forEach(arrayOfAttrs, function(attrs) {
            _mapStates(resource, attrs);
            _createDeviceClassActionsTypes(resource, attrs);
          });
        } else {
          _mapStates(resource, attrs);
          _createDeviceClassActionsTypes(resource, attrs);
        }
      }

    });

    DSDeviceClass.getAllActionTypes = function(deviceClassId) {
      var deviceClassActionTypes = DSDeviceClassActionType.getAll();
      var deviceClassActionTypesFiltered = deviceClassActionTypes.filter(function(deviceClassActionType) {
        return deviceClassActionType.deviceClassId === deviceClassId;
      });
      var deviceClass = DS.get('deviceClass', deviceClassId);
      var actionTypes = [];

      angular.forEach(deviceClassActionTypesFiltered, function(deviceClassActionType) {
        if(deviceClassActionType.deviceClassId === deviceClassId) {
          var actionType = DS.get('actionType', deviceClassActionType.actionTypeId);
          actionTypes.push(actionType);
        }
      });

      return actionTypes;
    };

    DSDeviceClass.getAllEventTypes = function(deviceClassId) {
      var deviceClassEventTypes = DSDeviceClassEventType.getAll();
      var deviceClassEventTypesFiltered = deviceClassEventTypes.filter(function(deviceClassEventType) {
        return deviceClassEventType.deviceClassId === deviceClassId;
      });
      var deviceClass = DS.get('deviceClass', deviceClassId);
      var eventTypes = [];

      angular.forEach(deviceClassEventTypesFiltered, function(deviceClassEventType) {
        if(deviceClassEventType.deviceClassId === deviceClassId) {
          var eventType = DS.get('eventType', deviceClassEventType.eventTypeId);
          eventTypes.push(eventType);
        }
      });

      return eventTypes;
    };

    DSDeviceClass.getAllStateTypes = function(deviceClassId) {
      var deviceClassStateTypes = DSDeviceClassStateType.getAll();
      var deviceClassStateTypesFiltered = deviceClassStateTypes.filter(function(deviceClassStateType) {
        return deviceClassStateType.deviceClassId === deviceClassId;
      });
      var deviceClass = DS.get('deviceClass', deviceClassId);
      var stateTypes = [];

      angular.forEach(deviceClassStateTypesFiltered, function(deviceClassStateType) {
        if(deviceClassStateType.deviceClassId === deviceClassId) {
          var stateType = DS.get('stateType', deviceClassStateType.stateTypeId);
          stateTypes.push(stateType);
        }
      });

      return stateTypes;
    };

    angular.extend(DSDeviceClass, {
      load: load
    });

    return DSDeviceClass;


    function load() {
      return websocketService
        .send({
          method: 'Devices.GetSupportedDevices'
        })
        .then(function(data) {
          DSDeviceClass.inject(data.deviceClasses);
          return DSDeviceClass.getAll();
        });
    }


    /*
     * Private method: _getInputPath(name, filename)
     */
    function _getInputPath(name, filename) {
      return 'app/containers/thing-details/device-class-templates/' + filename + '.html';
    }

    /*
     * Private method: _addUiTemplate(name)
     */
    function _addUiTemplate(name) {
      // Example: 'Elro Remote' => 'elro-remote'
      var templateName = name
        .toLowerCase()
        .replace(/\s/g, '-')
        .replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '');
      var templateUrl = _getInputPath(name, 'device-class-' + templateName);

      return modelsHelper.checkTemplateUrl(templateUrl);
    }

    /*
     * Private method:_createDeviceClassActionsTypes()
     */
    function _createDeviceClassActionsTypes(resource, attrs) {
      var deviceClassActionTypes = DS.getAll('deviceClassActionType');
      var deviceClassEventTypes = DS.getAll('deviceClassEventType');
      var deviceClassStateTypes = DS.getAll('deviceClassStateType');
      var actionTypes = attrs.actionTypes;
      var eventTypes = attrs.eventTypes;
      var stateTypes = attrs.stateTypes;
      var deviceClassId = attrs.id;

      // ActionTypes
      angular.forEach(actionTypes, function(actionType) {
        // Create actionType
        var actionTypeInstance = DS.createInstance('actionType', actionType);
        DS.inject('actionType', actionTypeInstance);

        // Filtered deviceClassActionTypes
        var deviceClassActionTypesFiltered = deviceClassActionTypes.filter(function(deviceClassActionType) {
          return deviceClassActionType.deviceClassId === deviceClassId && deviceClassActionType.actionTypeId === actionType.id;
        });

        // Only inject if not already there
        if(angular.isArray(deviceClassActionTypesFiltered) && deviceClassActionTypesFiltered.length === 0) {
          // Create membership (deviceClass <-> actionType)
          deviceClassActionTypesId = deviceClassActionTypesId + 1;
          var deviceClassActionTypeInstance = DS.createInstance('deviceClassActionType', {
            id: deviceClassActionTypesId,
            deviceClassId: deviceClassId,
            actionTypeId: actionType.id
          });
          DS.inject('deviceClassActionType', deviceClassActionTypeInstance);
        }
      });

      // EventTypes
      angular.forEach(eventTypes, function(eventType) {
        // Create eventType
        var eventTypeInstance = DS.createInstance('eventType', eventType);
        DS.inject('eventType', eventTypeInstance);

        // Filtered deviceClassEventTypes
        var deviceClassEventTypesFiltered = deviceClassEventTypes.filter(function(deviceClassEventType) {
          return deviceClassEventType.deviceClassId === deviceClassId && deviceClassEventType.eventTypeId === eventType.id;
        });

        // Only inject if not already there
        if(angular.isArray(deviceClassEventTypesFiltered) && deviceClassEventTypesFiltered.length === 0) {
          // Create membership (deviceClass <-> eventType)
          deviceClassEventTypesId = deviceClassEventTypesId + 1;
          var deviceClassEventTypeInstance = DS.createInstance('deviceClassEventType', {
            id: deviceClassEventTypesId,
            deviceClassId: deviceClassId,
            eventTypeId: eventType.id
          });
          DS.inject('deviceClassEventType', deviceClassEventTypeInstance);
        }
      });

      // StateTypes
      angular.forEach(stateTypes, function(stateType) {
        // Create stateType
        var stateTypeInstance = DS.createInstance('stateType', stateType);
        DS.inject('stateType', stateTypeInstance);

        // Filtered deviceClassStateTypes
        var deviceClassStateTypesFiltered = deviceClassStateTypes.filter(function(deviceClassStateType) {
          return deviceClassStateType.deviceClassId === deviceClassId && deviceClassStateType.stateTypeId === stateType.id;
        });

        // Only inject if not already there
        if(angular.isArray(deviceClassStateTypesFiltered) && deviceClassStateTypesFiltered.length === 0) {
          // Create membership (deviceClass <-> actionType)
          deviceClassStateTypesId = deviceClassStateTypesId + 1;
          var deviceClassStateTypeInstance = DS.createInstance('deviceClassStateType', {
            id: deviceClassStateTypesId,
            deviceClassId: deviceClassId,
            stateTypeId: stateType.id
          });
          DS.inject('deviceClassStateType', deviceClassStateTypeInstance);
        }
      });
    }

    /*
     * Private method: _mapStates(resource, attrs)
     */
    function _mapStates(resource, attrs) {
      var actionTypes = attrs.actionTypes;
      var eventTypes = attrs.eventTypes;
      var stateTypes = attrs.stateTypes;
      // var stateIds = libs._.pluck(stateTypes, 'id');
      var stateIds = _.pluck(stateTypes, 'id');

      // Map actionTypes
      angular.forEach(actionTypes, function(actionType) {
        // Check if current actionType belongs to a stateType
        if(_.contains(stateIds, actionType.id)) {
          actionType.hasState = true;
        } else {
          actionType.hasState = false;
        }
      });

      // Map eventTypes
      angular.forEach(eventTypes, function(eventType) {
        // Check if current eventType belongs to a stateType
        if(_.contains(stateIds, eventType.id)) {
          eventType.hasState = true;
        } else {
          eventType.hasState = false;
        }
      });
    }


    /*
     * Public method: discover(discoveryParams)
     */
    function discover(discoveryParams) {
      /* jshint validthis: true */
      var self = this;

      return websocketService.send({
        method: 'Devices.GetDiscoveredDevices',
        params: {
          deviceClassId: self.id,
          discoveryParams: discoveryParams
        }
      });
    }

    /*
     * Public method: getCreateMethod()
     */
    function getCreateMethod() {
      /* jshint validthis: true */
      var self = this;
      var basePath = 'app/components/create-thing/templates/';
      var createMethodData = null;

      if(self.createMethods.indexOf('CreateMethodDiscovery') > -1) {
        createMethodData = {
          title: 'Discovery',
          template: basePath + 'create-thing-discovery.html'
        };
      } else if(self.createMethods.indexOf('CreateMethodUser') > -1) {
        createMethodData = {
          title: 'User',
          template: basePath + 'create-thing-user.html'
        };
      } else if(self.createMethods.indexOf('CreateMethodAuto') > -1) {
        createMethodData = {
          title: 'Auto',
          template: null
        };
      } else {
        $log.error('CreateMethod not implemented.');
      }

      return createMethodData;
    }

    /*
     * Public method: getSetupMethod()
     */
    function getSetupMethod() {
      /* jshint validthis: true */
      var self = this;
      var basePath = 'app/components/setup-thing/templates/';
      var setupMethodData = {};

      switch(self.setupMethod) {
        case 'SetupMethodJustAdd':
          setupMethodData = null;
          break;
        case 'SetupMethodDisplayPin':
          setupMethodData = {
            title: 'Display Pin',
            template: basePath + 'setup-thing-display-pin.html'
          };
          break;
        case 'SetupMethodEnterPin':
          setupMethodData = {
            title: 'Enter Pin',
            template: basePath + 'setup-thing-enter-pin.html'
          };
          break;
        case 'SetupMethodPushButton':
          setupMethodData = {
            title: 'Push Button',
            template: basePath + 'setup-thing-push-button.html'
          };
          break;
        default:
          $log.error('SetupMethod not implemented.');
          break;
      }

      return setupMethodData;
    }


  }

}());