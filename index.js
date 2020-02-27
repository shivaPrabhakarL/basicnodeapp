var express = require('express');
var app = express();
//var mongo = require('mongoose');
const passport = require('passport');
const session = require('express-session');
var bodyParser = require('body-parser');
const fromcontroler = require('./controllers/formControler');
const chatcontroler = require('./controllers/chatcontroler');
var expressValidator = require('express-validator');
var flash=require("connect-flash");

app.use(flash());
app.use(expressValidator())
app.use(bodyParser.json());
app.use(express.static('./assets')); 
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
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

  app.use(passport.initialize());
  app.use(passport.session());
  require('./config/passport')(passport);
  // Passport Middleware
  

app.set('port',3000);

app.set('view engine','ejs');

fromcontroler(app);
chatcontroler(app);
app.listen(3000);