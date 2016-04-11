# socket-event
WebSocket client-server communication library.

# About
WebSoket technology is awesome. But it comes a little hard to start using it. Also you have some problems building big apps with websockets.

In this library we still have imitation of methods (get, post, put, delete), added new one "notify".
The connection goes with websockets and we have ability to set callback on front and handler on back.
Also added one method "notify". It should serve to send any kind of notifications between front and end.
You can build client => server event system on top of this "notify" method.

Actually all these methods work identically. The idea of separating them is to make code better and cleaner. The logic you build around them is your deal.

### Usage:

#### Front:

Include the front-end lib.The lib is placed in the /lib folder:

``` html
<script src="socket-events.js" type="text/javascript"></script>
```

Init the socket. You may pass port as a parameter. The default port used is 8081.

``` javascript
var socket = new SocketEvent(optionalPort)
```

Using send methods(get, post, put, delete, notify) has same interface.

``` javascript
socket[methodName](eventName, data, callback)
```

All arguments are optional instead of eventName.

``` javascript
socket.get('messages', null, function(data) {
  console.log(data)
})

socket.post('message', data)

socket.put('message', data, function(data) {
  console.log(data);
})

socket.delete('message', data)

// Using notify for small messages looks good idea

socket.notify('state-change', data)

socket.notify('game-over', data)

socket.notify('user-afk', data)
```

Server can send notifications too. To make it easier, the server sends only the name of the event.
How you handle it on front:
```javascript
socket.on('map-refresh', function() {
  // Server notifies about map refresh
  // You send request for the new map
  socket.get('map', null, function(data) {
    // Print new map
    console.log(data);
  })
})
```

Also, using method 'on', you can set handler to the 'open' event of the socket. Its reserved word.
'Open' event fires when the socket connection between server and client is established and ready to function normally.
Example:
``` javascript
socket.on('open', function() {
  console.log("socket has just connected")
})
```

Or you can simply react on the certain events:
```javascript
socket.on('server-off', function() {
  alert("Server will be shutdown in 2 minutes. Please, save your work.")
})
```

You also may delete handlers of the server events dynamically using method "remove":
```javascript
socket.remove('server-off')
```

#### Back:

The model of interaction looks like:
Event(route, url) - Handler - Callback

The handler is actually callback too. Just not to get confused, we will call it handler.
So, handler is actually the event handler on back-end, same as common router handler.
Firing callback - is sending data/notification to front-end.

Include this module by:

``` javascript
npm install --save socket-event
```

Init socket server. Three possible ways to do that: pass port, pass server, dont pass any:
``` javascript
const s = require('socket-event')


// Example: set connection port to 8000
var options = { port : 8000 }

// Other example: set connection to the created before http server
var options = { server : server}

// This will set to default port 8081
var options = null

s.init(options, function(ws) {
  // Port is optional. Default is 8081.
  // Any additional logic can be placed here
  // Actually this is on 'connection' event handler, that will be fired on connection with each socket
  // ws - socket object, you may atach any logic to it. But remember, socket refreshes on page refresh, browser close etc...
})
```

Set handlers. Callback has two "node-way" arguments: error, data.

``` javascript
s.get('messages', function(data, callback) {
  let msg = JSON.parse(data);  

  // connect to db and get data. example code
  let sql = "SELECT * FROM `messages` WHERE id = " + msg.data.id;
  someDbDriver.query(sql, function(err, data) {
    if(err) callback(err);

    else callback(null, data);
  }   
});

s.post('message', function(data, callback) {
  // pretty much the same

 // dont forget to fire callback(err,data) at the end
});

// same for s.put, s.delete

s.notify('any-event', function(data, callback) {
  // You can build here any logic outside restapi
});
```

You might need to delete handler dynamically. Use 'remove' method:
``` javascript
s.remove('get', 'greet');
s.remove('post', 'greet');
s.remove('put', 'greet');
s.remove('delete', 'greet');
s.remove('notify', 'greet');
```

The server to client communication is done through the "notifyAll" method. This code notifies all connected clients about event.
``` javascript
s.notifyAll('map-refresh')
```

Happens, that you need to get the original socket object. You may access it with method "getSocket".
``` javascript
let socket = s.getSocket()

// Maybe atach some user object, session or any other logic
```
