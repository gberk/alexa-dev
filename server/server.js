
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
var Session = require('./models/Session')
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

var findUniqueSessionCode = function(){
	return new Promise(function(resolve,reject){
		var found = true;
		var sessionCode;
		sessionCode = Session.generateName();
		Session.findOne({name: sessionCode}, function(err, foundGame) {
			if (!foundGame) {
				resolve(sessionCode);
			}else{
				findUniqueSessionCode();
			}
		})
	});
}


io.on('connection',function(socket){
	socket.on('startSession',function(){
		findUniqueSessionCode().then(function(sessionCode){
			var session = new Session({
				name: sessionCode,
				_id: sessionCode,
				amzUserId: ""
			});

			session.save(function(saveErr) {
				if (saveErr) {
					console.log(saveErr);
				} else {
					console.log("New session created in db");
				}
			}).then(function() {
				socket.join(sessionCode);
				// console.log("Connected to existing session in db");
				socket.emit('sessionCode', sessionCode);
			})

			socket.on('disconnect',function(){
				// console.log("Game " + name + " ended");
				session.remove();
			});
		}, function(err){
			console.log(err);
		});
	});
});

/* App routes */

app.post('/connect', function(req, res) {
	var name = req.body.name;
	var amzUserId = req.body.amzUserId;
	Game.findOne({name: name}, function(err, game) {
		if (game) {
			game.amzUserId = amzUserId;
			game.save();
			res.send({"found":true});
		} else {
			res.send({"found":false});
		}
	})
});

app.get('/deal/:name', function(req, res) {
	var hand = blackjack.startNewGame();
	io.to(req.params.name).emit('updateCards', blackjack);
	res.send(blackjack);
})

app.get('/hit/:name', function(req, res) {
	var hand = blackjack.hit();
	io.to(req.params.name).emit('updateCards', blackjack);
	res.send(blackjack);
})

app.get('/stand/:name', function(req, res) {
	var hand = blackjack.stand();
	io.to(req.params.name).emit('updateCards', blackjack);
	res.send(blackjack);
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