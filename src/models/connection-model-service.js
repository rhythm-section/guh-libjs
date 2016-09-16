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
    .factory('DSConnection', DSConnectionFactory)
    .run(function(DSConnection) {});


  DSConnectionFactory.$inject = ['$log', 'LocalForage', 'cloudWebsocketService'];

  function DSConnectionFactory($log, LocalForage, cloudWebsocketService) {

    LocalForage.localForageStore.registerAdapter('localForage', LocalForage.localForageAdapter, { default: true });

    var tunnelCreated = false;

    var DSConnection = LocalForage.localForageStore.defineResource({
      name: 'connection',
      relations: {
        belongsTo: {
          settings: {
            localField: 'settings',
            localKey: 'settingsId',
            parent: true
          }
        }
      }
    });

    angular.extend(DSConnection, {
      getConnections: getConnections,
      createTunnel: createTunnel,
      isTunnelCreated: isTunnelCreated
    });

    return DSConnection;


    /*
     * Static method: createTunnel(connectionId)
     */

    function createTunnel(connectionId) {
      if(connectionId) {
        return cloudWebsocketService
          .send({
            method: 'Connection.CreateTunnel',
            params: {
              connectionId: connectionId
            }
          })
          .then(function(tunnelData) {
            tunnelCreated = true;

            return DSConnection
              .create({
                id: tunnelData.tunnel.id,
                activationTimeStamp: tunnelData.tunnel.activationTimeStamp,
                clientConnection: tunnelData.tunnel.clientConnection,
                // tunnelId: tunnelData.tunnel.id,
                serverConnection: tunnelData.tunnel.serverConnection
              })
              .then(function(connection) {
                return tunnelData.tunnel;
              })
              .catch(function(error) {
                return error;
              });
          })
          .catch(function(error) {
            tunnelCreated = false;
            return error;
          });
      } else {
        $log.error('Parameter "connectionId" missing.');
        tunnelCreated = false;
      }
    }

    /*
     * Static method: isTunnelCreated()
     */

    function isTunnelCreated() {
      return tunnelCreated;
    }

    /*
     * Static method: getConnections()
     */

    function getConnections() {
      // $log.log('getConnections');

      return cloudWebsocketService
        .send({
          method: 'Connection.GetConnections'
        });
    }

  }

}());
