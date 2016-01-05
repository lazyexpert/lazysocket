"use strict";

const s = require('../index.js');

/* Create http server */
var http = require('http');
var staticServer = require('node-static');

var fileFolder = new staticServer.Server('./public');

http.createServer(function (request, response) {
  console.log("Got a http request!");

  request.addListener('end', function () {
    fileFolder.serve(request, response);
  }).resume();
}).listen(1337);

console.log("Http server created!");

/* Socket-event module. Usually you would move this to router module */
s.init(8081, function() {
  console.log('New client connected');
});

s.get('messages', function(data, callback) {
  console.log("Recieved new get message: \n");

  /* You would connect to db here */
  let messages  =  [
    {
      id : 1,
      author: "miha",
      message: "Hi there. Call me later."
    },
    {
      id : 2,
      author: "lorem",
      message: "Nevermind. I am afk. bb."
    },
    {
      id : 3,
      author: "ipsum",
      message: "Sockets really rock."
    }
  ];

  callback(null, JSON.stringify(messages));
});

s.post('message', function(data, callback) {
  console.log("Recieved new post message: ");
  console.log(data);

  callback(null, {
    dataSent : "true",
    added : data
  });

});

s.put('message', function(data, callback) {
  console.log("Recieved new put message: ");
  console.log(data);

  callback(null, {
    dataUpdated : "true",
    newData : data
  });
});

s.delete('message', function(data, callback) {
  console.log("Recieved new delete message: ");
  console.log(data);

  callback(null, {
    triedToRemove : "true",
    removedData : data
  });
});

s.get('error', function(data, callback) {
  console.log("Recieved new error-check message.");  

  callback("Gotcha! Error-handling check.");
});

/* Test error handling */
