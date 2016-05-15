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

// Constants
import {
  LOAD_DATA_REQUEST,
  LOAD_DATA_PENDING,
  LOAD_DATA_RECEIVED,
  ADD_DATA_PART_TYPES,
  DATA_PART_RECEIVED,
  DATA_PART_NOT_RECEIVED
} from '../constants/action-types';

const INITIAL_STATE = Map({
  dataPartTypes: Map()
});


export default function intro(state = INITIAL_STATE, action) {

  // ADD_DATA_PART_TYPES
  let dataParts;

  if(!action && !action.type) {
    return state;
  }
  
  switch(action.type) {

    case LOAD_DATA_REQUEST:
      console.log('LOAD_DATA_REQUEST', action);
      return state;

    case LOAD_DATA_PENDING:
      console.log('LOAD_DATA_PENDING', action);
      return state;

    case LOAD_DATA_RECEIVED:
      return state;

    case ADD_DATA_PART_TYPES:
      if(_.has(action, 'payload') && 
         _.has(action.payload, 'dataPartTypes') &&
         state.has('dataPartTypes')) {
        dataParts = action.payload.dataPartTypes.map(dataPartType => {
          return {
            type: dataPartType,
            isFetached: false
          }
        });
        state = state.set('dataPartTypes', dataParts);
      }
      return state;

    case DATA_PART_RECEIVED:
      return state;

    case DATA_PART_NOT_RECEIVED:
      return state;

    default:
      return state;

  }
  
}