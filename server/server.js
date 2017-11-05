var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

require('dotenv').config();



mongoose.connect("mongodb://lynkr:dogpatch@test-shard-00-00-mlsxy.mongodb.net:27017,test-shard-00-01-mlsxy.mongodb.net:27017,test-shard-00-02-mlsxy.mongodb.net:27017/test?ssl=true&replicaSet=test-shard-0&authSource=admin", {useMongoClient: true}, function(err) {
	if (err) {
		console.log("Mongoose error: " + err);
	} else {
		database = mongoose.connection;
		console.log("Successfully connected to database");
	}
});

var schema = new mongoose.Schema({score: Number});
var Score = mongoose.model('Score', schema);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

// io.on('connection', function(socket){
//   console.log('a user connected');
// });

// app.get('/flip', function(req, res){
// 	io.emit('flip', "FLIPPED");
// 	res.end();
// });

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:3000');
});



app.post('/score', function(req, res){
	Score.remove({},function(){
		Score.create({score: req.body.score}, function(err){
			if (!err) console.log("Saved score: " + req.body.score);
		});
	});
	res.sendStatus(200);
});


app.get('/score', function(req, res){
	Score.findOne(function(err, doc){
		res.send(doc);
	})
});