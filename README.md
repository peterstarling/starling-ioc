starling-ioc
=========

A simple IoC container for node.js with ES6

## Installation
```
  npm install starling-ioc --save
```

## Usage

Import the library and register the dependencies.

```javascript
   import ioc from 'starling-ioc';

   ioc.register('some_module', SomeClass);
   ioc.register('some_singleton', new SingletonClass);

```
Above will bind a class SomeClass to the module name 'some_module'.
This means that each time this dependency is resolved it will return 
a new instance.

For SingletonClass we are binding an instantiated class, so the
same object will be resolved each time.

Then to resolve any class with previously bound dependencies

```javascript

   class NewClass {
      constructor(some_module, some_singleton);
   }

   const nc = ioc.resolve(NewClass);
```

or to simply resolve a dependency from existing bindings

```javascript
   
   ioc.register('some_dependency', {});

   const dependency = ioc.resolve('some_dependency'); // will resolve the above object {}
```
Important! This library assumes that any function bound as a dependency is a constructor function
and will resolve it with the 'new' keyword to instantiate to a new object.