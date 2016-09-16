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
    .factory('websocketService', websocketService);

  websocketService.$inject = ['$log', '$rootScope', '$q', '$timeout'];

  function websocketService($log, $rootScope, $q, $timeout) {

    var ws = null;
    var connectionTimer;
    var websocketService = {
      close: close,
      connect: connect,
      reconnect: reconnect,
      send: send,
      onmessage: angular.noop
    };

    return websocketService;


    function close() {
      if(ws) {
        ws.close();
        ws = null;
      }
    }

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
          $rootScope.$apply(function() {
            $rootScope.$broadcast('WebsocketConnectionLost', 'The app has lost the connection to guh. Please check if you are connected to your network and if guh is running correctly.');
          });
        }
      };

      ws.onerror = function(event) {
        $rootScope.$apply(function() {
          $rootScope.$broadcast('WebsocketConnectionError', 'There was an error connecting to guh.');
        });

        return event;
      };

      ws.onmessage = function(event) {
        var response = angular.fromJson(event.data);

        // $log.log('%cwebsocketService:onmessage', 'color: #da7469', response, websocketService);
        websocketService.onmessage(response);
      };
    }

    function reconnect(url) {
      websocketService.close();
      websocketService.connect(url);
    }

    function send(request) {
      // $log.log('%cwebsocketService:send', 'color: #da7469', request);
      ws.send(angular.toJson(request));
    }

  }

}());