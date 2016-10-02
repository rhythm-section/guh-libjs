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
    .factory('DSAuthentication', DSAuthenticationFactory)
    .run(function(DSAuthentication) {});


  DSAuthenticationFactory.$inject = ['$log', '$q', 'LocalForage', 'cloudWebsocketService'];

  function DSAuthenticationFactory($log, $q, LocalForage, cloudWebsocketService) {

    LocalForage.localForageStore.registerAdapter('localForage', LocalForage.localForageAdapter, { default: true });

    var cloudUserAuthenticated = false;
    var connectionAuthenticated = false;

    var DSAuthentication = LocalForage.localForageStore.defineResource({
      name: 'authentication',
      relations: {},
      methods: {
        isAuthenticated: isAuthenticated
      }
    });

    angular.extend(DSAuthentication, {
      // authenticateCloudUser: authenticateCloudUser,
      authenticateConnection: authenticateConnection
    });

    return DSAuthentication;


    /*
     * Static method: authenticateCloudUser(username, password)
     */

    // function authenticateCloudUser(username, password) {
    //   $log.log('DSAuthentication:factory.authenticateLocalUser', username, password);

    //   // Fiware authentication
    //   return cloudService
    //     .login(username, password)
    //     .then(function(response) {
    //       if(angular.isDefined(response.data)) {
    //         var data = response.data;

    //         cloudUserAuthenticated = true;

    //         return DSAuthentication.create({
    //           id: 'cloudUser',
    //           accessToken: data.access_token,
    //           expiresIn: data.expires_in,
    //           refreshToken: data.refresh_token,
    //           tokenType: data.token_type
    //         })
    //         .then(function(response) {
    //           return response;
    //         })
    //         .catch(function(error) {
    //           return error;
    //         });
    //       } else {
    //         return $q.reject('Field "data" missing in response.');
    //       }
    //     })
    //     .catch(function(error) {
    //       cloudUserAuthenticated = false;
    //       return error;
    //     });
    // }

    /*
     * Static method: authenticateConnection(id, name, token, type)
     */

    function authenticateConnection(id, name, token, type) {
      return cloudWebsocketService.send({
        method: 'Authentication.Authenticate',
        params: {
          id: id,
          name: name,
          token: token,
          type: type
        }
      })
      .then(function(response) {
        return response;
      })
      .catch(function(error) {
        connectionAuthenticated = false;
        return error;
      });;
    }


    /*
     * Public method: isLocalUserAuthenticated()
     */

    function isAuthenticated() {
      if(this.id === 'cloudUser') {
        return cloudUserAuthenticated;  
      }/* else if(this.id === 'connection') {
        return connectionAuthenticated;
      }*/ else {
        return false;
      }
    }


    /*
     * Public method: isLocalUserAuthenticated()
     */

    // function isLocalUserAuthenticated() {

    // }

    /*
     * Public method: isCloudUserAuthenticated()
     */

    // function isCloudUserAuthenticated() {

    // }

    /*
     * Public method: isConnectionAuthenticated()
     */

    // function isConnectionAuthenticated() {

    // }

  }

}());
