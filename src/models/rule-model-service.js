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

  DSRuleFactory.$inject = ['$log', 'app', 'DS'];

  function DSRuleFactory($log, app, DS) {
    
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

    return DSRule;


    /*
     * Public method: executeActions()
     */
    function executeActions() {
      /* jshint validthis: true */
      var self = this;

      return DS
        .adapters
        .http
        .POST(app.apiUrl + '/rules/' + self.id + "/executeactions");   
    }

    /*
     * Public method: executeExitActions()
     */
    function executeExitActions() {
      /* jshint validthis: true */
      var self = this;

      return DS
        .adapters
        .http
        .POST(app.apiUrl + '/rules/' + self.id + "/executeexitactions");   
    }

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