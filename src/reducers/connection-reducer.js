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


const INITIAL_STATE = Map({
  availableConnections: Map(),
  defaultConnection: '',
  activeConnection: ''
});


export default function connection(state = INITIAL_STATE, action) {

  // ADD_CONNECTION
  let defaultConnection;
  let newConnection;

  if(!action && !action.type) {
    return state;
  }
  
  switch(action.type) {

    case ADD_CONNECTION:
      // if(state.has('availableConnections')) {
      //   // Get first (and hopefully only) defaultConnection
      //   defaultConnection = state.get('availableConnections').filter(availableConnection => availableConnection.get('default') === true).fisrt();
      // }

      if(_.has(action, 'payload') &&
         _.has(action.payload, 'newConnection')) {
        // Create Connection record for new connection
        newConnection = new Connection(action.payload.newConnection);
      }

      // // If there is already a default connection (defaultConnection) defined, then use it's id and override it
      // if(defaultConnection &&
      //    typeof defaultConnection.get('id') !== undefined &&
      //    newConnection &&
      //    newConnection.get('default')) {
      //   newConnection = newConnection.set('id', defaultConnection.get('id'));
      // }

      // If newConnection should be the new defaultConnection
      if(newConnection &&
         newConnection.get('isDefault') &&
         state.has('defaultConnection')) {
        console.log('Set default connection to ', newConnection.id);
        state = state.set('defaultConnection', newConnection.id);
      }

      if(state.has('availableConnections') && newConnection) {
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