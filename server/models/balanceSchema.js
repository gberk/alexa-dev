
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var balanceSchema = new Schema({
	USD: Number
})

var Balance = mongoose.model('Balance', balanceSchema);

module.exports = Balance;