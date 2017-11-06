
'use strict';

var path = require('path');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
var Game = require('./models/game');
require('dotenv').config();

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var gameNum = 0;
var gameNames = ['apple','banana','pear'];

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_URI, {useMongoClient: true}, function(err) {
	if (err) console.log("Mongoose error: " + err);
	else console.log("Connected to db");
});

http.listen(process.env.PORT || 3000);

io.on('connection',function(socket){
	console.log("User connected");
	socket.on('newGame',function(){
		var name = gameNames[gameNum];
		var game = new Game({name: name});
		console.log('Starting game ' + name);
		game.save(function(err){
			if(!err){
				socket.join(name);
				gameNum++;
				socket.emit('gameName', name)
				socket.on('disconnect',function(){
					console.log("Game " + name + " ended");
					game.remove();
				});
			}
		});
	})
});

/* App routes */

app.get('/', function(req, res){
	res.sendFile(path.resolve('client/index.html'));
});

app.post('/score', function(req, res){
	var name = req.body.name;
	var score = req.body.score;
	console.log("Looking for game " + name);
	Game.findOne({name: name},function(err,game){
		game.score = score;
		game.save();
		io.to(name).emit('score',score);
	})
	res.end();
});

app.get('/score', function(req, res){
	Score.findOne(function(err, doc){
		res.send(doc);
	})
});