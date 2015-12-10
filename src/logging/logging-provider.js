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
    .module('guh.logging')
    .provider('guhLogging', Logging);

  Logging.$inject = ['$injector'];

  function Logging($injector) {
    var _logTypes = {
      log: {},
      info: {},
      warn: {},
      error: {}
    };

    var _hooks = {
      http: 'guhLoggingHttpHook',
      broadcast: 'guhLoggingBroadcastHook',
      websocket: null
    };

    var provider = {
      $get: $get,
      enhance: enhance,
      before: before,
      after: after,
      decorate: decorate
    };

    return provider;


    // function _getArrayFromString(string) {
    //   if(!angular.isString(string)) {
    //     return;
    //   }
    // }

    function _addHooks(prePost, logTypes, hooks) {
      try {
        if(angular.isUndefined(logTypes) || logTypes === null || !angular.isString(logTypes)) {
          throw 'Wrong argument type. The argument "logTypes" should be a comma seperated String.';
        }
        if(angular.isDefined(hooks) && hooks !== null && !angular.isString(hooks)) {
          throw 'Wrong argument type. The argument "hooks" should be a comma seperated String.';
        }
      } catch(error) {
        return error;
      }

      var logTypesArray = logTypes.replace(/\s+/g, '').split(',');
      var hooksArray = hooks.replace(/\s+/g, '').split(',');
      var logTypeCallbacks = [];

      // Check hooks
      var callback;
      angular.forEach(hooksArray, function(hook) {
        if(angular.isDefined(_hooks[hook]) && _hooks[hook] !== null) {
          logTypeCallbacks.push(_hooks[hook]);
        }
      });

      // Initialize all log types with preCallbacks = [] / postCallbacks = []
      angular.forEach(_logTypes, function(_logType) {
        _logType[prePost + 'Callbacks'] = [];
      });

      // Set defined callbacks for log types
      angular.forEach(logTypesArray, function(logType) {
        if(angular.isDefined(_logTypes[logType])) {
          _logTypes[logType][prePost + 'Callbacks'] = logTypeCallbacks;
        }
      });
    }

    function _getEnhancedArguments(args) {
      // console.log('args', args, angular.isObject(args), angular.isArray(args));

      var argsArray = args ? [].slice.call(args) : args;

      // console.log('argsArray', argsArray, argsArray.length, angular.isArray(argsArray), argsArray[0]);

      if(argsArray.length === 1) {
        return argsArray[0];
      } else {
        return args;
      }
    }

    function _addTimestamp() {

    }


    function $get() {
      var service = {
        isEnhanced: isEnhanced,
        log: log,
        info: info,
        warn: warn,
        error: error,
        getLogType: getLogType
      };

      return service;


      function isEnhanced(logType) {
        return (angular.isDefined(_logTypes[logType]) && angular.isDefined(_logTypes[logType].enhanced)) ? _logTypes[logType].enhanced : false;
      }

      function log() {
        // var args = _getEnhancedArguments(arguments);
        // console.log(arguments);
      }

      function info() {
        // var args = _getEnhancedArguments(arguments);
        // console.info(arguments);
      }

      function warn() {
        // var args = _getEnhancedArguments(arguments);
        // console.warn(arguments);
      }

      function error() {
        // var args = _getEnhancedArguments(arguments);
        // console.error(arguments);
      }

      function getLogType(logType) {
        return _logTypes[logType];
      }
    }

    function enhance(logTypes) {
      try {
        if(angular.isDefined(logTypes) && logTypes !== null && !angular.isString(logTypes)) {
          throw 'Wrong argument type. The argument "logTypes" should be a comma seperated String.';
        }
      } catch(error) {
        return error;
      }

      var logTypesArray = [];

      // Set enhanced
      if(angular.isString(logTypes)) {
        logTypesArray = logTypes.replace(/\s+/g, '').split(',');

        // Initialize all log types with enhanced = false
        angular.forEach(_logTypes, function(_logType) {
          _logType.enhanced = false;
        });

        // Set defined enhanced values for log types
        angular.forEach(logTypesArray, function(logType) {
          if(angular.isDefined(_logTypes[logType])) {
            _logTypes[logType].enhanced = true;
          }
        });
      } else {
        // If logTypes is undefined or null
        // Initialize all log types with enhanced = true
        angular.forEach(_logTypes, function(_logType) {
          _logType.enhanced = true;
        });
      }
    }

    function before(logTypes, hooks) {
      _addHooks('pre', logTypes, hooks);
    }

    function after(logTypes, hooks) {
      _addHooks('post', logTypes, hooks);
    }

    function decorate(message) {

    }
  }

}());
