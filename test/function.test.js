/* jslint node:true, esnext:true, mocha:true, -W080 */
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

require('../');

const
    should = require('should'),
    A1 = 1,
    A2 = 'abc',
    A3 = true,
    A4 = undefined,
    A5 = null,
    A6 = ['a', 1],
    A7 = {
        z: 1
    },
    A8 = 123,
    A9 = 'def';

describe('Function DI', () => {

    let functionA = function () {
            return {
                this: this,
                args: Array.prototype.slice.apply(arguments)
            };
        },
        functionB = function () {
            return {
                this: this,
                args: Array.prototype.slice.apply(arguments)
            };
        };

    it('Should extend function prototype', () => {
        should.exist(functionA.inject);
    });

    it('Should pass simple dependencies', () => {

        let functionC = functionA.inject(null, A1, A2, A3, A4, A5, A6, A7);

        functionC.should.not.be.eql(functionA);
        functionC.should.not.be.eql(functionB);

        let result = functionC(A8, A9);

        should.exist(result);
        should.not.exist(result.this);
        result.args.length.should.be.eql(9);
        result.args[0].should.be.eql(A1);
        result.args[1].should.be.eql(A2);
        result.args[2].should.be.eql(A3);
        (typeof result.args[3]).should.equal('undefined');
        should.not.exist(result.args[4]);
        (typeof result.args[4]).should.equal('object');
        result.args[5].should.be.eql(A6);
        result.args[6].should.be.eql(A7);
        result.args[7].should.be.eql(A8);
        result.args[8].should.be.eql(A9);
    });

    it('Should pass simple dependencies', () => {

        let functionC = functionA.injected(null, new Promise(resolve => {
            setTimeout(() => {
                resolve(A8);
            }, 1);
        }));

        functionC.should.not.be.eql(functionA);
        functionC.should.not.be.eql(functionB);

        let result = functionC(A9);

        should.exist(result);
        should.not.exist(result.this);
        should.not.exist(result.args);
        should.exist(result.then);

        return result
            .then(promised => {
                should.not.exist(promised.this);
                promised.args.length.should.be.eql(2);
                promised.args[0].should.be.eql(A8);
                promised.args[1].should.be.eql(A9);
                return true;
            })
            .should.finally.be.eql(true);
    });

    it('Should support this ARG', () => {

        let functionC = functionA.injected(functionB, new Promise(resolve => {
            setTimeout(() => {
                resolve(A3);
            }, 1);
        }));

        functionC.should.not.be.eql(functionA);
        functionC.should.not.be.eql(functionB);

        let result = functionC(A9);

        should.exist(result);
        should.not.exist(result.this);
        should.not.exist(result.args);
        should.exist(result.then);

        return result
            .then(promised => {
                promised.this.should.be.eql(functionB);
                promised.args.length.should.be.eql(2);
                promised.args[0].should.be.eql(A3);
                promised.args[1].should.be.eql(A9);
                return true;
            })
            .should.finally.be.eql(true);
    });

});
