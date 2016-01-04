"use strict";
/* Front-end lib */

/*
  Message structure (JSON.stringified):
    id - identificator
    name - event name
    data - data object
*/

function SocketEvent( port ) {
  var url = "ws://" + window.location.host + ":" + port || "8081";

  this._socket = new WebSocket(url);

  this._handlers = [];

  this._id = 0;

  this._socket.onmessage = function(data) {
    this._handle(data);
  }.bind(this);
}

SocketEvent.prototype.send = function(name, data, callback) {
  if( typeof name == "undefined" ) return;

  var id = this._id;

  if( typeof callback !== "undefined" )
    this._registerCallback(callback);

  var data = {
    id : id,
    name : name,
    data : data
  };

  this._socket.send(JSON.stringify(data));

};

SocketEvent.prototype._handle = function(data) {

  var msg;
  try {
    msg = JSON.parse(data);
    if( typeof this._handlers[msg.id] !== "undefined" ) {
      this._handlers[msg.id].call(this, data);
      delete this._handlers[msg.id];
    }
  } catch(e) {
    console.error("Got socket error: " + data);
  }
};

SocketEvent.prototype._registerCallback = function(callback) {
  this._handlers[ this._id ] = callback;
  this._id ++;
};
