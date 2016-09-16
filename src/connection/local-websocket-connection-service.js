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
    .factory('localWebsocketService', localWebsocketService);

  localWebsocketService.$inject = ['$log', '$rootScope', '$q', 'cloudService', 'websocketService'];

  function localWebsocketService($log, $rootScope, $q, cloudService, websocketService) {
  
    var currentRequestId = 0;
    var callbacks = {};
    var localWebsocketService = {
      send: send,
      onmessage: angular.noop,
      getOnMessageCallback: _getOnMessageCallback
    };

    return localWebsocketService;


    function _onmessage(response) {
      // $log.log('%clocalWebsocket:_onmessage', 'color: #4f98da', response, callbacks);

      localWebsocketService.onmessage(response);
    }

    function _getOnMessageCallback() {
      return _onmessage;
    }


    function send(request) {
      websocketService.send(request);
    }

  }

}());
