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

  DSDeviceClassFactory.$inject = ['$log', '$q', 'DS', 'app', 'libs', 'websocketService', 'modelsHelper', 'DSDeviceClassActionType', 'DSDeviceClassEventType', 'DSDeviceClassStateType'];

  function DSDeviceClassFactory($log, $q, DS, app, libs, websocketService, modelsHelper, DSDeviceClassActionType, DSDeviceClassEventType, DSDeviceClassStateType) {
    
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
          // eventType: {
          //   localField: 'eventTypes',
          //   foreignKey: 'deviceClassId'
          // },
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
            _addUiData(resource, attrs);
            _mapClassType(resource, attrs);
            _mapStates(resource, attrs);
            _createDeviceClassActionsTypes(resource, attrs);
          });
        } else {
          _addUiData(resource, attrs);
          _mapClassType(resource, attrs);
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
      var classType = _getClassType(name);

      return 'app/containers/thing-details/device-class-templates/' + filename + app.fileExtensions.html;
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
     * Private method: _addUiData(resource, attrs)
     */
    function _addUiData(resource, attrs) {
      var discoveryParamTypes = attrs.discoveryParamTypes;
      var paramTypes = attrs.paramTypes;
      // var stateTypes = attrs.stateTypes;

      attrs = modelsHelper.addUiData(attrs);

      // discoveryParamTypes
      angular.forEach(discoveryParamTypes, function(paramType) {
        paramType = modelsHelper.addUiData(paramType);
      });

      // paramTypes
      angular.forEach(paramTypes, function(paramType) {
        paramType = modelsHelper.addUiData(paramType);
      });

      // stateTypes
      // angular.forEach(stateTypes, function(stateType) {
      //   stateType = modelsHelper.addUiData(stateType);
      // });
    }

    /*
     * Private method: _getClassType(name)
     */
    function _getClassType(name) {
      var devServices = [
        'Mock Device',
        'Mock Device (Auto created)',
        'Mock Device (Child)',
        'Mock Device (Display Pin)',
        'Mock Device (Parent)',
        'Mock Device (Push Button)'
      ];
      var devices = [
        'Elro Bulb (AB440L)',
        'Elro outdoor socket (AB440WD)',
        'Elro Socket (AB440D)',
        'Elro Socket (AB440S)',
        'Hue Light',
        'Intertechno switch',
        'IR receiver',
        'Lirc',
        'LG Smart Tv',
        'Max! Cube LAN Gateway',
        'Max! Radiator Thermostat',
        'Max! Wall Thermostat',
        'RF Controller (LN-CON-RF20B)',
        'Shutter (RSM900R)',
        'Tune',
        'Unitec switch (48111)',
        'WeMo Switch',
        'WiFi Device'
      ];
      var gateways = [
        'Hue Bridge'
      ];
      var moods = [
        'Mood'
      ];
      var services = [
        'aWATTar',
        'Alarm',
        'Application launcher',
        'Bashscript launcher',
        'Button',
        'Countdown',
        'Custom mail',
        'Google mail',
        'Kodi',
        'ON/OFF Button',
        'Today',
        'Toggle Button',
        'UDP Commander',
        'Wake On Lan',
        'Weather',
        'Yahoo mail'
      ];
      var classType = 'device';

      if(libs._.contains(devServices, name)) {
        classType = 'dev-service';
      } else if(libs._.contains(moods, name)) {
        classType = 'mood';
      } else if(libs._.contains(gateways, name)) {
        classType = 'gateway';
      } else if(libs._.contains(services, name)) {
        classType = 'service';
      }

      return classType;
    }

    /*
     * Private method: _mapClassType(resource, attrs)
     */
    function _mapClassType(resource, attrs) {
      attrs.classType = _getClassType(attrs.name);
    }


    /*
     * Private method: _mapStates(resource, attrs)
     */
    function _mapStates(resource, attrs) {
      var actionTypes = attrs.actionTypes;
      var eventTypes = attrs.eventTypes;
      var stateTypes = attrs.stateTypes;
      var stateIds = libs._.pluck(stateTypes, 'id');

      // Map actionTypes
      angular.forEach(actionTypes, function(actionType) {
        // Check if current actionType belongs to a stateType
        if(libs._.contains(stateIds, actionType.id)) {
          actionType.hasState = true;
        } else {
          actionType.hasState = false;
        }
      });

      // Map eventTypes
      angular.forEach(eventTypes, function(eventType) {
        // Check if current eventType belongs to a stateType
        if(libs._.contains(stateIds, eventType.id)) {
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
      var addBasePath = 'app/components/devices/add/pairing-templates/';
      var editBasePath = 'app/components/devices/edit/pairing-templates/';
      var createMethodData = null;

      if(self.createMethods.indexOf('CreateMethodDiscovery') > -1) {
        createMethodData = {
          title: 'Discovery',
          addTemplate: addBasePath + 'devices-add-create-discovery.html',
          editTemplate: editBasePath + 'devices-edit-create-discovery.html'
        };
      } else if(self.createMethods.indexOf('CreateMethodUser') > -1) {
        createMethodData = {
          title: 'User',
          addTemplate: addBasePath + 'devices-add-create-user.html',
          editTemplate: editBasePath + 'devices-edit-create-user.html'
        };
      } else if(self.createMethods.indexOf('CreateMethodAuto') > -1) {
        createMethodData = {
          title: 'Auto',
          // addTemplate: addBasePath + 'devices-add-create-user.html',
          // editTemplate: editBasePath + 'devices-edit-create-user.html'
          addTemplate: null,
          ediTemplate: null
        };
      } else {
        $log.error('CreateMethod not implemented.');
      }

      // createMethodData.addTemplate = modelsHelper.checkTemplateUrl(createMethodData.addTemplate);

      return createMethodData;
    }

    /*
     * Public method: getSetupMethod()
     */
    function getSetupMethod() {
      /* jshint validthis: true */
      var self = this;
      var addBasePath = 'app/components/devices/add/pairing-templates/';
      var editBasePath = 'app/components/devices/edit/pairing-templates/';
      var setupMethodData = {};

      switch(self.setupMethod) {
        case 'SetupMethodJustAdd':
          setupMethodData = null;
          break;
        case 'SetupMethodDisplayPin':
          setupMethodData = {
            title: 'Display Pin',
            addTemplate: addBasePath + 'devices-add-setup-display-pin.html',
            editTemplate: editBasePath + 'devices-edit-setup-display-pin.html'
          };
          break;
        case 'SetupMethodEnterPin':
          setupMethodData = {
            title: 'Enter Pin',
            addTemplate: addBasePath + 'devices-add-setup-enter-pin.html',
            editTemplate: editBasePath + 'devices-edit-setup-enter-pin.html'
          };
          break;
        case 'SetupMethodPushButton':
          setupMethodData = {
            title: 'Push Button',
            addTemplate: addBasePath + 'devices-add-setup-push-button.html',
            editTemplate: editBasePath + 'devices-edit-setup-push-button.html'
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