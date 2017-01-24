StarlingIoC
=========
[![Build Status](https://travis-ci.org/peterstarling/starling-ioc.svg?branch=master)](https://travis-ci.org/peterstarling/starling-ioc)

A simple IoC container Javascript. It allows you to bind various dependencies (classes, factory functions, objects, etc) to a container by name. Then when you request (resolve) them it automatically looks up dependencies required by each of them and traverses up the tree to inject all the necessary ones.

Since the app also allows you to register asynchronous dependencies (ones that resolve to a promise) it always resolves to a promise - so the result of `resolve` method is always thenable.

## Installation
### npm
```sh
  npm install starling-ioc
```
### yarn

```sh
  yarn add starling-ioc
```

## Usage

Import the library and register the dependencies.

### Javascript and Typescript

```javascript
   import { Container } from 'starling-ioc';

   const container = new Container();

   container.bind(SomeClass, "some_module");
   container.bind('some_singleton', new SingletonClass);
```

Above will bind a class SomeClass to the module name 'some_module'.
This means that each time this dependency is resolved it will return 
a new instance.

For SingletonClass we are binding an instantiated class, so the
same object will be resolved each time.

Then to resolve any class with previously bound dependencies

### Javascript 

```javascript

   class NewClass {
      constructor(some_module, some_singleton);
   }

   const module = container.resolve(NewClass); // will return instance of NewClass with some_module 
                                               // and some_singleton injected through the constructor
```
### Typescript

```typescript

   class NewClass {
      constructor(some_module, some_singleton);
   }

   const module = await container.resolve<NewClass>(NewClass); // will return instance of NewClass with some_module 
                                                               // and some_singleton injected through the constructor
```

or to simply resolve a dependency by name from an already existing binding

### Javascript

```javascript

   const someDependency = {};
   
   container.bind(someDependency, 'some_dependency');

   const dependency = await container.resolve('some_dependency'); // will return someDependency
```

### Typescript

```typescript

   const someDependency = {};
   
   container.bind(someDependency, 'some_dependency');

   const dependency = await container.resolve<typeof someDependency>('some_dependency'); // will resolve someDependency
```

To register a factory function you should bind an arrow function and StarlingIoC is going to resolve it for you by invoking it with arguments treated as dependency names (same as constructor function). 

### Javascript

```javascript
    const module = { output: () => "test factory function output" };

    container.bind(
      (someDependency) => module,
      "factoryFunction"
    );

    const testClassD = await container.resolve("factoryFunction");
```

### Typescript
```typescript
    const module = { output: () => "test factory function output" };

    container.bind(
      (someDependency) => module,
      "factoryFunction"
    );

    const testClassD = await container.resolve<typeof module>("factoryFunction");
```

You can also bind modules that return a promise. StarlingIoC will inject whatever the promise resolves to.

### Javascript

```javascript
    const module = { output: () => "test factory function output" };

    const factory = (): Promise<FactoryProduct> =>
      Promise.resolve(module);

    container.bind(factory, "factoryFunction");

    const testClassD = await container.resolve(TestClassD);
```

### Typescript

```typescript
    const module = { output: () => "test factory function output" };

    const factory = (): Promise<FactoryProduct> =>
      Promise.resolve(module);

    container.bind(factory, "factoryFunction");

    const testClassD = await container.resolve<Promise<typeof module>>(TestClassD);
```