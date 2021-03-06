var app = require('express')();
var fs = require('fs');
var options = {
        // pfx: fs.readFileSync('secure.pfx')
        cert: fs.readFileSync('localhost.crt'),
        key: fs.readFileSync('localhost.key')
    };
var server = require('http').createServer( app);
// var server = require('http').createServer(app);
var webRTC = require('webrtc.io').listen(server);
// var WebSocketServer = require('websocket').server;

var port = process.env.PORT || 9449;
server.listen(port);



app.get('/', function(req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.get('/javicon.ico', function(req, res) {
  res.sendfile(__dirname + '/javicon.ico');
});

app.get('/style.css', function(req, res) {
  res.sendfile(__dirname + '/style.css');
});

app.get('/fullscrean.png', function(req, res) {
  res.sendfile(__dirname + '/fullscrean.png');
});

app.get('/script.js', function(req, res) {
  res.sendfile(__dirname + '/script.js');
});

app.get('/webrtc.io.js', function(req, res) {
  res.sendfile(__dirname + '/webrtc.io.js');
});

// create websocketSever

// webRTC = new WebSocketServer({
//     httpServer: server,
//     autoAcceptConnections: false
// });

//======
webRTC.rtc.on('chat_msg', function(data, socket) {
  var roomList = webRTC.rtc.rooms[data.room] || [];

  for (var i = 0; i < roomList.length; i++) {
    var socketId = roomList[i];

    if (socketId !== socket.id) {
      var soc = webRTC.rtc.getSocket(socketId);

      if (soc) {
        soc.send(JSON.stringify({
          "eventName": "receive_chat_msg",
          "data": {
            "messages": data.messages,
            "color": data.color
          }
        }), function(error) {
          if (error) {
            console.log(error);
          }
        });
      }
    }
  }
});

console.log('Please open SSL URL: https://localhost:'+(port)+'/');