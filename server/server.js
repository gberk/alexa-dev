var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

require('dotenv').config();



mongoose.connect(process.env.DB_URI);
var schema = new mongoose.Schema({score: Number});
var Score = mongoose.model('Score', schema);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

// io.on('connection', function(socket){
//   console.log('a user connected');
// });

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:3000');
});

// app.get('/flip', function(req, res){
// 	io.emit('flip', "FLIPPED");
// 	res.end();
// });

app.post('/score', function(req, res){
	Score.create({score: req.body.score}, function(err){
		console.log(err);
	});
	res.sendStatus(200);
})

app.get('/score', function(req, res){
	Score.findOne(function(err, doc){
		console.log(err);
		res.send(doc);
	})
});