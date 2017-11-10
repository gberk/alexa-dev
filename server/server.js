
'use strict';

var path = require('path');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var Blackjack = require('./models/Blackjack');
var blackjack = new Blackjack();

require('dotenv').config();

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


var gameNum = 0;
var gameNames = ['donkey','frog','bear','dog','cat','buffalo','badger','ant','giraffe', 'elephant'];

var mongoose = require('mongoose');
var Game = require('./models/Game');
var db;
var uri = process.env.DB_URI;

mongoose.Promise = global.Promise;
mongoose.connect(uri, {useMongoClient: true}, function(err) {
	if (err) {
		console.log("Mongoose error: " + err);
	} else {
		db = mongoose.connection;
		console.log("Successfully connected to database via mongoose");
	}
});

http.listen(process.env.PORT || 3000, function() {
	console.log("Node server started")
});

io.on('connection',function(socket){
	socket.on('startSession',function(){
		var name = gameNames[gameNum];

		var game = new Game({
			name: name,
			_id: name,
			score: 0,
			amzUserId: ""
		});

		var found = false;
		Game.findOne({name: name}, function(err, foundGame) {
			if (foundGame) {
				found = true;
			} else {
				found = false;
			}
		}).then(function(foundGame) {
			if (found) {
				socket.join(name);
				console.log("Connected to existing session in db");
				gameNum++;
				socket.emit('gameName', name);
			} else {
				game.save(function(saveErr) {
					if (saveErr) {
						console.log(saveErr);
					} else {
						console.log("New session created in db");
					}
				}).then(function(game){
					socket.join(name);
					gameNum++;
					socket.emit('gameName', name);
				})
			}
		})
		socket.on('disconnect',function(){
			console.log("Game " + name + " ended");
			game.remove();
		});
	});
});

/* App routes */

app.get('/deal/:name', function(req, res) {
	var hand = blackjack.startNewGame();
	console.log(hand);
	io.to(req.params.name).emit('updateCards', hand);
	res.send(hand);
})

app.get('/hit/:name', function(req, res) {
	var hand = blackjack.hit();
	console.log(hand);
	io.to(req.params.name).emit('updateCards', hand);
	res.send(hand);
})

app.get('/stand/:name', function(req, res) {
	var hand = blackjack.stand();
	console.log(hand);
	io.to(req.params.name).emit('updateCards', hand);
	res.send(hand);
})

app.get('/', function(req, res){
	res.sendFile(path.resolve('client/index.html'));
});

// app.use('/blackjack/*', function(req,res,next){ 
// 	Game.findOne({name: req.body.name}, function(err, game){
// 		if(err) next(err);
// 		else {
// 			req.game = game;
// 			next();
// 		}
// 	});
// })

app.post('/blackjack/hit', function(req,res){
	console.log(req.game);
	res.end();
});

app.post('/blackjack/stand', function(req, res){

});

app.get('/score/:name', function(req, res){
	Game.findOne({name:req.params.name}, function(err,game){
		res.send(game);
	});
});

// app.post('/score', function(req, res){
// 	var name = req.body.name;
// 	var score = req.body.score;
// 	Game.findOne({name: name},function(err,game){
// 		game.score = score;
// 		game.save();
// 		io.to(name).emit('score',score);
// 	})
// 	res.end();
// });