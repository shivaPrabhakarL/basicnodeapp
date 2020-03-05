var express = require('express');
var app = express();
//var mongo = require('mongoose');
//const passport = require('passport');
const session = require('express-session');
var bodyParser = require('body-parser');
const fromcontroler = require('./controllers/formControler');
const chatcontroler = require('./controllers/chatcontroler');
var expressValidator = require('express-validator');
const cors = require('cors');
const auth = require('./controllers/auth');
const cookieParser = require('cookie-parser');
const ejs = require('ejs'); 




  //app.use(cookieParser());
  
  
 // app.use(session());


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

app.set('view engine','ejs');

fromcontroler(app);
chatcontroler(app);
app.listen(3030);