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

// Constants
import {
  OPEN_REQUEST,
  OPEN_PENDING,
  OPEN_RECEIVED,
  CLOSE_REQUEST,
  CLOSE_PENDING,
  CLOSE_RECEIVED,
  ERROR_RECEIVED,
  MESSAGE_RECEIVED,
  SEND_REQUEST,
  SEND_PENDING,
  SEND_RECEIVED
} from '../constants/action-types';

import {
  STATUS_OPEN_RECEIVED,
  STATUS_CLOSE_RECEIVED,
  STATUS_ERROR_RECEIVED,
  STEP_CONNECT,
  STEP_LOAD
} from '../constants/app-types';

// Actions
import * as appActions from '../actions/app-actions';
import * as websocketActions from '../actions/websocket-actions';
import * as introActions from '../actions/intro-actions';
import * as connectionActions from '../actions/connection-actions';


export default function createWebsocketMiddleware(websocketService) {
  return ({ dispatch, getState }) => (next) => (action) => {
    if(typeof action === 'function') {
      return action({ dispatch, getState, websocketService });
    }

    const onOpen = (dispatch, connectionId) => evt => {
      dispatch(websocketActions.receivedOpen());
      dispatch(connectionActions.changeStatus(connectionId, STATUS_OPEN_RECEIVED));
      dispatch(introActions.goToStep(STEP_LOAD));
    }

    const onClose = (dispatch, connectionId) => evt => {
      dispatch(websocketActions.receivedClose());
      dispatch(connectionActions.changeStatus(connectionId, STATUS_CLOSE_RECEIVED));
    }

    const onError = (dispatch, connectionId) => evt => {
      // TODO: Better error handling (timeout, closed before handshake, close before established, ...)
      dispatch(websocketActions.receivedError(evt));
      dispatch(connectionActions.changeStatus(connectionId, STATUS_ERROR_RECEIVED));
    }

    const onMessage = (dispatch) => message => {
      let data = JSON.parse(message.data);

      dispatch(appActions.saveServerInfo(data));
      dispatch(websocketActions.receivedMessage(data));
    }

    switch(action.type) {
      // Open websocket connection
      case OPEN_REQUEST:
        dispatch(websocketActions.openIsPending());

        if(_.has(action, 'payload') &&
           _.has(action.payload, 'url') &&
           _.has(action.payload, 'connectionId')) {
          websocketService.open(action.payload.url);

          websocketService.ws.onopen = onOpen(dispatch, action.payload.connectionId);
          websocketService.ws.onclose = onClose(dispatch, action.payload.connectionId);
          websocketService.ws.onerror = onError(dispatch, action.payload.connectionId);
          websocketService.ws.onmessage = onMessage(dispatch);
        }
        
        break;

      // Close websocket connection
      case CLOSE_REQUEST:
        if(websocketService.ws !== null) {
          dispatch(websocketActions.closeIsPending());
          websocketService.close();
        }

        break;

      // Send message
      case SEND_REQUEST:
        if(_.has(action, 'payload') &&
           _.has(action.payload, 'message')) {
          websocketService.send(action.payload.message);
        }

        break;

      default:
        return next(action);
    }
  }
}