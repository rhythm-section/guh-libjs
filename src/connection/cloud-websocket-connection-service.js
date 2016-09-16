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
    .module('guh.connection')
    .factory('cloudWebsocketService', cloudWebsocketService);

  cloudWebsocketService.$inject = ['$log', '$rootScope', '$q', 'cloudService', 'websocketService'];

  function cloudWebsocketService($log, $rootScope, $q, cloudService, websocketService) {
  
    var currentRequestId = 0;
    var callbacks = {};
    var cloudWebsocketService = {
      send: send,
      onmessage: angular.noop,
      getOnMessageCallback: _getOnMessageCallback
    };

    return cloudWebsocketService;


    function _getRequestId() {
      currentRequestId = currentRequestId + 1;

      if(currentRequestId > 10000) {
        currentRequestId = 0;
      }

      return currentRequestId;
    }

    function _onmessage(response) {
      // $log.log('%ccloudWebsocket:_onmessage', 'color: #bada55', response, callbacks);

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

    function _getOnMessageCallback() {
      return _onmessage;
    }

    function _notificationHandler(response) {
      var notification = response.notification;

      switch(notification) {
        // TODO: Connection.ConnectionAdded


        // TODO: Connection.ConnectionRemoved


        case 'Connection.DataReceived':
          if(angular.isDefined(response.params) &&
            angular.isDefined(response.params.tunnelId) &&
            response.params.tunnelId === cloudService.getTunnelId() &&
            angular.isDefined(response.params.data)) {
            cloudWebsocketService.onmessage(response.params.data);
          }
          break;

        // TODO: Connection.TunnelAdded


        // TODO: Connection.TunnelRemoved


        default:
          // $log.warn('cloudWebsocket:notification', 'Notification not handled.', response);
      }
    }

    function _responseHandler(response) {
      if(response.status === 'success') {
        if(angular.isDefined(response.params.authenticationError) &&
           response.params.authenticationError !== 'AuthenticationErrorSuccess') {
          $rootScope.$apply(callbacks[response.id].callback.reject(response.params));
        } else if(angular.isDefined(response.params.connectionError) &&
                  response.params.connectionError !== 'ConnectionErrorNoError') {
          $rootScope.$apply(callbacks[response.id].callback.reject(response.params));
        }/* else if(angular.isDefined(response.params.authenticationError) ||
                  angular.isDefined(response.params.connectionError)) {
          // Response has to be from cloud (only responses with authenticationError or connectionError are coming from cloud)
          $rootScope.$apply(callbacks[response.id].callback.resolve(response.params));
        } */else {
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

      callbacks[requestId] = {
        time: new Date(),
        callback: defer,
        request: request
      };

      // var callbackString = '';
      // angular.forEach(callbacks, function(value, key) {
      //   callbackString = callbackString + key + '-' + value.request.method + ':';
      // });
      // $log.log('%ccloudWebsocketService:send', 'color: #bada55', requestId, request, callbackString);

      if(angular.isDefined(tunnelId)) {
        request = {
          id: requestId,
          method: 'Connection.SendData',
          params: {
            data: request,
            tunnelId: tunnelId
          }
        };
      } else {
        request.id = requestId;
      }

      websocketService.send(request);

      return defer.promise;
    }

  }

}());
