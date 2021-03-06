// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var assert = require('assert');

var rest = require("./rest.js")(app);
var chat = require("./chat.js");
var draw = require("./draw.js");
var webrtc = require("./webrtc.js");

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/fancychat';
var mdb = require('./mdb.js');

// MongoClient.connect(url, function(err, db) {
//   assert.equal(null, err);
//   console.log("Connected correctly to mongodb server.");
// //  insertDocument(db, function() {
// //      db.close();
// //  });
// //  insertDocument(db, function(){});
//   var mydb = mdb(db, function(){
// 	  console.dir('init db');
//   });
//   findRestaurants(db, function() {
//       db.close();
//   });
//   //db.close();
// });

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
  var params = {
    room: "default"
  }

  socket.on('room', function (newRoom) {
    if(newRoom !== params.room){
      var oldRoom = params.room;
  	  params.room = newRoom;
  	  socket.join(params.room);
  	  console.log("socket id", socket.id, "user", socket.username, "new room:", params.room);
      socket.leave(oldRoom);
      console.log("socket id", socket.id, "user", socket.username, "old room:", oldRoom);
      // add the client's username to the global room list
      addName(params.room, socket.username);
      socket.emit('login', {
        numUsers: rooms[params.room].num
      });
      // echo globally (all clients) that a person has connected
      socket.broadcast.to(params.room).emit('user joined', {
        username: socket.username,
        numUsers: rooms[params.room].num
      });
    }
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (username) {
    // we store the username in the socket session for this client
    socket.username = username;
    addedUser = true;
    console.log("socket id", socket.id, "user", socket.username, "user joined");
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    console.log("socket id", socket.id, "user", socket.username, "user disconnect", "current room:", params.room);
    // remove the username from global usernames list
    if (addedUser ) {
      delete rooms[params.room][socket.username];
      rooms[params.room].num--;

      // echo globally that this client has left
      socket.broadcast.to(params.room).emit('user left', {
        username: socket.username,
        numUsers: rooms[params.room].num
      });
    }
  });

  chat(socket, params);
  draw(socket, params);
  webrtc(socket, params);
});
