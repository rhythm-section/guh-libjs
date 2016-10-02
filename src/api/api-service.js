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
    .provider('apiService', apiService);


  apiService.$inject = [];

  function apiService() {

    var apiServiceProvider = {
      connectionType: 'localWebsocketService',
      $get: $get
    };

    return apiServiceProvider;


    $get.$inject = ['$log', '$rootScope', '$q', 'cloudService', 'localWebsocketService', 'cloudWebsocketService', 'websocketService', 'DS'];

    function $get($log, $rootScope, $q, cloudService, localWebsocketService, cloudWebsocketService, websocketService, DS) {
      var currentRequestId = 0;
      var callbacks = {};
      var apiService = {
        send: send
      };

      // Set callbacks
      if(apiServiceProvider.connectionType === 'cloudWebsocket') {
        cloudWebsocketService.onmessage = _onmessage;
        websocketService.onmessage = cloudWebsocketService.getOnMessageCallback();
      } else {
        localWebsocketService.onmessage = _onmessage;
      }

      return apiService;


      function _getRequestId() {
        currentRequestId = currentRequestId + 1;

        if(currentRequestId > 10000) {
          currentRequestId = 0;
        }

        return currentRequestId;
      }

      function _onmessage(response) {
        // $log.log('%capiService:_onmessage', 'color: #4f98da', response, callbacks);

        if(angular.isDefined(response.notification)) {
          _notificationHandler(response);
        } else if(angular.isDefined(response.server) &&
                  angular.isDefined(response.version)) {
          $rootScope.$apply(function() {
            $rootScope.$broadcast('InitialHandshake', response);
          });
        } else if(angular.isDefined(response.id)) {
          _responseHandler(response);
        }
      }

      function _notificationHandler(response) {
        var notification = response.notification;

        switch(notification) {
          // TODO: Cloud.ConnectionStatusChanged

          
          // TODO: Configuration.BasicConfigurationChanged

          
          // TODO: Configuration.TcpServerConfigurationChanged

          
          // TODO: Configuration.WebServerConfigurationChanged

          
          // TODO: Configuration.WebSocketServerConfigurationChanged


          // Devices.DeviceAdded
          case 'Devices.DeviceAdded':
            var deviceId = response.params.device.id;
            var device = DS.get('device', deviceId);

            if(angular.isUndefined(device)) {
              var injectedItem = DS.inject('device', response.params.device);

              if(DS.is('device', injectedItem)) {
                $rootScope.$broadcast('ReloadView', injectedItem.deviceClass.name + ' was added.');
              }          
            }
            break;


          // TODO: Devices.DeviceChanged


          // Devices.DeviceRemoved
          case 'Devices.DeviceRemoved':
            var deviceId = response.params.deviceId;
            var ejectedItem = DS.eject('device', deviceId);

            if(angular.isDefined(ejectedItem)) {
              $rootScope.$broadcast('ReloadView', 'Device was removed.', ejectedItem);
            }
            break;


          // Devices.StateChanged
          case 'Devices.StateChanged':
            var deviceId = response.params.deviceId;
            var stateTypeId = response.params.stateTypeId;
            var value = response.params.value;

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
            var ruleId = response.params.rule.id;
            var rule = DS.get('rule', ruleId);

            if(angular.isUndefined(rule)) {
              var injectedItem = DS.inject('rule', response.params.rule);

              if(DS.is('rule', injectedItem)) {
                $rootScope.$broadcast('ReloadView', injectedItem.name + ' was added.');
              }
            }
            break;


          // Rules.ConfigurationChanged
          case 'Rules.ConfigurationChanged':
            var rule = response.params.rule;
            var injectedItem = DS.inject('rule', rule);

            if(DS.is('rule', injectedItem)) {
              $rootScope.$broadcast('ReloadView', injectedItem.name + ' was updated.');
            }
            break;

          // Rules.RuleRemoved
          case 'Rules.RuleRemoved':
            var ruleId = response.params.ruleId;
            var ejectedItem = DS.eject('rule', ruleId);

            if(angular.isDefined(ejectedItem)) {
              $rootScope.$broadcast('ReloadView', 'Rule was removed.');
            }
            break;

          default:
            $log.warn('apiService:notification', 'Notification "' + notification + '" not handled.', response);
        }
      }

      function _responseHandler(response) {      
        if(response.status === 'success') {
          if(angular.isDefined(response.params.deviceError) && response.params.deviceError !== 'DeviceErrorNoError') {
            $rootScope.$apply(callbacks[response.id].callback.reject(response.params));
          } else if(angular.isDefined(response.params.loggingError) && response.params.loggingError !== 'LoggingErrorNoError') {
            $rootScope.$apply(callbacks[response.id].callback.reject(response.params));
          } else if(angular.isDefined(response.params.ruleError) && response.params.ruleError !== 'RuleErrorNoError') {
            $rootScope.$apply(callbacks[response.id].callback.reject(response.params));
          } else if(angular.isDefined(response.params.connectionError) && response.params.connectionError !== 'ConnectionErrorNoError') {
            $rootScope.$apply(callbacks[response.id].callback.reject(response.params));
          } else {
            $rootScope.$apply(callbacks[response.id].callback.resolve(response.params));
          }
        } else {
          $rootScope.$apply(callbacks[response.id].callback.reject(response));
        }

        delete callbacks[response.id];
      }


      function send(request) {
        var defer = $q.defer();
        var requestId = _getRequestId();
        var tunnelId = cloudService.getTunnelId();

        request.id = requestId;

        callbacks[requestId] = {
          time: new Date(),
          callback: defer,
          request: request
        };

        // var callbackString = '';
        // angular.forEach(callbacks, function(value, key) {
        //   callbackString = callbackString + key + '-' + value.request.method + ':';
        // });
        // $log.log('%capiService:send', 'color: #4f98da', requestId, request, callbackString);

        if(angular.isDefined(tunnelId)) {
          cloudWebsocketService.send(request);
        } else {
          localWebsocketService.send(request);
        }

        return defer.promise;
      }
    }

  }

}());