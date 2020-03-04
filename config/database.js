const mongo = require('mongoose');

mongo.connect('mongodb://localhost:27017/test',{useNewUrlParser: true, useUnifiedTopology: true});

var db = module.exports = mongo.connection;

