var express = require('express');
var app = express();
const session = require('express-session');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mainC = require('./controllers/MainControler');


app.use(cors());

app.use(expressValidator())

app.use(bodyParser.json());

app.use(express.static('./assets')); 

app.use(session({
    cookie: { maxAge: 60000 },
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    key: 'express.sid'
}));
 
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;
  
      while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param : formParam,
        msg   : msg,
        value : value
      };
    }
}));
  
app.use(require('flash')());

app.use(cookieParser());

app.set('port',3030);

var port = 3000;
app.set('view engine','ejs');

app.listen(port);

//return app;



mainC(app);

module.exports = {app};