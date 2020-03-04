const LocalStrategy = require('passport-local').Strategy;

const User = require('../DBSchemas/user');
const db = require('./database');

const config = require('../config/key');
const bcrypt = require('bcryptjs');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
opts.secretOrKey = config.secret;


db.once('open',function(){
  console.log("connected");
});

// User.find({},function(err,data){
//   console.log("data = ",data);
// })

module.exports = function(passport){


  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    console.log(jwt_payload);
    User.getUserById( jwt_payload._id, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
            
        }
    });
}));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
}