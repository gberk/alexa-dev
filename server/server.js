
'use strict';

var path = require('path');

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('client'));

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

require('dotenv').config();

// Connection to MongoDB Altas via mongoose
var mongoose = require('mongoose');
var uri = process.env.DB_URI;
var atlasdb;

var Balance = require(path.resolve("server/models/balanceSchema.js"));
var Score = require(path.resolve("server/models/scoreSchema.js"));

mongoose.connect(uri, {useMongoClient: true}, function(err) {
	if (err) {
		console.log("Mongoose error: " + err);
	} else {
		atlasdb = mongoose.connection;
		console.log("Successfully connected to MongoDB Atlas via mongoose");
	}
});

app.get('/', function(req, res){
	res.sendFile(path.resolve('client/index.html'));
});

// io.on('connection', function(socket){
//   console.log('a user connected');
// });

// app.get('/flip', function(req, res){
// 	io.emit('flip', "FLIPPED");
// 	res.end();
// });

app.get('/number', function(req, res) {
	var number = document.getElementById("numberPlaceholder").value;
	res.send(number);
})

app.post('/score', function(req, res){
	Score.remove({},function(){
		Score.create({score: req.body.score}, function(err, score){
			if (!err) console.log("Saved score: " + req.body.score);
			res.send(score);
		});
	});
});

app.get('/score', function(req, res){
	Score.findOne(function(err, doc){
		res.send(doc);
	})
});

http.listen(process.env.PORT || 3000, function(){
	console.log('listening on *:3000');
});