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
    .module('guh.logging.hooks')
    .provider('guhLoggingHttpHook', guhLoggingHttpHook);

  function guhLoggingHttpHook() {
    // Variables
    var locationProtocol = location.protocol;
    var locationHost = location.hostname;
    var locationPort = location.port;
    var locationServer = locationProtocol + '//' + locationHost + ':' + locationPort;


    var provider = {
      // Provider methods (needed)
      $get: ['$http', $get],

      // Other methods
      getServer: getServer,
      setProtocol: setProtocol,
      setHostname: setHostname,
      setPort: setPort
    };

    return provider;


    function _checkParameter(parameterName, parameter) {
      try {
        if(!angular.isDefined(parameter) || parameter === null) {
          throw 'The parameter ' + parameterName + ' has to be defined.';
        } else if(!angular.isString(parameter)) {
          throw 'The value of ' + parameterName + ' has to be a string.';
        }
      } catch(error) {
        return;
      }
    }

    function _setServerAddress() {
      locationServer = locationProtocol + '//' + locationHost + ':' + locationPort;
    }


    function $get($http) {
      return function(logObject) {
        $http
          .post(locationServer, {
            data: logObject
          })
          .then(function(response) {
            console.log('Data successfully sent.', {
              payload: logObject,
              response: response
            });
          })
          .catch(function(error) {
            console.log('Data not sent.', {
              payload: logObject,
              error: error
            })
          });
      }

      // console.log('$get', $http);

      // var service = {
      //   // Variables
      //   protocol: locationProtocol,
      //   host: locationHost,
      //   port: locationPort,
      //   server: locationServer,

      //   // Methods
      //   addToQueue: addToQueue
      // };

      // return service;


      // function addToQueue($http) {
      //   console.log('addToQueue', $http);
      // }
    }

    function setProtocol(protocol) {
      _checkParameter('protocol', protocol);
      locationProtocol = protocol;
      _setServerAddress();
    }

    function setHostname(hostname) {
      _checkParameter('hostname', hostname);
      locationHost = hostname;
      _setServerAddress();
    }

    function setPort(port) {
      _checkParameter('port', port);
      locationPort = port;
      _setServerAddress();
    }

    function getServer() {
      return locationServer;
    }
  }

}());
