
'use strict';

var path = require('path');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Promise = require('bluebird');

require('dotenv').config();

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var mongoose = require('mongoose');

var Blackjack = require('./models/Blackjack');
var Session = require('./models/Session');

//var uri = process.env.DB_URI;
var blackjackGamesBySession = {};

var findUniqueSessionCode = function(){
	return new Promise(function(resolve,reject){
		var sessionCode = Session.generateName().then(function(sessionCode){
			if(!blackjackGamesBySession[sessionCode])
				resolve(sessionCode);				
			else
				findUniqueSessionCode();
		});
	});
}

http.listen(process.env.PORT || 3000, function() {
	console.log("Node server started")
});

io.on('connection',function(socket){
	socket.on('startSession',function(){
		findUniqueSessionCode().then(function(sessionCode){
			blackjackGamesBySession[sessionCode] = new Blackjack();
			socket.join(sessionCode);
			socket.emit('sessionCode', sessionCode);
			socket.on('disconnect',function(){
				delete blackjackGamesBySession[sessionCode];
			});
		});
	})
});

/* App routes */

app.post('/connect', function(req, res) {
	var sessionCode = req.body.sessionCode;
	if(blackjackGamesBySession[sessionCode])
		res.send({"found":true})
	else
		res.send({"found":false});
});

app.get('/deal/:name', function(req, res) {
		var blackjack = blackjackGamesBySession[req.params.name];
		blackjack.startNewGame();
		io.to(req.params.name).emit('updateCards', blackjack);
		res.send(blackjack);
})

app.get('/hit/:name', function(req, res) {
		var blackjack = blackjackGamesBySession[req.params.name];
		blackjack.hit();
		io.to(req.params.name).emit('updateCards', blackjack);
		res.send(blackjack);
})

app.get('/stand/:name', function(req, res) {
		var blackjack = blackjackGamesBySession[req.params.name];
		blackjack.stand();
		io.to(req.params.name).emit('updateCards', blackjack);
		res.send(blackjack);
})

app.get('/', function(req, res){
	res.sendFile(path.resolve('client/index.html'));
});