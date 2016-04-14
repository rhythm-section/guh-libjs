
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
    .module('guh.logging.hooks', [])
    .config(config);

  config.$inject = [];

  function config() {}

}());
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
    .provider('guhLoggingBroadcastHook', guhLoggingBroadcastHook);

  function guhLoggingBroadcastHook() {

    var provider = {
      // Provider methods (needed)
      $get: ['$rootScope', $get]
    };

    return provider;


    function $get($rootScope) {
      return function(logObject) {
        var type = logObject.type ? logObject.type : null;
        var argsArray = logObject.args ? [].slice.call(logObject.args) : null;

        if(angular.isArray(argsArray)) {
          switch(argsArray.length) {
            case 1:
              if(!angular.isString(argsArray[0])) {
                $rootScope.$broadcast('notification', {
                  type: type,
                  args: argsArray[0]
                });
              }
              break;
            case 2:
              $rootScope.$broadcast('notification', {
                type: type,
                context: argsArray[0],
                args: argsArray[1]
              });
              break;
            default:
              console.log('Wrong number of arguments.', logObject.type, logObject.args, argsArray.length);
          }
        }
      }
    }
  }

}());

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
    .module('guh.models', [
      // Datastore
      'js-data'
    ])
    .config(config);

  config.$inject = ['DSHttpAdapterProvider', 'DSProvider', 'app'];

  function config(DSHttpAdapterProvider, DSProvider, app) {
    DSHttpAdapterProvider
      .defaults
      .log = false;

    DSHttpAdapterProvider
      .defaults
      .deserialize = function deserialize(resourceConfig, data) {
        return data ? ('data' in data ? data.data : data) : data;
      };


    DSProvider
      .defaults
      .basePath = app.apiUrl;

    DSProvider
      .defaults
      .debug = false;
  }

}());
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
    .factory('DSVendor', DSVendorFactory)
    .run(function(DSVendor) {});

  DSVendorFactory.$inject = ['$log', '$q', 'DS', 'websocketService'];

  function DSVendorFactory($log, $q, DS, websocketService) {
    
    var staticMethods = {};

    /*
     * DataStore configuration
     */
    var DSVendor = DS.defineResource({

      // API configuration
      endpoint: 'vendors',

      // Model configuration
      idAttribute: 'id',
      name: 'vendor',
      relations: {
        hasMany: {
          deviceClass: {
            localField: 'deviceClasses',
            foreignKey: 'vendorId'
          }
        }
      },

      // Computed properties
      computed: {},

      // Instance methods
      methods: {}

    });

    angular.extend(DSVendor, {
      load: load
    });

    return DSVendor;


    function load() {
      return websocketService
        .send({
          method: 'Devices.GetSupportedVendors'
        })
        .then(function(data) {
          DSVendor.inject(data.vendors);
          return DSVendor.getAll();
        });
    }

  }

}());
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
    .factory('DSStateType', DSStateTypeFactory)
    .run(function(DSStateType) {});

  DSStateTypeFactory.$inject = ['$log', 'DS', 'modelsHelper'];

  function DSStateTypeFactory($log, DS, modelsHelper) {
    
    var staticMethods = {};

    /*
     * DataStore configuration
     */
    var DSStateType = DS.defineResource({

      // API configuration
      endpoint: 'statetypes',

      // Model configuration
      idAttribute: 'id',
      name: 'stateType',
      relations: {
        // belongsTo: {
        //   deviceClass: {
        //     localField: 'deviceClass',
        //     localKey: 'deviceClassId',
        //     parent: true
        //   }
        // }
        hasMany: {
          deviceClassStateType: {
            localField: 'deviceClassStateTypes',
            foreignKey: 'stateTypeId'
          },
        }
      },

      // Computed properties
      computed: {},

      // Instance methods
      methods: {},

      // Lifecycle hooks
      afterInject: function(resource, attrs) {
        if(angular.isArray(attrs)) {
          var arrayOfAttrs = attrs;
          angular.forEach(arrayOfAttrs, function(attrs) {
            _addUiData(resource, attrs);
          });
        } else {
          _addUiData(resource, attrs);
        }
      }

    });

    return DSStateType;


    /*
     * Private method: _addUiData(resource, attrs)
     */
    function _addUiData(resource, attrs) {
      // var paramTypes = attrs.paramTypes;
      var regExp = /\s\[([^)]+)\]/;                 // Value inside brackets []
      var searchUnit = name.replace(regExp, '');    // Get value inside brackets
      var phrase = attrs.name;

      // If name contains the unit in brackets []
      if(regExp.test(name)) {
        phrase = searchUnit;
      }

      // phrase
      attrs.phrase = 'When value of ' + phrase;

      // Add templateUrl to stateType
      attrs = modelsHelper.addUiData(attrs);
    }

  }

}());
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
    .factory('DSState', DSStateFactory)
    .run(function(DSState) {});

  DSStateFactory.$inject = ['$log', '$q', 'DS', 'websocketService'];

  function DSStateFactory($log, $q, DS, websocketService) {
    
    var staticMethods = {};

    /*
     * DataStore configuration
     */
    var DSState = DS.defineResource({

      // API configuration
      endpoint: 'states',

      // Model configuration
      // idAttribute: 'stateTypeId',
      idAttribute: 'compoundId',
      name: 'state',
      relations: {
        belongsTo: {
          device: {
            localField: 'device',
            localKey: 'deviceId',
            parent: true
          }
        },
        hasOne: {
          stateType: {
            localField: 'stateType',
            localKey: 'stateTypeId'
          }
        }
      },

      // Computed properties
      computed: {
        compoundId: ['deviceId', 'stateTypeId', 'value', function (deviceId, stateTypeId, value) {
          return '' + deviceId + '_' + stateTypeId;
        }]
      },

      // Instance methods
      methods: {}

    });

    angular.extend(DSState, {
      load: load
    });

    return DSState;


    function load(deviceId) {
      return websocketService
        .send({
          method: 'Devices.GetStateValues',
          params: {
            deviceId: deviceId
          }
        })
        .then(function(data) {
          var states = data.values.map(function(state) {
            state.deviceId = deviceId;
            return state;
          });
          DSState.inject(states);
          return DSState.getAll();
        });
    }

  }

}());
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
    .factory('DSRule', DSRuleFactory)
    .run(function(DSRule) {});

  DSRuleFactory.$inject = ['$log', '$q', 'app', 'DS', 'websocketService'];

  function DSRuleFactory($log, $q, app, DS, websocketService) {
    
    var staticMethods = {};

    /*
     * DataStore configuration
     */
    var DSRule = DS.defineResource({

      // API configuration
      endpoint: 'rules',

      // Model configuration
      idAttribute: 'id',
      name: 'rule',
      relations: {},

      // Computed properties
      computed: {},

      // Instance methods
      methods: {
        // API
        executeActions: executeActions,
        executeExitActions: executeExitActions,
        remove: remove
      }

    });

    angular.extend(DSRule, {
      load: load,
      add: add
    });

    return DSRule;


    function _loadDetails(ruleDescription) {
      return websocketService
        .send({
          method: 'Rules.GetRuleDetails',
          params: {
            ruleId: ruleDescription.id
          }
        });
    }

    function load() {
      return websocketService
        .send({
          method: 'Rules.GetRules'
        })
        .then(function(data) {
          return $q.all(data.ruleDescriptions.map(function(ruleDescription) {
            return _loadDetails(ruleDescription)
              .then(function(data) {
                DSRule.inject(data.rule);
                return data.rule;
              });
          }));
        })
        .then(function(rules) {
          return DSRule.getAll();
        });
    }

    function add(rule) {
      return websocketService.send({
        method: 'Rules.AddRule',
        params: rule
      });
    }

    /*
     * Public method: executeActions()
     */
    function executeActions() {
      /* jshint validthis: true */
      var self = this;

      return websocketService.send({
        method: 'Rules.ExecuteActions',
        params: {
          ruleId: self.id
        }
      });
    }

    /*
     * Public method: executeExitActions()
     */
    function executeExitActions() {
      /* jshint validthis: true */
      var self = this;

      return websocketService.send({
        method: 'Rules.ExecuteExitActions',
        params: {
          ruleId: self.id
        }
      });
    }

    /*
     * Public method: remove()
     */
    function remove() {
      /* jshint validthis: true */
      var self = this;

      return websocketService.send({
        method: 'Rules.RemoveRule',
        params: {
          ruleId: self.id
        }
      });
    }


  }

}());
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
    .factory('DSPlugin', DSPluginFactory)
    .run(function(DSPlugin) {});

  DSPluginFactory.$inject = ['$log', '$q', 'DS', 'websocketService'];

  function DSPluginFactory($log, $q, DS, websocketService) {
    
    var staticMethods = {};

    /*
     * DataStore configuration
     */
    var DSPlugin = DS.defineResource({

      // API configuration
      endpoint: 'plugins',

      // Model configuration
      idAttribute: 'id',
      name: 'plugin',
      relations: {},

      // Computed properties
      computed: {},

      // Instance methods
      methods: {}

    });

    angular.extend(DSPlugin, {
      load: load
    });

    return DSPlugin;


    function load() {
      return websocketService
        .send({
          method: 'Devices.GetPlugins'
        })
        .then(function(data) {
          DSPlugin.inject(data.plugins);
          return DSPlugin.getAll();
        });
    }

  }

}());
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
    .factory('DSParamType', DSParamTypeFactory)
    .run(function(DSParamType) {});

  DSParamTypeFactory.$inject = ['$log', 'DS'];

  function DSParamTypeFactory($log, DS) {
    
    var staticMethods = {};

    /*
     * DataStore configuration
     */
    var DSParamType = DS.defineResource({

      // Model configuration
      name: 'paramType',
      relations: {
        belongsTo: {
          deviceClass: {
            localField: 'deviceClass',
            localKey: 'deviceClassId'
          }
        }
      },

      // Computed properties
      computed: {},

      // Instance methods
      methods: {}

    });

    return DSParamType;

  }

}());
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
    .factory('modelsHelper', modelsHelper);

  modelsHelper.$inject = ['$log', '$q', 'DS', 'File', 'app'];

  function modelsHelper($log, $q, DS, File, app) {

    var modelsHelper = {
      addUiData: addUiData,
      checkTemplateUrl: checkTemplateUrl,
      setBasePath: setBasePath
    };

    return modelsHelper;


    /*
     * Private method: _getInputPath(directiveName, filename)
     */
    function _getInputPath(folderName, directiveName, filename) {
      if(directiveName) {
        return app.basePaths.ui + folderName + '/' + directiveName + '-templates/' + filename + app.fileExtensions.html;
      } else {
        return app.basePaths.ui + folderName + '/templates/' + filename + app.fileExtensions.html;
      }
    }

    /*
     * Private method: _getActionTemplates(actionType)
     */
    function _getActionTemplate(actionType) {
      var paramTypes = (actionType.paramTypes === undefined) ? null : actionType.paramTypes;
      var folderName = 'form';
      var directiveName = 'form-field';

      if(angular.isArray(paramTypes)) {
        if(paramTypes.length === 0) {
          actionType.templateUrl = _getInputPath(folderName, directiveName, directiveName + '-button');
        } else {
          actionType.templateUrl = undefined;
        }
        // if(paramTypes.length <= 0) {
        //   // ActionType
        //   actionType.templateUrl = _getInputPath(folderName, directiveName, directiveName + '-default');
        // } else if(paramTypes.length === 1) {
        //   // ActionType
        //   actionType.templateUrl = _getInputPath(folderName, directiveName, directiveName + '-default');

        //   // ParamType
        //   // paramTypes[0].templateUrl = _getInputTemplate(paramTypes[0], true);
        // } else if(paramTypes.length > 1) {
        //   // ActionType
        //   actionType.templateUrl = _getInputPath(folderName, directiveName, directiveName + '-execute');

        //   // ParamTypes
        //   // angular.forEach(paramTypes, function(paramType, index) {
        //   //   actionType.paramTypes[index].templateUrl = _getInputTemplate(paramType, true);
        //   // });
        // }
      } else {
        $log.warn('guh.models.modelsHelper | The property paramTypes is not of type Array.', guhType);
      }
    }

    /*
     * Private method: _getInputTemplate(guhType, isChildOfActionType)
     * guhType can be of type: ParamType, StateType
     */
    function _getInputTemplate(guhType, isChildOfActionType) {
      var allowedValues = (guhType.allowedValues === undefined) ? null : guhType.allowedValues;
      var possibleValues = (guhType.possibleValues === undefined) ? null : guhType.possibleValues;
      var inputType = (guhType.inputType === undefined) ? null : guhType.inputType;
      var type = (guhType.type === undefined) ? null : guhType.type;
      var folderName = 'form';
      var directiveName = 'form-field';
      var template;

      switch(type) {
        case 'Bool':
          if(isChildOfActionType) {
            template = _getInputPath(folderName, directiveName, directiveName + '-toggle-button');
          } else {
            template = _getInputPath(folderName, directiveName, directiveName + '-checkbox');
          }
          break;
        case 'Int':
        case 'Uint':
          if(isChildOfActionType) {
            template = _getInputPath(folderName, directiveName, directiveName + '-range');
          } else {
            template = _getInputPath(folderName, directiveName, directiveName + '-number-integer');
          }
          break;
        case 'Double':
          if(isChildOfActionType) {
            template = _getInputPath(folderName, directiveName, directiveName + '-range');
          } else {
            template = _getInputPath(folderName, directiveName, directiveName + '-number-decimal');
          }
          break;
        case 'Color':
          template = _getInputPath(folderName, directiveName, directiveName + '-color');
          break;
        case 'String':
          if(allowedValues || possibleValues) {
            if(isChildOfActionType) {
              template = _getInputPath(folderName, directiveName, directiveName + '-select');
            } else {
              template = _getInputPath(folderName, directiveName, directiveName + '-select');
            }
          } else if(inputType) {
            template = _getInputPath(folderName, directiveName, directiveName + app.inputTypes[inputType]);
          } else {
            template = _getInputPath(folderName, directiveName, directiveName + '-text');
          }
          break;
        default:
          template = _getInputPath(folderName, directiveName, 'template-not-available');
          // template = null;
      }

      return template;
    }

    /*
     * Private method: _getValue(guhType)
     */
    function _getValue(guhType) {
      var type = (guhType.type === undefined) ? null : guhType.type;
      var value;

      switch(type) {
        case 'Bool':
          value = guhType.defaultValue || false;
          break;
        case 'Int':
        case 'Uint':
          value = guhType.defaultValue || 0;
          break;
        case 'Double':
          value = guhType.defaultValue || 0.0;
          break;
        case 'Color':
          value = guhType.defaultValue || '0,0,0';
          break;
        case 'String':
          value = guhType.defaultValue || '';
          break;
        default:
          value = guhType.defaultValue || undefined;
          break;
      }

      return value;
    }


    /*
     * Public method: addUiData(guhType)
     * guhType can be of type: ActionType, StateType, ParamType
     */
    function addUiData(guhType, isChildOfActionType) {
      var type;

      if(DS.is('actionType', guhType)) {
        guhType.actionTemplateUrl = _getActionTemplate(guhType);
        type = 'actionType';
        // _setActionTemplates(guhType);
      } else if(DS.is('stateType', guhType)) {
        isChildOfActionType = false;
        guhType.inputTemplateUrl = _getInputTemplate(guhType, isChildOfActionType);
        // guhType.operator = app.valueOperator.is.operators[0];
        // guhType.value = _getValue(guhType);
        type = 'stateType';
        // guhType.templateUrl = _getInputTemplate(guhType);
      } else {
        guhType.inputTemplateUrl = _getInputTemplate(guhType, isChildOfActionType);
        // guhType.value = _getValue(guhType);
        type = 'paramType';
        // guhType.templateUrl = _getInputTemplate(guhType);
      }

      // $log.log('Template of ' + type + ' [' + guhType.name + ' / ' + guhType.type + ']: ', guhType.templateUrl);

      return guhType;
    }

    /*
     * Public method: checkTemplateUrl(templateUrl)
     */
    function checkTemplateUrl(templateUrl) {
      var pathElements = templateUrl.split('/');
      var file = pathElements.pop();
      var path = pathElements.join('/') + '/';

      if(templateUrl !== undefined && templateUrl !== '') {
        var fileExists = $q.when(File.checkFile(path, file))
          .then(function(fileExists) {
            if(fileExists) {
              // $log.log('Template available', templateUrl);
              return templateUrl;
            } else {
              // $log.warn('Template NOT available', templateUrl);
              return path + 'template-not-available.html'; 
            }
          });

        return fileExists;
      } else {
        return path + 'template-not-defined.html';
      }
    }

    /*
     * Public method: setBasePath()
     */
    function setBasePath() {      
      DS
        .defaults
        .basePath = app.apiUrl;
    }

  }

}());
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
    .factory('DSEventType', DSEventTypeFactory)
    .run(function(DSEventType) {});

  DSEventTypeFactory.$inject = ['$log', 'DS', 'modelsHelper'];

  function DSEventTypeFactory($log, DS, modelsHelper) {
    
    var staticMethods = {};

    /*
     * DataStore configuration
     */
    var DSEventType = DS.defineResource({

      // API configuration
      endpoint: 'eventtypes',

      // Model configuration
      idAttribute: 'id',
      name: 'eventType',
      relations: {
        belongsTo: {
          deviceClass: {
            localField: 'deviceClass',
            localKey: 'deviceClassId',
            parent: true
          }
        }
      },

      // Computed properties
      computed: {},

      // Instance methods
      methods: {
        getParamDescriptor: getParamDescriptor
      },

      // Lifecycle hooks
      afterInject: function(resource, attrs) {
        if(angular.isArray(attrs)) {
          var arrayOfAttrs = attrs;
          angular.forEach(arrayOfAttrs, function(attrs) {
            _addUiData(resource, attrs);
          });
        } else {
          _addUiData(resource, attrs);
        }
      }

    });

    return DSEventType;


    /*
     * Private method: _addUiData(resource, attrs)
     */
    function _addUiData(resource, attrs) {
      var paramTypes = attrs.paramTypes;
      var phrase = 'When ' + attrs.name;

      // Add phrase for moods
      if(angular.isArray(paramTypes) && paramTypes.length === 0) {
        attrs.phrase = phrase + ' is detected';
      } else {
        attrs.phrase = phrase + ' is detected and parameters are';
      }

      // Add templateUrl to paramTypes
      angular.forEach(paramTypes, function(paramType) {
        paramType = modelsHelper.addUiData(paramType);
      });
    }


    /*
     * Public method: getParamDescriptors(paramType, value, operator)
     */
    function getParamDescriptor(paramType, value, operator) {
      var paramDescriptor = {};

      paramDescriptor = {
        name: paramType.name,
        operator: operator,
        value: value
      };

      return paramDescriptor;
    }

  }

}());
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
    .factory('DSDevice', DSDeviceFactory)
    .run(function(DSDevice) {});

  DSDeviceFactory.$inject = ['$log', '$q', 'DS', 'libs', 'app', 'websocketService'];

  function DSDeviceFactory($log, $q, DS, libs, app, websocketService) {
    
    var staticMethods = {};

    /*
     * DataStore configuration
     */
    var DSDevice = DS.defineResource({

      // API configuration
      endpoint: 'devices',

      // Model configuration
      idAttribute: 'id',
      name: 'device',
      relations: {
        belongsTo: {
          deviceClass: {
            localField: 'deviceClass',
            localKey: 'deviceClassId'
          }
        }

        // Not working (error: "Doh! You just changed the primary key of an object!") because states are injected before the state primary keys are generated
        // hasMany: {
        //   state: {
        //     localField: 'states',
        //     foreignKey: 'deviceId'
        //   }
        // }
      },

      // Computed properties
      computed: {},

      // Instance methods
      methods: {
        executeAction: executeAction,
        remove: remove,
        getDescription: getDescription,
        getEventDescriptor: getEventDescriptor,
        getStateDescriptor: getStateDescriptor,
        getAction: getAction
      },

      // Lifecycle hooks
      afterInject: function(resource, attrs) {
        if(angular.isArray(attrs)) {
          var arrayOfAttrs = attrs;
          angular.forEach(arrayOfAttrs, function(attrs) {
            _createStates(resource, attrs);
          });
        } else {
          _createStates(resource, attrs);
        }
      },

      afterEject: function(resource, attrs) {
        if(angular.isArray(attrs)) {
          var arrayOfAttrs = attrs;
          angular.forEach(arrayOfAttrs, function(attrs) {
            _removeStates(resource, attrs);
          });
        } else {
          _removeStates(resource, attrs);
        }
      }

    });

    angular.extend(DSDevice, {
      load: load,
      add: add,
      edit: edit,
      pair: pair,
      confirmPairing: confirmPairing
    });

    return DSDevice;
    

    /*
     * Private method: _createStates(resource, attrs);
     */
    function _createStates(resource, attrs) {
      var deviceId = attrs.id;
      var states = attrs.states;

      angular.forEach(states, function(state, index) {
        state.deviceId = deviceId;

        var stateInstance = DS.createInstance('state', state);
        DS.inject('state', stateInstance);

        if(angular.isUndefined(attrs.states)) {
          attrs.states = [];
        }
        attrs.states[index] = DS.get('state', '' + deviceId + '_' + state.stateTypeId);
      });
    }

    /*
     * Private method: _removeStates(resource, attrs)
     */
    function _removeStates(resource, attrs) {
      var deviceId = attrs.id;
      var states = attrs.states;

      angular.forEach(states, function(state, index) {
        var ejectedItem = DS.eject('state', '' + deviceId + '_' + state.stateTypeId);
        $log.log('ejected state', ejectedItem);
      });
    }


    function load() {
      return websocketService
        .send({
          method: 'Devices.GetConfiguredDevices'
        })
        .then(function(data) {
          DSDevice.inject(data.devices);
          return DSDevice.getAll();
        });
    }

    /*
     * Public method: getDescription(delimiter)
     */
    function getDescription(delimiter) {
      /* jshint validthis: true */
      var self = this;
      var vendorName = self.deviceClass.vendor.name;
      var deviceClassName = self.deviceClass.name || '';

      delimiter = delimiter || '-';

      return (vendorName === deviceClassName) ? deviceClassName : (vendorName + delimiter + deviceClassName);
    }

    /*
     * Public method: pair(deviceClassId, deviceDescriptorId, deviceParams, name)
     */
    function pair(deviceClassId, deviceDescriptorId, deviceParams, name) {
      var params = {};

      params.deviceClassId = deviceClassId || '';

      if(angular.isDefined(deviceDescriptorId) && deviceDescriptorId !== '') {
        params.deviceDescriptorId = deviceDescriptorId;
      } else {
        params.deviceParams = deviceParams || [];
      }

      if(angular.isDefined(name)) {
        params.name = name;
      }

      return websocketService.send({
        method: 'Devices.PairDevice',
        params: params
      });
    }

    /*
     * Public method: confirmPairing(pairingTransactionId, secret)
     */
    function confirmPairing(pairingTransactionId, secret) {
      var params = {};
      
      params.pairingTransactionId = pairingTransactionId;

      if(secret) {
        params.secret = secret;
      }

      return websocketService.send({
        method: 'Devices.ConfirmPairing',
        params: params
      }); 
    }

    /*
     * Public method: add(deviceClassId, deviceDescriptorId, deviceParams, name)
     */
    function add(deviceClassId, deviceDescriptorId, deviceParams, name) {
      var params = {};

      // name
      if(angular.isDefined(name) && name !== '') {
        params.name = name;
      }

      // deviceClassId
      if(angular.isDefined(deviceClassId) && deviceClassId  !== '') {
        params.deviceClassId = deviceClassId;
      }

      // deviceDescriptorId or deviceParams
      if(angular.isDefined(deviceDescriptorId) && deviceDescriptorId !== '') {
        params.deviceDescriptorId = deviceDescriptorId;
      } else if(angular.isDefined(deviceParams) && deviceParams !== []) {
        params.deviceParams = deviceParams;
      }

      // Device gets inserted when notification "Devices.DeviceAdded" was received
      return websocketService.send({
        method: 'Devices.AddConfiguredDevice',
        params: params
      });
    }

    /*
     * Public method: edit(deviceId, deviceData)
     */
    function edit(deviceId, deviceData) {
      var device = {};
      deviceData = deviceData || {};

      device.deviceDescriptorId = deviceData.id || '';

      device.deviceParams = [];
      angular.forEach(deviceData.deviceParamTypes, function(deviceParamType) {
        var deviceParam = {};

        deviceParam.name = deviceParamType.name;
        deviceParam.value = deviceParamType.value;

        device.deviceParams.push(deviceParam);
      });

      return DSDevice.update(deviceId, {device: device});
    }

    /*
     * Public method: executeAction()
     */
    function executeAction(actionType, params) {
      /* jshint validthis: true */
      var self = this;
      var jsonRpcParams = {
        actionTypeId: actionType.id,
        deviceId: self.id
      };

      if(angular.isDefined(params) && params !== {}) {
        jsonRpcParams.params = params;
      }

      return websocketService.send({
        method: 'Actions.ExecuteAction',
        params: jsonRpcParams
      });
    }

    /*
     * Public method: remove()
     */
    function remove(params) {
      /* jshint validthis: true */
      var self = this;
      var jsonRpcParams = {
        deviceId: self.id
      };

      if(angular.isDefined(params) && params !== {}) {
        jsonRpcParams.params = params;
      }

      return websocketService.send({
        method: 'Devices.RemoveConfiguredDevice',
        params: jsonRpcParams
      });
    }

    /*
     * Public method: getEventDescriptor(eventType, paramDescriptors)
     */
    function getEventDescriptor(eventType, paramDescriptors) {
      /* jshint validthis: true */
      var self = this;
      var eventDescriptor = {};

      eventDescriptor.deviceId = self.id;
      eventDescriptor.eventTypeId = eventType.id;

      if(angular.isDefined(paramDescriptors) && paramDescriptors.length > 0) {
        eventDescriptor.paramDescriptors = paramDescriptors;
      }

      return eventDescriptor;     
    }

    /*
     * Public method: getStateDescriptor(stateType, paramDescriptor)
     */
    function getStateDescriptor(stateType, paramDescriptor) {
      /* jshint validthis: true */
      var self = this;
      var stateDescriptor = {};

      stateDescriptor.deviceId = self.id;
      stateDescriptor.operator = paramDescriptor.operator;
      stateDescriptor.stateTypeId = stateType.id;
      stateDescriptor.value = paramDescriptor.value;
      
      return stateDescriptor;
    }


    /*
     * Public method: getAction(actionType, params)
     */
    function getAction(actionType, params) {
      /* jshint validthis: true */
      var self = this;
      var action = {};
      var ruleActionParams = [];

      ruleActionParams = actionType.getRuleActionParams(params);
      if(ruleActionParams.length > 0) {
        action.ruleActionParams = ruleActionParams;
      }

      action.actionTypeId = actionType.id;
      action.deviceId = self.id;

      return action;
    }

  }

}());
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
    .factory('DSDeviceClassStateType', DSDeviceClassStateTypeFactory)
    .run(function(DSDeviceClassStateType) {});

  DSDeviceClassStateTypeFactory.$inject = ['$log', 'DS', 'modelsHelper'];

  function DSDeviceClassStateTypeFactory($log, DS, modelsHelper) {
    
    var staticMethods = {};

    /*
     * DataStore configuration
     */
    var DSDeviceClassStateType = DS.defineResource({

      // Model configuration
      name: 'deviceClassStateType',
      relations: {
        belongsTo: {
          deviceClass: {
            localField: 'deviceClass',
            localKey: 'deviceClassId'
          },
          stateType: {
            localField: 'stateType',
            localKey: 'stateTypeId'
          }
        }
      }

    });

    return DSDeviceClassStateType;

  }

}());
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

      if(classType === 'device' || classType === 'gateway') {
        return app.basePaths.devices + 'detail/device-class-templates/' + filename + app.fileExtensions.html;
      } else if(classType === 'service' || classType === 'dev-service') {
        return app.basePaths.services + 'detail/device-class-templates/' + filename + app.fileExtensions.html;
      } else {
        return '';
      }
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
          discoveryParams: angular.toJson(discoveryParams)
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
    .factory('DSDeviceClassEventType', DSDeviceClassEventTypeFactory)
    .run(function(DSDeviceClassEventType) {});

  DSDeviceClassEventTypeFactory.$inject = ['$log', 'DS', 'modelsHelper'];

  function DSDeviceClassEventTypeFactory($log, DS, modelsHelper) {
    
    var staticMethods = {};

    /*
     * DataStore configuration
     */
    var DSDeviceClassEventType = DS.defineResource({

      // Model configuration
      name: 'deviceClassEventType',
      relations: {
        belongsTo: {
          deviceClass: {
            localField: 'deviceClass',
            localKey: 'deviceClassId'
          },
          eventType: {
            localField: 'eventType',
            localKey: 'eventTypeId'
          }
        }
      }

    });

    return DSDeviceClassEventType;

  }

}());
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
    .factory('DSDeviceClassActionType', DSDeviceClassActionTypeFactory)
    .run(function(DSDeviceClassActionType) {});

  DSDeviceClassActionTypeFactory.$inject = ['$log', 'DS', 'modelsHelper'];

  function DSDeviceClassActionTypeFactory($log, DS, modelsHelper) {
    
    var staticMethods = {};

    /*
     * DataStore configuration
     */
    var DSDeviceClassActionType = DS.defineResource({

      // Model configuration
      name: 'deviceClassActionType',
      relations: {
        belongsTo: {
          deviceClass: {
            localField: 'deviceClass',
            localKey: 'deviceClassId'
          },
          actionType: {
            localField: 'actionType',
            localKey: 'actionTypeId'
          }
        }
      }

    });

    return DSDeviceClassActionType;

  }

}());
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
    .factory('DSActionType', DSActionTypeFactory)
    .run(function(DSActionType) {});

  DSActionTypeFactory.$inject = ['$log', 'DS', 'modelsHelper'];

  function DSActionTypeFactory($log, DS, modelsHelper) {
    
    var staticMethods = {};

    /*
     * DataStore configuration
     */
    var DSActionType = DS.defineResource({

      // API configuration
      endpoint: 'actiontypes',

      // Model configuration
      idAttribute: 'id',
      name: 'actionType',
      relations: {
        // belongsTo: {
        //   deviceClass: {
        //     localField: 'deviceClass',
        //     localKey: 'deviceClassId',
        //     parent: true
        //   }
        // },
        hasMany: {
          deviceClassActionType: {
            localField: 'deviceClassActionTypes',
            foreignKey: 'actionTypeId'
          },
        }
      },

      // Computed properties
      computed: {},

      // Instance methods
      methods: {
        getParams: getParams,
        getRuleActionParams: getRuleActionParams
      },

      // Lifecycle hooks
      afterInject: function(resource, attrs) {
        if(angular.isArray(attrs)) {
          var arrayOfAttrs = attrs;
          angular.forEach(arrayOfAttrs, function(attrs) {
            _addUiData(resource, attrs);
          });
        } else {
          _addUiData(resource, attrs);
        }
      }

    });

    return DSActionType;


    /*
     * Private method: _addUiData(resource, attrs)
     */
    function _addUiData(resource, attrs) {
      var paramTypes = attrs.paramTypes;
      
      attrs.phrase = 'Execute "' + attrs.name + '"';

      // Add phrase for moods
      if(angular.isArray(paramTypes) && paramTypes.length > 0) {
        attrs.phrase = attrs.phrase + ' with parameters';
      }

      // Add templateUrl to paramTypes
      var isChildOfActionType = true;
      angular.forEach(paramTypes, function(paramType) {
        paramType = modelsHelper.addUiData(paramType, isChildOfActionType);
        // paramType.dependsOnTrigger = false;
      });

      // Add templateUrl to actionType & paramTypes
      attrs = modelsHelper.addUiData(attrs);
    }


    /*
     * Public method: getParams()
     */
    function getParams() {
      /* jshint validthis: true */
      var self = this;
      var params = [];
      var paramTypes = self.paramTypes;

      angular.forEach(paramTypes, function(paramType) {
        params.push({
          name: paramType.name,
          value: paramType.value
        });
      });

      return params;
    }

    /*
     * Public method: getRuleActionParams(params, actionParamType, eventParamType)
     */
    function getRuleActionParams(params, actionParamType, eventParamType) {
      /* jshint validthis: true */
      var self = this;
      var ruleActionParams = [];

      angular.forEach(params, function(param) {
        if(actionParamType !== undefined && eventParamType !== undefined) {
          if(param.name === actionParamType.name) {
            ruleActionParams.push({
              name: param.name,
              eventParamName: eventParamType.name,
              eventTypeId: eventParamType.eventDescriptor.eventTypeId
            });
          } else {
            ruleActionParams.push({
              name: param.name,
              value: param.value
            });
          }
        } else {
          ruleActionParams.push({
            name: param.name,
            value: param.value
          });
        }
      });

      return ruleActionParams;
    }

  }

}());
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
    .module('guh.api', [])
    .config(config);

  config.$inject = [];

  function config() {}

}());
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

  websocketService.$inject = ['$log', '$rootScope', '$q', 'libs', 'app', 'DS'];

  function websocketService($log, $rootScope, $q, libs, app, DS) {

    var ws = null;
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

              $log.log('state changed', data);

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
                var injectedItem = DS.inject('device', data.params.device);

                // Send broadcast event
                if(DS.is('device', injectedItem)) {
                  $rootScope.$broadcast('ReloadView', injectedItem.deviceClass.name + ' was added.');
                }          
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

            // Rules.ConfigurationChanged
            case app.notificationTypes.rules.ruleConfigurationChanged:
              var rule = data.params.rule;
              var injectedItem = DS.inject('rule', rule);

              // Send broadcast event
              if(DS.is('rule', injectedItem)) {
                $rootScope.$broadcast('ReloadView', injectedItem.name + ' was updated.');
              }

              break;

            // Rules.RuleAdded
            case app.notificationTypes.rules.ruleAdded:
              var ruleId = data.params.rule.id;
              var rule = DS.get('rule', ruleId);

              if(angular.isUndefined(rule)) {
                var injectedItem = DS.inject('rule', data.params.rule);

                // Send broadcast event
                if(DS.is('rule', injectedItem)) {
                  $rootScope.$broadcast('ReloadView', injectedItem.name + ' was added.');
                }
              }

              break;

            // Rules.RuleRemoved
            case app.notificationTypes.rules.ruleRemoved:
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

        } else if(angular.isDefined(data.authenticationRequired)) {
          $rootScope.$apply(function() {
            $rootScope.$broadcast('InitialHandshake', data);
          });
        } else if(callbacks.hasOwnProperty(data.id)) {
          if(data.status === 'success') {
            if(angular.isDefined(data.params.deviceError) && data.params.deviceError !== 'DeviceErrorNoError') {
              $rootScope.$apply(callbacks[data.id].callback.reject(data.params.deviceError));
            } else if(angular.isDefined(data.params.loggingError) && data.params.loggingError !== 'LoggingErrorNoError') {
              $rootScope.$apply(callbacks[data.id].callback.reject(data.params.loggingError));
            } else if(angular.isDefined(data.params.ruleError) && data.params.ruleError !== 'RuleErrorNoError') {
              $rootScope.$apply(callbacks[data.id].callback.reject(data.params.ruleError));
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
     * Public method: reconnect()
     */
    function reconnect() {
      websocketService.close();
      websocketService.connect();
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

      ws.send(angular.toJson(request));

      return defer.promise;
    }

  }

}());