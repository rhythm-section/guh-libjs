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

  config.$inject = ['DSProvider', 'app'];

  function config(DSProvider, app) {
    DSProvider
      .defaults
      .basePath = app.apiUrl;
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
      suffix: '.json',

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
      endpoint: 'state_types',
      suffix: '.json',

      // Model configuration
      idAttribute: 'id',
      name: 'stateType',
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
      var paramTypes = attrs.paramTypes;
      var regExp = /\s\[([^)]+)\]/;                 // Value inside brackets []
      var searchUnit = name.replace(regExp, '');    // Get value inside brackets
      var phrase = attrs.name;

      // If name contains the unit in brackets []
      if(regExp.test(name)) {
        phrase = searchUnit;
      }

      // phrase
      attrs.phrase = 'When value of ' + phrase + ' is';

      // unit
      attrs.unit = modelsHelper.getUnit(attrs.name);

      // paramTypes
      angular.forEach(paramTypes, function(paramType) {
        paramType = modelsHelper.addUiData('input', paramType);
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
      suffix: '.json',

      // Model configuration
      idAttribute: 'stateTypeId',
      name: 'state',
      relations: {
        belongsTo: {
          device: {
            localField: 'device',
            localKey: 'deviceId',
            parent: true
          }
        }
      },

      // Computed properties
      computed: {},

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
      suffix: '.json',

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

  modelsHelper.$inject = ['$log', '$q', '$cordovaFile', 'DS', 'DSParamType', 'File', 'app'];

  function modelsHelper($log, $q, $cordovaFile, DS, DSParamType, File, app) {

    var modelsHelper = {
      addUiData: addUiData,
      checkTemplateUrl: checkTemplateUrl,
      getTemplateUrl: getTemplateUrl,
      getUnit: getUnit,
      setBasePath: setBasePath
    };

    return modelsHelper;


    /*
     * Private method: _getInputPath(directiveName, filename)
     */
    function _getInputPath(directiveName, filename) {
      return app.basePaths.ui + directiveName + '/templates/' + filename + app.fileExtensions.html;
    }

    /*
     * Private method: _getActionTemplate(guhType)
     */
    function _getActionTemplate(guhType) {
      var allowedValues = (guhType.allowedValues === undefined) ? null : guhType.allowedValues;
      var inputType = (guhType.inputType === undefined) ? null : guhType.inputType;
      // var name = (guhType.name === undefined) ? null : guhType.name;
      var type = (guhType.type === undefined) ? null : guhType.type;
      var directiveNameAction = 'action-param';
      var directiveNameInput = 'input';
      var template;

      switch(type) {
        case 'bool':
          template = _getInputPath(directiveNameAction, directiveNameAction + '-toggle-button');
          break;
        case 'int':
        case 'uint':
          template = _getInputPath(directiveNameAction, directiveNameAction + '-slider');
          break;
        case 'double':
          template = _getInputPath(directiveNameAction, directiveNameAction + '-slider');
          break;
        case 'QColor':
          template = _getInputPath(directiveNameAction, directiveNameAction + '-color-picker');
          break;
        case 'QString':
          if(allowedValues) {
            template = _getInputPath(directiveNameInput, directiveNameInput + '-select');
          } else if(inputType) {
            template = _getInputPath(directiveNameInput, directiveNameInput + app.inputTypes[inputType]);
          } else {
            template = _getInputPath(directiveNameInput, directiveNameInput + '-text');
          }
          break;
        default:
          template = _getInputPath(directiveNameAction, 'template-not-available');
      }

      return template;
    }

    /*
     * Private method: _getInputTemplate(guhType)
     */
    function _getInputTemplate(guhType) {
      var allowedValues = (guhType.allowedValues === undefined) ? null : guhType.allowedValues;
      var inputType = (guhType.inputType === undefined) ? null : guhType.inputType;
      // var name = (guhType.name === undefined) ? null : guhType.name;
      var type = (guhType.type === undefined) ? null : guhType.type;
      var directiveName = 'input';
      var template;

      switch(type) {
        case 'bool':
          template = _getInputPath(directiveName, directiveName + '-checkbox');
          break;
        case 'int':
        case 'uint':
          template = _getInputPath(directiveName, directiveName + '-number-integer');
          break;
        case 'double':
          template = _getInputPath(directiveName, directiveName + '-number-decimal');
          break;
        case 'QColor':
          template = _getInputPath(directiveName, directiveName + '-color');
          break;
        case 'QString':
          if(allowedValues) {
            template = _getInputPath(directiveName, directiveName + '-select');
          } else if(inputType) {
            template = _getInputPath(directiveName, directiveName + app.inputTypes[inputType]);
          } else {
            template = _getInputPath(directiveName, directiveName + '-text');
          }
          break;
        default:
          template = _getInputPath(directiveName, 'template-not-available');
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
     * Public method: addUiData(directiveName, guhType)
     * guhType can be from type ParamType or StateType
     */
    function addUiData(directiveName, guhType) {
      guhType.operator = app.valueOperator.is.operators[0];
      guhType.actionTemplateUrl = _getActionTemplate(guhType);
      guhType.inputTemplateUrl = _getInputTemplate(guhType);
      guhType.value = _getValue(guhType);

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
     * Public method: getTemplateurl(directiveName, filename)
     */
    function getTemplateUrl(directiveName, filename) {
      var templateUrl = _getInputPath(directiveName, filename);
      return checkTemplateUrl(templateUrl);
    }

    /*
     * Public method: getUnit(name)
     */
    function getUnit(name) {
      // Get value inside Brackets []
      var regExp = /\[([^)]+)\]/;
      var searchUnit = regExp.exec(name);

      if(angular.isArray(searchUnit) && searchUnit.length === 2) {
        return searchUnit[1];
      } else {
        return '';
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
      endpoint: 'event_types',
      suffix: '.json',

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
        getParamDescriptors: getParamDescriptors
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

      // phrase
      if(angular.isArray(paramTypes) && paramTypes.length === 0) {
        attrs.phrase = phrase + ' is detected';
      } else {
        attrs.phrase = phrase + ' is detcted and parameters are';
      }

      // unit
      attrs.unit = modelsHelper.getUnit(attrs.name);

      // paramTypes
      angular.forEach(paramTypes, function(paramType) {
        paramType = modelsHelper.addUiData('input', paramType);
      });
    }


    /*
     * Public method: getParamDescriptors(paramTypes)
     */
    function getParamDescriptors(paramTypes) {
      var paramDescriptors = [];

      angular.forEach(paramTypes, function(paramType) {
        paramDescriptors.push({
          name: paramType.name,
          operator: paramType.operator,
          value: paramType.value
        });
      });

      return paramDescriptors;
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
      suffix: '.json',

      // Model configuration
      idAttribute: 'id',
      name: 'device',
      relations: {
        belongsTo: {
          deviceClass: {
            localField: 'deviceClass',
            localKey: 'deviceClassId'
          }
        },
        hasMany: {
          state: {
            localField: 'states',
            foreignKey: 'deviceId'
          }
        }
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
          });
        } else {
          _addCustomName(resource, attrs);
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
     * Public method: subscribe(deviceId, cb)
     */
    function subscribe(deviceId, cb) {
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
     * Public method: pair(deviceClassId, deviceData)
     */
    function pair(deviceClassId, deviceData) {
      var device = {};
      var options = {};
      deviceData = deviceData || {};

      device.deviceClassId = deviceClassId || '';
      device.deviceDescriptorId = deviceData.id || '';

      device.deviceParams = [];
      angular.forEach(deviceData.deviceParamTypes, function(deviceParamType) {
        var deviceParam = {};

        deviceParam.name = deviceParamType.name;
        deviceParam.value = deviceParamType.value;

        device.deviceParams.push(deviceParam);
      });

      options.device = device;

      return DS
        .adapters
        .http
        .POST(app.apiUrl + '/devices.json', options);
    }

    /*
     * Public method: confirmPairing(pairingTransactionId)
     */
    function confirmPairing(pairingTransactionId) {
      var options = {};
      var params = {};
      
      params.pairingTransactionId = pairingTransactionId;

      options.params = params;

      return DS
        .adapters
        .http
        .POST(app.apiUrl + '/devices/confirm_pairing.json', options);      
    }

    /*
     * Public method: add(deviceClassId, deviceData)
     */
    function add(deviceClassId, deviceData) {
      var device = {};
      deviceData = deviceData || {};

      device.deviceClassId = deviceClassId || '';
      device.deviceDescriptorId = deviceData.id || '';

      $log.log('add deviceData', deviceData);

      device.deviceParams = [];
      if(deviceData.deviceParamTypes) {
        angular.forEach(deviceData.deviceParamTypes, function(deviceParamType) {
          var deviceParam = {};

          deviceParam.name = deviceParamType.name;
          deviceParam.value = deviceParamType.value;

          device.deviceParams.push(deviceParam);
        });
      } else if(deviceData.params) {
        device.deviceParams = deviceData.params;
      }

      $log.log('add device.deviceParams', device.deviceParams);

      // Temporarly add name
      // TODO: Add name to discovery template
      device.deviceParams.push({
        name: 'name',
        value: 'Name'
      });

      $log.log('add device.deviceParams', device.deviceParams);

      return DSDevice.create({device: device});
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
    function executeAction(actionType) {
      /* jshint validthis: true */
      var self = this;
      var options = {};

      options.params = actionType.getParams();

      return DS
        .adapters
        .http
        .POST(app.apiUrl + '/devices/' + self.id + '/actions/' + actionType.id + '/execute.json', options);
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
     * Public method: getEventDescriptor(eventType)
     */
    function getEventDescriptor(eventType) {
      /* jshint validthis: true */
      var self = this;
      var eventDescriptor = {};
      var paramDescriptors = [];

      eventDescriptor.deviceId = self.id;
      eventDescriptor.eventTypeId = eventType.id;

      paramDescriptors = eventType.getParamDescriptors(eventType.paramTypes);
      if(paramDescriptors.length > 0) {
        eventDescriptor.paramDescriptors = paramDescriptors;
      }

      return eventDescriptor;     
    }

    /*
     * Public method: getStateDescriptor(stateType)
     */
    function getStateDescriptor(stateType) {
      /* jshint validthis: true */
      var self = this;
      var stateDescriptor = {};

      stateDescriptor.deviceId = self.id;
      stateDescriptor.operator = stateType.operator;
      stateDescriptor.stateTypeId = stateType.id;
      stateDescriptor.value = stateType.value;

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
    .factory('DSDeviceClass', DSDeviceClassFactory)
    .run(function(DSDeviceClass) {});

  DSDeviceClassFactory.$inject = ['$log', 'DS', 'DSHttpAdapter', 'DSState', 'app', 'libs', 'modelsHelper'];

  function DSDeviceClassFactory($log, DS, DSHttpAdapter, DSState, app, libs, modelsHelper) {
    
    var staticMethods = {};

    /*
     * DataStore configuration
     */
    var DSDeviceClass = DS.defineResource({

      // API configuration
      endpoint: 'device_classes',
      suffix: '.json',

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
          actionType: {
            localField: 'actionTypes',
            foreignKey: 'deviceClassId'
          },
          eventType: {
            localField: 'eventTypes',
            foreignKey: 'deviceClassId'
          },
          stateType: {
            localField: 'stateTypes',
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
          });
        } else {
          _addUiData(resource, attrs);
          _mapClassType(resource, attrs);
          _mapStates(resource, attrs);
        }
      }

    });

    return DSDeviceClass;


    /*
     * Private method: _getInputPath(filename)
     */
    function _getInputPath(filename) {
      return app.basePaths.devices + 'detail/device-class-templates/' + filename + app.fileExtensions.html;
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
      var templateUrl = _getInputPath('device-class-' + templateName);

      return modelsHelper.checkTemplateUrl(templateUrl);
    }

    /*
     * Private method: _addUiData(resource, attrs)
     */
    function _addUiData(resource, attrs) {
      var discoveryParamTypes = attrs.discoveryParamTypes;
      var paramTypes = attrs.paramTypes;
      var stateTypes = attrs.stateTypes;

      // discoveryParamTypes
      angular.forEach(discoveryParamTypes, function(paramType) {
        paramType = modelsHelper.addUiData('input', paramType);
      });

      // paramTypes
      angular.forEach(paramTypes, function(paramType) {
        paramType = modelsHelper.addUiData('input', paramType);
      });

      // stateTypes
      angular.forEach(stateTypes, function(stateType) {
        stateType = modelsHelper.addUiData('input', stateType);
      });
    }

    /*
     * Private method: _mapClassType(resource, attrs)
     */
    function _mapClassType(resource, attrs) {
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
        'Kodi',
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
        'ON/OFF Button',
        'Today',
        'Toggle Button',
        'UDP Commander',
        'Wake On Lan',
        'Weather from OpenWeatherMap',
        'Yahoo mail'
      ];

      attrs.classType = 'device';

      if(libs._.contains(devServices, attrs.name)) {
        attrs.classType = 'dev-service';
      } else if(libs._.contains(moods, attrs.name)) {
        attrs.classType = 'mood';
      } else if(libs._.contains(gateways, attrs.name)) {
        attrs.classType = 'gateway';
      } else if(libs._.contains(services, attrs.name)) {
        attrs.classType = 'service';
      }
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
     * Public method: discover()
     */
    function discover() {
      /* jshint validthis: true */
      var self = this;
      var discoveryParams = [];

      angular.forEach(self.discoveryParamTypes, function(discoveryParamType) {
        var discoveryParam = {};

        discoveryParam.name = discoveryParamType.name;
        discoveryParam.value = discoveryParamType.value;

        discoveryParams.push(discoveryParam);
      });

      return DSHttpAdapter.GET(app.apiUrl + '/device_classes/' + self.id + '/discover.json', {
        params: {
          'device_class_id': self.id,
          'discovery_params': angular.toJson(discoveryParams)
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
      endpoint: 'action_types',
      suffix: '.json',

      // Model configuration
      idAttribute: 'id',
      name: 'actionType',
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
      var phrase = 'Execute "' + attrs.name + '"';

      // phrase
      if(angular.isArray(paramTypes) && paramTypes.length === 0) {
        attrs.phrase = phrase + '.';
      } else {
        attrs.phrase = phrase + ' with parameters';
      }

      function _handleParamType(paramType) {
        paramType = modelsHelper.addUiData('action', paramType);
        paramType.dependsOnTrigger = false;
      }

      // paramTypes
      angular.forEach(paramTypes, _handleParamType);
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

  websocketService.$inject = ['$log', '$rootScope', 'libs', 'app'];

  function websocketService($log, $rootScope, libs, app) {

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
        $log.log('Successfully connected with websocket.', event);

        // Send broadcast event
        $rootScope.$apply(function() {
          $rootScope.$broadcast('WebsocketConnected', 'Successful connected to guh.');
        });
      };

      ws.onclose = function(event) {
        $log.log('Closed websocket connection.', event);

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
        var data = angular.fromJson(message.data);

        if(data.notification === app.notificationTypes.devices.stateChanged) {
          $log.log('Device state changed.', data);

          // Execute callback-function with right ID
          if(libs._.has(websocketService.callbacks, data.params.deviceId)) {
            var cb = websocketService.callbacks[data.params.deviceId];
            cb(data);
          }
        } else {
          $log.warn('Type of notification not handled:' + data.notification);
        }
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