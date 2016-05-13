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
import logger from './store-logger-config';
import thunkMiddleware from 'redux-thunk';


function _getMiddleware() {
  let middleware = [
    'ngUiRouterMiddleware',
    thunkMiddleware
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
  let storeEnhancers = [];
  return storeEnhancers;
}

export default angular
  .module('store', [
    uiRouter,
    ngRedux,
    ngReduxRouter
  ])
  .config(['$ngReduxProvider', '$urlRouterProvider', '$stateProvider', ($ngReduxProvider, $urlRouterProvider, $stateProvider) => {

    // Store
    $ngReduxProvider.createStoreWith(
      reducer,
      _getMiddleware(),
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
  .name;