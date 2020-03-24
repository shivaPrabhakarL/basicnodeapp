var express = require('express');
var app = express();
const session = require('express-session');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mainC = require('./controllers/MainControler');
const os = require('os');
const passport = require('passport');
const googleStrategy = require('passport-google-oauth20').OAuth2Strategy;
const {passportAuth} = require('./controllers/auth');
const cookieSession = require('cookie-session');
const keys = require('./config/authKeys');
app.use(cors());

//googleStrategy(passport); 
// app.use(express.methodOverride());

app.use(expressValidator())

app.use(bodyParser.json());

app.use(express.static('./assets')); 

app.use(cookieSession({
  maxAge : 24*60*60*1000,
  keys: [keys.session.cookieKey],
}));

app.use(passport.initialize());
app.use(passport.session());
passportAuth();

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

var port = 3031;
app.set('view engine','ejs');

app.listen(port);

//return app;

// console.log(os.platform());
// console.log(os.arch());
// console.log(os.cpus());
// console.log(os.freemem());
// console.log(os.totalmem());

mainC(app);

module.exports = {app};