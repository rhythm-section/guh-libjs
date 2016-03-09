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
    .module('guh.api')
    .factory('websocketService', websocketService);

  websocketService.$inject = ['$log', '$rootScope', 'libs', 'app', 'DS', 'DSHttpAdapter'];

  function websocketService($log, $rootScope, libs, app, DS, DSHttpAdapter) {

    var ws = null;
    var websocketService = {
      close: close,
      connect: connect,
      reconnect: reconnect
    };

    return websocketService;


    /*
     * Public method: close()
     */
    function close() {
      if(ws) {
        ws = null;
      }
    }

    /*
     * Public method: connect()
     */
    function connect() {
      if(ws) {
        return;
      }

      ws = new WebSocket(app.websocketUrl);

      ws.onopen = function(event) {
        $log.log('Successfully connected with websocket.', ws, event);

        // Send broadcast event
        $rootScope.$apply(function() {
          $rootScope.$broadcast('WebsocketConnected', 'Successful connected to guh.');
        });
      };

      ws.onclose = function(event) {
        $log.log('Closed websocket connection.', ws, event);

        // Send broadcast event
        $rootScope.$apply(function() {
          $rootScope.$broadcast('WebsocketConnectionLost', 'The app has lost the connection to guh. Please check if you are connected to your network and if guh is running correctly.');
        });
      };

      ws.onerror = function(event) {
        $log.error('There was an error with the websocket connection.', ws, event);

        // Send broadcast event
        $rootScope.$apply(function() {
          $rootScope.$broadcast('WebsocketConnectionError', 'There was an error connecting to guh.');
        });
      };

      ws.onmessage = function(message) {
        var data = angular.fromJson(message.data);

        if(angular.isDefined(data.notification)) {
          switch(data.notification) {
            // Devices.StateChanged
            case app.notificationTypes.devices.stateChanged:
              var deviceId = data.params.deviceId;
              var stateTypeId = data.params.stateTypeId;
              var value = data.params.value;

              DS.inject('state', {
                id: '' + deviceId + '_' + stateTypeId,
                deviceId: deviceId,
                stateTypeId: stateTypeId,
                value: value
              });
              break;

            // Devices.DeviceAdded
            case app.notificationTypes.devices.deviceAdded:
              var deviceId = data.params.device.id;
              var device = DS.get('device', deviceId);

              if(angular.isUndefined(device)) {
                var deviceData = data.params.device;

                DSHttpAdapter
                  .GET(app.apiUrl + '/devices/' + deviceId + '/states')
                  .then(function(response) {
                    var states = response.data;

                    var injectedItem = DS.inject('device', {
                      deviceClassId: deviceData.deviceClassId,
                      id: deviceData.id,
                      name: deviceData.name,
                      params: deviceData.params,
                      setupComplete: deviceData.setupComplete,
                      states: states
                    });

                    // Send broadcast event
                    if(DS.is('device', injectedItem)) {
                      $rootScope.$broadcast('ReloadView', injectedItem.deviceClass.name + ' was added.');
                    }
                  });            
              }

              break;

            // Devices.DeviceRemoved
            case app.notificationTypes.devices.deviceRemoved:
              var deviceId = data.params.deviceId;
              var ejectedItem = DS.eject('device', deviceId);

              if(angular.isDefined(ejectedItem)) {
                // Send broadcast event
                $rootScope.$broadcast('ReloadView', 'Device was removed.');
              }

              break;

            // RulesConfigurationChanged
            case app.notificationTypes.rules.ruleConfigurationChanged:
              var rule = data.params.rule;
              var injectedRule = DS.inject('rule', rule);

              // Send broadcast event
              if(DS.is('rule', injectedRule)) {
                $rootScope.$broadcast('ReloadView', injectedRule.name + ' was updated.');
              }

              break;

            default:
              $log.warn('Type of notification not handled:', data);
          }

        } else if(angular.isDefined(data.authenticationRequired)) {
          $rootScope.$broadcast('Initialize', data);
        }
      };
    }

    /*
     * Public method: reconnect()
     */
    function reconnect() {
      websocketService.close();
      websocketService.connect();
    }

  }

}());