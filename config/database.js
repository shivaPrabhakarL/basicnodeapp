const mongo = require('mongoose');

mongo.connect('mongodb://localhost:27018/test',{useNewUrlParser: true, useUnifiedTopology: true});



module.exports  =  function(){
    var db = mongo.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () {
        console.log('Connected');
    });
};

