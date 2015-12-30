# socket-event

## Scratch of the documentation

I see this module pretty much like rest api, but I will use webSockets to achieve higher speed.

### Dependencies: 

- npm module 'ws' at backend

### Usage:

#### Front:

Include the front-end lib:

`<script src="socket-events.js" type="text/javascript"></script>`

Init the socket. You may pass port as a parameter. The default port used is 8081.
`var socket = new SocketEvent(optionalPort)`

Send your data, and set callback, if needed:

<code>socket.send('greet', data, function(data) {
	console.log(data);
})</code>

<code>socket.send('greet', null, function(data){
	// You should pass null instead of data, if you're going just to notify back
})</code>

Or simply send event to server, without any data or callback. Just event name.

`socket.send('greet')

#### Back:

Include this module by:

`npm install --save socket-event`

Init socketServer.

<code>const socket = require('socket-event');

socket.init(function() {
	
	// Any additional logic can be placed here

});</code>

Set handlers:

<code>socket.on('greet', function(data, callback) {
	console.log('greet recieved');
	console.log(data);
	// Firing callback at the end is important for your front end to know when to fire callback
	callback();
})</code>


