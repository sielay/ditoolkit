/* jslint node:true, esnext:true */
'use strict';
/**

The MIT License (MIT)

Copyright (c) 2016 Łukasz Marek Sielski

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/
const gulp = require('gulp'),
    istanbul = require('gulp-istanbul'),
    mocha = require('gulp-mocha'),
    path = require('path'),
    coveralls = require('gulp-coveralls');

gulp.task('pre-test', function () {
    return gulp.src([
         'index.js',
        'lib/*.js',
        'lib/**/*.js'
    ])
        .pipe(istanbul({
            includeUntested: true
        }))
        .pipe(istanbul.hookRequire());
});

gulp.task('test', ['istanbul'], () => {
    if (!process.env.CI) {
        process.exit(0);
    }

    return gulp.src(path.join(__dirname, 'coverage/lcov.info'))
        .pipe(coveralls())
        .on('end', () => {
            process.exit(0);
        });
});

gulp.task('istanbul', ['pre-test'], function () {
    return gulp.src([
        'test/**/*.js',
         'index.js',
        'lib/*.js',
        'lib/**/*.js'

    ])
        .pipe(mocha({
            bail: true,
            timeout: 50000
        }))
        .pipe(istanbul.writeReports({
            reporters: ['lcov', 'json', 'text', 'text-summary', 'html']
        }))
        .pipe(istanbul.enforceThresholds({
            thresholds: {
                global: 1
            }
        }));
});

gulp.task('mocha', function () {
    return gulp.src([
        'test/**/*.js',
         'index.js',
        'lib/*.js',
        'lib/**/*.js'
    ])
        .pipe(mocha({
            bail: true,
            timeout: 50000
        }));
});
