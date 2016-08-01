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

Function.prototype.inject = function () {
    let dependencies = Array.prototype.slice.apply(arguments),
        thisArg = dependencies.shift(),
        func = this;

    return function () {
        return func.apply(thisArg, dependencies.concat(Array.prototype.slice.apply(arguments)));
    };
};

Function.prototype.injected = function () {
    let dependencies = Array.prototype.slice.apply(arguments),
        thisArg = dependencies.shift(),
        func = this;

    return function () {
        return Promise
            .all(dependencies
                .concat(Array.prototype.slice.apply(arguments))
                .map(dependency => !!dependency ? (typeof dependency.then === 'function' ? dependency : Promise.resolve(dependency)) : Promise.resolve(dependency)))
            .then(promised => func.apply(thisArg, promised));
    };
};

function getMethods(object) {
    return Object.getOwnPropertyNames(Object.getPrototypeOf(object)).filter(name => name !== 'constructor').filter(property => typeof object[property] === 'function');


}

module.exports.decorate = function () {
    let args = Array.prototype.slice.apply(arguments),

        thisArg = args.shift(),
        defaultDependencies = Array.isArray(args[0]) ? args.shift() : [],
        dependenciesHash = args[0] ? args[0] : {},
        map = args[0] ? Object.keys(args[0]) : getMethods(thisArg);

    map
        .forEach(method => {
            let original = thisArg[method];
            thisArg[method] = original.injected.apply(original, [thisArg].concat(defaultDependencies, dependenciesHash[method] || []));
        });
};
