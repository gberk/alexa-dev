var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');

  //generate random 3 words
  
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

app.get('/flip', function(req, res){
	io.emit('flip', "FLIPPED");
	res.end();
});

// app.get('/newSession', function(req, res){
// 	//return 3 random words to Alexa
// 	//display same words on browser
// })


