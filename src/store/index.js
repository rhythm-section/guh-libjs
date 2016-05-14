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


// Angular
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngRedux from 'ng-redux';
import ngReduxRouter from 'redux-ui-router';

// Store
import reducer from '../reducers';
import thunkMiddleware from 'redux-thunk';
import logger from './store-logger-config';
import createWebsocketMiddleware from '../middleware/websocket-middleware';
import { persistStore, autoRehydrate } from 'redux-persist';
import { REHYDRATE } from 'redux-persist/constants';
import createActionBuffer from 'redux-action-buffer';
import localForage from 'localForage';
import immutableTransform from 'redux-persist-immutable';

// Services
import websocketService from '../services/websocket/websocket-service';


function _getMiddleware(websocketServiceProvider) {
  let websocketMiddleware = createWebsocketMiddleware(websocketServiceProvider);
  let middleware = [
    'ngUiRouterMiddleware',
    thunkMiddleware,
    websocketMiddleware,
    createActionBuffer(REHYDRATE)
  ];

  if(__DEV__) {
    middleware = [
      ...middleware,
      logger
    ];
  }

  return middleware;
}

function _getStoreEnhancers() {
  let storeEnhancers = [
    autoRehydrate()
  ];

  return storeEnhancers;
}

export default angular
  .module('store', [
    uiRouter,
    ngRedux,
    ngReduxRouter
  ])
  .provider('websocketService', websocketService)
  .config(['$ngReduxProvider', '$urlRouterProvider', '$stateProvider', 'websocketServiceProvider', ($ngReduxProvider, $urlRouterProvider, $stateProvider, websocketServiceProvider) => {

    // Store
    $ngReduxProvider.createStoreWith(
      reducer,
      _getMiddleware(websocketServiceProvider),
      _getStoreEnhancers()
    );

    // States
    $urlRouterProvider.otherwise('/dashboard');

    $stateProvider.state('app', {
      abstract: true,
      template: '<guh-app />'
    });

      $stateProvider.state('app.dashboard', {
        url: '/dashboard'
      });

      $stateProvider.state('app.things', {
        url: '/things'
      });

      $stateProvider.state('app.rules', {
        url: '/rules'
      });

  }])
  .run(['$ngRedux', function($ngRedux) {
    persistStore(
      $ngRedux,
      {
        whitelist: [ 'connection' ],
        storage: localForage,
        transforms: [
          immutableTransform
        ]
      }
    );
  }])
  .name;