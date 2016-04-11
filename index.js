"use strict";

/* Back-end part */
var ws = require('ws');

/*
  Message structure (JSON.stringified):
    id - identificator
    type - method type (get, put, delete, post, notify)
    name - event name
    data - data object
    error - null or error message
    callback - true/false (to notify whether it's callback)
*/

var m = module.exports = {
  handlers : {
    get : {},
    post : {},
    put : {},
    delete : {},
    notify : {}
  },
  clients : {},
  init : function(options, callback) {

    m.server = new ws.Server({
      port : options.port || 8081,
      server:  options.server
    })   

    m.server.on('connection', function(ws) {
      callback(ws);

      var id = Math.random();
      m.clients[id] = ws;

      ws.on('message', function(data) {
        var msg = JSON.parse(data);

        // Pass message to handle function
        if( typeof m.handlers[msg.type] !== "undefined" &&
          typeof m.handlers[msg.type][msg.name] !== "undefined" ) {
          m.handle(msg.type, msg.name, msg.data, function(error, outerData) {
            ws.send(JSON.stringify({
              id : msg.id,
              type : msg.type,
              data : outerData,
              name : msg.name,
              error : error,
              callback : true
            }));
          });
        } else {
          m.throwErr( ws, "Sorry, no back-end handler found.");
        }
      });


      ws.on('close', function() {
        delete m.clients[id];
      });

      m.getSocket = function() {
        return ws;
      }

    });
  },

  handle : function(type, name, data, callback) {
    m.handlers[type][name](data, callback);
  },

  get : function(name, callback) {
    m.handlers.get[name] = callback;
  },
  post : function(name, callback) {
    m.handlers.post[name] = callback;
  },
  put : function(name, callback) {
    m.handlers.put[name] = callback;
  },
  delete : function(name, callback) {
    m.handlers.delete[name] = callback;
  },
  notify : function(name, callback) {
    m.handlers.notify[name] = callback;
  },

  notifyAll : function(name) {
    for (var key in m.clients) {
      m.clients[key].send(JSON.stringify({
        id: 0,
        type: "server-notify",
        name: name,
        data : null,
        error: null,
        callback: false
      }));
    }
  },

  remove : function(method, name) {
    if( typeof m.handlers[method][name] !== 'undefined' )
      delete m.handlers[method][name];
  },

  throwErr : function(ws, data, message) {
    var msg = JSON.parse(data);

    ws.send(JSON.stringify({
        id: msg.id,
        type: msg.type,
        name: msg.name,
        data : null,
        error: message,
        callback: false
    }));
  }
};
