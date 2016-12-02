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

  websocketService.$inject = ['$log', '$rootScope', '$q', '$timeout', 'DS'];

  function websocketService($log, $rootScope, $q, $timeout, DS) {

    var ws = null;
    var connectionTimer;
    var callbacks = {};
    var currentRequestId = 0;
    var websocketService = {
      close: close,
      connect: connect,
      reconnect: reconnect,
      send: send
    };

    return websocketService;

    /*
     * Private function: _getRequestId()
     */
    function _getRequestId() {
      currentRequestId = currentRequestId + 1;
      if(currentRequestId > 10000) {
        currentRequestId = 0;
      }
      return currentRequestId;
    };


    /*
     * Public method: close()
     */
    function close() {
      if(ws) {
        ws.close();
        ws = null;
      }
    }

    /*
     * Public method: connect()
     */
    function connect(url) {
      if(ws) {
        return;
      }

      if(angular.isUndefined(url)) {
        $log.error('guh.api.websocketService:factory', 'Missing argument: url');
      }

      ws = new WebSocket(url);

      // Timeout if connecting takes to long (can take up to 1 minute, with the timeout only 2 seconds)
      connectionTimer = $timeout(function() {
        ws.close();
        ws = null;
      }, 2000);

      ws.onopen = function(event) {
        if(connectionTimer) {
          $timeout.cancel(connectionTimer);
        }

        // Send broadcast event
        $rootScope.$apply(function() {
          $rootScope.$broadcast('WebsocketConnected', 'Successful connected to guh.');
        });
      };

      ws.onclose = function(event) {
        // Safari is not calling onerror but calls onclose with code = 1006
        if(event.code === 1006) {
          $rootScope.$apply(function() {
            $rootScope.$broadcast('WebsocketConnectionError', 'There was an error connecting to guh.');
          });
        } else {
          // Send broadcast event
          $rootScope.$apply(function() {
            $rootScope.$broadcast('WebsocketConnectionLost', 'The app has lost the connection to guh. Please check if you are connected to your network and if guh is running correctly.');
          });
        }
      };

      ws.onerror = function(event) {
        // Send broadcast event
        $rootScope.$apply(function() {
          $rootScope.$broadcast('WebsocketConnectionError', 'There was an error connecting to guh.');
        });
      };

      ws.onmessage = function(message) {
        var data = angular.fromJson(message.data);
        var injectedItem;

        if(angular.isDefined(data.notification)) {
          switch(data.notification) {
            // Devices.DeviceAdded
            case 'Devices.DeviceAdded':
              var deviceId = data.params.device.id;
              var device = DS.get('device', deviceId);

              if(angular.isUndefined(device)) {
                injectedItem = DS.inject('device', data.params.device);

                // Send broadcast event
                if(DS.is('device', injectedItem)) {
                  $rootScope.$broadcast('ReloadView', injectedItem.deviceClass.name + ' was added.');
                }          
              }

              break;


            // Devices.DeviceChanged
            case 'Devices.DeviceChanged':
              var deviceId = data.params.device.id;
              var device = DS.get('device', deviceId);

              if(angular.isDefined(device)) {
                injectedItem = DS.inject('device', data.params.device);

                // Send broadcast event
                if(DS.is('device', injectedItem)) {
                  $rootScope.$broadcast('ReloadView', injectedItem.deviceClass.name + ' was changed.');
                }
              }

              break;

            // Devices.DeviceRemoved
            case 'Devices.DeviceRemoved':
              var deviceId = data.params.deviceId;
              var ejectedItem = DS.eject('device', deviceId);

              if(angular.isDefined(ejectedItem)) {
                // Send broadcast event
                $rootScope.$broadcast('ReloadView', 'Device was removed.', ejectedItem);
              }

              break;


            // Devices.StateChanged
            case 'Devices.StateChanged':
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


            // TODO: Events.EventTriggered


            // TODO: Logging.LogDatabaseUpdated


            // TODO: Logging.LogEntryAdded


            // TODO: Rules.RuleActiveChanged


            // Rules.RuleAdded
            case 'Rules.RuleAdded':
              var ruleId = data.params.rule.id;
              var rule = DS.get('rule', ruleId);

              if(angular.isUndefined(rule)) {
                injectedItem = DS.inject('rule', data.params.rule);

                // Send broadcast event
                if(DS.is('rule', injectedItem)) {
                  $rootScope.$broadcast('ReloadView', injectedItem.name + ' was added.');
                }
              }

              break;


            // Rules.ConfigurationChanged
            case 'Rules.ConfigurationChanged':
              var rule = data.params.rule;
              injectedItem = DS.inject('rule', rule);

              // Send broadcast event
              if(DS.is('rule', injectedItem)) {
                $rootScope.$broadcast('ReloadView', injectedItem.name + ' was updated.');
              }

              break;


            // Rules.RuleRemoved
            case 'Rules.RuleRemoved':
              var ruleId = data.params.ruleId;
              var ejectedItem = DS.eject('rule', ruleId);

              if(angular.isDefined(ejectedItem)) {
                // Send broadcast event
                $rootScope.$broadcast('ReloadView', 'Rule was removed.');
              }

              break;


            default:
              // $log.warn('Type of notification not handled:', data);
          }

        // } else if(angular.isDefined(data.authenticationRequired)) {
        } else if(angular.isDefined(data.id) && data.id === 0) {
          $rootScope.$apply(function() {
            $rootScope.$broadcast('InitialHandshake', data);
          });
        } else if(angular.isDefined(data.id)) {
          if(data.status === 'success') {
            if(angular.isDefined(data.params.deviceError) && data.params.deviceError !== 'DeviceErrorNoError') {
              $rootScope.$apply(callbacks[data.id].callback.reject(data.params));
            } else if(angular.isDefined(data.params.loggingError) && data.params.loggingError !== 'LoggingErrorNoError') {
              $rootScope.$apply(callbacks[data.id].callback.reject(data.params));
            } else if(angular.isDefined(data.params.ruleError) && data.params.ruleError !== 'RuleErrorNoError') {
              $rootScope.$apply(callbacks[data.id].callback.reject(data.params));
            } else {
              $rootScope.$apply(callbacks[data.id].callback.resolve(data.params));
            }
          } else {
            $rootScope.$apply(callbacks[data.id].callback.reject(data.error));
          }
          
          delete callbacks[data.id];
        }
      };
    }

    /*
     * Public method: reconnect(url)
     */
    function reconnect(url) {
      websocketService.close();
      websocketService.connect(url);
    }

    /*
     * Public method: send(request)
     */
    function send(request) {
      var defer = $q.defer();
      var requestId = _getRequestId();

      callbacks[requestId] = {
        time: new Date(),
        callback: defer
      };

      request.id = requestId;

      console.log('SEND', request, angular.toJson(request));

      ws.send(angular.toJson(request));

      return defer.promise;
    }

  }

}());