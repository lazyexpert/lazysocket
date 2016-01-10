document.addEventListener('DOMContentLoaded', function(e) {
  var socket  = new SocketEvent(8081);

  socket.on('greet', function() {
    alert("server greeting ;)");
  });

  /* Cache DOM elements */
  var getButton = document.getElementById('getButton');
  var postButton = document.getElementById('postButton');
  var putButton = document.getElementById('putButton');
  var deleteButton = document.getElementById('deleteButton');
  var notifyButton = document.getElementById('notifyButton');
  var errorButton = document.getElementById('errorButton');
  var serverNotifyButton = document.getElementById('serverNotifyButton');

  var postMessage = document.getElementById('postText');
  var putMessage = document.getElementById('putText');
  var deleteMessage = document.getElementById('deleteText');
  var notifyMessage = document.getElementById('notifyText');

  /* Set event handlers for clicks */
  getButton.addEventListener('click', function(e) {
    socket.get('messages', null, function(data) {
      console.log("Get callback");
      console.log(data);
    });
  }.bind(this));

  postButton.addEventListener('click', function(e) {
    if( postMessage.value.length ) {
      socket.post('message', postMessage.value, function(data) {
        console.log("Post callback");
        console.log(data);
      });
      postMessage.innerHTML = "";
    }
  }.bind(this));

  putButton.addEventListener('click', function(e) {
    if(putMessage.value.length) {
      socket.put('message', putMessage.value, function(data) {
        console.log('Put callback');
        console.log(data);
      });
    }
  }.bind(this));

  deleteButton.addEventListener('click', function(e) {
    if(deleteMessage.value.length) {
      socket.delete('message', deleteMessage.value, function(data) {
        console.log('Delete callback');
        console.log(data);
      });
    }
  }.bind(this));

  notifyButton.addEventListener('click', function(e) {
    if(notifyMessage.value.length) {
      socket.notify('message', notifyMessage.value, function(data) {
        console.log('Notify callback');
        console.log(data);
      });
    }
  }.bind(this));

  errorButton.addEventListener('click', function(e) {
    socket.get('error', null, function(data) {
      console.log('Error check callback');
      console.log(data);
    });
  }.bind(this));

  serverNotifyButton.addEventListener('click', function(e) {
    socket.notify('get-server-event');
  }.bind(this));

});
