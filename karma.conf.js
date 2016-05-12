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


var path = require('path');
var bourbon = require('node-bourbon').includePaths;
var webpack = require('webpack');
// var webpackConfig = require('./webpack.config');

module.exports = function (config) {
  config.set({
    files: [
      'test.webpack.js'
    ],

    frameworks: [
      'mocha',
      'chai',
      'sinon'
    ],

    preprocessors: {
      'test.webpack.js': [
        'webpack',
        'sourcemap'
      ]
    },

    reporters: [
      'mocha'
    ],
    
    browsers: [
      'PhantomJS'
    ],

    client: {
      mocha: {
        reporter: 'html', // change Karma's debug.html to the mocha web reporter
        ui: 'bdd'
      }
    },

    // webpack: webpackConfig,
    webpack: {
      module: {
        loaders: [
          // Scripts
          {
            test: /\.js$/,
            loader: 'babel!eslint',
            include: [
              path.resolve(__dirname, 'test.webpack'),
              path.resolve(__dirname, 'src')
            ]
          },
          // Styles
          {
            test: /\.scss$/,
            loader: 'style!css?sourceMap!sass?sourceMap&includePaths[]=' + bourbon,
            include: path.resolve(__dirname, 'src'),
            exclude: [
              path.resolve(__dirname, 'src/api'),
              path.resolve(__dirname, 'src/logging'),
              path.resolve(__dirname, 'src/models')
            ]
          }
        ]
      },
      devtool: 'inline-source-map'
    },

    webpackMiddleware: {
      noInfo: 'errors-only'
    },
    
    plugins: [
      require('karma-chai'),
      require('karma-chrome-launcher'),
      require('karma-mocha'),
      require('karma-mocha-reporter'),
      require('karma-phantomjs-launcher'),
      require('karma-sinon'),
      require('karma-sourcemap-loader'),
      require('karma-webpack')
    ]

  })
}