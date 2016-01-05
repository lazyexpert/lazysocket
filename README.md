# socket-event

## Scratch of the documentation

WebSoket technology is awesome. But it comes a little hard to start using it. Also you have some problems building big apps with websockets.
So, this module, I hope, will make this issues easier. And more people will start using websockets in their projects.

I am trying to use pretty same concepts adding a little new features. And sure one great difference is that this at low level works with websokets.


So, briefly: 
We still have imitation of methods (get, post, put, delete), added new one "notify". 
The connection goes with websockets and we have ability to set callback on front and handler on back. 
Also added one method "notify". It should serve to send any kind of notifications between front and end. 
You can build client => server event system on top of this "notify" method.

Actually all these methods work identically. The idea of separating them is to make code better. The logic you build aroung them is your deal.

### Dependencies: 

- npm module [ws] (https://www.npmjs.com/package/ws) at backend

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
socket[methodName](eventName, data, callback);
```

All arguments are optional instead of eventName.

``` javascript
socket.get('messages', null, function(data) {
  console.log(data)
});

socket.post('message', data);

socket.put('message', data, function(data) {
  console.log(data);
});

socket.delete('message', data);

// Using notify for small messages look good idea

socket.notify('state-change', data);

socket.notify('game-over', data);

socket.notify('user-afk', data);
```


#### Back:

The model of interaction looks like: 
Event(route, url) - Handler - Callback

The handler is actually callback two. Just not to get confused, we will call it handler. 
So, handler is actually the handler of the event on back-end.
Firing callback - is sending data/notification to front-end.

Include this module by:

``` javascript
npm install --save socket-event
```

Init socket server:
``` javascript
const s = require('socket-event')

s.init(port, function() {
  // Port is optional. Default is 8081.
  // Any additional logic can be placed here
  // Actually this is on 'connection' event handler, that will be fired on connection with each socket
})
```

Set handlers. Callback has two "node-way" arguments: error, data.

``` javascript
socket.on.get('messages', function(data, callback) {
  let msg = JSON.parse(data);  
  
  // connect to db and get data. example code
  let sql = "SELECT * FROM `messages` WHERE id = " + msg.data.id;
  someDbDriver.query(sql, function(err, data) { 
    if(err) callback(err);
    
    else callback(null, data);
  }   
});

socket.on.post('message', function(data, callback) {
  // pretty much the same
  
 // dont forget to fire callback(err,data) at the end
});

// same for socket.on.put, socket.on.delete

socket.on.notify('any-event', function(data, callback) {
  // You can build here any logic outside restapi
});
```

You might need to delete handler dynamically. Use 'remove' method:
``` javascript
socket.remove.get('greet');
socket.remove.post('greet');
socket.remove.put('greet');
socket.remove.delete('greet');
socket.remove.notify('greet');
```

