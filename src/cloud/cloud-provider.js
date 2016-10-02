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
    .module('guh.cloud')
    .provider('cloudService', Cloud);

  Cloud.$inject = [];

  function Cloud() {
    
    var grantType = 'password';

    var provider = {
      ssl: true,
      baseUrl: '',
      loginUrl: '/auth/login',
      signupUrl: '/auth/signup',
      $get: $get
    };

    return provider;


    /*
     * Provider method: $get()
     */

    $get.$inject = ['$log', '$q', '$http'];

    function $get($log, $q, $http) {
      var authenticated = false;
      var tunnelId;
      var service = {
        login: login,
        logout: logout,
        isAuthenticated: isAuthenticated,
        getTunnelId: getTunnelId,
        setTunnelId: setTunnelId,

        // Authentication.Authenticate
        // Connection.CreateTunnel
        // Connection.DestroyTunnel
        // Connection.GetConnections
        // Connection.GetTunnels
        // Connection.SendData
        // Interface.Introspect
      };

      return service;


      /*
       * Public method: login(username, password)
       */
      function login(username, password) {
        var protocol = provider.ssl ? 'https' : 'http';

        return $http({
          method: 'POST',
          url: protocol + '://' + provider.baseUrl + provider.loginUrl,
          // http://stackoverflow.com/questions/24710503/how-do-i-post-urlencoded-form-data-with-http-in-angularjs
          headers: {
            'Content-Type' : 'application/x-www-form-urlencoded'
          },
          transformRequest: function(obj) {
            var str = [];

            for(var p in obj) {
              str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
            }
            
            return str.join('&');
          },
          data: {
            'grant_type': grantType,
            'username': username,
            'password': password
          }
        }).then(function success(response) {
          if(angular.isDefined(response.data)) {
            var data = response.data;

            authenticated = true;

            // $log.log('success', response);

            return data;
          } else {
            return $q.reject('Field "data" missing in response.');
          }
        }, function failure(error) {
          authenticated = false;

          return error;
        });
      }

      /*
       * Public method: logout()
       */
      function logout() {
        $log.log('Cloud.logout');
      }

      /*
       * Public method: isAuthenticated()
       */
      function isAuthenticated() {
        return authenticated;
      }

      /*
       * Public method: getTunnelId()
       */
      function getTunnelId() {
        // $log.log('getTunnelId', tunnelId);
        return tunnelId;
      }

      /*
       * Public method: setTunnelId(id)
       */
      function setTunnelId(id) {
        tunnelId = id;
        // $log.log('setTunnelId', tunnelId);
      }
    }

  }

}());
