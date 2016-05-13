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
  ADD_STEP,
  GO_TO_STEP
} from '../constants/action-types';

const INITIAL_STATE = Map({
  steps: Map(),
  visibleStep: ''
});


export default function intro(state = INITIAL_STATE, action) {

  if(!action && !action.type) {
    return state;
  }
  
  switch(action.type) {

    case ADD_STEP:
      if(state.has('steps') && _.has(action, 'payload') && _.has(action.payload, 'step')) {
        state = state.setIn(['steps', action.payload.step.name], action.payload.step);
      }
      return state;

    case GO_TO_STEP:
      if(state.hasIn(['steps', action.payload.stepName]) && _.has(action, 'payload') && _.has(action.payload, 'stepName')) {
        state = state.set('visibleStep', action.payload.stepName);
      }
      return state;

    default:
      return state;

  }
  
}