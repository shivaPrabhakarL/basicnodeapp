const mongo = require('mongoose');

mongo.connect('mongodb://localhost:27017/test',{useNewUrlParser: true, useUnifiedTopology: true});



 function dbConnect(){
    var db = mongo.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () {
       // console.log('Connected');
    });
};

module.exports  = {dbConnect};
