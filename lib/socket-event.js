"use strict";
/* Front-end lib */

/*
  Message structure (JSON.stringified):
    id - identificator
    type - method type (get, put, delete, post, notify)
    name - event name
    data - data object
    callback - true/false (to notify whether it's callback)
*/

/* Public part */
function SocketEvent( port ) {
  var url = "ws://" + window.location.hostname + ":" + port || "8081";

  this._socket = new WebSocket(url);

  this._handlers = [];
  this._serverHandlers = {};
  this._openHandlers = [];
  this._id = 0;

  this._socket.onmessage = function(data) {
    this._handle(data);
  }.bind(this);

  this._socket.onopen = function() {
    this._openHandlers.forEach( function(handler) {
      handler();
    });
    delete this._openHandlers;

  },bind(this)
};

SocketEvent.prototype.get = function(name, data, callback) {
  this._send('get', name, data, callback);
};

SocketEvent.prototype.post = function(name, data, callback) {
  this._send('post', name, data, callback);
};

SocketEvent.prototype.delete = function(name, data, callback) {
  this._send('delete', name, data, callback);
};

SocketEvent.prototype.put = function(name, data, callback) {
  this._send('put', name, data, callback);
};

SocketEvent.prototype.notify = function(name, data, callback) {
  this._send('notify', name, data, callback);
};

SocketEvent.prototype.on = function(name, callback) {
  if( name == "open") {
    this._openHandlers.push(callback);
  } else {
    this._serverHandlers[name] = callback;
  }
};

SocketEvent.prototype.remove = function(name) {
  if( typeof this._serverHandlers[name] !== "undefined" )
    delete this._serverHandlers[name];
}

/* Private part */
SocketEvent.prototype._send = function(type, name, data, callback) {
  if( typeof name == "undefined" ) return;

  var id = this._id;

  if( typeof callback !== "undefined" )
    this._registerCallback(callback);

  this._socket.send(JSON.stringify({
    id : id,
    type: type,
    name : name,
    data : data,
    error : null,
    callback : false
  }));

};

SocketEvent.prototype._handle = function(socket) {

  var msg = JSON.parse(socket.data);

  if(msg.error) this._errorHandler(msg.error);
  else if( msg.type === "server-notify") this._handleServerNotify(msg.name);
  else if( typeof this._handlers[msg.id] !== "undefined" && msg.callback) {
    this._handlers[msg.id](msg.data);
    delete this._handlers[msg.id];
  }
};

SocketEvent.prototype._handleServerNotify = function(name) {
  if(typeof this._serverHandlers[name] !== "undefined")
      this._serverHandlers[name]();
};

SocketEvent.prototype._errorHandler = function(error) {
  console.error("Got socket error: " + error);
};

SocketEvent.prototype._registerCallback = function(callback) {
  this._handlers[ this._id ] = callback;
  this._id ++;
};
