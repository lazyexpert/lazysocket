/* Back-end part */
const ws = require('ws');

/*
  Message structure (JSON.stringified):
    id - identificator
    name - event name
    data - data object
*/

module.exports = {
  handlers : {},

  init : function(port, callback) {
    let p = port || 8081;

    this.server = new ws.Server({port: p});

    this.server.on('connection', function(ws) {
      callback(ws);

      this.server.on('message', function(data) {
        let msg = JSON.parse(data);

        // create callback function
        let callback = function() {
          let newMsg = {
            id : msg.id,
            name : 'callback'
          };

          ws.send(JSON.stringify(newMsg));
        };

        // Pass message to handle function
        if( typeof this.handlers[name] !== "undefined" ) {
          this.handle(msg.name, msg.data, callback);
        } else {
          this.throwErr( ws, "Sorry, no handler for this message");
        }
      });
    });
  },

  handle : function(name, data, callback) {
      this.handlers[name](data, callback);
  },

  on : function(name, callback) {
    this.handlers[name] = callback;
  },

  remove : function(name)  {
    if( typeof this.handlers[name] !== 'undefined' )
      delete this.handlers[name];
  },

  throwErr : function(ws, msg) {
    ws.send(msg);
  }
};
