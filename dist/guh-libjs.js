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
      }


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

  DSVendorFactory.$inject = ['$log', 'DS'];

  function DSVendorFactory($log, DS) {
    
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

    return DSVendor;

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

  DSStateFactory.$inject = ['$log', 'DS'];

  function DSStateFactory($log, DS) {
    
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

    return DSState;

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

  DSRuleFactory.$inject = ['$log', 'DS'];

  function DSRuleFactory($log, DS) {
    
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
        remove: remove
      }

    });

    return DSRule;


    /*
     * Public method: remove()
     */
    function remove() {
      /* jshint validthis: true */
      var self = this;

      return DSRule.destroy(self.id);
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
      var inputType = (guhType.inputType === undefined) ? null : guhType.inputType;
      var type = (guhType.type === undefined) ? null : guhType.type;
      var folderName = 'form';
      var directiveName = 'form-field';
      var template;

      switch(type) {
        case 'bool':
          if(isChildOfActionType) {
            template = _getInputPath(folderName, directiveName, directiveName + '-toggle-button');
          } else {
            template = _getInputPath(folderName, directiveName, directiveName + '-checkbox');
          }
          break;
        case 'int':
        case 'uint':
          if(isChildOfActionType) {
            template = _getInputPath(folderName, directiveName, directiveName + '-range');
          } else {
            template = _getInputPath(folderName, directiveName, directiveName + '-number-integer');
          }
          break;
        case 'double':
          if(isChildOfActionType) {
            template = _getInputPath(folderName, directiveName, directiveName + '-range');
          } else {
            template = _getInputPath(folderName, directiveName, directiveName + '-number-decimal');
          }
          break;
        case 'QColor':
          template = _getInputPath(folderName, directiveName, directiveName + '-color');
          break;
        case 'QString':
          if(allowedValues) {
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
        case 'bool':
          value = guhType.defaultValue || false;
          break;
        case 'int':
        case 'uint':
          value = guhType.defaultValue || 0;
          break;
        case 'double':
          value = guhType.defaultValue || 0.0;
          break;
        case 'QColor':
          value = guhType.defaultValue || '0,0,0';
          break;
        case 'QString':
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
    .factory('DSLogs', DSLogsFactory)
    .run(function(DSLogs) {});

  DSLogsFactory.$inject = ['$log', 'DS'];

  function DSLogsFactory($log, DS) {
    
    var staticMethods = {};

    /*
     * DataStore configuration
     */
    var DSLogs = DS.defineResource({

      // API configuration
      endpoint: 'logs',

      // Model configuration
      idAttribute: 'id',
      name: 'logs',
      relations: {},

      // Computed properties
      computed: {},

      // Instance methods
      methods: {}

    });

    return DSLogs;

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

  DSDeviceFactory.$inject = ['$log', 'DS', 'libs', 'app', 'websocketService'];

  function DSDeviceFactory($log, DS, libs, app, websocketService) {
    
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
        // Websocket
        subscribe: subscribe,
        unsubscribe: unsubscribe,
        
        // API
        executeAction: executeAction,
        remove: remove,
        getEventDescriptor: getEventDescriptor,
        getStateDescriptor: getStateDescriptor,
        getAction: getAction
      },

      // Lifecycle hooks
      afterInject: function(resource, attrs) {
        if(angular.isArray(attrs)) {
          var arrayOfAttrs = attrs;
          angular.forEach(arrayOfAttrs, function(attrs) {
            _addCustomName(resource, attrs);
            _createStates(resource, attrs);
          });
        } else {
          _addCustomName(resource, attrs);
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
      add: add,
      edit: edit,
      pair: pair,
      confirmPairing: confirmPairing
    });

    return DSDevice;


    /*
     * Private method: _addCustomName()
     */
    function _addCustomName(resource, attrs) {
      var nameParameter = libs._.find(attrs.params, function(param) { return (param.name === 'name'); });
      attrs.name = (nameParameter === undefined) ? 'Name' : nameParameter.value;
    }

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
      $log.log('_removeStates', resource, attrs);

      var deviceId = attrs.id;
      var states = attrs.states;

      angular.forEach(states, function(state, index) {
        var ejectedItem = DS.eject('state', '' + deviceId + '_' + state.stateTypeId);
        $log.log('ejected state', ejectedItem);
      });
    }

    /*
     * Public method: subscribe(cb)
     */
    function subscribe(cb) {
      /* jshint validthis: true */
      var self = this;

      return websocketService.subscribe(self.id, cb);
    }

    /*
     * Public method: unsubscribe()
     */
    function unsubscribe() {
      /* jshint validthis: true */
      var self = this;

      return websocketService.unsubscribe(self.id);
    }

    /*
     * Public method: pair(deviceClassId, deviceDescriptorId, deviceParams)
     */
    function pair(deviceClassId, deviceDescriptorId, deviceParams) {
      var options = {};

      options.deviceClassId = deviceClassId || '';

      if(angular.isDefined(deviceDescriptorId) && deviceDescriptorId !== '') {
        options.deviceDescriptorId = deviceDescriptorId;
      } else {
        options.deviceParams = deviceParams || [];
      }

      return DS
        .adapters
        .http
        .POST(app.apiUrl + '/devices/pair', options);
    }

    /*
     * Public method: confirmPairing(pairingTransactionId)
     */
    function confirmPairing(pairingTransactionId) {
      var options = {};
      
      options.pairingTransactionId = pairingTransactionId;

      return DS
        .adapters
        .http
        .POST(app.apiUrl + '/devices/confirmpairing', options);      
    }

    /*
     * Public method: add(deviceClassId, deviceDescriptorId, deviceParams)
     */
    function add(deviceClassId, deviceDescriptorId, deviceParams) {
      var device = {};

      // deviceClassId
      if(angular.isDefined(deviceClassId) && deviceClassId  !== '') {
        device.deviceClassId = deviceClassId;
      }

      // deviceDescriptorId or deviceParams
      if(angular.isDefined(deviceDescriptorId) && deviceDescriptorId !== '') {
        device.deviceDescriptorId = deviceDescriptorId;
      } else if(angular.isDefined(deviceParams) && deviceParams !== []) {
        device.deviceParams = deviceParams;
      }

      return DSDevice.create(device, {
        cacheResponse: false
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
      var options = {};

      // options.params = actionType.getParams();
      options.params = params;

      // return DS
      //   .adapters
      //   .http
      //   .POST(app.apiUrl + '/devices/' + self.id + '/actions/' + actionType.id + '/execute.json', options);

      return DS
        .adapters
        .http
        .POST(app.apiUrl + '/devices/' + self.id + '/execute/' + actionType.id, options);
    }

    /*
     * Public method: remove()
     */
    function remove() {
      /* jshint validthis: true */
      var self = this;

      return DSDevice.destroy(self.id);
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
     * Public method: getStateDescriptor(stateType, value, operator)
     */
    function getStateDescriptor(stateType, value, operator) {
      /* jshint validthis: true */
      var self = this;
      var stateDescriptor = {};

      stateDescriptor.deviceId = self.id;
      stateDescriptor.operator = operator;
      stateDescriptor.stateTypeId = stateType.id;
      stateDescriptor.value = value;

      return stateDescriptor;
    }

    /*
     * Public method: getAction(actionType, actionParamType, eventParamType)
     */
    function getAction(actionType, actionParamType, eventParamType) {
      /* jshint validthis: true */
      var self = this;
      var action = {};
      var ruleActionParams = [];

      ruleActionParams = actionType.getRuleActionParams(actionType, actionParamType, eventParamType);
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

  DSDeviceClassFactory.$inject = ['$log', 'DS', 'DSHttpAdapter', 'app', 'libs', 'modelsHelper', 'DSDeviceClassActionType', 'DSDeviceClassStateType'];

  function DSDeviceClassFactory($log, DS, DSHttpAdapter, app, libs, modelsHelper, DSDeviceClassActionType, DSDeviceClassStateType) {
    
    var staticMethods = {};
    var deviceClassActionTypesId = 0;
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
          eventType: {
            localField: 'eventTypes',
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

    return DSDeviceClass;


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
      var actionTypes = attrs.actionTypes;
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

      // StateTypes
      angular.forEach(stateTypes, function(stateType) {
        // Create stateType
        var stateTypeInstance = DS.createInstance('stateType', stateType);
        DS.inject('stateType', stateTypeInstance);

        // Filtered deviceClassStateTypes
        var deviceClassStateTypesFiltered = deviceClassActionTypes.filter(function(deviceClassStateType) {
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
        'Mock Device (Auto created)'
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

      return DSHttpAdapter.GET(app.apiUrl + '/deviceclasses/' + self.id + '/discover?params=' + angular.toJson(discoveryParams));
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
     * Public method: getRuleActionParams(actionType, actionParamType, eventParamType)
     */
    function getRuleActionParams(actionType, actionParamType, eventParamType) {
      /* jshint validthis: true */
      var self = this;
      var ruleActionParams = [];
      var paramTypes = self.paramTypes;

      angular.forEach(paramTypes, function(paramType) {
        if(actionParamType !== undefined && eventParamType !== undefined) {
          if(paramType.name === actionParamType.name) {
            ruleActionParams.push({
              name: paramType.name,
              eventParamName: eventParamType.name,
              eventTypeId: eventParamType.eventDescriptor.eventTypeId
            });
          } else {
            ruleActionParams.push({
              name: paramType.name,
              value: paramType.value
            });
          }
        } else {
          ruleActionParams.push({
            name: paramType.name,
            value: paramType.value
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
    .module('guh.logging', [])
    .config(config);

  config.$inject = ['$provide'];

  function config($provide) {
    $provide.decorator('$exceptionHandler', ['$injector', '$delegate', function($injector, $delegate) {
      return function(exception, cause) {
        console.log('exception', exception, cause);

        var $rootScope = $injector.get('$rootScope');

        $rootScope.$broadcast('HandleError', {
          exception: exception,
          cause: cause
        });

        $delegate(exception, cause);
      };
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

  websocketService.$inject = ['$log', '$rootScope', 'libs', 'app', 'DS', 'DSHttpAdapter'];

  function websocketService($log, $rootScope, libs, app, DS, DSHttpAdapter) {

    var websocketService = {
      // Data
      ws: null,
      callbacks: {},

      // Methods
      close: close,
      connect: connect,
      reconnect: reconnect,
      subscribe: subscribe,
      unsubscribe: unsubscribe
    };

    return websocketService;


    /*
     * Public method: close()
     */
    function close() {
      if(websocketService.ws) {
        websocketService.ws = null;
      }
    }

    /*
     * Public method: connect()
     */
    function connect() {
      $log.log('Connect to websocket.');

      if(websocketService.ws) {
        return;
      }

      var ws = new WebSocket(app.websocketUrl);

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

      ws.onerror = function() {
        $log.error('There was an error with the websocket connection.');

        // Send broadcast event
        $rootScope.$apply(function() {
          $rootScope.$broadcast('WebsocketConnectionError', 'There was an error connecting to guh.');
        });
      };

      ws.onmessage = function(message) {
        $log.log('onmessage', message);
        var data = angular.fromJson(message.data);

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
            $log.log('Device added', data);

            var deviceId = data.params.device.id;
            var device = DS.get('device', deviceId);

            if(angular.isUndefined(device)) {
              var deviceData = data.params.device;

              $log.log('Insert new device.');
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

                  $log.log('injectedItem', injectedItem);

                  // Send broadcast event
                  if(DS.is('device', injectedItem)) {
                    $rootScope.$broadcast('ReloadView', injectedItem.deviceClass.name + ' was added.');
                  }
                });            
            } else {
              $log.log('Device already inserted.');
            }

            break;

          // Devices.DeviceRemoved
          case app.notificationTypes.devices.deviceRemoved:
            $log.log('Device removed', data);

            var deviceId = data.params.deviceId;
            var ejectedItem = DS.eject('device', deviceId);

            if(angular.isDefined(ejectedItem)) {
              // Send broadcast event
              $rootScope.$broadcast('ReloadView', 'Device was removed.');
            } else {
              $log.log('Device not found, removing not possible.')
            }

            break;

          default:
            $log.warn('Type of notification not handled:', data);
        }

        // if(data.notification === app.notificationTypes.devices.stateChanged) {
        //   $log.log('Device state changed.', data);

        //   $log.log('websocketService.callbacks', websocketService.callbacks);
        //   $log.log('data.params.deviceId', data.params.deviceId);

        //   // Execute callback-function with right ID
        //   if(libs._.has(websocketService.callbacks, data.params.deviceId)) {
        //     var cb = websocketService.callbacks[data.params.deviceId];
        //     cb(data);
        //   }
        // } else {
        //   // $log.warn('Type of notification not handled:' + data.notification);
        //   $log.warn('Type of notification not handled:', data);
        // }
      };

      websocketService.ws = ws;
    }

    /*
     * Public method: reconnect()
     */
    function reconnect() {
      websocketService.close();
      websocketService.connect();
    }

    /*
     * Public method: subscribe(id, cb)
     */
    function subscribe(id, cb) {
      $log.log('Subscribe to websocket.');

      if(!websocketService.ws) {
        websocketService.connect();
      }

      websocketService.callbacks[id] = cb;
    }

    /*
     * Public method: unsubscribe(id)
     */
    function unsubscribe(id) {
      $log.log('Unsubscribe from websocket.', id);
      delete websocketService.callbacks[id];
    }

  }

}());