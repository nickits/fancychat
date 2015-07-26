// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var assert = require('assert');

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/fancychat';
var mdb = require('./mdb.js');
/*
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to mongodb server.");
//  insertDocument(db, function() {
//      db.close();
//  });
//  insertDocument(db, function(){});
  var mydb = mdb(db);
  mydb.init(function(){
	  console.dir('init db');
  });
  findRestaurants(db, function() {
      db.close();
  });
  //db.close();
});
*/
var findRestaurants = function(db, callback) {
   var cursor =db.collection('restaurants').find( { "borough": "Manhattan" } ).limit(2);
   cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
         console.dir(doc);
      } else {
         callback();
      }
   });
};
	
server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

// Chatroom

// usernames which are currently connected to the chat
var usernames = {};
var numUsers = 0;
var rooms = {};
var addName = function(room, name){
	if(!rooms[room]){
		rooms[room] = {num: 0, usernames: {}};
	}
	rooms[room].num++;
	rooms[room].usernames[name] = name;
};

io.on('connection', function (socket) {

  var addedUser = false;
  var room = "default";
  socket.on('room', function (data) {
	  room = data;
	  socket.join(room);
	  console.log("room:", room);
  });
  
  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    // we tell the client to execute 'new message'
    socket.broadcast.to(room).emit('new message', {
      username: socket.username,
      message: data
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (username) {
    // we store the username in the socket session for this client
    socket.username = username;
    // add the client's username to the global list
    //usernames[username] = username;
    addName(room, username);
    //++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: rooms[room].num
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.to(room).emit('user joined', {
      username: socket.username,
      numUsers: rooms[room].num
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', function () {
    socket.broadcast.to(room).emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', function () {
    socket.broadcast.to(room).emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    // remove the username from global usernames list
    if (addedUser) {
      delete rooms[room][socket.username];
      rooms[room].num--;

      // echo globally that this client has left
      socket.broadcast.to(room).emit('user left', {
        username: socket.username,
        numUsers: rooms[room].num
      });
    }
  });
  
  socket.on('startline', function (data) {
	  socket.broadcast.to(room).emit('startline', data);
  });

  socket.on('drawline', function (data) {
	  socket.broadcast.to(room).emit('drawline', data);
  });

});
