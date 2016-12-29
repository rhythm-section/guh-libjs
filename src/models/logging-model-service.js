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
    .factory('DSLogging', DSLoggingFactory)
    .run(function(DSLogging) {});

  DSLoggingFactory.$inject = ['$log', 'DS', 'websocketService'];

  function DSLoggingFactory($log, DS, websocketService) {
    
    /*
     * DataStore configuration
     */
    var DSLogging = DS.defineResource({

      // API configuration
      endpoint: 'logging',

      // Model configuration
      idAttribute: 'id',
      name: 'logging',
      relations: {},

      // Computed properties
      computed: {},

      // Instance methods
      methods: {}

    });

    angular.extend(DSLogging, {
      getLogEntries: getLogEntries
      // load: load,
      // add: add,
      // edit: edit,
      // pair: pair,
      // confirmPairing: confirmPairing
    });

    return DSLogging;


    /*
     * Public method: getLogEntries(filters)
     */
    function getLogEntries(filters) {
      /* jshint validthis: true */
      var self = this;
      var jsonRpcParams = {};

      // deviceIds
      if(angular.isArray(filters.deviceIds) && filters.deviceIds.length > 0) {
        jsonRpcParams.deviceIds = filters.deviceIds;
      }

      // eventTypes
      if(angular.isArray(filters.eventTypes) && filters.eventTypes.length > 0) {
        jsonRpcParams.eventTypes = filters.eventTypes;
      }

      // loggingLevels
      if(angular.isArray(filters.loggingLevels) && filters.loggingLevels.length > 0) {
        jsonRpcParams.loggingLevels = filters.loggingLevels;
      }

      // loggingSources
      if(angular.isArray(filters.loggingSources) && filters.loggingSources.length > 0) {
        jsonRpcParams.loggingSources = filters.loggingSources;
      }

      // timeFilters
      if(angular.isArray(filters.timeFilters) && filters.timeFilters.length > 0) {
        jsonRpcParams.timeFilters = filters.timeFilters;
      }

      // typeIds
      if(angular.isArray(filters.typeIds) && filters.typeIds.length > 0) {
        jsonRpcParams.typeIds = filters.typeIds;
      }

      // values
      if(angular.isArray(filters.values) && filters.values.length > 0) {
        jsonRpcParams.values = filters.values;
      }

      return websocketService.send({
          method: 'Logging.GetLogEntries',
          params: jsonRpcParams
        });
    }


  }

}());