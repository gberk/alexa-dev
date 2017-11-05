var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.DB_URI);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
});

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:3000');
});

app.get('/flip', function(req, res){
	io.emit('flip', "FLIPPED");
	res.end();
});