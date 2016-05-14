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


// Vendor
import _ from 'lodash';
import { Map } from 'immutable';

// Record
import { Connection } from '../model-records/connection-model-record';

// Constants
import {
  ADD_CONNECTION,
  REMOVE_CONNECTION,
  CHANGE_STATUS
} from '../constants/action-types';

import {
  STATUS_CLOSE_RECEIVED
} from '../constants/app-types';

import {
  REHYDRATE
} from 'redux-persist/constants';

const INITIAL_STATE = Map({
  availableConnections: Map(),
  defaultConnection: '',
  activeConnection: ''
});


export default function connection(state = INITIAL_STATE, action) {

  // REHYDRATE & ADD_CONNECTION
  let availableConnections;

  // ADD_CONNECTION
  let defaultConnection;
  let newConnection;

  if(!action && !action.type) {
    return state;
  }
  
  switch(action.type) {

    case REHYDRATE:
      // Hook which is called after state was fetched from IndexedDB (localForage)
      if(_.has(action, 'payload') &&
         _.has(action.payload, 'connection') &&
         _.has(action.payload.connection, 'availableConnections')) {
        availableConnections = action.payload.connection.get('availableConnections');
        action.payload.connection = action.payload.connection.set('availableConnections', availableConnections.map(availableConnection => {
          if(availableConnection.has('status')) {
            availableConnection.set('status', STATUS_CLOSE_RECEIVED);
          }
        }));
      }
      return state;

    case ADD_CONNECTION:
      // Create the passed new connection
      if(_.has(action, 'payload') &&
         _.has(action.payload, 'newConnection')) {
        // Create Connection record for new connection
        newConnection = new Connection(action.payload.newConnection);
      }

      // Check if there is a default connection
      if(state.has('availableConnections')) {
        availableConnections = state.get('availableConnections')

        // Get first (and hopefully only) defaultConnection
        defaultConnection = availableConnections.filter(availableConnection => availableConnection.get('isDefault') === true).first();
      }

      // If there is already a default connection defined, then use it's id and override it
      if(defaultConnection &&
         typeof defaultConnection.get('id') !== undefined &&
         newConnection &&
         newConnection.get('isDefault') &&
         state.has('defaultConnection')) {
        newConnection = newConnection.set('id', defaultConnection.get('id'));
        state = state.set('defaultConnection', newConnection.id);
      }

      // Add new connection
      if(state.has('availableConnections') &&
         newConnection) {
        state = state.setIn(['availableConnections', newConnection.id], newConnection);
      }

      return state;

    case REMOVE_CONNECTION:
      if(_.has(action, 'payload') &&
         _.has(action.payload, 'id') &&
         state.hasIn(['availableConnections'], action.payload.id) &&
         state.getIn(['availableConnections', action.payload.id]).get('default') === false) {
        state = state.deleteIn(['availableConnections', action.payload.id]);
      }
      return state;

    case CHANGE_STATUS:
      if(_.has(action, 'payload') &&
         _.has(action.payload, 'id') && 
         state.hasIn(['availableConnections', action.payload.id, 'status'])) {
        state = state.setIn(['availableConnections', action.payload.id, 'status'], action.payload.status);
      }
      return state;

    default:
      return state;

  }
  
}