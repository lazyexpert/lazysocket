/* Back-end part */
const ws = require('ws');

/*
  Message structure (JSON.stringified):
    id - identificator
    type - method type (get, put, delete, post, notify)
    name - event name
    data - data object
    error - null or error message
    callback - true/false (to notify whether it's callback)
*/

module.exports = {
  handlers : {
    get : {},
    post : {},
    put : {},
    delete : {},
    notify : {}
  },

  init : function(port, callback) {
    let p = port || 8081;

    this.server = new ws.Server({port: p});

    this.server.on('connection', function(ws) {
      callback(ws);

      this.server.on('message', function(data) {
        let msg = JSON.parse(data);

        // Pass message to handle function
        if( typeof this.handlers[name] !== "undefined" ) {
          this.handle(msg.type, msg.name, msg.data, function(error, data) {
            ws.send(JSON.stringify({
              id : msg.id,
              type : msg.type,
              data : data,
              name : msg.name,
              error : error,
              callback : true
            }));
          });
        } else {
          this.throwErr( ws, "Sorry, no back-end handler found.");
        }
      });
    });
  },

  handle : function(type, name, data, callback) {  
    this.handlers[type][name](data, callback);
  },

  on : {
    get : function(name, callback) {
      this.handlers.get[name] = callback;
    },
    post : function(name, callback) {
      this.handlers.post[name] = callback;
    },
    put : function(name, callback) {
      this.handlers.put[name] = callback;
    },
    delete : function(name, callback) {
      this.handlers.delete[name] = callback;
    },
    notify : function(name, callback) {
      this.handlers.notify[name] = callback;
    }
  },

  remove : {
    get : function(name)  {
      if( typeof this.handlers.get[name] !== 'undefined' )
        delete this.handlers.get[name];
    },
    post : function(name)  {
      if( typeof this.handlers.post[name] !== 'undefined' )
        delete this.handlers.post[name];
    },
    put : function(name)  {
      if( typeof this.handlers.put[name] !== 'undefined' )
        delete this.handlers.put[name];
    },
    delete : function(name)  {
      if( typeof this.handlers.delete[name] !== 'undefined' )
        delete this.handlers.delete[name];
    },
    notify : function(name) {
      if( typeof this.handlers.notify[name] !== 'undefined' )
        delete this.handlers.notify[name];
    }
  },

  throwErr : function(ws, data, msg) {
    let msg = JSON.parse(data);

    ws.send(JSON.stringify({
        id: msg.id,
        type: msg.type,
        name: msg.name,
        data : null,
        error: msg
    }));
  }
};
