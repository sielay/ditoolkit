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

const DI = require('../');

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

    class A {
        test() {
            return {
                this: this,
                args: Array.prototype.slice.apply(arguments)
            };
        }
        test2() {
            return Array.prototype.slice.apply(arguments)
        }
    }

    it('Should expose decorator function', () => {
        should.exist(DI.decorate);
    });

    it('Should decorate whole object of class A with default depencencies', () => {

        let a = new A();

        a.test().this.should.be.eql(a);
        a.test(A8).args.should.be.eql([A8]);

        DI.decorate(a, [A1, A2, A3, A4, A5, A6, Promise.resolve(A7)]);

        should.not.exist(a.test().this);
        should.not.exist(a.test().args);
        should.not.exist(a.test2().this);
        should.not.exist(a.test2().args);

        return a
            .test()
            .then(promised => {
                should.exist(promised);
                promised.this.should.be.eql(a);
                promised.args.length.should.be.eql(7);
                promised.args[0].should.be.eql(A1);
                promised.args[1].should.be.eql(A2);
                promised.args[2].should.be.eql(A3);
                (typeof promised.args[3]).should.equal('undefined');
                should.not.exist(promised.args[4]);
                (typeof promised.args[4]).should.equal('object');
                promised.args[5].should.be.eql(A6);
                promised.args[6].should.be.eql(A7);
                return true;
            })
            .should.finally.be.eql(true);

    });

    it('Should decorate whole object of class A with custom depencencies', () => {

        let a = new A();

        a.test().this.should.be.eql(a);
        a.test(A8).args.should.be.eql([A8]);

        DI.decorate(a, [A1, A2, A3, A4, A5, A6, Promise.resolve(A7)], {
            test2: [A8]
        });

        should.exist(a.test().this);
        should.exist(a.test().args);
        should.not.exist(a.test2().this);
        should.not.exist(a.test2().args);

        return a
            .test2()
            .then(promised => {
                should.exist(promised);
                promised.length.should.be.eql(8);
                promised[0].should.be.eql(A1);
                promised[1].should.be.eql(A2);
                promised[2].should.be.eql(A3);
                (typeof promised[3]).should.equal('undefined');
                should.not.exist(promised[4]);
                (typeof promised[4]).should.equal('object');
                promised[5].should.be.eql(A6);
                promised[6].should.be.eql(A7);
                promised[7].should.be.eql(A8);
                return true;
            })
            .should.finally.be.eql(true);

    });

});
