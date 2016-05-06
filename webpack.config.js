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


var webpack = require('webpack');
var path = require('path');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
  entry: {
    lib: path.resolve(__dirname, 'src/index.js')
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js',
    sourceMapFilename: '[name].js.map',
  },
  devTool: 'source-map',
  module: {
    preLoaders: [
      // Scripts
      {
        test: /\.js$/,
        loader: 'babel!eslint',
        include: path.resolve(__dirname, 'src'),
        exclude: [
          path.resolve(__dirname, 'src/api'),
          path.resolve(__dirname, 'src/logging'),
          path.resolve(__dirname, 'src/models')
        ]
      }
    ],
    loaders: [
      // HTML
      {
        test: /\.html$/,
        loader: 'html',
        include: path.resolve(__dirname, 'src'),
        exclude: [
          path.resolve(__dirname, 'src/api'),
          path.resolve(__dirname, 'src/logging'),
          path.resolve(__dirname, 'src/models') 
        ]
      },
      // Styles
      {
        test: /\.scss$/,
        loader: 'style!css!sass',
        include: path.resolve(__dirname, 'src'),
        exclude: [
          path.resolve(__dirname, 'src/api'),
          path.resolve(__dirname, 'src/logging'),
          path.resolve(__dirname, 'src/models') 
        ]
      }
    ]
  },
  plugins: [
    // Clean build directory before building
    // Link: https://github.com/johnagan/clean-webpack-plugin
    new CleanWebpackPlugin(['build'], {
      root: __dirname,
      verbose: true, 
      dry: false
    }),

    // Insert index.html with automatically added dependencies
    // Link: https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
      inject: 'body'
    })
  ]
};