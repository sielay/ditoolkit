# DIToolkit

## Problem

There are various projects solving dependency injection for NodeJS. All of them are quire opinioneted and most apply Angular way - where target of injection decide about dependencies and they can be overriden in some config.

Also non of them appreciate that DI is most useful in node for promised/deferred dependencis.

## Installation

```sh
npm i --save ditoolkit
```

## Usage

### Functions - on example of Express Middleware

```javascript
// module1

module.export = function IWantToBeTestable(dependency1, dependancy2, dependancy3, req, res, next, id) {
    ...
}

// module 2
const module1 = require('./module1');
require('ditoolkit');

app.user(module1.injected(null, 123, {config:1}, Promise.resolve('whatever')));

```

Method `injected` and it synchronous version (not supporting promises) `inject` are added to `Function` prototype. Once you call them you'd get version of the function with bound `thisArg` and dependencies. Dependencies will be prefixed to later arguments (like you can see in function declaration).

### Classes

```javascript

const DI = require('ditoolkit');

class A {
    test(depencency1, someArg) { ... }
}

let a = new A();

DI.decorate(a, [sharedDependnecy1]);

class B {
    test() { ... },
    test2(dependency1) { ... },
    test3(dependency1, dependency2, someArg) { ... }
}

let B = new A();

DI.decorate(a, [sharedDependnecy1], {
    test2: [],
    test3: [sharedDepenency2]
});


```

### Also

See test for details.

## License

MIT

