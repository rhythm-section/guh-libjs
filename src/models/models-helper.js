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
      getUnit: getUnit,
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
          // if(isChildOfActionType) {
          //   template = _getInputPath(folderName, directiveName, directiveName + '-toggle-button');
          // } else {
            template = _getInputPath(folderName, directiveName, directiveName + '-checkbox');
          // }
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
          template = _getInputPath(folderName, directiveName, directiveName + '-color-picker');
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