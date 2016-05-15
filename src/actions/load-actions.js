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
  LOAD_DATA_REQUEST,
  LOAD_DATA_PENDING,
  LOAD_DATA_RECEIVED,
  ADD_DATA_PART_TYPES,
  LOAD_DATA_PART_REQUEST,
  LOAD_DATA_PART_PENDING,
  LOAD_DATA_PART_RECEIVED
} from '../constants/action-types';

// Actions
// import DevicesActions from './devices-actions.js';


export default class LoadActions {

  constructor() {
  // constructor(DevicesActions) {
    // this.devicesActions = DevicesActions;
  }

  loadData(dataPartTypes) {
    return (dispatch) => {
      // dispatch(this.devicesActions.getSupportedDevices());

      return {
        type: LOAD_DATA_PENDING
      };
    };
    // console.log('loadData()', dataPartTypes);
    // dispatch(loadDataPending());
  }

}

LoadActions.$inject = [];
// LoadActions.$inject = ['DevicesActions'];


// export function loadDataRequest(dataPartTypes) {
//   return dispatch => {
//     dispatch(loadDataPending());
//     dispatch(addDataPartTypes(dataPartTypes));

//     dataPartTypes.map(dataPartType => dispatch(loadDataPartRequest(dataPartType)));
//   };
// }

// export function loadDataPending() {
//   return {
//     type: LOAD_DATA_PENDING
//   };
// }

// export function loadDataReceived() {
//   return {
//     type: LOAD_DATA_RECEIVED
//   };
// }

// export function addDataPartTypes(dataPartTypes) {
//   return {
//     type: ADD_DATA_PART_TYPES,
//     payload: {
//       dataPartTypes
//     }
//   };
// }

// export function loadDataPartRequest(currentDataPartType) {
//   return dispatch => {
//     loadDataPartPending(currentDataPartType);

//     if(currentDataPartType === 'devices') {
//       dispatch(DevicesActions.getSupportedDevices());
//     }
//   };
// }

// export function loadDataPartPending(currentDataPartType) {
//   return {
//     type: LOAD_DATA_PART_PENDING,
//     payload: {
//       currentDataPartType
//     }
//   };
// }

// export function loadDataPartReceived(currentDataPartType) {
//   return {
//     type: LOAD_DATA_PART_RECEIVED,
//     payload: {
//       currentDataPartType
//     }
//   };
// }