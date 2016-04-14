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