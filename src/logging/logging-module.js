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
    .module('guh.logging', [
      'guh.logging.hooks'
    ])
    .config(config);

  config.$inject = ['$provide'];

  function config($provide) {
    // Exceptions
    // $provide.decorator('$exceptionHandler', ['$injector', '$delegate', 'Logging', function($injector, $delegate, Logging) {
    //   if(!Logging.angularServiceEnhanced.$exceptionHandler) {
    //     return $delegate;
    //   }

    //   return function(exception, cause) {
    //     $delegate(exception, cause);
    //   }
    // }]);

    // Logs
    $provide.decorator('$log', ['$injector', '$delegate', 'guhLogging', function($injector, $delegate, guhLogging) {
      var decorator = {
        log: log,
        info: info,
        warn: warn,
        error: error
      };

      return decorator;


      function _applyCallbacks(logType, args) {
        var logTypeData = guhLogging.getLogType(logType);

        // Pre callbacks
        angular.forEach(logTypeData.preCallbacks, function(preCallbackProvider) {
          var preCallback = $injector.get(preCallbackProvider);
          preCallback.call(preCallback, {
            type: logType,
            args: args
          });
        });

        // Console
        if(guhLogging.isEnhanced(logType)) {
          $delegate[logType].apply($delegate, args);
          guhLogging[logType].apply(null, args);
        } else {
          $delegate[logType].apply($delegate, args);
        }

        // Post callbacks
        angular.forEach(logTypeData.postCallbacks, function(postCallbackProvider) {
          var postCallback = $injector.get(postCallbackProvider);
          postCallback.call(postCallback, {
            type: logType,
            args: args
          });
        });
      }

      function log() {
        var args = arguments;
        _applyCallbacks('log', args);
      }

      function info() {
        var args = arguments;
        _applyCallbacks('info', args);
      }

      function warn() {
        var args = arguments;
        _applyCallbacks('warn', args);
      }

      function error() {
        var args = arguments;
        _applyCallbacks('error', args);
      }
    }]);
  }

}());
