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


/*
 * Plugins
 */

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var size = require('gulp-size');
var sourcemaps = require('gulp-sourcemaps');


/*
 * Pipes
 */

var validatedAppScripts = require('../pipes/validated-app-scripts');
var orderedAppScripts = require('../pipes/ordered-app-scripts');


/*
 * Configuration
 */

var pathConfig = require('../gulp-config').paths;
var jshintConfig = require('../gulp-config').jshint;
var concatConfig = require('../gulp-config').concat;
var uglifyConfig = require('../gulp-config').uglify;
var renameConfig = require('../gulp-config').rename;
var sizeConfig = require('../gulp-config').size;


/*
 * Pipe
 */

module.exports = {
  getPipe: function() {
    var validatedAppScriptsPipe = validatedAppScripts.getPipe();
    var orderedAppScriptsPipe = orderedAppScripts.getPipe();

    return validatedAppScriptsPipe
      .pipe(orderedAppScriptsPipe)
      .pipe(sourcemaps.init())
        .pipe(concat('guh-libjs.js', concatConfig))
        .pipe(gulp.dest(pathConfig.dest.production))
        .pipe(size(sizeConfig))
        .pipe(uglify(uglifyConfig))
        .pipe(size(sizeConfig))
        .pipe(rename(renameConfig))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(pathConfig.dest.production));
  }
};