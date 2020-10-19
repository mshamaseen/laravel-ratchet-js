[![NPM package][npm]](https://www.npmjs.com/package/laravel-ratchet)
[![Build Status](https://scrutinizer-ci.com/g/mshamaseen/laravel-ratchet-js/badges/build.webp?b=master)](https://scrutinizer-ci.com/g/mshamaseen/laravel-ratchet-js/build-status/master)

# laravel-ratchet-js
This package is made to simplify websocket useage throughout PHP laravel ratchet package.

You can check PHP laravel ratchet package [here](https://github.com/mshamaseen/laravel-ratchet).

## Installation

To install the package, run the following command:
```
npm i laravel-ratchet
```

## Usage
Make new instance from `Shama` class:

```js
let shama = new Shama();
```

By default, Shama class detect your hostname and ssl and will start websocket with `ws(another s if you are using ssl)://{hostname}:9090` URL, if You want to change the URL or the port you should send it as a parameter when making the instance:
 ```js
 let shama = new Shama(url);
 ```

You should have an input element with Session value in your HTML:

```html
<input type="hidden" name="session" value="{{\Session::getId()}}">
```

And set your session id in Shama property, as following:
```js
shama.session = $('input[name=session]').val();
``` 
 
#### Philosophy
 The package philosophy is based on event listener, it is always expected to have event property on the returned json response from the server.
 The package will match the event sent from the server with the predefined  listeners on the instance, then it will auto trigger the listener with a data parameter sent from the server, and you will continue from here !
 

#### Define listeners
 You can define as many listener as you want by triggering the `addListener` method on Shama class:
 
 ```js
shama.addListeners(event, method);
```
  The event parameter is expected to be a string (the event name which sent from the server) and the method property is expected to be a function to trigger.

####getting parameters
the method defined inside `addListeners` will automatically inject an object parameter which has all data from the server, e.i:
 
 ```
 function method(e)
 {
    console.log(e.route);
    console.log(e.{anyParameters come from the server}));
 }
 ```
#### Send a message
to send a message, call the method ``send`` from Shama instance:
```js
shama.send(object);
```

`object` should container `route` property to specify which route it should be call.

## Default listeners
By default, Shama class will have these listeners:

#### Error listener
This listener will be triggered on error from PHP side.

#### Initialize Listener
When you make an instance from Shama class, it will open a websocket connection and make an initializing process, this process will till the socket "Hey I'm here !, Am ready to recieve messages !".

#### Default listener
If an event is sent without having a listener to catch it, default listener will be triggered.

[npm]: https://img.shields.io/npm/v/laravel-ratchet.svg

#### Default listener
If an event is sent without having a listener to catch it, default listener will be triggered.
