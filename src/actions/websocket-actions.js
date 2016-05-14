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
import * as connectionConstants from '../constants/app-types';


export function requestOpen(connectionId, url) {
  return {
    type: OPEN_REQUEST,
    payload: {
      connectionId,
      url
    },
    meta: {
      status: connectionConstants.STATUS_OPEN_REQUEST
    }
  };
}

export function openIsPending(url) {
  return {
    type: OPEN_PENDING,
    payload: {
      url
    },
    meta: {
      status: connectionConstants.STATUS_OPEN_PENDING
    }
  };
}

export function receivedOpen(url) {
  return {
    type: OPEN_RECEIVED,
    payload: {
      url
    },
    meta: {
      status: connectionConstants.STATUS_OPEN_RECEIVED
    }
  };
}

export function requestClose(connectionId, url) {
  return {
    type: CLOSE_REQUEST,
    payload: {
      connectionId,
      url
    },
    meta: {
      status: connectionConstants.STATUS_CLOSE_REQUEST
    }
  };
}

export function closeIsPending(url) {
  return {
    type: CLOSE_PENDING,
    payload: {
      url
    },
    meta: {
      status: connectionConstants.STATUS_CLOSE_PENDING
    }
  };
}

export function receivedClose(url) {
  return {
    type: CLOSE_RECEIVED,
    payload: {
      url
    },
    meta: {
      status: connectionConstants.STATUS_CLOSE_RECEIVED
    }
  };
}

export function receivedError(error) {
  return {
    type: ERROR_RECEIVED,
    error: true,
    payload: error,
    meta: {
      status: connectionConstants.STATUS_ERROR_RECEIVED
    }
  };
}

export function receivedMessage(message) {
  return {
    type: MESSAGE_RECEIVED,
    payload: message
  }
}

export function requestSend(message) {
  return {
    type: SEND_REQUEST,
    payload: message
  };
}

export function sendIsPending(message) {
  return {
    type: SEND_PENDING,
    payload: message
  };
}

export function receivedSend(message) {
  return {
    type: SEND_PENDING,
    payload: message
  };
}