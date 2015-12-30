# socket-event

## Scratch of the documentation

I see this module pretty much like rest api, but I will use webSockets to achieve higher speed.

### Dependencies: 

- npm module [ws] (https://www.npmjs.com/package/ws) at backend

### Usage:

#### Front:

Include the front-end lib:

``` html
<script src="socket-events.js" type="text/javascript"></script>
```

Init the socket. You may pass port as a parameter. The default port used is 8081.

``` javascript
var socket = new SocketEvent(optionalPort)
```

Send your data, and set callback, if needed:

``` javascript
socket.send('greet', data, function(data) {
  console.log(data)
})
```

You should pass null instead of data, if you dont have any:
``` javascript
socket.send('greet', null, function(data){
  console.log(data)
})
```

Or simply send event to server, without any data or callback. Just event name.
``` javascript
socket.send('greet')
```

#### Back:

Include this module by:

``` javascript
npm install --save socket-event
```

Init socket server:
``` javascript
const socket = require('socket-event')

socket.init(function() {
  // Any additional logic can be placed here
  // Actually this is on 'connection' event, that will be fired on connection with each socket
})
```

Set handlers:

``` javascript
socket.on('greet', function(data, callback) {
  console.log('greet recieved');
  console.log(data);
  
  // Firing callback at the end is important for your front end to know when to fire callback
  callback();
})
```

